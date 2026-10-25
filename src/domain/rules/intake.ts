/**
 * 進線加膠囊：規則 1～3（文件 2 第 3 章）
 * 三個判斷互不影響；顯示順序為「數位閱片／需拉片確認」在前。
 */
import type { Specimen, StatusKey, Thresholds } from '../types';
import { shouldHaveAiAlert } from './leave';

/** 規則 2：LIS 有「需推片確認」註記（實際作業為拉片）→ 需拉片確認；沒有 → 數位閱片（兩者只會有一個） */
export function intakeRoute(spec: Specimen): 'Follow-up' | 'Digital Review' {
  return spec.lis?.smearRequiredNote ? 'Follow-up' : 'Digital Review';
}

/** 規則 3：觸發血小板確認的 PLT LIS-flag（P＝PLT**、A＝全部項目 **）；p（PLT*）不觸發 */
export const PLT_CHECK_FLAGS: readonly string[] = ['P', 'A'];

export function needsPltCheck(spec: Specimen): boolean {
  return !!spec.wam && PLT_CHECK_FLAGS.includes(spec.wam.pltFlag);
}

/**
 * 檢體進線時的膠囊（不改傳入的檢體）：
 *   規則 2 → 需拉片確認或數位閱片；規則 1 → AI 分類警示；規則 3 → 血小板確認。
 * 「鎖定中」（他人編輯中，規則 6）不是進線判斷，只是清單顯示，附加在最後。
 */
export function intakeStatus(spec: Specimen, thresholds: Thresholds): StatusKey[] {
  const status: StatusKey[] = [intakeRoute(spec)];
  if (shouldHaveAiAlert(spec, thresholds)) status.push('AI Alert');
  if (needsPltCheck(spec)) status.push('PLT Check');
  if (spec.review?.locked) status.push('Locked');
  return status;
}

/**
 * 規則 1、7：修改留單門檻後，依新門檻加上或拿掉 AI 分類警示（回傳新的膠囊陣列）。
 * 只對有數位閱片或需拉片確認的檢體作用（AI 分類警示不會單獨存在）；加上時放在該膠囊後面。
 */
export function withRecomputedAiAlert(spec: Specimen, thresholds: Thresholds): StatusKey[] {
  const status = spec.review.status.slice();
  const base = status.indexOf('Digital Review') !== -1 ? status.indexOf('Digital Review') : status.indexOf('Follow-up');
  const want = base !== -1 && shouldHaveAiAlert(spec, thresholds);
  const index = status.indexOf('AI Alert');
  if (want && index === -1) status.splice(base + 1, 0, 'AI Alert');
  else if (!want && index !== -1) status.splice(index, 1);
  return status;
}
