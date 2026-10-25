/**
 * 留單判斷：規則 1（AI 分類警示、年齡）與規則 4（新發／延續）
 *
 * 純函式：不碰畫面、不碰瀏覽器儲存。門檻由呼叫端傳入（app/thresholds.ts 保存目前的門檻）。
 */
import { DEFAULT_THRESHOLDS, PEDIATRIC_AGE_CUTOFF, SETTING_ONLY_KEYS, THRESHOLD_KEYS } from '../constants/thresholds';
import type { MetricValues, RawValue, RiskState, Specimen, ThresholdKey, Thresholds, ThresholdValue } from '../types';
import { parseNum } from '../values';

/** 參與判斷的門檻項目（不含只在設定畫面出現的兒童 Lymphocyte） */
export const METRIC_THRESHOLD_KEYS: readonly ThresholdKey[] = THRESHOLD_KEYS.filter(
  (k) => !SETTING_ONLY_KEYS.includes(k),
);

// ─── 門檻設定（規則 7）────────────────────────────────────────────

/**
 * 以外部來源（設定畫面、瀏覽器儲存、後端）更新門檻，回傳新的門檻（不改傳入的物件）。
 * 只接受已定義的項目：「出現即算」的項目只能是 'present'；數字項目須為 ≥ 0 的數值，否則保留原值。
 */
export function mergeThresholds(current: Thresholds, input: unknown): Thresholds {
  const next = { ...current };
  if (!input || typeof input !== 'object') return next;
  const source = input as Record<string, unknown>;
  for (const key of THRESHOLD_KEYS) {
    const value = source[key];
    if (value === undefined || value === null) continue;
    if (DEFAULT_THRESHOLDS[key] === 'present') {
      if (value === 'present') next[key] = 'present';
      continue;
    }
    const n = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    if (!Number.isNaN(n) && n >= 0) next[key] = n;
  }
  return next;
}

/**
 * 規則 7：「留單標準設定」視窗按儲存時的門檻。和 mergeThresholds 不同：設定畫面上填了非數字或負數的欄位
 * 回到預設值（不是保留原值）；「出現即算」的項目固定為 'present'。
 */
export function thresholdsFromForm(
  fields: Partial<Record<ThresholdKey, string>>,
  order: readonly ThresholdKey[],
): Partial<Thresholds> {
  const next: Partial<Record<ThresholdKey, ThresholdValue>> = {};
  for (const k of order) {
    if (DEFAULT_THRESHOLDS[k] === 'present') {
      next[k] = 'present';
      continue;
    }
    const raw = fields[k];
    if (raw === undefined) continue;
    const n = parseFloat(raw.replace(',', '.'));
    next[k] = Number.isNaN(n) || n < 0 ? DEFAULT_THRESHOLDS[k] : n;
  }
  return next as Partial<Thresholds>;
}

// ─── 年齡（規則 1）────────────────────────────────────────────────

/** 病人年齡（歲）：LIS 提供的年齡；沒有時回傳 null */
export function patientAge(spec: Pick<Specimen, 'lis'> | null | undefined): number | null {
  const age = spec?.lis ? parseFloat(String(spec.lis.age)) : NaN;
  return Number.isNaN(age) ? null : age;
}

/** 適用兒童規則：未滿 18 歲；年齡未知視為成人 */
export function isPediatric(spec: Pick<Specimen, 'lis'> | null | undefined): boolean {
  const age = patientAge(spec);
  return age != null && age < PEDIATRIC_AGE_CUTOFF;
}

// ─── 單一病人的判斷器（規則 1、4）──────────────────────────────────

export interface LeaveJudge {
  /** 此病人某項目的門檻；undefined＝此病人不適用該項目 */
  thresholdFor(key: string): ThresholdValue | undefined;
  /** 單項是否達留單門檻：數字門檻 ≥ 即達標；出現即算 > 0；'-'／空白不達標 */
  isLeave(key: string, value: RawValue): boolean;
  /** 規則 4：本次達標、前次同一項目未達標 */
  isNewLeave(key: string, current: RawValue, previous: RawValue): boolean;
  hasAnyLeave(values: MetricValues | null | undefined): boolean;
  hasAnyNewLeave(current: MetricValues | null | undefined, previous: MetricValues | null | undefined): boolean;
}

/**
 * 依病人年齡建立判斷器（規則 1）：
 *  - Lymphocyte：未滿 18 歲用兒童門檻（預設 80%），18 歲以上用成人門檻（預設 60%）
 *  - Megakaryocyte：只有 18 歲以上適用（出現即算）
 */
export function leaveJudge(thresholds: Thresholds, spec?: Pick<Specimen, 'lis'> | null): LeaveJudge {
  const child = isPediatric(spec);
  const table = thresholds as Record<string, ThresholdValue | undefined>;

  const thresholdFor = (key: string): ThresholdValue | undefined => {
    if ((SETTING_ONLY_KEYS as readonly string[]).includes(key)) return undefined;
    if (key === 'lymphocyte' && child) return thresholds.lymphocytePediatric;
    if (key === 'megakaryocyte' && child) return undefined;
    return table[key];
  };
  const isLeave = (key: string, value: RawValue): boolean => {
    const threshold = thresholdFor(key);
    if (threshold == null) return false;
    const n = parseNum(value);
    if (n == null) return false;
    return threshold === 'present' ? n > 0 : n >= threshold;
  };
  const isNewLeave = (key: string, current: RawValue, previous: RawValue): boolean =>
    isLeave(key, current) && !isLeave(key, previous);
  const get = (values: MetricValues | null | undefined, key: ThresholdKey): RawValue =>
    (values as Record<string, RawValue> | null | undefined)?.[key];

  return {
    thresholdFor,
    isLeave,
    isNewLeave,
    hasAnyLeave: (values) => METRIC_THRESHOLD_KEYS.some((k) => isLeave(k, get(values, k))),
    hasAnyNewLeave: (current, previous) =>
      METRIC_THRESHOLD_KEYS.some((k) => isNewLeave(k, get(current, k), get(previous, k))),
  };
}

// ─── 判斷用的數值 ──────────────────────────────────────────────────

/** AI 值＝WAM 的 WBC、PLT ＋ AI 分類結果（Diff%）；規則 1 用 */
export function aiValues(spec: Specimen): MetricValues {
  const cbc = spec.wam?.cbc ?? {};
  return { wbc: cbc.wbc, plt: cbc.plt, ...(spec.imaging?.aiDiff ?? {}) };
}

/**
 * 報告頁「人員編輯」欄：有人員編輯值就顯示人員編輯值，否則顯示 AI 值（都沒有為 '-'）；
 * 紅字（達留單）也依這個值判斷。注意：與規則 4 的 effectiveValues 不同，這裡不比較是否與 AI 相同。
 */
export function editedOrAiValue(spec: Specimen, key: string): RawValue {
  const edited = (spec.review.editedDiff ?? {}) as Record<string, RawValue>;
  const ai = aiValues(spec) as Record<string, RawValue>;
  return edited[key] != null ? edited[key] : ai[key] || '-';
}

/** 前次報告（LIS 最近一次） */
export function prevValues(spec: Specimen): MetricValues {
  const prev = spec.lis?.prevReport;
  return { wbc: prev?.wbc, plt: prev?.plt, ...(prev?.diff ?? {}) };
}

/**
 * 規則 4、14：判斷與回傳 LIS 用的數值。醫檢師已儲存人員編輯結果 → 以人員編輯值覆寫分類；否則用 AI 值。
 * WBC、PLT 一律用分析儀（XN-9000）的數值（人員編輯結果不含這兩項）。
 * （舊版另比較「是否與 AI 不同」，因 WBC 也被拿來比而幾乎都成立；只在 WBC 空白時會改用 AI 值，已依確認統一。）
 */
export function effectiveValues(spec: Specimen): MetricValues {
  const ai = aiValues(spec);
  const edited = spec.review?.editedDiff ?? {};
  return Object.keys(edited).length ? { ...ai, ...edited } : ai;
}

/**
 * 規則 4：報告簽核頁的橫幅
 *  - 任一項本次達標、但前次同一項沒達標 → 新發（紅）
 *  - 達標的項目前次也都達標 → 延續性異常（黃）
 *  - 都沒達標 → 綠
 */
export function riskState(spec: Specimen, thresholds: Thresholds, current?: MetricValues): RiskState {
  const judge = leaveJudge(thresholds, spec);
  const values = current ?? effectiveValues(spec);
  const hasLeaveNow = judge.hasAnyLeave(values);
  const hasNewLeave = judge.hasAnyNewLeave(values, prevValues(spec));
  return { hasNewLeave, hasLeaveNow, isPersistentLeave: hasLeaveNow && !hasNewLeave };
}

/** 規則 1：AI 值（WBC＋AI 分類結果）任一項達門檻 → 應有 AI 分類警示 */
export function shouldHaveAiAlert(spec: Specimen | null | undefined, thresholds: Thresholds): boolean {
  return !!spec && leaveJudge(thresholds, spec).hasAnyLeave(aiValues(spec));
}
