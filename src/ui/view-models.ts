/**
 * 畫面要顯示的資料（純計算，三個頁面共用）：膠囊外觀、分析表、前次報告欄標
 */
import { ANALYSIS_ROWS } from '../domain/constants/cell-types';
import { DONE_STYLE, STATUS_LABELS, STATUS_STYLES } from '../domain/constants/status';
import { aiValues, prevValues } from '../domain/rules/leave';
import { isCapsuleDone } from '../domain/rules/workflow';
import type { MetricKey, RawValue, Specimen, StatusKey } from '../domain/types';
import { parseDate } from '../domain/values';

export interface CapsuleView {
  label: string;
  style: string;
  /** 完成：綠色＋打勾 */
  done: boolean;
}

export function capsuleView(spec: Specimen, key: StatusKey): CapsuleView {
  const done = isCapsuleDone(spec.review, key);
  return {
    label: STATUS_LABELS[key] || key,
    style: done ? DONE_STYLE : STATUS_STYLES[key] || 'bg-gray-100 text-gray-800',
    done,
  };
}

/** 流式計數欄（WAM）：WBC／PLT 取 CBC；其餘取 Flow DC（未成熟與異常細胞流式儀無法提供，為 '-'） */
export function flowDcValue(spec: Specimen, key: MetricKey): RawValue {
  if (!spec.wam) return '-';
  if (key === 'wbc' || key === 'plt') {
    const v = spec.wam.cbc?.[key];
    return v != null && v !== '' ? v : '-';
  }
  const v = spec.wam.flowDc?.[key];
  return v !== undefined ? v : '-';
}

export interface AnalysisRow {
  label: string;
  key: MetricKey;
  flow: RawValue;
  ai: RawValue;
  prev: RawValue;
}

/** 「分析與歷史報告」：流式計數、AI 值、前次報告 */
export function analysisRows(spec: Specimen): AnalysisRow[] {
  const ai = aiValues(spec) as Record<string, RawValue>;
  const prev = prevValues(spec) as Record<string, RawValue>;
  return ANALYSIS_ROWS.map(([label, key]) => ({
    label,
    key,
    flow: flowDcValue(spec, key),
    ai: ai[key],
    prev: prev[key],
  }));
}

/** 前次報告距離本次分析的天數（沒有資料回傳 null） */
export function prevReportDaysAgo(spec: Specimen): number | null {
  const prev = parseDate(spec.lis?.prevReport?.date);
  if (!prev) return null;
  const anchor = parseDate(spec.imaging?.analysisTime) ?? new Date();
  const diff = anchor.getTime() - prev.getTime();
  if (!Number.isFinite(diff)) return null;
  return Math.max(0, Math.floor(diff / 86400000));
}

/** 欄標：「前次報告（X天前）」 */
export function prevReportHeader(spec: Specimen | null, base = '前次報告'): string {
  const days = spec ? prevReportDaysAgo(spec) : null;
  return days == null ? `${base}（-）` : `${base}（${days}天前）`;
}

/** 右鍵選單的「AI 建議」：AI 模型的預分類與信心值（沒有信心值時不顯示） */
export function aiSuggestion(cell: {
  aiCategory: string;
  aiConfidence: number | null;
}): { label: string; pct: number } | null {
  if (cell.aiConfidence == null) return null;
  const label = cell.aiCategory === 'Segmented Neutrophil' ? AI_SEGMENTED_LABEL : cell.aiCategory;
  return { label, pct: Math.round(cell.aiConfidence * 100) };
}

/** 選單上 Segmented Neutrophil 縮寫為 Segmented，其餘直接顯示類別名稱 */
const AI_SEGMENTED_LABEL = 'Segmented';

/** 右鍵選單「AI 建議」的顯示名稱 → 類別 */
export function aiSuggestionCategory(label: string): string {
  return label === AI_SEGMENTED_LABEL ? 'Segmented Neutrophil' : label;
}
