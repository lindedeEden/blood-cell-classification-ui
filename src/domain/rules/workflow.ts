/**
 * 膠囊與工作流程規則：完成判定與唯讀（規則 13）、工作分流與篩選（規則 5、第 4 章）、
 * 報告簽核頁的按鈕與鎖頭（規則 9、10）、清單點膠囊（規則 12）
 *
 * 純函式，只看檢體的處理狀態（review）；「把結果存起來」由 app/specimen-store.ts 負責。
 */
import { ENTITY_STATUSES, isEntityStatus } from '../constants/status';
import type {
  EntityStatusKey,
  FilterKey,
  LockTarget,
  Review,
  Specimen,
  StatusKey,
  Thresholds,
  WorkflowFlags,
} from '../types';
import { parseDate } from '../values';
import { riskState } from './leave';

/** 判斷只需要膠囊與流程旗標（加上鎖定中） */
export type ReviewState = Pick<Review, 'status' | 'workflowDone'> & Partial<Pick<Review, 'locked'>>;

export function hasStatus(review: Pick<Review, 'status'>, key: StatusKey): boolean {
  return review.status.includes(key);
}

export function emptyWorkflow(): WorkflowFlags {
  return {
    digitalReview: false,
    digitalReviewSignedOff: false,
    aiAlertConfirmed: false,
    entityReview: false,
    entityStatusDone: {},
  };
}

/** 外部（瀏覽器儲存、舊資料）讀進來的流程旗標整理成完整格式：缺的旗標視為 false，只保留實體作業膠囊 */
export function normalizeWorkflow(raw: unknown): WorkflowFlags {
  const wf = emptyWorkflow();
  if (!raw || typeof raw !== 'object') return wf;
  const src = raw as Record<string, unknown>;
  wf.digitalReview = !!src.digitalReview;
  wf.digitalReviewSignedOff = !!src.digitalReviewSignedOff;
  wf.aiAlertConfirmed = !!src.aiAlertConfirmed;
  wf.entityReview = !!src.entityReview;
  const done = src.entityStatusDone;
  if (done && typeof done === 'object') {
    for (const key of ENTITY_STATUSES) {
      const v = (done as Record<string, unknown>)[key];
      if (v !== undefined) wf.entityStatusDone[key] = !!v;
    }
  }
  return wf;
}

// ─── 完成判定（規則 13）─────────────────────────────────────────────

/** 數位閱片已結束（沒有數位閱片膠囊視為完成） */
export function isDigitalReviewDone(r: ReviewState): boolean {
  return !hasStatus(r, 'Digital Review') || r.workflowDone.digitalReview;
}

/** AI 分類警示已確認（沒有該膠囊視為完成） */
export function isAiAlertConfirmed(r: ReviewState): boolean {
  return !hasStatus(r, 'AI Alert') || r.workflowDone.aiAlertConfirmed;
}

export function isDigitalWorkflowDone(r: ReviewState): boolean {
  return isDigitalReviewDone(r) && isAiAlertConfirmed(r);
}

function entityStatusesOf(status: readonly StatusKey[]): EntityStatusKey[] {
  return status.filter(isEntityStatus);
}

/** 單一實體作業膠囊是否完成（沒有個別紀錄時看整體的實體作業旗標） */
export function isEntityStatusCompleted(r: ReviewState, key: StatusKey): boolean {
  if (!isEntityStatus(key)) return false;
  const done = r.workflowDone.entityStatusDone[key];
  return done !== undefined ? done : r.workflowDone.entityReview;
}

/** 實體作業全部完成（沒有實體作業膠囊視為完成） */
export function isEntityReviewDone(r: ReviewState): boolean {
  return entityStatusesOf(r.status).every((k) => r.workflowDone.entityStatusDone[k] === true);
}

/** 規則 13：整體完成＝數位流程（數位閱片＋AI 分類警示）與實體作業都完成 */
export function isCompleted(r: ReviewState): boolean {
  return isDigitalWorkflowDone(r) && isEntityReviewDone(r);
}

/** entityReview 旗標：實體作業膠囊全部完成（沒有實體作業膠囊時為 true） */
export function allEntityDone(status: readonly StatusKey[], done: WorkflowFlags['entityStatusDone']): boolean {
  return entityStatusesOf(status).every((k) => done[k] === true);
}

// ─── 需拉片確認、唯讀（規則 10、13）───────────────────────────────

/** 還有待辦的需拉片確認 */
export function needsPendingFollowUp(r: ReviewState): boolean {
  return hasStatus(r, 'Follow-up') && !isEntityStatusCompleted(r, 'Follow-up');
}

/** 已「改為人工鏡檢」交接：數位閱片已結束但未簽核（之後拉片完成與否都算） */
export function isHandoffToFollowUp(r: ReviewState): boolean {
  return r.workflowDone.digitalReview && !r.workflowDone.digitalReviewSignedOff && hasStatus(r, 'Follow-up');
}

/**
 * 規則 13：影像檢視只能唯讀（不能改分類、儲存或簽核）
 *  - 他人編輯中（清單另外擋下，完全不能開啟，規則 6）
 *  - 數位閱片已結束：已簽核（要重做只能由 LIS 撤回，規則 15），或已改為人工鏡檢（不論之後拉片是否完成）
 *  - 沒有數位閱片膠囊（因 LIS 註記直接進實體作業）且需拉片確認已完成
 */
export function isDigitalReviewReadOnly(r: ReviewState): boolean {
  if (r.locked) return true;
  if (r.workflowDone.digitalReview) return true;
  return !hasStatus(r, 'Digital Review') && hasStatus(r, 'Follow-up') && isEntityStatusCompleted(r, 'Follow-up');
}

/** AI 分類警示＋需拉片確認、數位閱片還沒結束：AI 的確認跟著需拉片確認走（規則 11、12） */
export function isAiAlertWithFollowUp(r: ReviewState): boolean {
  return hasStatus(r, 'AI Alert') && hasStatus(r, 'Follow-up') && !r.workflowDone.digitalReview;
}

// ─── 工作分流（規則 5）──────────────────────────────────────────────

/** 數位閱片清單：有數位閱片膠囊且還沒完成 */
export function inDigitalList(r: ReviewState): boolean {
  return hasStatus(r, 'Digital Review') && !isDigitalReviewDone(r);
}

/** 實體作業清單：需拉片確認或血小板確認還沒完成 */
export function inEntityList(r: ReviewState): boolean {
  return ENTITY_STATUSES.some((k) => hasStatus(r, k) && !isEntityStatusCompleted(r, k));
}

export type WorkQueue = 'digital' | 'entity' | 'both' | 'done';

/** 工作分流結果：兩邊都有待辦時兩個清單都會出現；全部完成不在待辦清單 */
export function workQueue(r: ReviewState): WorkQueue {
  const digital = inDigitalList(r);
  const entity = inEntityList(r);
  if (digital && entity) return 'both';
  if (digital) return 'digital';
  if (entity) return 'entity';
  return 'done';
}

/** 第 4 章：勾選某狀態時，只列出該狀態「還沒完成」的檢體（「已完成」另外處理） */
export function matchesStatusFilter(r: ReviewState, key: FilterKey): boolean {
  if (key === 'Verified' || !hasStatus(r, key)) return false;
  if (key === 'Digital Review') return !isDigitalReviewDone(r);
  if (key === 'AI Alert') return !isAiAlertConfirmed(r);
  if (isEntityStatus(key)) return !isEntityStatusCompleted(r, key);
  return true;
}

/** 膠囊是否顯示為完成（綠色打勾） */
export function isCapsuleDone(r: ReviewState, key: StatusKey): boolean {
  if (key === 'Digital Review') return isDigitalReviewDone(r);
  if (key === 'AI Alert') return isAiAlertConfirmed(r);
  return isEntityStatusCompleted(r, key);
}

/**
 * 規則 12：清單上可否點實體作業膠囊切換完成／未完成。
 * 鎖定中、已全部完成、或已簽核檢體的需拉片確認（隨簽核完成）不能切換；要重做只能由 LIS 撤回（規則 15）。
 */
export function canToggleEntityStatus(r: ReviewState, key: StatusKey): boolean {
  if (r.locked) return false;
  if (!isEntityStatus(key) || !hasStatus(r, key)) return false;
  if (isCompleted(r)) return false;
  return !(key === 'Follow-up' && r.workflowDone.digitalReviewSignedOff);
}

/**
 * 規則 12、15：點實體作業膠囊卻不能切換、需要在頁尾提示原因的情況（鎖定中或其他不能點的情況不提示）
 * - 'completed'：流程已完成，不能取消（已簽核的數位閱片結果只能由 LIS 撤回）
 * - 'followUpSignedOff'：已簽核，需拉片確認已隨簽核完成，不能取消
 */
export function entityToggleBlockReason(r: ReviewState, key: StatusKey): 'completed' | 'followUpSignedOff' | null {
  if (r.locked || !isEntityStatus(key)) return null;
  if (isCompleted(r)) return 'completed';
  if (key === 'Follow-up' && hasStatus(r, 'Follow-up') && !canToggleEntityStatus(r, key)) return 'followUpSignedOff';
  return null;
}

/**
 * 第 4 章「時效」：LIS 收件到現在經過幾分鐘；已完成一律 0；沒有收件時間為空白
 */
export function urgencyMinutes(spec: Specimen, now: Date | null): number | '' {
  if (isCompleted(spec.review)) return 0;
  const received = parseDate(spec.lis?.receivedTime);
  if (!received || !now) return '';
  return Math.max(0, Math.floor((now.getTime() - received.getTime()) / 60000));
}

// ─── 報告簽核頁（規則 9、10）────────────────────────────────────────

/**
 * 規則 10：是否顯示「需拉片確認：改為人工鏡檢」：沒有待辦的需拉片確認，且數位閱片（或 AI 分類警示）還沒完成。
 * 紅、黃、綠都顯示；綠色要開鎖才能按（見 reportLockTarget）。
 */
export function canSwitchToManualReview(r: ReviewState): boolean {
  if (needsPendingFollowUp(r)) return false;
  if (hasStatus(r, 'Digital Review')) return !isDigitalReviewDone(r);
  return hasStatus(r, 'AI Alert') && !isAiAlertConfirmed(r);
}

/**
 * 規則 9、10：鎖頭鎖住哪個按鈕（開鎖＝允許做與系統判斷相反的操作）
 *  - 'signOff'：紅／黃橫幅，或有待辦需拉片確認 → 鎖「確認並簽核」
 *  - 'manualReview'：綠色且可改為人工鏡檢 → 鎖「改為人工鏡檢」
 *  - null：不顯示鎖頭
 */
export function reportLockTarget(spec: Specimen, thresholds: Thresholds): LockTarget {
  if (needsPendingFollowUp(spec.review) || riskState(spec, thresholds).hasLeaveNow) return 'signOff';
  if (canSwitchToManualReview(spec.review)) return 'manualReview';
  return null;
}

/**
 * 規則 9：簽核後自動開啟的下一筆待數位閱片檢體：依清單順序從這一筆往後找，找不到再從頭找
 * ordered：清單順序；pending：待數位閱片的檢體
 */
export function nextPendingSpecimen<S extends { barcode: string }>(
  ordered: readonly S[],
  pending: readonly S[],
  barcode: string,
): S | null {
  if (!pending.length) return null;
  const ids = new Set(pending.map((s) => s.barcode));
  const start = ordered.findIndex((s) => s.barcode === barcode) + 1;
  const rotated = [...ordered.slice(start), ...ordered.slice(0, start)];
  return rotated.find((s) => ids.has(s.barcode)) ?? pending[0] ?? null;
}
