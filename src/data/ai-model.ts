/**
 * AI 模型（林口人工智慧中心開發）的預分類 —— 原型以模擬代替（文件 2 第 2.2 節）
 *
 * 流程：DI-60 影像存於 CellaVision 資料庫 → AI 模型讀取影像、逐顆預分類 → 結果傳入新介面，與 WAM、LIS 依條碼合併。
 * 原型：範例圖依真實類別存放在 public/assets/images/cells/<類別>/，以資料夾判斷類別（等於模型判對），再套用指定的誤判與信心值。
 * 正式系統：改為接收 AI 模型傳來的結果（串接方式待確認，附錄 A #4、#5），回傳格式維持 AiModelRecord。
 */
import { UNIDENTIFIED } from '../domain/constants/cell-types';
import type { AiModelMockSettings, AiModelRecord, CellaVisionRecord } from '../domain/source-records';

/** 模擬模型對一張影像的預分類：依範例圖所在資料夾；不認得的影像為 Unidentified */
export function classifyImage(settings: AiModelMockSettings, image: string): string {
  const parts = String(image || '').split('/');
  const folder = parts.length >= 2 ? (parts[parts.length - 2] ?? '') : '';
  return settings.FOLDER_TO_CATEGORY[folder] || UNIDENTIFIED;
}

/** 讀取一筆 CellaVision 紀錄的影像，逐顆預分類 */
export function classifySpecimen(settings: AiModelMockSettings, record: CellaVisionRecord): AiModelRecord {
  const noConfidence = settings.NO_CONFIDENCE_BARCODES.includes(record.barcode);
  const cells = (record.cells ?? []).map((c) => {
    const override = settings.CELL_OVERRIDES[c.cellId];
    if (override) return { cellId: c.cellId, category: override.category, confidence: override.confidence ?? null };
    const category = classifyImage(settings, c.image);
    const confidence = settings.CONFIDENCE_BY_CATEGORY[category];
    return { cellId: c.cellId, category, confidence: !noConfidence && confidence != null ? confidence : null };
  });
  const fixed = settings.FIXED_DIFF[record.barcode];
  return { barcode: record.barcode, cells, values: fixed ? { ...fixed } : null };
}

export function classifyAll(settings: AiModelMockSettings, records: readonly CellaVisionRecord[]): AiModelRecord[] {
  return records.map((r) => classifySpecimen(settings, r));
}
