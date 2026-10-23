/**
 * 血球分類軟體 - 進線後的檢體資料（原型）
 *
 * 檢體資料不再直接寫在這裡，而是由四份模擬資料依條碼合併而成（第 2 節 進線與合併）：
 *   assets/data/sources/cellavision-db.js（SOURCE_CELLAVISION：DI-60 影像）→ AiModelService 模擬 AI 模型預分類（設定 ai-model-mock.js）、
 *   wam.js（SOURCE_WAM）、lis.js（SOURCE_LIS）
 *   → IntakeMerge.mergeByBarcode()（src/rules/intake-merge.js）
 *   → SpecimenStore.init() 呼叫 WorkflowRules.intakeStatus() 加膠囊（第 3 節）
 *
 * 載入順序：rules（含 intake-merge.js）→ sources/*.js → database.js
 */

/**
 * 【展示用】新介面本身的處理狀態（放在檢體的 review，不是外部系統的資料）：
 *   editor 編輯人員、locked 鎖定中（他人編輯中）、completed 展示用的已完成檢體（所有流程旗標設為完成）
 *   notes 只是模擬情境說明，程式不使用
 * 正式系統由新介面自己的資料庫提供。
 */
var DEMO_STATE = {
  H5080720847: {
    notes: ['血小板與前次差距過大，需人工鏡檢確認']
  },
  H5080720276: {
    editor: 'F12630E',
    completed: true
  },
  H5080720647: {
    notes: ['AI 辨識 Blast 6%，請確認（可為誤報）；另待血小板確認']
  },
  H5080720696: {},
  H5080706286: {
    notes: ['AI 辨識 Blast 2%，請確認（可為誤報）']
  },
  H5080706280: {
    notes: ['前次報告 Eosinophil 25%，本次追蹤，建議實體鏡檢確認']
  },
  H5080706275: {
    editor: 'F412630E',
    locked: true
  },
  H5080706301: {
    editor: 'Eden',
    completed: true
  },
  H5080721101: {},
  H5080721102: {},
  H5080721103: {
    notes: ['AI 辨識 Promyelocyte 3%（Present），請確認分類']
  },
  H5080721104: {
    notes: ['AI 將 3 顆 Lymphocyte 誤判為 Blast 3%（Present），請人工確認（可能為誤報）', '成效調查情境四～五：3 顆淋巴球誤判為 Blast']
  },
  H5080721105: {},
  H5080721106: {},
  H5080721107: {},
  H5080721108: {},
  H5080721109: {},
  H5080721110: {},
  H5080721201: {
    notes: ['AI 辨識 Blast 達留單門檻，請確認分類', '前次報告 Blast 3%，本次追蹤，建議實體鏡檢']
  },
  H5080721202: {
    notes: ['AI 辨識 Abnormal lymphocyte 達留單門檻，請確認分類', '前次 Abn Lym 50%，本次 10%，屬延續性異常']
  },
  H5080721301: {
    notes: ['AI 將 Lymphocyte 誤判為 Blast 2%，請人工確認（置頂警示可能為誤報）', '成效調查情境四：AI 誤判劇本']
  },
  H5080721401: {
    notes: ['WBC 32.5 (10e9/L) 偏高（>30），請確認是否需留單或追蹤']
  },
  H5080721501: {},
  H5080721502: {},
  H5080721503: {}
};

var APP_DATABASE = (function () {
  var merged = IntakeMerge.mergeByBarcode({
    cellavision: SOURCE_CELLAVISION,   // CellaVision 資料庫：DI-60 拍的細胞影像
    ai: AiModelService.classifyAll(SOURCE_CELLAVISION),   // AI 模型讀取影像 → 每顆預分類、AI 分類結果（Diff%）
    wam: SOURCE_WAM,
    lis: SOURCE_LIS
  });
  merged.issues.forEach(function (i) {
    if (typeof console !== 'undefined') console.warn('[進線] ' + i.message);
  });
  // 新介面的處理狀態放在 review（與 LIS／WAM／影像等進線資料分開）
  merged.specimens.forEach(function (s) {
    var d = DEMO_STATE[s.barcode] || {};
    s.review.editor = d.editor || '';
    s.review.locked = !!d.locked;
    if (d.completed) {
      s.review.workflowDone = { digitalReview: true, digitalReviewSignedOff: true, aiAlertConfirmed: true, entityReview: true,
        entityStatusDone: { 'PLT Check': true, 'Follow-up': true } };
    }
  });
  return {
    /** 進線後的檢體（合併結果；膠囊由 SpecimenStore.init 依進線資料產生） */
    specimens: merged.specimens,
    /** 進線異常（缺來源、條碼格式不符、重複）；原型只輸出到 console */
    intakeIssues: merged.issues,
    departments: ['心臟外科', '感染科/住院醫師', '一般科', '過敏及免疫風濕科', '胸腔科', '腎臟科', '骨科', '神經內科', '家醫科', '皮膚科', '泌尿科', '小兒科'],
    machines: ['DI1', 'DI2']
  };
})();
