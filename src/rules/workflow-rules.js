/**
 * WorkflowRules — 檢體狀態與工作流程規則（單一來源）
 *
 * 對應《邏輯規則說明文件》規則 1～3（進線膠囊）、規則 13（完成與唯讀），
 * 以及工作分流與篩選排序（規則 5、第 4 節）與按鈕動作（規則 9～12）。
 *
 * 設計原則：
 *  - 純邏輯模組：只讀寫傳入的檢體物件，不操作畫面、不讀寫瀏覽器儲存或 API
 *  - 「把結果存起來」由 assets/js/core/specimen-store.js 負責
 *  - 可在 Node 環境直接測試（tests/run-tests.js）
 *
 * 檢體物件會用到的欄位（完整結構見 ARCHITECTURE.md「檢體資料結構」）：
 *  處理狀態（spec.review，以 reviewOf(spec) 讀取）
 *   review.status[]      膠囊，例如 ['Digital Review', 'AI Alert', 'PLT Check']
 *   review.workflowDone  流程旗標 { digitalReview, digitalReviewSignedOff, aiAlertConfirmed, entityReview, entityStatusDone }
 *   review.statusDone    是否全部完成（由膠囊與流程旗標計算，computeStatusDone）
 *   review.locked        他人編輯中（規則 6）
 *  進線判斷（規則 1～3）另讀 lis.smearRequiredNote、wam.pltFlag，以及經 LeaveRules 取得的 wam.cbc、imaging.aiDiff、lis.birthDate
 *
 * 載入順序：config.js → status.js → leave-rules.js → workflow-rules.js
 */
var WorkflowRules = (function () {
  'use strict';

  var ENTITY_STATUSES = StatusConstants.ENTITY_STATUSES;

  /** 檢體的處理狀態（spec.review：膠囊 status、流程旗標 workflowDone、statusDone、editor、locked、editedDiff） */
  function reviewOf(spec) {
    return (spec && spec.review) || {};
  }

  function hasStatus(spec, statusKey) {
    var st = reviewOf(spec).status;
    return Array.isArray(st) && st.indexOf(statusKey) !== -1;
  }

  function emptyWorkflow() {
    return { digitalReview: false, digitalReviewSignedOff: false, aiAlertConfirmed: false, entityReview: false, entityStatusDone: {} };
  }

  // ─── 流程旗標（規則 13）─────────────────────────────────────

  /** 將 workflowDone 整理成完整格式（缺的旗標視為 false） */
  function normalizeWorkflowDone(rawWorkflow) {
    var wf = emptyWorkflow();
    if (!rawWorkflow || typeof rawWorkflow !== 'object') return wf;
    wf.digitalReview = !!rawWorkflow.digitalReview;
    wf.digitalReviewSignedOff = !!rawWorkflow.digitalReviewSignedOff;
    wf.aiAlertConfirmed = !!rawWorkflow.aiAlertConfirmed;
    wf.entityReview = !!rawWorkflow.entityReview;
    var src = rawWorkflow.entityStatusDone;
    if (src && typeof src === 'object') {
      ENTITY_STATUSES.forEach(function (k) {
        if (src[k] !== undefined) wf.entityStatusDone[k] = !!src[k];
      });
    }
    return wf;
  }

  function workflowOf(spec) {
    return normalizeWorkflowDone(reviewOf(spec).workflowDone);
  }

  // ─── 完成判定（規則 13）────────────────────────────────────

  /** 數位閱片已完成（沒有 Digital Review 標籤者視為完成） */
  function isDigitalReviewDone(spec) {
    if (!spec) return false;
    if (!hasStatus(spec, 'Digital Review')) return true;
    return !!workflowOf(spec).digitalReview;
  }

  /** AI 分類警示已確認（沒有 AI Alert 標籤者視為完成） */
  function isAiAlertConfirmed(spec) {
    if (!spec) return false;
    if (!hasStatus(spec, 'AI Alert')) return true;
    return !!workflowOf(spec).aiAlertConfirmed;
  }

  /** 數位流程完成：數位閱片（若有）＋ AI 警示（若有） */
  function isDigitalWorkflowDone(spec) {
    if (!spec) return false;
    return isDigitalReviewDone(spec) && isAiAlertConfirmed(spec);
  }

  function hasAnyEntityTask(spec) {
    var st = reviewOf(spec).status;
    if (!Array.isArray(st)) return false;
    return st.some(function (s) { return ENTITY_STATUSES.indexOf(s) !== -1; });
  }

  /** 實體作業完成：所有實體標籤（PLT Check、Follow-up）皆完成 */
  function isEntityReviewDone(spec) {
    if (!spec) return false;
    if (!hasAnyEntityTask(spec)) return true;
    var wf = workflowOf(spec);
    var st = reviewOf(spec).status || [];
    for (var i = 0; i < st.length; i++) {
      if (ENTITY_STATUSES.indexOf(st[i]) === -1) continue;
      if (!wf.entityStatusDone || wf.entityStatusDone[st[i]] !== true) return false;
    }
    return true;
  }

  /** 單一實體標籤是否完成 */
  function isEntityStatusCompleted(spec, statusKey) {
    if (!spec) return false;
    if (ENTITY_STATUSES.indexOf(statusKey) === -1) return false;
    var wf = workflowOf(spec);
    if (wf.entityStatusDone && wf.entityStatusDone[statusKey] !== undefined) return !!wf.entityStatusDone[statusKey];
    return !!wf.entityReview;
  }

  /** 規則 13：整體完成＝數位流程完成且實體流程完成 */
  function isCompleted(spec) {
    if (!spec) return false;
    return isDigitalWorkflowDone(spec) && isEntityReviewDone(spec);
  }

  /** 由膠囊與流程旗標計算 statusDone */
  function computeStatusDone(statusArr, workflowDone) {
    return isCompleted({ review: {
      status: Array.isArray(statusArr) ? statusArr.slice() : [],
      workflowDone: workflowDone || emptyWorkflow()
    } });
  }

  /** entityReview 旗標：實體標籤全數完成（沒有實體標籤時為 true） */
  function recomputeEntityReview(statusArr, entityStatusDone) {
    var entityStatuses = (statusArr || []).filter(function (x) { return ENTITY_STATUSES.indexOf(x) !== -1; });
    if (entityStatuses.length === 0) return true;
    return entityStatuses.every(function (k) { return entityStatusDone && entityStatusDone[k] === true; });
  }

  // ─── 需拉片確認、唯讀（規則 10、13）──────────────────────

  /** 仍有待辦的需拉片確認（有 Follow-up 標籤且尚未完成） */
  function needsPendingFollowUp(spec) {
    return hasStatus(spec, 'Follow-up') && !isEntityStatusCompleted(spec, 'Follow-up');
  }

  /** 已「改為人工鏡檢」交接：數位閱片已結束但未簽核（之後拉片完成與否都算） */
  function isHandoffToFollowUp(spec) {
    if (!spec) return false;
    var wf = workflowOf(spec);
    return !!wf.digitalReview && !wf.digitalReviewSignedOff && hasStatus(spec, 'Follow-up');
  }

  /**
   * 規則 13：影像檢視唯讀（只能「唯讀檢視」，不能改分類、儲存或簽核）
   *  - 他人編輯中（鎖定中；清單另擋下，完全不能開啟，規則 6）
   *  - 數位閱片已結束：已簽核結案（要重做只能由 LIS 撤回，規則 15），或已改為人工鏡檢交接（不論之後拉片是否完成）
   *  - 沒有數位閱片膠囊（LIS 註記進線）且需拉片確認已處理完
   */
  function isDigitalReviewReadOnly(spec) {
    if (!spec) return false;
    if (reviewOf(spec).locked) return true;
    if (workflowOf(spec).digitalReview) return true;
    return !hasStatus(spec, 'Digital Review') && hasStatus(spec, 'Follow-up') && isEntityStatusCompleted(spec, 'Follow-up');
  }

  // ─── 工作分流（規則 5）─────────────────────────────────────

  /** AI 分類警示＋需拉片確認，且數位閱片尚未確認 AI：AI 的確認跟著需拉片確認走（規則 11、12） */
  function isAiAlertWithFollowUp(spec) {
    return hasStatus(spec, 'AI Alert') && hasStatus(spec, 'Follow-up') && !workflowOf(spec).digitalReview;
  }

  /** 規則 5：列入數位閱片清單＝有數位閱片膠囊且尚未完成 */
  function inDigitalList(spec) {
    if (!spec) return false;
    return hasStatus(spec, 'Digital Review') && !isDigitalReviewDone(spec);
  }

  /** 規則 5：列入實體作業清單＝需拉片確認或血小板確認尚未完成 */
  function inEntityList(spec) {
    if (!spec) return false;
    return ENTITY_STATUSES.some(function (k) { return hasStatus(spec, k) && !isEntityStatusCompleted(spec, k); });
  }

  /**
   * 規則 5：工作分流結果
   *  'digital'＝只在數位閱片清單；'entity'＝只在實體作業清單；'both'＝兩邊並行；'done'＝已完成（不在待辦清單）
   * 每一筆未完成的檢體至少會在一個清單（tests/run-tests.js 以所有可到達的膠囊組合驗證）。
   * 畫面依清單模式直接使用 inDigitalList／inEntityList；本函式是兩者的總結，供文件附錄 D 與測試使用。
   */
  function workQueue(spec) {
    var d = inDigitalList(spec);
    var e = inEntityList(spec);
    if (d && e) return 'both';
    if (d) return 'digital';
    if (e) return 'entity';
    return 'done';
  }

  /** 第 4 節：勾選某狀態時，只列出該狀態「尚未完成」的檢體 */
  function matchesStatusFilter(spec, statusKey) {
    if (!hasStatus(spec, statusKey)) return false;
    if (statusKey === 'Digital Review') return !isDigitalReviewDone(spec);
    if (statusKey === 'AI Alert') return !isAiAlertConfirmed(spec);
    if (ENTITY_STATUSES.indexOf(statusKey) !== -1) return !isEntityStatusCompleted(spec, statusKey);
    return true;
  }

  /** 第 4 節：狀態欄出現綠勾者（或已完成）排到清單最下方 */
  function showsCheckmark(spec) {
    if (!spec) return false;
    if (hasStatus(spec, 'Digital Review') && isDigitalReviewDone(spec)) return true;
    if (hasStatus(spec, 'Follow-up') && isEntityStatusCompleted(spec, 'Follow-up')) return true;
    return isCompleted(spec);
  }

  /** 膠囊是否顯示為完成（綠勾） */
  function isCapsuleDone(spec, statusKey) {
    if (statusKey === 'Digital Review') return isDigitalReviewDone(spec);
    if (statusKey === 'AI Alert') return isAiAlertConfirmed(spec);
    return isEntityStatusCompleted(spec, statusKey);
  }

  /**
   * 規則 12：檢體管理可否點選實體標籤切換完成／未完成。
   * 鎖定中、整體流程已完成、或已簽核檢體的需拉片確認，不可由膠囊切換（已簽核的數位閱片結果要重做只能由 LIS 撤回，規則 15）。
   */
  function canToggleEntityStatus(spec, statusKey) {
    if (!spec || reviewOf(spec).locked) return false;
    if (ENTITY_STATUSES.indexOf(statusKey) === -1 || !hasStatus(spec, statusKey)) return false;
    if (isCompleted(spec)) return false;
    // 已簽核的檢體：需拉片確認是隨簽核一起完成的，不能在清單取消（要重做只能由 LIS 撤回）
    if (statusKey === 'Follow-up' && workflowOf(spec).digitalReviewSignedOff) return false;
    return true;
  }

  /**
   * 清單「時效」欄（第 4 節）：從 LIS 收件時間到 now 經過幾分鐘；已完成一律 0；沒有收件時間為空白。
   * now：目前時間（Date）。清單頁每 AppConfig.URGENCY_REFRESH_MS 更新一次（暫定 120 秒）。
   */
  function displayUrgency(spec, now) {
    if (!spec) return '';
    if (isCompleted(spec)) return 0;
    var received = LeaveRules.parseDate(spec.lis && spec.lis.receivedTime);
    if (!received || !now) return '';
    return Math.max(0, Math.floor((now.getTime() - received.getTime()) / 60000));
  }

  // ─── 進線：加膠囊（規則 1～3）────────────────────────────────

  /** 規則 2：LIS 有「需推片確認」註記（實際作業為拉片）→ 需拉片確認；沒有 → 數位閱片（兩者互斥） */
  function intakeBaseStatus(spec) {
    return spec && spec.lis && spec.lis.smearRequiredNote ? 'Follow-up' : 'Digital Review';
  }

  /** 規則 3：會觸發血小板確認的 PLT LIS-flag（P＝PLT**、A＝全部項目 **）；p（PLT*）不在此列 */
  var PLT_CHECK_FLAGS = Object.freeze(['P', 'A']);

  /** 規則 3：PLT 帶 **（LIS-flag 為 P 或 A）→ 需要血小板確認 */
  function needsPltCheck(spec) {
    return !!(spec && spec.wam) && PLT_CHECK_FLAGS.indexOf(spec.wam.pltFlag) !== -1;
  }

  /**
   * 規則 1～3：檢體進線時決定膠囊，回傳新的 status 陣列（不修改傳入的 spec）。
   * 輸入為第 2 節合併後的檢體（IntakeMerge.mergeByBarcode），只讀進線資料：
   * wam.cbc 的 WBC＋imaging.aiDiff（AI 分類結果（Diff%））、lis.birthDate（年齡）、lis.smearRequiredNote（LIS 註記）、wam.pltFlag（PLT flag）。
   *   判斷 1（規則 1）：CBC 與 AI 值任一項達留單門檻 → 'AI Alert'
   *   判斷 2（規則 2）：LIS 有「需推片確認」註記 → 'Follow-up'，否則 'Digital Review'
   *   判斷 3（規則 3）：PLT** → 'PLT Check'
   * 三個判斷互不影響；膠囊顯示順序為「數位閱片／需拉片確認」在前。
   * 'Locked'（他人編輯中，規則 6）不是進線判斷，僅為清單顯示附加在最後。
   */
  function intakeStatus(spec) {
    var aiAlert = LeaveRules.shouldHaveAiAlert(spec);                // 判斷 1（規則 1）
    var base = intakeBaseStatus(spec);                               // 判斷 2（規則 2）
    var pltCheck = needsPltCheck(spec);                              // 判斷 3（規則 3）
    var st = [base];
    if (aiAlert) st.push('AI Alert');
    if (pltCheck) st.push('PLT Check');
    if (reviewOf(spec).locked) st.push('Locked');                    // 規則 6（顯示用）
    return st;
  }

  /**
   * 規則 1：依目前門檻與年齡即時計算 AI Alert（原地修改 spec.review.status）。
   * 用於修改留單門檻後重算（SpecimenStore.recomputeAiAlerts）；進線時由 intakeStatus() 一併決定。
   * 只對有 Digital Review 或 Follow-up 的檢體作用（單獨 AI Alert 不存在，第 3 節）。
   */
  function applyIntakeAiAlert(spec) {
    var st = reviewOf(spec).status;
    if (!Array.isArray(st)) return;
    var hasBase = st.indexOf('Digital Review') !== -1 || st.indexOf('Follow-up') !== -1;
    var idx = st.indexOf('AI Alert');
    var want = hasBase && LeaveRules.shouldHaveAiAlert(spec);
    if (want && idx === -1) {
      var pos = st.indexOf('Digital Review');
      if (pos === -1) pos = st.indexOf('Follow-up');
      st.splice(pos + 1, 0, 'AI Alert');
    } else if (!want && idx !== -1) {
      st.splice(idx, 1);
    }
  }

  // ─── 報告核發頁的動作（規則 9～11）───────────────────────

  /**
   * 規則 10：是否顯示「需拉片確認：改為人工鏡檢」（紅、黃、綠都顯示；綠色要開鎖才能按，見 reportLockTarget）
   * 尚無待辦 Follow-up；仍有未完成的數位閱片或 AI 待確認。
   */
  function canSwitchToManualReview(spec) {
    if (!spec) return false;
    if (needsPendingFollowUp(spec)) return false;
    if (hasStatus(spec, 'Digital Review')) return !isDigitalReviewDone(spec);
    return hasStatus(spec, 'AI Alert') && !isAiAlertConfirmed(spec);
  }

  /**
   * 規則 9、10：報告簽核頁的鎖頭鎖住哪個按鈕。開鎖＝允許做與系統判斷不同的操作：
   *  - 'signOff'：紅／黃橫幅，或有待辦需拉片確認 → 鎖「確認並簽核」
   *  - 'manualReview'：綠色且可改為人工鏡檢 → 鎖「改為人工鏡檢」（醫檢師覺得異常但數值未達門檻時用）
   *  - null：不顯示鎖頭
   */
  function reportLockTarget(spec) {
    if (!spec) return null;
    if (needsPendingFollowUp(spec) || LeaveRules.riskState(spec).hasLeaveNow) return 'signOff';
    if (canSwitchToManualReview(spec)) return 'manualReview';
    return null;
  }

  /** 規則 10：改為人工鏡檢後的流程旗標（數位結束但未簽核、AI 一併確認、Follow-up 待辦） */
  function workflowAfterManualReview(spec, statusArr) {
    var wf = workflowOf(spec);
    var entityStatusDone = {};
    ENTITY_STATUSES.forEach(function (k) {
      if (wf.entityStatusDone && wf.entityStatusDone[k] !== undefined) entityStatusDone[k] = !!wf.entityStatusDone[k];
    });
    var st = Array.isArray(statusArr) ? statusArr : reviewOf(spec).status || [];
    var aiAlertConfirmed = !!wf.aiAlertConfirmed || st.indexOf('AI Alert') !== -1;
    if (st.indexOf('Follow-up') !== -1) entityStatusDone['Follow-up'] = false;
    return {
      digitalReview: true,
      digitalReviewSignedOff: false,
      aiAlertConfirmed: aiAlertConfirmed,
      entityReview: false,
      entityStatusDone: entityStatusDone
    };
  }

  /**
   * 規則 9：簽核後的狀態與流程旗標
   * options.confirmAiOnVerify：綠／黃橫幅簽核 → AI 一併確認
   * options.forceUnlockSignOff：開鎖強制簽核 → AI 確認；有待辦 Follow-up 一併完成
   * 回傳 { status, workflowDone }（不修改傳入的 spec）
   */
  function workflowOnReportVerified(spec, options) {
    options = options || {};
    var wf = workflowOf(spec);
    var entityStatusDone = {};
    ENTITY_STATUSES.forEach(function (k) {
      if (wf.entityStatusDone && wf.entityStatusDone[k] !== undefined) entityStatusDone[k] = !!wf.entityStatusDone[k];
    });
    var cur = reviewOf(spec).status;
    var st = Array.isArray(cur) ? cur.slice() : [];
    var confirmAi = !!(options.confirmAiOnVerify || options.forceUnlockSignOff);

    if (st.indexOf('Digital Review') !== -1 || confirmAi) {
      wf.digitalReview = true;
      wf.digitalReviewSignedOff = true;
    }
    if (confirmAi && st.indexOf('AI Alert') !== -1) wf.aiAlertConfirmed = true;
    if (options.forceUnlockSignOff && st.indexOf('Follow-up') !== -1) entityStatusDone['Follow-up'] = true;
    // 簽核完成數位流程時補上 Digital Review 膠囊（顯示完成勾）
    if (wf.digitalReview && st.indexOf('Digital Review') === -1) st.push('Digital Review');

    wf.entityReview = recomputeEntityReview(st, entityStatusDone);
    wf.entityStatusDone = entityStatusDone;
    return { status: st, workflowDone: wf };
  }

  return {
    ENTITY_STATUSES: ENTITY_STATUSES,
    reviewOf: reviewOf,
    hasStatus: hasStatus,
    emptyWorkflow: emptyWorkflow,
    normalizeWorkflowDone: normalizeWorkflowDone,
    isDigitalReviewDone: isDigitalReviewDone,
    isAiAlertConfirmed: isAiAlertConfirmed,
    isDigitalWorkflowDone: isDigitalWorkflowDone,
    isEntityReviewDone: isEntityReviewDone,
    isEntityStatusCompleted: isEntityStatusCompleted,
    isCompleted: isCompleted,
    computeStatusDone: computeStatusDone,
    recomputeEntityReview: recomputeEntityReview,
    needsPendingFollowUp: needsPendingFollowUp,
    isHandoffToFollowUp: isHandoffToFollowUp,
    isDigitalReviewReadOnly: isDigitalReviewReadOnly,
    isAiAlertWithFollowUp: isAiAlertWithFollowUp,
    inDigitalList: inDigitalList,
    inEntityList: inEntityList,
    workQueue: workQueue,
    matchesStatusFilter: matchesStatusFilter,
    showsCheckmark: showsCheckmark,
    isCapsuleDone: isCapsuleDone,
    canToggleEntityStatus: canToggleEntityStatus,
    displayUrgency: displayUrgency,
    PLT_CHECK_FLAGS: PLT_CHECK_FLAGS,
    intakeBaseStatus: intakeBaseStatus,
    needsPltCheck: needsPltCheck,
    intakeStatus: intakeStatus,
    applyIntakeAiAlert: applyIntakeAiAlert,
    canSwitchToManualReview: canSwitchToManualReview,
    reportLockTarget: reportLockTarget,
    workflowAfterManualReview: workflowAfterManualReview,
    workflowOf: workflowOf,
    workflowOnReportVerified: workflowOnReportVerified
  };
})();
