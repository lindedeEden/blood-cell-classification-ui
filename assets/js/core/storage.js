/**
 * DemoStorage — 瀏覽器儲存（localStorage／sessionStorage）的唯一出入口
 *
 * 原型沒有後端，所有「需要保存」的資料都經由這裡寫進瀏覽器：
 *  - 使用者介面偏好：字級、細胞縮放、清單模式與篩選條件
 *  - Demo 業務資料：留單門檻、檢體狀態、人員編輯結果
 *    ⚠️ 正式系統應改由後端 API 保存（第 11 節），屆時只需替換本檔的實作
 *  - 跨頁一次性訊息：返回清單後顯示的提示（toast）
 *
 * key 一律定義在 AppConfig.STORAGE_KEYS（src/config/config.js）。
 * 瀏覽器禁止儲存時（例如隱私模式）一律安靜略過，不影響畫面運作。
 */
var DemoStorage = (function () {
  'use strict';

  var K = AppConfig.STORAGE_KEYS;

  // ─── 共用工具 ─────────────────────────────────────────────
  function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function lsSet(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function lsRemove(key) { try { localStorage.removeItem(key); } catch (e) {} }
  function ssGet(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } }
  function ssSet(key, value) { try { sessionStorage.setItem(key, value); } catch (e) {} }
  function ssRemove(key) { try { sessionStorage.removeItem(key); } catch (e) {} }
  function parseJson(raw) { if (!raw) return null; try { return JSON.parse(raw); } catch (e) { return null; } }

  // ─── 介面偏好 ─────────────────────────────────────────────
  function getFontLevel() { return lsGet(K.FONT_LEVEL); }
  function setFontLevel(level) { lsSet(K.FONT_LEVEL, String(level)); }
  function getCellZoom() { return lsGet(K.CELL_ZOOM); }
  function setCellZoom(level) { lsSet(K.CELL_ZOOM, String(level)); }

  /** 檢體管理模式：'digital' | 'entity' | null */
  function getListMode() {
    var v = lsGet(K.LIST_MODE);
    return (v === 'digital' || v === 'entity') ? v : null;
  }
  function setListMode(mode) {
    if (mode === 'digital' || mode === 'entity') lsSet(K.LIST_MODE, mode);
    else lsRemove(K.LIST_MODE);
  }
  function getListUiState() {
    var parsed = parseJson(lsGet(K.LIST_UI_STATE));
    return parsed && typeof parsed === 'object' ? parsed : null;
  }
  function setListUiState(state) { lsSet(K.LIST_UI_STATE, JSON.stringify(state)); }

  /** 進入影像檢視前記住清單模式，返回清單時還原 */
  function rememberReviewReturnMode() {
    var mode = getListMode() || 'digital';
    ssSet(K.REVIEW_RETURN_MODE, mode);
  }
  function consumeReviewReturnMode() {
    var mode = ssGet(K.REVIEW_RETURN_MODE);
    return (mode === 'digital' || mode === 'entity') ? mode : null;
  }
  function clearReviewReturnMode() { ssRemove(K.REVIEW_RETURN_MODE); }

  // ─── Demo：留單門檻（規則 7：正式系統改存後端）───────────────
  function loadThresholds() { return parseJson(lsGet(K.LEAVE_THRESHOLDS)); }
  function saveThresholds(thresholds) { lsSet(K.LEAVE_THRESHOLDS, JSON.stringify(thresholds)); }
  function clearThresholds() { lsRemove(K.LEAVE_THRESHOLDS); }

  // ─── Demo：檢體處理狀態（key＝檢體條碼；每筆存 review 的 status、statusDone、workflowDone、editor）──
  function readStatusMap() {
    var map = parseJson(lsGet(K.SPECIMEN_STATUS));
    return map && typeof map === 'object' ? map : {};
  }
  function writeStatusMap(map) { lsSet(K.SPECIMEN_STATUS, JSON.stringify(map)); }
  function removeStatusEntries(specimenIds) {
    if (lsGet(K.SPECIMEN_STATUS) == null) return;
    var map = readStatusMap();
    (specimenIds || []).forEach(function (id) { delete map[id]; });
    writeStatusMap(map);
  }
  function isStatusKey(key) { return key === K.SPECIMEN_STATUS; }

  // ─── Demo：人員編輯結果（細胞分類快照、人員編輯值 review.editedDiff）─────────
  // specimenId＝檢體條碼；cells＝影像檢視頁的細胞工作副本
  // （{ id:'cell-n', cellId, category＝目前分類, imageUrl, aiSuggestion }），不是 imaging.cells
  function saveEditedCells(specimenId, cells) {
    if (!specimenId || !Array.isArray(cells) || cells.length === 0) return;
    lsSet(K.EDITED_CELLS_PREFIX + specimenId, JSON.stringify(cells));
  }
  function loadEditedCells(specimenId) {
    if (!specimenId) return null;
    var parsed = parseJson(lsGet(K.EDITED_CELLS_PREFIX + specimenId));
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  }
  function removeEditedCells(specimenId) { if (specimenId) lsRemove(K.EDITED_CELLS_PREFIX + specimenId); }
  /** 人員編輯值（review.editedDiff） */
  function saveEditedDiff(specimenId, editedDiff) {
    if (specimenId) lsSet(K.EDITED_DIFF_PREFIX + specimenId, JSON.stringify(editedDiff));
  }
  function loadEditedDiff(specimenId) {
    var parsed = parseJson(lsGet(K.EDITED_DIFF_PREFIX + specimenId));
    return parsed && typeof parsed === 'object' ? parsed : null;
  }
  /** 清除某檢體的人員編輯結果（LIS 撤回時使用：SpecimenStore.withdrawFromLis，規則 15） */
  function clearEditedResult(specimenId) {
    if (!specimenId) return;
    lsRemove(K.EDITED_CELLS_PREFIX + specimenId);
    lsRemove(K.EDITED_DIFF_PREFIX + specimenId);
  }

  // ─── Demo：LIS 回寫紀錄（規則 14；正式系統由後端寫入 LIS）──
  function readLisLog() { return parseJson(lsGet(K.LIS_WRITEBACK_LOG)) || []; }
  function appendLisLog(entry) {
    var log = readLisLog();
    log.push(entry);
    lsSet(K.LIS_WRITEBACK_LOG, JSON.stringify(log.slice(-200)));
  }

  /** 登入時重設 Demo：清除檢體狀態、所有人員編輯結果與 LIS 回寫紀錄（留單門檻保留） */
  function resetDemoData() {
    lsRemove(K.SPECIMEN_STATUS);
    lsRemove(K.LIS_WRITEBACK_LOG);
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && (k.indexOf(K.EDITED_CELLS_PREFIX) === 0 || k.indexOf(K.EDITED_DIFF_PREFIX) === 0)) keys.push(k);
      }
      keys.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  }

  // ─── 登入帳號（簽核完成時寫入編輯人員）─────────────────────
  function getCurrentUserAccount() { return ssGet(AppConfig.AUTH.USER_ACCOUNT_KEY) || ''; }
  function setCurrentUserAccount(account) { ssSet(AppConfig.AUTH.USER_ACCOUNT_KEY, account); }

  // ─── 跨頁提示（返回檢體管理後顯示一次）─────────────────────
  /** 改為人工鏡檢：{ specimenId, addedFollowUp, lisSynced } */
  function queueManualReviewToast(specimenId, addedFollowUp, lisSynced) {
    if (!specimenId) return;
    ssSet(K.TOAST_MANUAL_REVIEW, JSON.stringify({
      specimenId: String(specimenId), addedFollowUp: addedFollowUp !== false, lisSynced: !!lisSynced
    }));
  }
  function consumeManualReviewToast() {
    var parsed = consumeRaw(K.TOAST_MANUAL_REVIEW);
    if (!parsed) return null;
    return { specimenId: String(parsed.specimenId), addedFollowUp: parsed.addedFollowUp !== false, lisSynced: !!parsed.lisSynced };
  }
  /** 拉片完成／簽核完成：{ specimenId, workflowCompleted } */
  function queueFollowUpDoneToast(specimenId, workflowCompleted) { queueDoneToast(K.TOAST_FOLLOW_UP_DONE, specimenId, workflowCompleted); }
  function consumeFollowUpDoneToast() { return consumeDoneToast(K.TOAST_FOLLOW_UP_DONE); }
  function queueReportVerifiedToast(specimenId, workflowCompleted) { queueDoneToast(K.TOAST_REPORT_VERIFIED, specimenId, workflowCompleted); }
  function consumeReportVerifiedToast() { return consumeDoneToast(K.TOAST_REPORT_VERIFIED); }

  function queueDoneToast(key, specimenId, workflowCompleted) {
    if (!specimenId) return;
    ssSet(key, JSON.stringify({ specimenId: String(specimenId), workflowCompleted: !!workflowCompleted }));
  }
  function consumeDoneToast(key) {
    var parsed = consumeRaw(key);
    if (!parsed) return null;
    return { specimenId: String(parsed.specimenId), workflowCompleted: !!parsed.workflowCompleted };
  }
  function consumeRaw(key) {
    var raw = ssGet(key);
    if (!raw) return null;
    ssRemove(key);
    var parsed = parseJson(raw);
    return parsed && parsed.specimenId ? parsed : null;
  }

  /** 清掉還沒顯示的提示（登入、登出時：不帶到下一次登入） */
  function clearToasts() { ssRemove(K.TOAST_MANUAL_REVIEW); ssRemove(K.TOAST_FOLLOW_UP_DONE); ssRemove(K.TOAST_REPORT_VERIFIED); }

  // ─── 展示用（demo/usability-study.js）──────────────────────
  function getUsabilityScenarioId() { return lsGet(K.USABILITY_SCENARIO) || ''; }
  function setUsabilityScenarioId(id) { if (id) lsSet(K.USABILITY_SCENARIO, id); else lsRemove(K.USABILITY_SCENARIO); }

  return {
    readLisLog: readLisLog,
    appendLisLog: appendLisLog,
    getFontLevel: getFontLevel, setFontLevel: setFontLevel,
    getCellZoom: getCellZoom, setCellZoom: setCellZoom,
    getListMode: getListMode, setListMode: setListMode,
    getListUiState: getListUiState, setListUiState: setListUiState,
    rememberReviewReturnMode: rememberReviewReturnMode,
    consumeReviewReturnMode: consumeReviewReturnMode,
    clearReviewReturnMode: clearReviewReturnMode,
    loadThresholds: loadThresholds, saveThresholds: saveThresholds, clearThresholds: clearThresholds,
    readStatusMap: readStatusMap, writeStatusMap: writeStatusMap,
    removeStatusEntries: removeStatusEntries, isStatusKey: isStatusKey,
    saveEditedCells: saveEditedCells, loadEditedCells: loadEditedCells, removeEditedCells: removeEditedCells,
    saveEditedDiff: saveEditedDiff, loadEditedDiff: loadEditedDiff,
    clearEditedResult: clearEditedResult, resetDemoData: resetDemoData,
    getCurrentUserAccount: getCurrentUserAccount, setCurrentUserAccount: setCurrentUserAccount,
    queueManualReviewToast: queueManualReviewToast, consumeManualReviewToast: consumeManualReviewToast,
    queueFollowUpDoneToast: queueFollowUpDoneToast, consumeFollowUpDoneToast: consumeFollowUpDoneToast,
    queueReportVerifiedToast: queueReportVerifiedToast, consumeReportVerifiedToast: consumeReportVerifiedToast,
    clearToasts: clearToasts,
    getUsabilityScenarioId: getUsabilityScenarioId, setUsabilityScenarioId: setUsabilityScenarioId
  };
})();
