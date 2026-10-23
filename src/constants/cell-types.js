/**
 * CellConstants — 細胞類別、資料欄位對照與表格列定義（唯一來源）
 *
 * 影像檢視、報告核發、檢體管理三頁都從這裡取用，不再各自定義清單。
 * 細胞類別名稱（例如 'Segmented Neutrophil'）＝影像檢視頁的分類名稱；
 * 欄位 key（例如 'segmentedNeutrophil'）＝檢體的 imaging.aiDiff（AI 值）、lis.prevReport.diff（前次報告）、review.editedDiff（人員編輯值）的欄位。
 */

const CellConstants = (function () {
  'use strict';

  /** 影像檢視頁細胞區塊的預設排序（成熟細胞 → 異常細胞 → 非白血球 → 待分類） */
  const REVIEW_CATEGORY_ORDER = Object.freeze([
    'Band', 'Segmented Neutrophil', 'Eosinophil', 'Monocyte', 'Basophil',
    'Lymphocyte', 'Atypical Lymphocyte', 'Abnormal Lymphocyte',
    'Blast', 'Promyelocyte', 'Myelocyte', 'Metamyelocyte', 'Hypersegmented',
    'Promonocyte', 'Plasma Cell', 'Megakaryocyte',
    'NRBC', 'Giant PLT', 'Smudge Cell', 'Unidentified', 'Artefact',
  ]);

  /**
   * 非白血球類別（規則 8）：
   * - 不計入白血球分類百分比的分母
   * - 本身也以 % 呈現，分母＝白血球總數（例：白血球 100 顆、NRBC 2 顆 → 2%），於報告核發「其他發現」（第 6 節）
   * Unidentified 不在此列：儲存前必須為 0（規則 8），閱片中視為待分類白血球計入分母。
   */
  const NON_WBC_TYPES = Object.freeze(['NRBC', 'Giant PLT', 'Megakaryocyte', 'Smudge Cell', 'Artefact']);

  /** 細胞類別 → 資料欄位 key（Unidentified 沒有對應欄位） */
  const CATEGORY_TO_METRIC_KEY = Object.freeze({
    'Band': 'band',
    'Segmented Neutrophil': 'segmentedNeutrophil',
    'Eosinophil': 'eosinophil',
    'Monocyte': 'monocyte',
    'Basophil': 'basophil',
    'Lymphocyte': 'lymphocyte',
    'Atypical Lymphocyte': 'atypicalLymphocyte',
    'Abnormal Lymphocyte': 'abnormalLymphocyte',
    'Blast': 'blast',
    'Promyelocyte': 'promyelocyte',
    'Myelocyte': 'myelocyte',
    'Metamyelocyte': 'metamyelocyte',
    'Hypersegmented': 'hypersegmented',
    'Promonocyte': 'promonocyte',
    'Plasma Cell': 'plasmaCell',
    'Megakaryocyte': 'megakaryocyte',
    'NRBC': 'nrbc',
    'Giant PLT': 'giantPlt',
    'Smudge Cell': 'smudgeCell',
    'Artefact': 'artefact',
  });

  /** 「分析與歷史報告」表格列（檢體管理右側摘要、影像檢視左側共用）：[顯示名稱, 欄位 key] */
  const ANALYSIS_ROWS = Object.freeze([
    ['WBC (10e9/L)', 'wbc'],
    ['PLT (10e9/L)', 'plt'],
    ['Band (%)', 'band'],
    ['Segmented neutrophil (%)', 'segmentedNeutrophil'],
    ['Eosinophil (%)', 'eosinophil'],
    ['Monocyte (%)', 'monocyte'],
    ['Basophil (%)', 'basophil'],
    ['Lymphocyte (%)', 'lymphocyte'],
    ['Atypical lymphocyte (%)', 'atypicalLymphocyte'],
    ['Blast (%)', 'blast'],
    ['Promyelocyte (%)', 'promyelocyte'],
    ['Myelocyte (%)', 'myelocyte'],
    ['Metamyelocyte (%)', 'metamyelocyte'],
    ['Hypersegmented (%)', 'hypersegmented'],
    ['Promonocyte (%)', 'promonocyte'],
    ['Plasma cell (%)', 'plasmaCell'],
    ['Abnormal lymphocyte (%)', 'abnormalLymphocyte'],
  ]);

  /** 報告核發頁表格列：[顯示名稱, 欄位 key] */
  const REPORT_ROWS = Object.freeze({
    COMMON: Object.freeze([
      ['Band', 'band'],
      ['Segmented neutrophil', 'segmentedNeutrophil'],
      ['Eosinophil', 'eosinophil'],
      ['Monocyte', 'monocyte'],
      ['Basophil', 'basophil'],
      ['Lymphocyte', 'lymphocyte'],
      ['Atypical lymphocyte', 'atypicalLymphocyte'],
    ]),
    ABNORMAL: Object.freeze([
      ['Blast', 'blast'],
      ['Promyelocyte', 'promyelocyte'],
      ['Myelocyte', 'myelocyte'],
      ['Metamyelocyte', 'metamyelocyte'],
      ['Hypersegmented', 'hypersegmented'],
      ['Promonocyte', 'promonocyte'],
      ['Plasma cell', 'plasmaCell'],
      ['Abnormal lymphocyte', 'abnormalLymphocyte'],
    ]),
    /** 其他發現（非白血球；% ＝該類顆數 ÷ 白血球總數） */
    OTHER: Object.freeze([
      ['NRBC', 'nrbc'],
      ['Giant PLT', 'giantPlt'],
      ['Megakaryocyte', 'megakaryocyte'],
      ['Smudge cell', 'smudgeCell'],
      ['Artefact', 'artefact'],
    ]),
  });

  function isNonWbcCategory(category) {
    return NON_WBC_TYPES.indexOf(category) !== -1;
  }

  return Object.freeze({
    REVIEW_CATEGORY_ORDER: REVIEW_CATEGORY_ORDER,
    NON_WBC_TYPES: NON_WBC_TYPES,
    CATEGORY_TO_METRIC_KEY: CATEGORY_TO_METRIC_KEY,
    ANALYSIS_ROWS: ANALYSIS_ROWS,
    REPORT_ROWS: REPORT_ROWS,
    isNonWbcCategory: isNonWbcCategory,
  });
})();
