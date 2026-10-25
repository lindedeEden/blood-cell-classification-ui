/**
 * 細胞類別、資料欄位對照與表格列定義（三個頁面共用的唯一來源）
 *
 * 細胞類別名稱（例 'Segmented Neutrophil'）＝影像檢視頁的分類名稱；
 * 欄位 key（例 'segmentedNeutrophil'）＝ imaging.aiDiff、lis.prevReport.diff、review.editedDiff 的欄位。
 */
import type { CellCategory, DiffKey, MetricKey } from '../types';

/** 待分類：AI 沒有結果的細胞；儲存前必須為 0（規則 8） */
export const UNIDENTIFIED = 'Unidentified';

/** 影像檢視頁細胞區塊的預設排序（成熟細胞 → 異常細胞 → 非白血球 → 待分類） */
export const REVIEW_CATEGORY_ORDER: readonly CellCategory[] = [
  'Band',
  'Segmented Neutrophil',
  'Eosinophil',
  'Monocyte',
  'Basophil',
  'Lymphocyte',
  'Atypical Lymphocyte',
  'Abnormal Lymphocyte',
  'Blast',
  'Promyelocyte',
  'Myelocyte',
  'Metamyelocyte',
  'Hypersegmented',
  'Promonocyte',
  'Plasma Cell',
  'Megakaryocyte',
  'NRBC',
  'Giant PLT',
  'Smudge Cell',
  UNIDENTIFIED,
  'Artefact',
];

/**
 * 非白血球（規則 8）：不計入白血球分類的分母；本身也以 % 呈現，分母＝白血球總數。
 * Unidentified 不在此列：閱片中視為待分類白血球，計入分母。
 */
export const NON_WBC_TYPES: readonly CellCategory[] = ['NRBC', 'Giant PLT', 'Megakaryocyte', 'Smudge Cell', 'Artefact'];

/** 細胞類別 → 資料欄位（Unidentified 沒有對應欄位）；順序＝LIS 回寫與 AI 分類結果的欄位順序 */
export const CATEGORY_TO_KEY: Readonly<Record<string, DiffKey>> = {
  Band: 'band',
  'Segmented Neutrophil': 'segmentedNeutrophil',
  Eosinophil: 'eosinophil',
  Monocyte: 'monocyte',
  Basophil: 'basophil',
  Lymphocyte: 'lymphocyte',
  'Atypical Lymphocyte': 'atypicalLymphocyte',
  'Abnormal Lymphocyte': 'abnormalLymphocyte',
  Blast: 'blast',
  Promyelocyte: 'promyelocyte',
  Myelocyte: 'myelocyte',
  Metamyelocyte: 'metamyelocyte',
  Hypersegmented: 'hypersegmented',
  Promonocyte: 'promonocyte',
  'Plasma Cell': 'plasmaCell',
  Megakaryocyte: 'megakaryocyte',
  NRBC: 'nrbc',
  'Giant PLT': 'giantPlt',
  'Smudge Cell': 'smudgeCell',
  Artefact: 'artefact',
};

/** 有資料欄位的類別（依 CATEGORY_TO_KEY 順序） */
export const KEYED_CATEGORIES: readonly CellCategory[] = Object.keys(CATEGORY_TO_KEY);

export function isNonWbcCategory(category: CellCategory): boolean {
  return NON_WBC_TYPES.includes(category);
}

/** 表格的一列：[顯示名稱, 欄位] */
export type TableRow<K extends MetricKey = MetricKey> = readonly [label: string, key: K];

/** 「分析與歷史報告」表格（檢體管理右側摘要、影像檢視左側共用） */
export const ANALYSIS_ROWS: readonly TableRow[] = [
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
];

/** 報告簽核頁表格 */
export const REPORT_ROWS = {
  COMMON: [
    ['Band', 'band'],
    ['Segmented neutrophil', 'segmentedNeutrophil'],
    ['Eosinophil', 'eosinophil'],
    ['Monocyte', 'monocyte'],
    ['Basophil', 'basophil'],
    ['Lymphocyte', 'lymphocyte'],
    ['Atypical lymphocyte', 'atypicalLymphocyte'],
  ],
  ABNORMAL: [
    ['Blast', 'blast'],
    ['Promyelocyte', 'promyelocyte'],
    ['Myelocyte', 'myelocyte'],
    ['Metamyelocyte', 'metamyelocyte'],
    ['Hypersegmented', 'hypersegmented'],
    ['Promonocyte', 'promonocyte'],
    ['Plasma cell', 'plasmaCell'],
    ['Abnormal lymphocyte', 'abnormalLymphocyte'],
  ],
  /** 其他發現（非白血球；% ＝該類顆數 ÷ 白血球總數） */
  OTHER: [
    ['NRBC', 'nrbc'],
    ['Giant PLT', 'giantPlt'],
    ['Megakaryocyte', 'megakaryocyte'],
    ['Smudge cell', 'smudgeCell'],
    ['Artefact', 'artefact'],
  ],
} as const satisfies Record<string, readonly TableRow<DiffKey>[]>;
