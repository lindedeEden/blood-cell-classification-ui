/**
 * 操作後的膠囊與流程旗標：簽核（規則 9）、改為人工鏡檢（規則 10）、已拉片完成（規則 11）、
 * 清單點膠囊（規則 12）、LIS 撤回（規則 15）
 *
 * 純函式：輸入目前的處理狀態，回傳操作後的新狀態（不改傳入的物件）。
 * 編輯人員、保存、回傳 LIS 由 app/specimen-store.ts 負責。
 */
import type { EntityStatusKey, Specimen, StatusKey, Thresholds, WorkflowFlags } from '../types';
import { intakeStatus } from './intake';
import { riskState } from './leave';
import {
  allEntityDone,
  canToggleEntityStatus,
  emptyWorkflow,
  hasStatus,
  isAiAlertWithFollowUp,
  isEntityStatusCompleted,
  reportLockTarget,
  type ReviewState,
} from './workflow';

export interface StatusAndFlags {
  status: StatusKey[];
  workflowDone: WorkflowFlags;
}

function copyFlags(wf: WorkflowFlags): WorkflowFlags {
  return { ...wf, entityStatusDone: { ...wf.entityStatusDone } };
}

export interface SignOffOptions {
  /** 綠／黃橫幅簽核：AI 分類警示一併確認 */
  confirmAiAlert?: boolean;
  /** 開鎖後簽核：AI 分類警示一併確認；待辦的需拉片確認一併完成（以數位閱片取代拉片與鏡檢） */
  unlocked?: boolean;
}

/**
 * 規則 9：確認並簽核
 * 有數位閱片膠囊（或開鎖簽核）→ 數位閱片完成並簽核；沒有數位閱片膠囊時補上（顯示完成的綠勾）。
 */
export function signOff(r: ReviewState, options: SignOffOptions = {}): StatusAndFlags {
  const status = r.status.slice();
  const wf = copyFlags(r.workflowDone);
  const confirmAi = !!(options.confirmAiAlert || options.unlocked);
  if (status.includes('Digital Review') || confirmAi) {
    wf.digitalReview = true;
    wf.digitalReviewSignedOff = true;
  }
  if (confirmAi && status.includes('AI Alert')) wf.aiAlertConfirmed = true;
  if (options.unlocked && status.includes('Follow-up')) wf.entityStatusDone['Follow-up'] = true;
  if (wf.digitalReview && !status.includes('Digital Review')) status.push('Digital Review');
  wf.entityReview = allEntityDone(status, wf.entityStatusDone);
  return { status, workflowDone: wf };
}

/**
 * 規則 10：改為人工鏡檢
 * 加上需拉片確認（待辦），數位閱片結束但不算簽核，AI 分類警示一併確認。
 */
export function switchToManualReview(r: ReviewState): StatusAndFlags & { addedFollowUp: boolean } {
  const status = r.status.slice();
  const addedFollowUp = !status.includes('Follow-up');
  if (!status.includes('Digital Review')) status.push('Digital Review'); // 防呆：改人工鏡檢前應已有數位閱片
  if (addedFollowUp) status.push('Follow-up');
  const entityStatusDone: WorkflowFlags['entityStatusDone'] = {
    ...r.workflowDone.entityStatusDone,
    'Follow-up': false,
  };
  return {
    status,
    addedFollowUp,
    workflowDone: {
      digitalReview: true,
      digitalReviewSignedOff: false,
      aiAlertConfirmed: r.workflowDone.aiAlertConfirmed || status.includes('AI Alert'),
      entityReview: false,
      entityStatusDone,
    },
  };
}

/**
 * 規則 11：已拉片完成（報告簽核頁的按鈕）
 * 需拉片確認完成；有 AI 分類警示、而且數位閱片還沒結束時，AI 分類警示跟著確認。
 * 沒有需拉片確認回傳 null；已完成則不變。
 */
export function markFollowUpDone(r: ReviewState): StatusAndFlags | null {
  if (!hasStatus(r, 'Follow-up')) return null;
  if (isEntityStatusCompleted(r, 'Follow-up'))
    return { status: r.status.slice(), workflowDone: copyFlags(r.workflowDone) };
  const wf = copyFlags(r.workflowDone);
  wf.entityStatusDone['Follow-up'] = true;
  if (isAiAlertWithFollowUp(r)) wf.aiAlertConfirmed = true;
  wf.entityReview = allEntityDone(r.status, wf.entityStatusDone);
  return { status: r.status.slice(), workflowDone: wf };
}

/**
 * 規則 12：清單點實體作業膠囊，切換完成／未完成（不能切換時回傳 null）
 * 需拉片確認＋AI 分類警示（數位閱片還沒結束）：AI 分類警示跟著完成或取消。
 */
export function toggleEntityStatus(r: ReviewState, key: EntityStatusKey): StatusAndFlags | null {
  if (!canToggleEntityStatus(r, key)) return null;
  const wf = copyFlags(r.workflowDone);
  const done = !wf.entityStatusDone[key];
  wf.entityStatusDone[key] = done;
  if (key === 'Follow-up' && isAiAlertWithFollowUp(r)) wf.aiAlertConfirmed = done;
  wf.entityReview = allEntityDone(r.status, wf.entityStatusDone);
  return { status: r.status.slice(), workflowDone: wf };
}

/** 規則 15：只有已簽核的數位閱片結果可以由 LIS 撤回（人工鏡檢結果在 LIS 細胞計數程式處理，與新介面無關） */
export function canWithdraw(r: ReviewState): boolean {
  return r.workflowDone.digitalReviewSignedOff;
}

/** 規則 15：撤回後回到剛進線的狀態：膠囊依進線資料重新判斷（規則 1～3），流程旗標全部清空 */
export function withdrawToIntake(spec: Specimen, thresholds: Thresholds): StatusAndFlags {
  return { status: intakeStatus(spec, thresholds), workflowDone: emptyWorkflow() };
}

/** 規則 9：按下「確認並簽核」時的處理方式 */
export interface SignOffPlan {
  /** 有 AI 分類警示且沒有新發留單（綠／黃橫幅）：AI 分類警示一併確認 */
  confirmAiAlert: boolean;
  /** 簽核後自動跳下一筆待數位閱片檢體；紅色（有新發留單）開鎖簽核後不跳 */
  navigateNext: boolean;
  /** 這次是開鎖後簽核（紅色橫幅鎖住簽核按鈕時） */
  unlocked: boolean;
}

/** 規則 9：簽核按鈕需開鎖（紅色）但還沒開鎖時回傳 null（按了沒有作用） */
export function signOffPlan(spec: Specimen, thresholds: Thresholds, unlocked: boolean): SignOffPlan | null {
  const forced = reportLockTarget(spec, thresholds) === 'signOff';
  if (forced && !unlocked) return null;
  const { hasNewLeave } = riskState(spec, thresholds);
  return {
    confirmAiAlert: hasStatus(spec.review, 'AI Alert') && !hasNewLeave,
    navigateNext: !hasNewLeave,
    unlocked: forced,
  };
}
