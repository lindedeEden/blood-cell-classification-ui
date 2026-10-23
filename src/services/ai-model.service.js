/**
 * AiModelService — AI 模型（林口人工智慧中心開發）的預分類（《邏輯規則說明文件》第 2.2 節）
 *
 * 流程（圖 1）：DI-60 拍攝的細胞影像存於 CellaVision 資料庫 → AI 模型讀取影像、逐顆預分類
 *              → 每顆細胞的預分類與信心值、AI 分類結果（Diff%）傳入新介面，與 WAM、LIS 依條碼合併（IntakeMerge）。
 * 不使用 CellaVision 軟體的 AI 預分類。
 *
 * 原型：無法執行真正的模型，依 AI_MODEL_MOCK_SETTINGS（assets/data/sources/ai-model-mock.js）模擬：
 *       範例圖依真實類別存放在 assets/images/cells/<類別>/，以資料夾判斷類別（等於模型判對），
 *       再套用指定的誤判與信心值。
 * 正式系統：改為接收 AI 模型傳來的結果（串接方式待確認，附錄 A #4、#5）；回傳格式維持下方 classifySpecimen() 的格式，
 *           IntakeMerge 與之後的規則不需變動。
 *
 * 載入順序：config → cell-types → intake-merge → ai-model.service；呼叫時需已載入 ai-model-mock.js
 */
var AiModelService = (function () {
  'use strict';

  function settings() {
    return (typeof AI_MODEL_MOCK_SETTINGS !== 'undefined' && AI_MODEL_MOCK_SETTINGS) || {};
  }

  /** 模擬模型對一張影像的預分類：依範例圖資料夾判斷；不認得的影像回傳 Unidentified */
  function classifyImage(image) {
    var folders = settings().FOLDER_TO_CATEGORY || {};
    var parts = String(image || '').split('/');
    var folder = parts.length >= 2 ? parts[parts.length - 2] : '';
    return folders[folder] || 'Unidentified';
  }

  /**
   * 讀取一筆 CellaVision 資料庫紀錄的影像，逐顆預分類。
   * @returns {{barcode: string, cells: Array<{cellId, category, confidence}>, values: Object|null}}
   *          values＝模型直接給的 AI 分類結果（Diff%）；null 表示由 IntakeMerge 依逐顆結果計算
   */
  function classifySpecimen(cvRecord) {
    var cfg = settings();
    var overrides = cfg.CELL_OVERRIDES || {};
    var conf = cfg.CONFIDENCE_BY_CATEGORY || {};
    var noConf = (cfg.NO_CONFIDENCE_BARCODES || []).indexOf(cvRecord.barcode) !== -1;
    var cells = (cvRecord.cells || []).map(function (c) {
      var o = overrides[c.cellId];
      if (o) return { cellId: c.cellId, category: o.category, confidence: o.confidence != null ? o.confidence : null };
      var category = classifyImage(c.image);
      var confidence = !noConf && conf[category] != null ? conf[category] : null;
      return { cellId: c.cellId, category: category, confidence: confidence };
    });
    var fixed = (cfg.FIXED_DIFF || {})[cvRecord.barcode];
    return { barcode: cvRecord.barcode, cells: cells, values: fixed ? JSON.parse(JSON.stringify(fixed)) : null };
  }

  /** 對 CellaVision 資料庫的每筆紀錄執行預分類 */
  function classifyAll(cvRecords) {
    return (cvRecords || []).map(classifySpecimen);
  }

  return {
    classifyImage: classifyImage,
    classifySpecimen: classifySpecimen,
    classifyAll: classifyAll
  };
})();
