/**
 * 從畫面程式移到 domain 的判斷：簽核方式（規則 9）、膠囊不能切換的提示（規則 12、15）、
 * 留單標準設定視窗的輸入（規則 7）、報告頁人員編輯欄（規則 1）
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_THRESHOLDS, THRESHOLD_FORM_ORDER } from '../../src/domain/constants/thresholds';
import { resultsPayload } from '../../src/domain/lis';
import { editedOrAiValue, effectiveValues, thresholdsFromForm } from '../../src/domain/rules/leave';
import { signOffPlan } from '../../src/domain/rules/transitions';
import { entityToggleBlockReason, nextPendingSpecimen } from '../../src/domain/rules/workflow';
import { adult } from '../support/specimen';

const th = { ...DEFAULT_THRESHOLDS };

describe('規則 9 按下確認並簽核', () => {
  it('綠／黃（沒有新發留單）：AI 分類警示一併確認，簽核後跳下一筆', () => {
    const spec = adult({ status: ['Digital Review', 'AI Alert'], values: { wbc: '6.0', blast: '-' } });
    expect(signOffPlan(spec, th, false)).toEqual({ confirmAiAlert: true, navigateNext: true, unlocked: false });
  });
  it('紅（有新發留單）：簽核按鈕鎖住，未開鎖按了沒作用；開鎖後簽核、不跳下一筆、不確認 AI 分類警示', () => {
    const spec = adult({ status: ['Digital Review', 'AI Alert'], values: { wbc: '6.0', blast: '5' } });
    expect(signOffPlan(spec, th, false)).toBeNull();
    expect(signOffPlan(spec, th, true)).toEqual({ confirmAiAlert: false, navigateNext: false, unlocked: true });
  });
});

describe('規則 12、15 點膠囊不能切換時的提示', () => {
  it('流程已完成 → completed；已簽核且需拉片確認隨簽核完成 → followUpSignedOff；鎖定中或可切換 → 不提示', () => {
    const done = adult({
      status: ['Digital Review'],
      workflowDone: { digitalReview: true, digitalReviewSignedOff: true },
    });
    const signedFu = adult({
      status: ['Digital Review', 'Follow-up', 'PLT Check'],
      workflowDone: { digitalReview: true, digitalReviewSignedOff: true, entityStatusDone: { 'Follow-up': true } },
    });
    const open = adult({ status: ['PLT Check'] });
    expect([
      entityToggleBlockReason(done.review, 'PLT Check'),
      entityToggleBlockReason(signedFu.review, 'Follow-up'),
      entityToggleBlockReason(signedFu.review, 'PLT Check'),
      entityToggleBlockReason({ ...done.review, locked: true }, 'PLT Check'),
      entityToggleBlockReason(open.review, 'PLT Check'),
      entityToggleBlockReason(open.review, 'Digital Review'),
    ]).toEqual(['completed', 'followUpSignedOff', null, null, null, null]);
  });
});

describe('規則 7 留單標準設定視窗', () => {
  it('數字欄位接受小數點與逗號；非數字或負數回到預設值；出現即算的項目固定為 present；沒有欄位的項目不變', () => {
    const next = thresholdsFromForm({ wbc: '5,5', blast: 'abc', lymphocyte: '-1' }, THRESHOLD_FORM_ORDER);
    expect([next.wbc, next.blast, next.lymphocyte, next.megakaryocyte, 'plt' in next]).toEqual([
      5.5,
      DEFAULT_THRESHOLDS.blast,
      DEFAULT_THRESHOLDS.lymphocyte,
      'present',
      false,
    ]);
  });
});

describe('規則 1 報告頁人員編輯欄', () => {
  it('有人員編輯值顯示人員編輯值（含 "-"），否則 AI 值，都沒有為 "-"', () => {
    const spec = adult({ values: { blast: '2.0', lymphocyte: '30.0' }, edited: { blast: '3.0' } });
    expect([
      editedOrAiValue(spec, 'blast'),
      editedOrAiValue(spec, 'lymphocyte'),
      editedOrAiValue(spec, 'monocyte'),
    ]).toEqual(['3.0', '30.0', '-']);
  });
});

describe('規則 9 簽核後開下一筆', () => {
  const list = ['A', 'B', 'C', 'D'].map((barcode) => ({ barcode }));
  const pick = (pending: string[], from: string) =>
    nextPendingSpecimen(
      list,
      list.filter((s) => pending.includes(s.barcode)),
      from,
    )?.barcode ?? null;
  it('依清單順序從這一筆往後找，找不到再從頭找；沒有待辦時為 null', () => {
    expect([pick(['A', 'D'], 'B'), pick(['A'], 'C'), pick([], 'A'), pick(['B'], 'X')]).toEqual(['D', 'A', null, 'B']);
  });
});

describe('規則 4、14 人員編輯值的採用', () => {
  it('有人員編輯結果就採用（即使分析儀 WBC 空白、只改了非留單項目），回傳 LIS 的就是簽核時看到的值', () => {
    const spec = adult({ values: { wbc: '-', band: '-', segmentedNeutrophil: '95.9' } });
    spec.review.editedDiff = { band: '1', segmentedNeutrophil: '94.8' };
    const payload = resultsPayload(spec) as unknown as { wbcDiff: Record<string, string> };
    expect([effectiveValues(spec).band, payload.wbcDiff.band, payload.wbcDiff.segmentedNeutrophil]).toEqual([
      '1',
      '1',
      '94.8',
    ]);
  });
  it('沒有人員編輯結果時用 AI 值', () => {
    const spec = adult({ values: { wbc: '6.0', blast: '2.0' } });
    expect(effectiveValues(spec).blast).toBe('2.0');
  });
});
