/**
 * LisSync — 結果回傳 LIS（《邏輯規則說明文件》規則 14；改為人工鏡檢的註記見規則 10）
 *
 *  - 簽核（規則 9）           → WBC Diff%、非白血球數據（POST /lis/results）
 *  - 改為人工鏡檢（規則 10）       → 檢驗註記「需拉片確認」（POST /lis/notes）
 *  - 需拉片確認完成（規則 11、12） → 檢驗註記「拉片完成」
 *  - 血小板確認完成（規則 12）     → 檢驗註記「血小板確認完成」
 *  - 開鎖後直接核發，待辦需拉片確認隨簽核完成（規則 9）→ 檢驗註記「數位閱片替代拉片鏡檢」
 *
 * 原型：ApiService 的模擬路由回應，每次回寫另記在瀏覽器（DemoStorage 的 LIS 回寫紀錄），
 *       可在開發者工具執行 DemoStorage.readLisLog() 查看。正式系統由後端寫入 LIS。
 * 取消完成（再點一次膠囊）時不回傳 LIS（血液組已確認）。LIS 實際的欄位與格式待確認（附錄 A #1）。
 *
 * 載入順序：api.service → storage.js → lis-sync.js → specimen-store.js
 */
var LisSync = (function () {
  'use strict';

  var NOTES = Object.freeze({
    SMEAR_REQUIRED: '需拉片確認',
    SMEAR_DONE: '拉片完成',
    PLT_DONE: '血小板確認完成',
    DIGITAL_INSTEAD_OF_SMEAR: '數位閱片替代拉片鏡檢'
  });

  var CC = CellConstants;

  function post(path, body) {
    DemoStorage.appendLisLog({ path: path, body: body, at: new Date().toISOString() });
    if (typeof ApiService === 'undefined') return Promise.resolve(false);
    return ApiService.post(path, body).then(function () { return true; }, function () { return false; });
  }

  /** 規則 14：簽核後回寫的數值（判定用數值，規則 4：有人員編輯值時用人員編輯值）；wbcDiff 與 nonWbc 皆為 %，分母＝白血球總數 */
  function resultsPayload(spec) {
    var edited = spec.review.editedDiff || DemoStorage.loadEditedDiff(spec.barcode);
    var current = LeaveRules.effectiveValues(edited ? Object.assign({}, spec, { review: Object.assign({}, spec.review, { editedDiff: edited }) }) : spec);
    var wbcDiff = {}, nonWbc = {};
    Object.keys(CC.CATEGORY_TO_METRIC_KEY).forEach(function (cat) {
      var key = CC.CATEGORY_TO_METRIC_KEY[cat];
      var v = current[key] != null ? current[key] : '-';
      if (CC.isNonWbcCategory(cat)) nonWbc[key] = v; else wbcDiff[key] = v;
    });
    return { barcode: spec.barcode, patientId: spec.lis.patientId, wbcDiff: wbcDiff, nonWbc: nonWbc };
  }

  function sendResults(spec) {
    return post('/lis/results', resultsPayload(spec));
  }

  function sendNote(spec, note) {
    return post('/lis/notes', { barcode: spec.barcode, patientId: spec.lis.patientId, note: note });
  }

  return {
    NOTES: NOTES,
    resultsPayload: resultsPayload,
    sendResults: sendResults,
    sendNote: sendNote
  };
})();
