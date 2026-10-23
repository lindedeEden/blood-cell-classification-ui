/**
 * 報告核發頁
 *  - 顯示檢體的 AI 值、人員編輯值與前次報告，依留單規則顯示紅／黃／綠橫幅（規則 9）
 *  - 按鈕：確認並簽核（規則 9）、需拉片確認：改為人工鏡檢（規則 10）、已拉片完成（規則 11）
 *  - 鎖頭：紅／黃鎖「確認並簽核」，綠色鎖「改為人工鏡檢」（WorkflowRules.reportLockTarget）
 *
 * 本頁通常以 iframe 嵌在影像檢視頁中：按鈕結果以 postMessage 通知外層頁面處理；
 * 單獨開啟時（不在 iframe 內）則自行完成動作並返回檢體管理。
 */
(function () {
  'use strict';

  var WR = WorkflowRules;
  var ROWS = CellConstants.REPORT_ROWS;
  var CHECK_ICON = '<span class="material-symbols-outlined text-[14px] mr-0.5 align-middle">check</span>';

  // 鎖頭狀態（規則 9、10）：鎖住哪個按鈕由 WR.reportLockTarget() 決定，換檢體時重新上鎖
  var unlocked = false;
  var unlockedSpecimenId = null;

  function isEmbedded() { return window.self !== window.top && !!window.parent; }
  function notifyParent(message) { window.parent.postMessage(message, '*'); }

  /** 目前檢體（含影像檢視頁儲存的人員編輯值 review.editedDiff） */
  function getSpecimen() {
    var id = AppNav.getSpecimenIdFromUrl();
    if (!id && SpecimenStore.all().length > 0) id = SpecimenStore.all()[0].barcode;
    var spec = id ? SpecimenStore.getById(id) : null;
    return spec ? SpecimenStore.loadEditedDiff(spec) : null;
  }

  function riskOf(spec) { return LeaveRules.riskState(spec); }

  // ─── 表格 ─────────────────────────────────────────────────

  function buildWbcTable(spec) {
    var aiVals = LeaveRules.aiValues(spec);
    var editedDiff = spec.review.editedDiff || {};
    var prev = LeaveRules.prevValues(spec);
    var tbody = document.getElementById('wbc-table-body');
    if (!tbody) return;
    var html = '';

    function addSection(label) {
      html += '<tr class="bg-zinc-50/30 dark:bg-zinc-800/10"><td class="px-4 py-1.5 text-xs font-bold text-zinc-600 uppercase tracking-widest" colspan="5">' + label + '</td></tr>';
    }

    function addRow(rowLabel, key) {
      var flow = AppUi.flowDcValue(spec, key);
      var ai = aiVals[key] || '-';
      // 人員編輯：有人工編輯結果時優先顯示；否則顯示 AI 值
      var edited = editedDiff[key] != null ? editedDiff[key] : (aiVals[key] || '-');
      var prevVal = prev[key] || '-';
      var abnormal = LeaveRules.isLeave(key, edited, spec);
      var rowClass = abnormal ? 'bg-medical-red/5 hover:bg-medical-red/10' : 'hover:bg-zinc-50/50';
      var nameClass = abnormal ? 'text-medical-red font-bold' : 'text-zinc-800 dark:text-zinc-200 font-semibold';
      var valueClass = abnormal ? 'text-medical-red font-bold' : 'text-zinc-600';
      var editedClass = abnormal
        ? 'text-medical-red font-black bg-red-50 dark:bg-red-900/30 ring-1 ring-inset ring-red-200/60'
        : 'text-blue-900 dark:text-blue-100 font-extrabold bg-blue-100/80 dark:bg-blue-900/40 ring-1 ring-inset ring-blue-200/70 dark:ring-blue-700/40';
      html += '<tr class="' + rowClass + '">';
      html += '<td class="px-4 py-2 text-base ' + nameClass + '">';
      html += abnormal ? rowLabel + ' <span class="material-symbols-outlined text-[18px] align-middle">error</span>' : rowLabel;
      html += '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular ' + valueClass + '">' + (flow || '-') + '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular ' + valueClass + '">' + (ai || '-') + '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular ' + editedClass + '">' + (edited || '-') + '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular text-zinc-600">' + (prevVal || '-') + '</td>';
      html += '</tr>';
    }

    addSection('常見細胞');
    ROWS.COMMON.forEach(function (r) { addRow(r[0], r[1]); });
    addSection('未成熟與異常細胞');
    ROWS.ABNORMAL.forEach(function (r) { addRow(r[0], r[1]); });
    tbody.innerHTML = html;
  }

  /** 其他發現（非白血球）：與白血球分類同為 %，分母＝白血球總數（規則 8、第 6 節） */
  function buildOtherTable(spec) {
    var aiVals = LeaveRules.aiValues(spec);
    var editedDiff = spec.review.editedDiff || {};
    var prev = LeaveRules.prevValues(spec);
    var tbody = document.getElementById('other-table-body');
    if (!tbody) return;
    var html = '';
    ROWS.OTHER.forEach(function (r) {
      var label = r[0];
      var key = r[1];
      var flow = AppUi.flowDcValue(spec, key);
      var ai = aiVals[key] || '-';
      var edited = editedDiff[key] != null ? editedDiff[key] : (aiVals[key] || '-');
      // 規則 1：≥18 歲出現 Megakaryocyte 即達留單，以紅字標示
      var otherAbnormal = LeaveRules.isLeave(key, edited, spec);
      var prevVal = prev[key] || '-';
      html += '<tr class="' + (otherAbnormal ? 'bg-medical-red/5 hover:bg-medical-red/10' : 'hover:bg-zinc-50/30') + '">';
      html += '<td class="px-3 py-1.5 text-xs font-semibold ' + (otherAbnormal ? 'text-medical-red font-bold' : 'text-zinc-700 dark:text-zinc-300') + '">' + label + (otherAbnormal ? ' <span class="material-symbols-outlined text-[14px] align-middle">error</span>' : '') + '</td>';
      html += '<td class="px-2 py-1.5 text-zinc-600 text-xs text-right tabular">' + (flow || '-') + '</td>';
      html += '<td class="px-2 py-1.5 text-zinc-600 text-xs text-right tabular">' + (ai || '-') + '</td>';
      html += '<td class="px-2 py-1.5 text-blue-900 dark:text-blue-100 text-xs font-extrabold text-right tabular bg-blue-100/80 dark:bg-blue-900/40 ring-1 ring-inset ring-blue-200/70 dark:ring-blue-700/40">' + (edited || '-') + '</td>';
      html += '<td class="px-2 py-1.5 text-zinc-600 text-xs text-right tabular">' + (prevVal || '-') + '</td>';
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  function fillCbcPanel(spec) {
    var c = spec.wam.cbc || {};
    var effective = LeaveRules.effectiveValues(spec);
    var wbcValue = effective.wbc != null ? effective.wbc : (c.wbc != null ? c.wbc : '-');
    var wbcAbnormal = LeaveRules.isLeave('wbc', wbcValue, spec);
    var byId = {
      'cbc-wbc': wbcValue, 'cbc-rbc': c.rbc, 'cbc-hb': c.hb, 'cbc-hct': c.hct,
      'cbc-mcv': c.mcv, 'cbc-mch': c.mch, 'cbc-mchc': c.mchc, 'cbc-plt': c.plt
    };
    var defaultValueClass = 'text-zinc-900 dark:text-zinc-100 text-sm font-bold tabular';
    var abnormalValueClass = 'text-medical-red text-sm font-black tabular';
    var defaultLabelClass = 'text-zinc-600 text-[9px] font-bold uppercase tracking-tight';
    var abnormalLabelClass = 'text-medical-red text-[9px] font-bold uppercase tracking-tight';
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = byId[id] != null ? byId[id] : '-';
      if (id === 'cbc-wbc') {
        el.className = wbcAbnormal ? abnormalValueClass : defaultValueClass;
        var labelEl = el.previousElementSibling;
        if (labelEl) labelEl.className = wbcAbnormal ? abnormalLabelClass : defaultLabelClass;
      } else {
        el.className = defaultValueClass;
      }
    });
  }

  /** 病患資訊：讀取該筆檢體實際資料（第 6 節） */
  function fillPatientInfo(spec) {
    var age = LeaveRules.getAgeYears(spec);
    var map = {
      'report-info-id': spec.barcode,
      'report-info-patient-id': spec.lis.patientId,
      'report-info-name': (spec.lis.name || '-') + (spec.lis.gender ? ' (' + spec.lis.gender + ')' : ''),
      'report-info-birth': (spec.lis.birthDate || '-') + (age != null && age !== '' ? ' (' + age + ' 歲)' : ''),
      'report-info-department': spec.lis.department,
      'report-info-machine': spec.wam.machine,   // 進入新介面的檢體皆已自動推片，機台＝玻片所在 DI-60
      'report-info-location': spec.wam.location
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = map[id] != null && map[id] !== '' ? map[id] : '-';
    });
  }

  function renderStatusTags(spec) {
    var wrap = document.getElementById('report-status-tags');
    if (!wrap) return;
    wrap.innerHTML = AppUi.displayStatuses(spec).map(function (s) {
      var cap = AppUi.capsuleInfo(spec, s);
      return '<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold ' + cap.style + '">' + (cap.done ? CHECK_ICON : '') + cap.label + '</span>';
    }).join('');
  }

  // ─── 橫幅與按鈕（規則 9）──────────────────────────

  function applyRiskBanner(spec) {
    var risk = riskOf(spec);
    var banner = document.getElementById('risk-banner');
    var icon = document.getElementById('risk-icon');
    var text = document.getElementById('risk-text');
    if (!banner || !icon || !text) return;
    banner.className = 'px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 border-b';
    text.className = 'text-md font-bold leading-tight tracking-tight text-white';
    if (risk.hasNewLeave) {
      banner.className += ' bg-medical-red border-medical-red/20';
      icon.textContent = 'warning';
      icon.className = 'material-symbols-outlined text-white fill-1 scale-100';
      text.textContent = '留單警示：本次出現新發留單條件，請確認是否需人工鏡檢';
    } else if (risk.hasLeaveNow) {
      banner.className += ' bg-amber-500 border-amber-500/20';
      icon.textContent = 'info';
      icon.className = 'material-symbols-outlined text-white';
      text.textContent = '延續性異常：前次同留單條件已存在，不重複留單';
    } else {
      banner.className += ' bg-emerald-600 border-emerald-600/20';
      icon.textContent = 'check_circle';
      icon.className = 'material-symbols-outlined text-white';
      text.textContent = '狀態良好：未達留單標準';
    }
  }

  function applyReportFooterActions(spec) {
    var sid = spec && spec.barcode ? spec.barcode : '';
    if (sid !== unlockedSpecimenId) {
      unlocked = false;
      unlockedSpecimenId = sid;
    }
    var pendingFollowUp = WR.needsPendingFollowUp(spec);
    var risk = riskOf(spec);
    var lockTarget = WR.reportLockTarget(spec);
    var signOffBlocked = lockTarget === 'signOff' && !unlocked;
    var manualBlocked = lockTarget === 'manualReview' && !unlocked;
    setBlocked(document.getElementById('confirm-btn'), signOffBlocked,
      '尚有需拉片或未解除留單鎖定，請開鎖、改為人工鏡檢或先完成拉片');
    var manualBtn = document.getElementById('manual-alert-btn');
    if (manualBtn) manualBtn.classList.toggle('hidden', !WR.canSwitchToManualReview(spec));
    setBlocked(manualBtn, manualBlocked, '數值未達留單門檻；如仍覺得異常，請先開鎖再改為人工鏡檢');
    var lockBtn = document.getElementById('verify-lock-btn');
    var lockIcon = document.getElementById('verify-lock-icon');
    if (lockBtn) {
      lockBtn.classList.toggle('hidden', !lockTarget);
      lockBtn.setAttribute('aria-hidden', lockTarget ? 'false' : 'true');
      if (lockTarget) {
        lockBtn.classList.toggle('bg-zinc-200', !unlocked);
        lockBtn.classList.toggle('border-zinc-300', !unlocked);
        lockBtn.classList.toggle('text-zinc-600', !unlocked);
        lockBtn.classList.toggle('bg-amber-50', unlocked);
        lockBtn.classList.toggle('border-amber-400', unlocked);
        lockBtn.classList.toggle('text-amber-800', unlocked);
        lockBtn.title = lockTitle(lockTarget, risk, unlocked);
        lockBtn.setAttribute('aria-label', unlocked ? '已開鎖，點擊重新上鎖' : '點擊開鎖');
        if (lockIcon) lockIcon.textContent = unlocked ? 'lock_open' : 'lock';
      }
    }
    var followUpDoneBtn = document.getElementById('follow-up-done-btn');
    if (followUpDoneBtn) followUpDoneBtn.classList.toggle('hidden', !pendingFollowUp);
  }

  /** 按鈕停用（鎖住）時的樣式與提示 */
  function setBlocked(btn, blocked, title) {
    if (!btn) return;
    btn.disabled = !!blocked;
    btn.setAttribute('aria-disabled', blocked ? 'true' : 'false');
    btn.classList.toggle('opacity-50', !!blocked);
    btn.classList.toggle('cursor-not-allowed', !!blocked);
    btn.classList.toggle('pointer-events-none', !!blocked);
    btn.title = blocked ? title : '';
  }

  function lockTitle(lockTarget, risk, isUnlocked) {
    if (lockTarget === 'manualReview') {
      return isUnlocked ? '已開鎖，可改為人工鏡檢' : '綠色：點擊開鎖後可改為人工鏡檢';
    }
    if (isUnlocked) return '已開鎖，可強制簽核（略過拉片／不補需拉片）';
    if (risk.hasNewLeave) return '紅色留單：點擊開鎖後可強制數位簽核';
    return risk.hasLeaveNow ? '延續性異常：點擊開鎖後可強制數位簽核' : '點擊開鎖後可強制簽核（略過需拉片）';
  }

  function renderReportView(spec) {
    if (!spec) return;
    var title = document.getElementById('report-specimen-id');
    if (title) title.textContent = spec.barcode || '';
    fillPatientInfo(spec);
    var prevWbcHeader = document.getElementById('wbc-prev-report-header');
    if (prevWbcHeader) prevWbcHeader.textContent = AppUi.prevReportHeaderLabel(spec, '前次報告(%)');
    var prevOtherHeader = document.getElementById('other-prev-report-header');
    if (prevOtherHeader) prevOtherHeader.textContent = AppUi.prevReportHeaderLabel(spec, '前次報告');
    renderStatusTags(spec);
    applyReportFooterActions(spec);
    applyRiskBanner(spec);
    buildWbcTable(spec);
    buildOtherTable(spec);
    fillCbcPanel(spec);
  }

  function refreshFromStorage() {
    SpecimenStore.applyStoredStatus();
    var spec = getSpecimen();
    if (spec) renderReportView(spec);
  }

  // ─── 按鈕動作 ─────────────────────────────────────────────

  /** 規則 9：確認並簽核 */
  function onConfirm() {
    var s = getSpecimen();
    var forced = WR.reportLockTarget(s) === 'signOff';
    if (forced && !unlocked) return;
    var risk = s ? riskOf(s) : null;
    var sid = s ? s.barcode : '';
    var options = {
      confirmAiOnVerify: !!(s && WR.hasStatus(s, 'AI Alert') && !risk.hasNewLeave),
      forceUnlockSignOff: forced                                    // 開鎖後簽核（規則 9）
    };
    var navigateNextDigitalReview = !!(s && !risk.hasNewLeave);   // 紅色強制簽核後不自動跳下一筆
    if (isEmbedded()) {
      notifyParent({
        type: 'reportVerified',
        specimenId: sid,
        navigateNextDigitalReview: navigateNextDigitalReview,
        confirmAiOnVerify: options.confirmAiOnVerify,
        forceUnlockSignOff: options.forceUnlockSignOff
      });
      return;
    }
    var signed = s ? SpecimenStore.signOffReport(sid, options) : null;
    if (signed && signed.review.statusDone) DemoStorage.queueReportVerifiedToast(sid, WR.isCompleted(signed));
    AppNav.goToSpecimenList({ preferMode: 'digital' });
  }

  /** 開鎖／重新上鎖（規則 9：紅黃鎖簽核；規則 10：綠色鎖改為人工鏡檢） */
  function onToggleLock() {
    var s = getSpecimen();
    if (!s) return;
    if (!WR.reportLockTarget(s)) return;
    unlocked = !unlocked;
    applyReportFooterActions(s);
  }

  /** 規則 11：已拉片完成 */
  function onFollowUpDone() {
    var s = getSpecimen();
    if (!s || !WR.needsPendingFollowUp(s)) return;
    if (isEmbedded()) {
      notifyParent({ type: 'reportFollowUpDone', specimenId: s.barcode });
      return;
    }
    var done = SpecimenStore.markFollowUpDone(s.barcode);
    DemoStorage.queueFollowUpDoneToast(s.barcode, WR.isCompleted(done));
    AppNav.goToSpecimenList();
  }

  /** 規則 10：需拉片確認：改為人工鏡檢；回寫 LIS 檢驗註記「需拉片確認」（LisSync，Demo 由 ApiService 模擬） */
  function onManualReview(btn) {
    var s = getSpecimen();
    if (!s || !WR.canSwitchToManualReview(s)) return;
    if (WR.reportLockTarget(s) === 'manualReview' && !unlocked) return;   // 綠色要先開鎖
    var addedFollowUp = !!SpecimenStore.switchToManualReview(s).addedFollowUp;
    refreshFromStorage();
    btn.disabled = true;
    LisSync.sendNote(s, LisSync.NOTES.SMEAR_REQUIRED)
      .then(function (lisSynced) {
        btn.disabled = false;
        if (isEmbedded()) {
          notifyParent({ type: 'reportManualAlert', specimenId: s.barcode, addedFollowUp: addedFollowUp, lisSynced: lisSynced });
          return;
        }
        DemoStorage.queueManualReviewToast(s.barcode, addedFollowUp, lisSynced);
        AppNav.goToSpecimenList({ preferMode: 'digital' });
      });
  }

  function onClose() {
    if (isEmbedded()) notifyParent({ type: 'reportCancel' });
    else AppNav.goToSpecimenList({ preferMode: 'digital' });
  }

  function bind(id, handler) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function () { handler(el); });
  }

  function init() {
    AppUi.initFontLevel();
    var spec = getSpecimen();
    if (!spec) return;
    renderReportView(spec);

    // 外層影像檢視頁通知資料已更新（例如簽核後）時重新整理
    window.addEventListener('message', function (e) {
      var data = e.data || {};
      if (data.type !== 'specimenDataUpdated') return;
      var myId = AppNav.getSpecimenIdFromUrl();
      if (!data.specimenId || !myId || data.specimenId !== myId) return;
      refreshFromStorage();
    });

    bind('btn-close', onClose);
    bind('confirm-btn', onConfirm);
    bind('verify-lock-btn', onToggleLock);
    bind('follow-up-done-btn', onFollowUpDone);
    bind('manual-alert-btn', onManualReview);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
