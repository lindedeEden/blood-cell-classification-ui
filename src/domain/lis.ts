/**
 * 結果回傳 LIS 的內容（規則 14；改為人工鏡檢的註記見規則 10）
 * 實際送出由 app/lis-sync.ts 負責；LIS 實際的欄位與格式待確認（文件 2 附錄 A #1）。
 */
import { CATEGORY_TO_KEY, KEYED_CATEGORIES, isNonWbcCategory } from './constants/cell-types';
import { effectiveValues } from './rules/leave';
import type { DiffKey, RawValue, Specimen } from './types';

/** LIS 檢驗註記 */
export const LIS_NOTES = {
  /** 改為人工鏡檢（規則 10） */
  SMEAR_REQUIRED: '需拉片確認',
  /** 需拉片確認完成（規則 11、12） */
  SMEAR_DONE: '拉片完成',
  /** 血小板確認完成（規則 12） */
  PLT_DONE: '血小板確認完成',
  /** 開鎖後簽核，待辦的需拉片確認隨簽核完成（規則 9） */
  DIGITAL_INSTEAD_OF_SMEAR: '數位閱片替代拉片鏡檢',
} as const;
export type LisNote = (typeof LIS_NOTES)[keyof typeof LIS_NOTES];

export interface LisResultsPayload {
  barcode: string;
  patientId: string;
  /** 白血球分類（%） */
  wbcDiff: Partial<Record<DiffKey, RawValue>>;
  /** 非白血球（%，分母＝白血球總數） */
  nonWbc: Partial<Record<DiffKey, RawValue>>;
}

/** 簽核後回寫的數值：判斷用的數值（規則 4：有人員編輯值時用人員編輯值） */
export function resultsPayload(spec: Specimen): LisResultsPayload {
  const current = effectiveValues(spec) as Record<string, RawValue>;
  const wbcDiff: LisResultsPayload['wbcDiff'] = {};
  const nonWbc: LisResultsPayload['nonWbc'] = {};
  for (const category of KEYED_CATEGORIES) {
    const key = CATEGORY_TO_KEY[category] as DiffKey;
    const value = current[key] != null ? current[key] : '-';
    if (isNonWbcCategory(category)) nonWbc[key] = value;
    else wbcDiff[key] = value;
  }
  return { barcode: spec.barcode, patientId: spec.lis.patientId, wbcDiff, nonWbc };
}

export interface LisNotePayload {
  barcode: string;
  patientId: string;
  note: LisNote;
}

export function notePayload(spec: Specimen, note: LisNote): LisNotePayload {
  return { barcode: spec.barcode, patientId: spec.lis.patientId, note };
}
