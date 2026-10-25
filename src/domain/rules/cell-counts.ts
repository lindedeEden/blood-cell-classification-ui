/**
 * 細胞計數換算成百分比（文件 2 第 2.2 節、規則 8）
 *
 * 白血球分類：分母＝白血球總數（排除非白血球；Unidentified 視為待分類白血球，計入）。
 * 非白血球（NRBC 等）也以 % 呈現，分母同樣是白血球總數，但不併入白血球加總。
 * 例：白血球 100 顆、NRBC 2 顆 → NRBC 2%。
 */
import { CATEGORY_TO_KEY, KEYED_CATEGORIES, REVIEW_CATEGORY_ORDER, isNonWbcCategory } from '../constants/cell-types';
import type { CellCategory, DiffKey, DiffValues } from '../types';
import type { LeaveJudge } from './leave';

/** 依類別計數，並算出白血球總數（分母） */
export function countCells(categories: readonly CellCategory[]): {
  counts: Map<CellCategory, number>;
  wbcTotal: number;
} {
  const counts = new Map<CellCategory, number>();
  let wbcTotal = 0;
  for (const category of categories) {
    counts.set(category, (counts.get(category) ?? 0) + 1);
    if (!isNonWbcCategory(category)) wbcTotal++;
  }
  return { counts, wbcTotal };
}

/**
 * AI 分類結果（Diff%）：AI 模型沒有直接給值時，由逐顆預分類計算（第 2.2 節）。
 * 格式：一位小數（例 '93.0'）；沒有的項目為 '-'。
 */
export function aiDiffFromCells(aiCategories: readonly CellCategory[]): DiffValues {
  const { counts, wbcTotal } = countCells(aiCategories);
  const values: DiffValues = {};
  for (const category of KEYED_CATEGORIES) {
    const n = counts.get(category) ?? 0;
    values[CATEGORY_TO_KEY[category] as DiffKey] = n ? (wbcTotal ? (n / wbcTotal) * 100 : 0).toFixed(1) : '-';
  }
  return values;
}

/**
 * 人員編輯值（規則 8）：醫檢師按「儲存結果」時，依調整後的分類計算。
 * 格式：一位小數、去掉結尾的 .0（例 '93'、'2.5'）；0% 或沒有的項目為 '-'。
 */
export function editedDiffFromCells(categories: readonly CellCategory[]): DiffValues {
  const { counts, wbcTotal } = countCells(categories);
  const values: DiffValues = {};
  for (const category of KEYED_CATEGORIES) values[CATEGORY_TO_KEY[category] as DiffKey] = '-';
  for (const [category, count] of counts) {
    const key = CATEGORY_TO_KEY[category];
    if (!key) continue;
    const pct = wbcTotal ? (count / wbcTotal) * 100 : 0;
    values[key] = pct > 0 ? pct.toFixed(1).replace(/\.0$/, '') : '-';
  }
  return values;
}

/**
 * 影像檢視頁：某類別依目前分類是否達留單門檻（規則 8；門檻依病人年齡，規則 1）
 * 「出現即算」的項目看顆數，其餘看百分比。
 */
export function categoryReachesLeave(
  judge: LeaveJudge,
  category: CellCategory,
  count: number,
  percent: number,
): boolean {
  const key = CATEGORY_TO_KEY[category];
  if (!key) return false;
  const threshold = judge.thresholdFor(key);
  if (threshold == null) return false;
  return judge.isLeave(key, threshold === 'present' ? count : percent);
}

/**
 * 影像檢視頁細胞區塊的順序（規則 8）：達留單門檻的類別全部置頂，其餘維持預設順序。
 * counts 的順序＝細胞第一次出現的順序（不在預設清單的類別接在最後）。
 */
export function reviewCategoryOrder(
  judge: LeaveJudge,
  counts: Map<CellCategory, number>,
  wbcTotal: number,
): CellCategory[] {
  const order = REVIEW_CATEGORY_ORDER.slice();
  for (const category of counts.keys()) if (!order.includes(category)) order.push(category);
  const hits = order.filter((category) => {
    const count = counts.get(category);
    if (!count) return false;
    return categoryReachesLeave(judge, category, count, wbcTotal > 0 ? (count / wbcTotal) * 100 : 0);
  });
  if (hits.length === 0) return order;
  return hits.concat(order.filter((category) => !hits.includes(category)));
}
