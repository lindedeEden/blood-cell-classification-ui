/**
 * 留單門檻（規則 1、7；本科標準，文件 2 第 3 章）
 * 執行中的門檻可在「留單標準設定」修改（app/thresholds.ts 保存）；這裡是預設值與設定畫面的顯示資訊。
 */
import type { ThresholdKey, Thresholds } from '../types';

export const DEFAULT_THRESHOLDS: Readonly<Thresholds> = Object.freeze({
  wbc: 30,
  lymphocyte: 60,
  monocyte: 20,
  eosinophil: 20,
  basophil: 5,
  atypicalLymphocyte: 10,
  blast: 'present',
  promyelocyte: 'present',
  myelocyte: 5,
  metamyelocyte: 10,
  hypersegmented: 10,
  promonocyte: 'present',
  plasmaCell: 'present',
  abnormalLymphocyte: 'present',
  // 規則 1 年齡相關：未滿 18 歲 Lymphocyte ≥80%；18 歲以上出現 Megakaryocyte 即留單
  lymphocytePediatric: 80,
  megakaryocyte: 'present',
});

/** 全部門檻 key（依預設值的順序） */
export const THRESHOLD_KEYS = Object.keys(DEFAULT_THRESHOLDS) as ThresholdKey[];

/** 未滿此年齡適用兒童規則；LIS 沒有提供年齡時視為成人（規則 1） */
export const PEDIATRIC_AGE_CUTOFF = 18;

/** 只在設定畫面出現、不直接對應數值欄位的門檻（兒童的 Lymphocyte 門檻，判斷時取代 lymphocyte） */
export const SETTING_ONLY_KEYS: readonly ThresholdKey[] = ['lymphocytePediatric'];

/** 設定畫面的顯示順序 */
export const THRESHOLD_FORM_ORDER: readonly ThresholdKey[] = [
  'wbc',
  'lymphocyte',
  'lymphocytePediatric',
  'monocyte',
  'eosinophil',
  'basophil',
  'atypicalLymphocyte',
  'blast',
  'promyelocyte',
  'myelocyte',
  'metamyelocyte',
  'hypersegmented',
  'promonocyte',
  'plasmaCell',
  'abnormalLymphocyte',
  'megakaryocyte',
];

export const THRESHOLD_LABELS: Readonly<Record<ThresholdKey, string>> = {
  wbc: 'WBC',
  lymphocyte: 'Lymphocyte (%)（18 歲以上）',
  lymphocytePediatric: 'Lymphocyte (%)（未滿 18 歲）',
  monocyte: 'Monocyte (%)',
  eosinophil: 'Eosinophil (%)',
  basophil: 'Basophil (%)',
  atypicalLymphocyte: 'Atypical lymphocyte (%)',
  blast: 'Blast',
  promyelocyte: 'Promyelocyte',
  myelocyte: 'Myelocyte (%)',
  metamyelocyte: 'Metamyelocyte (%)',
  hypersegmented: 'Hypersegmented (%)',
  promonocyte: 'Promonocyte',
  plasmaCell: 'Plasma cell',
  abnormalLymphocyte: 'Abnormal lymphocyte',
  megakaryocyte: 'Megakaryocyte（18 歲以上）',
};
