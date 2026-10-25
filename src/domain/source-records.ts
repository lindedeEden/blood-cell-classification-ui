/**
 * 四個外部來源的原始資料格式（合併前）。正式系統由後端接收，欄位以 LIS／WAM／AI 模型實際提供為準（附錄 A #1、#5）。
 */
import type { Cbc, DiffKey, DiffValues, PrevCbcKey } from './types';

export interface CellaVisionRecord {
  barcode: string;
  analysisTime?: string;
  cells: { cellId: string; image: string }[];
}

/** AI 模型對一筆檢體的結果：每顆細胞的預分類與信心值；values＝模型直接給的 AI 分類結果（null＝由逐顆結果計算） */
export interface AiModelRecord {
  barcode: string;
  cells: { cellId: string; category: string; confidence: number | null }[];
  values: DiffValues | null;
}

export interface WamRecord {
  barcode: string;
  machine?: string;
  location?: string;
  cbc?: Cbc;
  flowDc?: Partial<Record<DiffKey, string>>;
  cbcFlags?: Record<string, string>;
  flowDcFlags?: string[];
  pltFlag?: string;
  sisRules?: string[];
}

export interface LisRecord {
  barcode: string | null;
  patientId?: string;
  name?: string;
  gender?: string;
  birthDate?: string;
  age?: number | string | null;
  department?: string;
  receivedTime?: string;
  smearRequiredNote?: boolean;
  prevReportDate?: string;
  prevReport?: Partial<Record<DiffKey | 'wbc' | 'plt' | PrevCbcKey, string>>;
}

export interface AiModelMockSettings {
  FOLDER_TO_CATEGORY: Record<string, string>;
  CONFIDENCE_BY_CATEGORY: Record<string, number>;
  CELL_OVERRIDES: Record<string, { category: string; confidence?: number | null }>;
  NO_CONFIDENCE_BARCODES: string[];
  FIXED_DIFF: Record<string, DiffValues>;
}
