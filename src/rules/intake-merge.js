/**
 * IntakeMerge — 進線與合併（《邏輯規則說明文件》第 2 節，不編規則號）
 *
 * DI-60 取像完成、AI 模型辨識完成後，檢體才進線。以檢體條碼（barcode）合併四份資料，
 * 產生新介面的檢體資料；合併後由 SpecimenStore.init() 交給 WorkflowRules.intakeStatus() 加膠囊（第 3 節）。
 *
 *   CellaVision 資料庫：DI-60 拍的細胞影像、取像時間（由 AI 模型讀取，附錄 A #4）
 *   AI 模型（林口人工智慧中心開發）：每顆細胞的預分類與信心值、AI 分類結果（Diff%）；不使用 CellaVision 的 AI 預分類
 *   WAM               ：XN-9000 CBC data、Flow DC data、CBC flag、Flow DC flag、PLT flag、SIS rule、檢體歸位、玻片機台
 *   LIS               ：病患資料（含年齡）、收件時間、前次報告、需推片確認註記（直接向 LIS 取，不經 WAM）
 *
 * 設計原則：純邏輯模組，不操作畫面、不讀寫儲存；輸入四份資料的陣列，輸出檢體與進線異常（issues）。
 * 原型：CellaVision 資料庫、WAM、LIS 為 assets/data/sources/ 的模擬資料；AI 模型的結果由 AiModelService 模擬產生；由 assets/data/database.js 呼叫。
 *
 * 進線異常的處理（附錄 A #3，待血液組、資訊室確認；目前做法如下）：
 *  - 條碼格式不符（不是 11 碼英數字）→ 該筆資料略過
 *  - 同一來源同一條碼出現多筆 → 以最後收到的一筆為準
 *  - CellaVision 資料庫有影像、缺 AI 結果、WAM 或 LIS → 暫不進線（不出現在清單），等資料到齊後再合併
 *  - 有 WAM／LIS、CellaVision 資料庫沒有影像 → 尚未取像（或沒有自動推片），不進線，不列為異常
 *  - 影像沒有對應的 AI 結果 → 該顆列為 Unidentified（待人員分類）
 *
 * 載入順序：config → cell-types → intake-merge
 */
var IntakeMerge = (function () {
  'use strict';

  var CC = CellConstants;

  /** 檢體條碼：11 碼英數字（組別碼＋年碼…）；比對前去除空白、轉大寫 */
  var BARCODE_PATTERN = /^[A-Z0-9]{11}$/;

  var SOURCE_LABELS = Object.freeze({ cellavision: 'CellaVision 資料庫', ai: 'AI 辨識結果', wam: 'WAM', lis: 'LIS' });

  function normalizeBarcode(v) {
    return String(v == null ? '' : v).replace(/\s+/g, '').toUpperCase();
  }

  function clone(v) {
    return v == null ? v : JSON.parse(JSON.stringify(v));
  }

  /** 把一個來源的陣列依條碼建索引；格式不符略過、重複以最後一筆為準（都記入 issues） */
  function indexByBarcode(records, source, issues) {
    var map = {};
    (records || []).forEach(function (r) {
      var bc = normalizeBarcode(r && r.barcode);
      if (!BARCODE_PATTERN.test(bc)) {
        issues.push({ type: 'invalid-barcode', source: source, barcode: bc,
          message: SOURCE_LABELS[source] + ' 條碼格式不符（' + (bc || '空白') + '），略過' });
        return;
      }
      if (map[bc]) {
        issues.push({ type: 'duplicate', source: source, barcode: bc,
          message: SOURCE_LABELS[source] + ' 條碼 ' + bc + ' 有多筆，以最後一筆為準' });
      }
      map[bc] = r;
    });
    return map;
  }

  /** 每顆細胞＝CellaVision 的影像＋AI 模型的預分類（依 cellId 對應）；沒有 AI 結果 → Unidentified */
  function joinCells(imageCells, aiCells) {
    var pred = {};
    (aiCells || []).forEach(function (p) { pred[p.cellId] = p; });
    return (imageCells || []).map(function (c) {
      var p = pred[c.cellId];
      return {
        cellId: c.cellId,
        imagePath: c.image,                                         // CellaVision 資料庫的影像
        aiCategory: p ? p.category : 'Unidentified',                // AI 模型的預分類
        aiConfidence: p && p.confidence != null ? p.confidence : null
      };
    });
  }

  /**
   * 由逐顆預分類計算 AI 分類結果（Diff%），即各畫面的「AI 值」（正式系統的算法）：
   * 白血球分類為百分比，分母只算白血球（排除非白血球；Unidentified 視為待分類白血球，計入）；
   * 非白血球也是百分比，但不併入白血球加總，另以「白血球總數」當分母（例：白血球 100 顆、NRBC 2 顆 → NRBC 2.0）。
   * 沒有的項目為 '-'。
   */
  function summarizeAiCells(cells) {
    var counts = {};
    var wbcTotal = 0;
    (cells || []).forEach(function (c) {
      counts[c.aiCategory] = (counts[c.aiCategory] || 0) + 1;
      if (!CC.isNonWbcCategory(c.aiCategory)) wbcTotal++;
    });
    var values = {};
    Object.keys(CC.CATEGORY_TO_METRIC_KEY).forEach(function (cat) {
      var key = CC.CATEGORY_TO_METRIC_KEY[cat];
      var n = counts[cat] || 0;
      // 白血球與非白血球都以白血球總數當分母
      values[key] = n ? (wbcTotal ? n / wbcTotal * 100 : 0).toFixed(1) : '-';
    });
    return values;
  }

  /** LIS 前次報告 → { date, wbc, plt, diff }；diff 只收白血球分類與非白血球欄位（皆為 %） */
  function toPrevReport(date, p) {
    p = p || {};
    var diff = {};
    Object.keys(CC.CATEGORY_TO_METRIC_KEY).forEach(function (cat) {
      var key = CC.CATEGORY_TO_METRIC_KEY[cat];
      if (p[key] !== undefined) diff[key] = p[key];
    });
    return { date: date || '', wbc: p.wbc, plt: p.plt, diff: diff };
  }

  /**
   * 四份資料各一筆 → 新介面的檢體。依資料來源分組，新介面自己產生的處理狀態另放 review：
   *   barcode  檢體條碼（四份資料的對應鍵）
   *   imaging  1. 影像與 AI 預分類結果（CellaVision 資料庫＋AI 模型）
   *   wam      2. WAM
   *   lis      3. LIS
   *   review   新介面的處理狀態（膠囊、流程旗標、編輯人員、鎖定中、人員編輯值；由 SpecimenStore 管理，不是外部資料）
   */
  function toSpecimen(barcode, cv, ai, w, l) {
    var cells = joinCells(cv.cells, ai.cells);
    return {
      barcode: barcode,
      imaging: {
        analysisTime: cv.analysisTime || '',                    // CellaVision 資料庫：DI-60 取像時間
        cells: cells,                                           // 每顆：CellaVision 影像＋AI 模型預分類（影像頁使用）
        // AI 分類結果（Diff%）＝各畫面的「AI 值」：模型有回傳就用回傳值，否則由逐顆結果計算
        aiDiff: ai.values ? clone(ai.values) : summarizeAiCells(cells)
      },
      wam: {
        machine: w.machine || '',                               // 玻片機台
        location: w.location || '',                             // 檢體歸位
        cbc: clone(w.cbc) || {},                                // CBC data（判斷 1 的 WBC 取這裡）
        flowDc: clone(w.flowDc) || {},                          // Flow DC data
        cbcFlags: clone(w.cbcFlags) || {},                      // CBC flag
        flowDcFlags: clone(w.flowDcFlags) || [],                // Flow DC flag
        pltFlag: w.pltFlag || '',                               // PLT flag：判斷 3（規則 3）
        sisRules: clone(w.sisRules) || []                       // 觸發的 SIS rule
      },
      lis: {
        patientId: l.patientId || '',
        name: l.name || '',
        gender: l.gender || '',
        birthDate: l.birthDate || '',
        age: l.age != null && l.age !== '' ? Number(l.age) : null,   // 年齡（LIS 提供）：留單門檻的年齡規則（規則 1）；沒有時視為成人
        department: l.department || '',
        receivedTime: l.receivedTime || '',                     // 收件時間：新介面據此計算時效（經過分鐘數，WorkflowRules.displayUrgency）
        smearRequiredNote: l.smearRequiredNote === true,        // 「需推片確認」註記：判斷 2（規則 2），只有明確為 true 才算
        prevReport: toPrevReport(l.prevReportDate, l.prevReport) // 前次報告（LIS 最近一次）：新發／延續（規則 4）
      },
      review: {}
    };
  }

  /**
   * 依條碼合併四份資料。
   * @param {{cellavision: Array, ai: Array, wam: Array, lis: Array}} sources
   * @returns {{specimens: Array, issues: Array}} specimens 依 CellaVision 資料庫的順序
   */
  function mergeByBarcode(sources) {
    var src = sources || {};
    var issues = [];
    var cv = indexByBarcode(src.cellavision, 'cellavision', issues);
    var ai = indexByBarcode(src.ai, 'ai', issues);
    var wam = indexByBarcode(src.wam, 'wam', issues);
    var lis = indexByBarcode(src.lis, 'lis', issues);
    var specimens = [];
    Object.keys(cv).forEach(function (bc) {   // 進線以 CellaVision 資料庫有影像為準：取像完成才出現在新介面
      var missing = [];
      if (!ai[bc]) missing.push('ai');
      if (!wam[bc]) missing.push('wam');
      if (!lis[bc]) missing.push('lis');
      if (missing.length) {
        var names = missing.map(function (m) { return SOURCE_LABELS[m]; }).join('、');
        issues.push({ type: 'missing-source', source: missing.join('+'), barcode: bc,
          message: '條碼 ' + bc + ' 缺 ' + names + '，暫不進線' });
        return;
      }
      specimens.push(toSpecimen(bc, cv[bc], ai[bc], wam[bc], lis[bc]));
    });
    return { specimens: specimens, issues: issues };
  }

  return {
    BARCODE_PATTERN: BARCODE_PATTERN,
    normalizeBarcode: normalizeBarcode,
    joinCells: joinCells,
    summarizeAiCells: summarizeAiCells,
    toPrevReport: toPrevReport,
    mergeByBarcode: mergeByBarcode
  };
})();
