/**
 * SpecimenStore — 檢體資料存取與狀態變更動作
 *
 * 原型的檢體資料來自 assets/data/database.js（APP_DATABASE：CellaVision 資料庫、AI 模型、WAM、LIS 四份模擬資料依條碼合併，第 2 節），
 * 狀態變更存在瀏覽器（DemoStorage）。
 * 正式系統：資料改由後端 API 取得，各「動作」改為呼叫 API（例如 PATCH /specimens/{barcode}/workflow），
 * 規則判斷仍沿用 WorkflowRules／LeaveRules。
 *
 * 載入順序：rules → sources/*.js → database.js →（demo/）→ storage.js → lis-sync.js → specimen-store.js
 * 本檔載入時即完成初始化（init）：依進線資料產生膠囊（WorkflowRules.intakeStatus），
 * 再套用已保存的流程狀態，之後各頁面讀到的就是已套用狀態的檢體。
 */
var SpecimenStore = (function () {
  'use strict';

  var WR = WorkflowRules;

  function all() {
    return (typeof APP_DATABASE !== 'undefined' && Array.isArray(APP_DATABASE.specimens)) ? APP_DATABASE.specimens : [];
  }

  /** 依檢體條碼取檢體 */
  function getById(barcode) {
    return all().find(function (s) { return s.barcode === barcode; }) || null;
  }

  /** 清單使用的檢體：展示模式（demo/usability-study.js）啟用時，只列出該情境的檢體並依情境排序 */
  function listForDisplay() {
    var list = all();
    if (typeof UsabilityStudy !== 'undefined') list = UsabilityStudy.filterSpecimensForList(list);
    return list;
  }

  function departments() { return (typeof APP_DATABASE !== 'undefined' && APP_DATABASE.departments) || []; }
  function machines() { return (typeof APP_DATABASE !== 'undefined' && APP_DATABASE.machines) || []; }

  // ─── 留單門檻（Demo：localStorage；規則 7 正式系統改存後端）──────
  function loadThresholds() {
    var saved = DemoStorage.loadThresholds();
    if (saved) LeaveRules.setThresholds(saved);
  }
  function saveThresholds() { DemoStorage.saveThresholds(LeaveRules.getThresholds()); }
  function resetThresholds() {
    LeaveRules.resetThresholds();
    DemoStorage.clearThresholds();
  }

  // ─── 狀態保存 ─────────────────────────────────────────────

  function normalizeStoredEntry(raw) {
    if (raw && typeof raw === 'object' && Array.isArray(raw.status)) {
      return {
        status: raw.status.slice(),
        statusDone: !!raw.statusDone,
        workflowDone: WR.normalizeWorkflowDone(raw.workflowDone),
        editor: typeof raw.editor === 'string' ? raw.editor : ''
      };
    }
    return { status: [], statusDone: false, workflowDone: WR.emptyWorkflow(), editor: '' };
  }

  /**
   * 保存一筆檢體的處理狀態（Demo：寫入 localStorage，並同步記憶體中檢體的 review.statusDone、workflowDone、editor；
   * review.status 須由呼叫端先設定）。specimenId＝檢體條碼。
   * options.workflowDone 只覆寫有提供的欄位；options.editor 指定編輯人員。
   * 流程未完成時編輯人員一律清空。
   */
  function persistStatus(specimenId, statusArray, options) {
    if (!specimenId) return;
    var map = DemoStorage.readStatusMap();
    var prev = normalizeStoredEntry(map[specimenId]);
    var nextStatus = Array.isArray(statusArray) ? statusArray.slice() : [];
    var workflowInput = prev.workflowDone;
    var patch = options && options.workflowDone;
    if (patch && typeof patch === 'object') {
      var prevEsd = prev.workflowDone.entityStatusDone || {};
      var nextEsd = {};
      WR.ENTITY_STATUSES.forEach(function (k) {
        if (patch.entityStatusDone && typeof patch.entityStatusDone === 'object' && patch.entityStatusDone[k] !== undefined) {
          nextEsd[k] = !!patch.entityStatusDone[k];
        } else if (prevEsd[k] !== undefined) {
          nextEsd[k] = !!prevEsd[k];
        }
      });
      workflowInput = {
        digitalReview: patch.digitalReview !== undefined ? patch.digitalReview : prev.workflowDone.digitalReview,
        digitalReviewSignedOff: patch.digitalReviewSignedOff !== undefined ? patch.digitalReviewSignedOff : prev.workflowDone.digitalReviewSignedOff,
        aiAlertConfirmed: patch.aiAlertConfirmed !== undefined ? patch.aiAlertConfirmed : prev.workflowDone.aiAlertConfirmed,
        entityReview: patch.entityReview !== undefined ? patch.entityReview : prev.workflowDone.entityReview,
        entityStatusDone: nextEsd
      };
    }
    var nextWorkflow = WR.normalizeWorkflowDone(workflowInput);
    var nextDone = WR.computeStatusDone(nextStatus, nextWorkflow);
    var nextEditor = options && options.editor !== undefined ? options.editor : prev.editor;
    if (!nextDone) nextEditor = '';
    map[specimenId] = { status: nextStatus, statusDone: nextDone, workflowDone: nextWorkflow, editor: nextEditor || '' };
    DemoStorage.writeStatusMap(map);
    var live = getById(specimenId);
    if (live) {
      live.review.statusDone = nextDone;
      live.review.workflowDone = nextWorkflow;
      live.review.editor = nextEditor || '';
    }
  }

  /** 讀回已保存的狀態並套用到記憶體中的檢體（其他頁面或分頁變更後呼叫） */
  function applyStoredStatus() {
    var map = DemoStorage.readStatusMap();
    Object.keys(map).forEach(function (id) {
      var spec = getById(id);
      if (!spec) return;
      var ent = normalizeStoredEntry(map[id]);
      spec.review.status = ent.status;
      spec.review.workflowDone = ent.workflowDone;
      spec.review.statusDone = WR.computeStatusDone(spec.review.status, spec.review.workflowDone);
      spec.review.editor = spec.review.statusDone ? ent.editor : '';
    });
  }

  /**
   * 規則 1、7：門檻變更後，重算 AI 分類警示。只對還能確認 AI 的檢體重算；以下不回溯：
   * 數位閱片已結束（已簽核或已改為人工鏡檢）、AI 已確認、流程已完成、
   * 沒有數位閱片且需拉片確認已完成（AI 的確認跟著需拉片確認走，已過時機）。
   */
  function recomputeAiAlerts() {
    all().forEach(function (spec) {
      var wf = spec.review.workflowDone || {};
      if (wf.digitalReview || wf.digitalReviewSignedOff || wf.aiAlertConfirmed || WR.isCompleted(spec)) return;
      var fuDone = !!(wf.entityStatusDone && wf.entityStatusDone['Follow-up']);
      if (!WR.hasStatus(spec, 'Digital Review') && WR.hasStatus(spec, 'Follow-up') && fuDone) return;
      WR.applyIntakeAiAlert(spec);
      spec.review.statusDone = WR.computeStatusDone(spec.review.status, spec.review.workflowDone);
    });
  }

  /** 依流程是否完成設定編輯人員（完成時寫入目前登入帳號；未完成清空） */
  function updateEditor(spec) {
    if (!spec.review.statusDone) { spec.review.editor = ''; return; }
    var account = DemoStorage.getCurrentUserAccount();
    if (account) spec.review.editor = account;
  }

  // ─── 動作（對應邏輯規則 9～12；15 為 LIS 撤回）──────────────────────

  /** 規則 9：報告簽核。回傳更新後的檢體 */
  function signOffReport(specimenId, options) {
    var spec = getById(specimenId);
    if (!spec) return null;
    var followUpPending = WR.needsPendingFollowUp(spec);   // 開鎖後直接核發：待辦需拉片確認會隨簽核完成（規則 9）
    var built = WR.workflowOnReportVerified(spec, options);
    spec.review.status = built.status;
    spec.review.workflowDone = built.workflowDone;
    spec.review.statusDone = WR.computeStatusDone(spec.review.status, spec.review.workflowDone);
    updateEditor(spec);
    persistStatus(specimenId, spec.review.status, { workflowDone: spec.review.workflowDone, editor: spec.review.editor || '' });
    if (spec.review.workflowDone.digitalReviewSignedOff) LisSync.sendResults(spec);   // 規則 14：WBC Diff%、非白血球數據回寫 LIS
    if (followUpPending && WR.isEntityStatusCompleted(spec, 'Follow-up')) {
      LisSync.sendNote(spec, LisSync.NOTES.DIGITAL_INSTEAD_OF_SMEAR);   // 規則 14：檢驗註記「數位閱片替代拉片鏡檢」
    }
    return spec;
  }

  /** 規則 10：需拉片確認：改為人工鏡檢。回傳 { addedFollowUp } */
  function switchToManualReview(spec) {
    if (!spec || !spec.barcode) return { addedFollowUp: false };
    if (!Array.isArray(spec.review.status)) spec.review.status = [];
    var hadFollowUp = spec.review.status.indexOf('Follow-up') !== -1;
    var st = spec.review.status.slice();
    // 改人工鏡檢前應已有 Digital Review（±AI）；缺漏時補上僅作防呆
    if (st.indexOf('Digital Review') === -1) st.push('Digital Review');
    if (!hadFollowUp) st.push('Follow-up');
    spec.review.status = st;
    var workflowPatch = WR.workflowAfterManualReview(spec, st);
    persistStatus(spec.barcode, spec.review.status, { workflowDone: workflowPatch });
    spec.review.workflowDone = workflowPatch;
    return { addedFollowUp: !hadFollowUp };
  }

  /** 規則 11：已拉片完成（AI＋FU 雙標籤時 AI 一併確認）。回傳更新後的檢體 */
  function markFollowUpDone(specimenId) {
    var spec = getById(specimenId);
    if (!spec || !WR.hasStatus(spec, 'Follow-up')) return null;
    if (WR.isEntityStatusCompleted(spec, 'Follow-up')) return spec;
    if (!spec.review.workflowDone || typeof spec.review.workflowDone !== 'object') spec.review.workflowDone = WR.emptyWorkflow();
    if (!spec.review.workflowDone.entityStatusDone || typeof spec.review.workflowDone.entityStatusDone !== 'object') spec.review.workflowDone.entityStatusDone = {};
    spec.review.workflowDone.entityStatusDone['Follow-up'] = true;
    if (WR.isAiAlertWithFollowUp(spec)) spec.review.workflowDone.aiAlertConfirmed = true;
    spec.review.workflowDone.entityReview = WR.recomputeEntityReview(spec.review.status, spec.review.workflowDone.entityStatusDone);
    spec.review.statusDone = WR.computeStatusDone(spec.review.status, spec.review.workflowDone);
    updateEditor(spec);
    persistStatus(specimenId, spec.review.status, { workflowDone: spec.review.workflowDone, editor: spec.review.editor || '' });
    LisSync.sendNote(spec, LisSync.NOTES.SMEAR_DONE);   // 規則 14：LIS 檢驗註記「拉片完成」
    return spec;
  }

  /**
   * 規則 12：檢體管理點選實體標籤（PLT Check／Follow-up）切換完成／未完成。回傳是否有變更。
   * AI＋FU 雙標籤：Follow-up 標記完成時 AI 一併確認（同規則 11「已拉片完成」）；取消時一併取消。
   * 已完成的檢體不可由此取消（WorkflowRules.canToggleEntityStatus）。
   */
  function toggleEntityStatus(specimenId, statusKey) {
    var spec = getById(specimenId);
    if (!WR.canToggleEntityStatus(spec, statusKey)) return false;
    if (!spec.review.workflowDone || typeof spec.review.workflowDone !== 'object') {
      spec.review.workflowDone = { digitalReview: false, aiAlertConfirmed: false, entityReview: false, entityStatusDone: {} };
    }
    if (!spec.review.workflowDone.entityStatusDone || typeof spec.review.workflowDone.entityStatusDone !== 'object') spec.review.workflowDone.entityStatusDone = {};
    var esd = spec.review.workflowDone.entityStatusDone;
    esd[statusKey] = !esd[statusKey];
    if (statusKey === 'Follow-up' && WR.isAiAlertWithFollowUp(spec)) spec.review.workflowDone.aiAlertConfirmed = esd[statusKey];
    var entityStatuses = (spec.review.status || []).filter(function (x) { return WR.ENTITY_STATUSES.indexOf(x) !== -1; });
    spec.review.workflowDone.entityReview = entityStatuses.length > 0 && entityStatuses.every(function (x) { return !!esd[x]; });
    spec.review.statusDone = WR.isCompleted(spec);
    updateEditor(spec);
    persistStatus(spec.barcode, spec.review.status, { workflowDone: spec.review.workflowDone, editor: spec.review.editor || '' });
    // 規則 14：標記完成時回寫 LIS 檢驗註記；取消完成時不回寫（血液組已確認；LIS 實際欄位見附錄 A #1）
    if (esd[statusKey]) {
      LisSync.sendNote(spec, statusKey === 'Follow-up' ? LisSync.NOTES.SMEAR_DONE : LisSync.NOTES.PLT_DONE);
    }
    return true;
  }

  /**
   * 規則 15：LIS 撤回（只限已簽核的數位閱片結果）。撤回只能由實體作業醫檢師在 LIS 執行，新介面沒有撤回按鈕；
   * 收到 LIS 撤回通知後，檢體全部回到進線時的原始狀態：
   * 膠囊依進線資料重新判斷（規則 1～3）、流程旗標清空、清除編輯人員與人員編輯結果；
   * 並通知畫面跳出「DC 結果已從 LIS 撤回」視窗（檢體管理頁接收 lis-withdrawn 事件）。
   * 原型未串接 LIS，保留此函式供正式系統串接時呼叫（tests/state-space.js 以此模擬）。回傳是否成功
   */
  function withdrawFromLis(specimenId) {
    var spec = getById(specimenId);
    if (!spec || !WR.workflowOf(spec).digitalReviewSignedOff) return false;   // 人工鏡檢結果在 LIS 細胞計數程式處理，與新介面無關
    spec.review.status = WR.intakeStatus(spec);
    spec.review.workflowDone = WR.emptyWorkflow();
    spec.review.statusDone = false;
    spec.review.editor = '';
    delete spec.review.editedDiff;
    DemoStorage.clearEditedResult(specimenId);
    persistStatus(specimenId, spec.review.status, { workflowDone: spec.review.workflowDone, editor: '' });
    if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('lis-withdrawn', { detail: { barcode: spec.barcode } }));
    }
    return true;
  }

  // ─── 人員編輯結果（規則 8）───────────────────────────

  /** 儲存影像檢視頁的人員編輯值（review.editedDiff）與細胞分類快照 */
  function saveEditedResult(spec, editedDiff, cells) {
    spec.review.editedDiff = editedDiff;
    DemoStorage.saveEditedDiff(spec.barcode, editedDiff);
    DemoStorage.saveEditedCells(spec.barcode, cells);
  }

  /** 取回已儲存的人員編輯值（報告核發頁使用） */
  function loadEditedDiff(spec) {
    var saved = DemoStorage.loadEditedDiff(spec.barcode);
    if (saved) spec.review.editedDiff = saved;
    return spec;
  }

  // ─── 初始化 ───────────────────────────────────────────────
  function init() {
    loadThresholds();
    all().forEach(function (spec) {
      if (!spec.review) spec.review = {};
      spec.review.status = WR.intakeStatus(spec);   // 規則 1～3：依進線資料決定膠囊
      spec.review.workflowDone = WR.normalizeWorkflowDone(spec.review.workflowDone);
      spec.review.statusDone = WR.computeStatusDone(spec.review.status, spec.review.workflowDone);
    });
    applyStoredStatus();
    recomputeAiAlerts();             // 套用已保存狀態後，依目前門檻校正一次（未簽核者）
    all().forEach(function (spec) {
      if (!WR.isCompleted(spec)) spec.review.editor = '';
    });
  }

  init();

  return {
    all: all,
    getById: getById,
    listForDisplay: listForDisplay,
    departments: departments,
    machines: machines,
    saveThresholds: saveThresholds,
    resetThresholds: resetThresholds,
    persistStatus: persistStatus,
    applyStoredStatus: applyStoredStatus,
    recomputeAiAlerts: recomputeAiAlerts,
    signOffReport: signOffReport,
    switchToManualReview: switchToManualReview,
    markFollowUpDone: markFollowUpDone,
    toggleEntityStatus: toggleEntityStatus,
    withdrawFromLis: withdrawFromLis,
    saveEditedResult: saveEditedResult,
    loadEditedDiff: loadEditedDiff
  };
})();
