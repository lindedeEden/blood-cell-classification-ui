/**
 * 規則單元測試（移植舊版 tests/run-tests.js 的 76 項，案例對應文件 2 第 2～10 章）
 */
import { describe, expect, it } from 'vitest';
import { CATEGORY_TO_KEY, isNonWbcCategory } from '../../src/domain/constants/cell-types';
import { DEFAULT_THRESHOLDS } from '../../src/domain/constants/thresholds';
import { aiDiffFromCells } from '../../src/domain/rules/cell-counts';
import { intakeStatus, withRecomputedAiAlert } from '../../src/domain/rules/intake';
import { mergeByBarcode } from '../../src/domain/rules/intake-merge';
import {
  aiValues,
  effectiveValues,
  isPediatric,
  leaveJudge,
  mergeThresholds,
  patientAge,
  prevValues,
  riskState,
} from '../../src/domain/rules/leave';
import { signOff, switchToManualReview } from '../../src/domain/rules/transitions';
import * as W from '../../src/domain/rules/workflow';
import type { AiModelRecord, CellaVisionRecord, LisRecord, WamRecord } from '../../src/domain/source-records';
import type { Specimen, StatusKey } from '../../src/domain/types';
import { classifySpecimen } from '../../src/data/ai-model';
import { adult, child } from '../support/specimen';

const TH = DEFAULT_THRESHOLDS;
const isLeave = (key: string, value: string, spec: Partial<Specimen>) =>
  leaveJudge(TH, spec as Specimen).isLeave(key, value);
const done = (status: StatusKey[], wf: Partial<Specimen['review']['workflowDone']>) =>
  W.isCompleted({ status, workflowDone: W.normalizeWorkflow(wf) });

describe('留單判斷（第 3 章）', () => {
  it('規則 1 數字門檻：≥ 即達標；「-」或空白不達標', () => {
    expect(['30', '29.9', '-', ''].map((v) => isLeave('wbc', v, adult()))).toEqual([true, false, false, false]);
  });
  it('規則 1 出現即算：> 0 即達標', () => {
    expect([isLeave('blast', '1', adult()), isLeave('blast', '0', adult())]).toEqual([true, false]);
  });
  it('規則 1 Lymphocyte：成人 ≥60、未滿 18 歲 ≥80', () => {
    expect([
      isLeave('lymphocyte', '60', adult()),
      isLeave('lymphocyte', '70', child()),
      isLeave('lymphocyte', '80', child()),
    ]).toEqual([true, false, true]);
  });
  it('規則 1 Megakaryocyte：成人出現即留單；兒童不適用', () => {
    expect([isLeave('megakaryocyte', '1', adult()), isLeave('megakaryocyte', '1', child())]).toEqual([true, false]);
  });
  it('規則 1 年齡直接用 LIS 提供的值（18 歲適用成人規則、17 歲適用兒童規則）', () => {
    expect(patientAge(adult({ age: 17 }))).toBe(17);
    expect(isLeave('lymphocyte', '65', adult({ age: 17 }))).toBe(false);
    expect(patientAge(adult({ age: 18 }))).toBe(18);
    expect(isLeave('lymphocyte', '65', adult({ age: 18 }))).toBe(true);
  });
  it('規則 1 年齡未知視為成人', () => {
    expect(isPediatric(adult({ age: null }))).toBe(false);
    expect(isLeave('lymphocyte', '60', adult({ age: null }))).toBe(true);
  });
  it('規則 4 新發／延續：同項目前次已達標＝延續（黃）', () => {
    expect(riskState(adult({ values: { blast: '6' }, prev: { blast: '2' } }), TH)).toEqual({
      hasNewLeave: false,
      hasLeaveNow: true,
      isPersistentLeave: true,
    });
  });
  it('規則 4 本次達標、前次未達標＝新發（紅）', () => {
    expect(riskState(adult({ values: { promyelocyte: '2' } }), TH).hasNewLeave).toBe(true);
  });
  it('規則 4 人員編輯值與 AI 不同時以人員編輯值判定；WBC 仍取分析儀值', () => {
    const s = adult({ values: { wbc: '8', blast: '3' }, edited: { blast: '-', lymphocyte: '40' } });
    expect([effectiveValues(s).blast, effectiveValues(s).wbc, riskState(s, TH).hasLeaveNow]).toEqual(['-', '8', false]);
  });
  it('規則 7 門檻可修改，恢復預設後還原', () => {
    const changed = mergeThresholds(TH, { lymphocytePediatric: 90 });
    expect(leaveJudge(changed, child()).isLeave('lymphocyte', '85')).toBe(false);
    expect(leaveJudge(TH, child()).isLeave('lymphocyte', '85')).toBe(true);
  });
  it('規則 7 出現即算的項目不可改成數字；負數不接受', () => {
    const t = mergeThresholds(TH, { blast: 5, wbc: -1 });
    expect([t.blast, t.wbc]).toEqual(['present', 30]);
  });
});

describe('進線與合併（第 2 章）', () => {
  const BC = 'H5080799001';
  const BC2 = 'H5080799002';
  const BC3 = 'H5080799003';
  const cv = (bc: string, extra: Partial<CellaVisionRecord> = {}): CellaVisionRecord => ({
    barcode: bc,
    analysisTime: '2025-08-07 10:00',
    cells: [
      { cellId: bc + '-001', image: 'img/1.jpg' },
      { cellId: bc + '-002', image: 'img/2.jpg' },
    ],
    ...extra,
  });
  const ai = (bc: string, extra: Partial<AiModelRecord> = {}): AiModelRecord => ({
    barcode: bc,
    cells: [
      { cellId: bc + '-001', category: 'Segmented Neutrophil', confidence: 0.95 },
      { cellId: bc + '-002', category: 'Lymphocyte', confidence: null },
    ],
    values: { segmentedNeutrophil: '60.0', lymphocyte: '30.0', blast: '-' },
    ...extra,
  });
  const wam = (bc: string, extra: Partial<WamRecord> = {}): WamRecord => ({
    barcode: bc,
    machine: 'DI1',
    location: '101-1',
    cbc: { wbc: '6.00', plt: '250' },
    flowDc: { lymphocyte: '31.0' },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: '',
    sisRules: [],
    ...extra,
  });
  const lis = (bc: string, extra: Partial<LisRecord> = {}): LisRecord => ({
    barcode: bc,
    patientId: 'P1',
    name: '測試',
    gender: '女',
    birthDate: '1985-01-01',
    age: 40,
    department: '一般科',
    receivedTime: '2025-08-07 09:30',
    smearRequiredNote: false,
    prevReportDate: '2025-07-31',
    prevReport: { lymphocyte: '28.0' },
    ...extra,
  });
  const merge = (c: CellaVisionRecord[], a: AiModelRecord[], w: WamRecord[], l: LisRecord[]) =>
    mergeByBarcode({ cellavision: c, ai: a, wam: w, lis: l });

  it('依條碼合併：影像、預分類、WAM、LIS 各歸各組；處理狀態另放 review', () => {
    const r = merge(
      [cv(BC)],
      [ai(BC)],
      [wam(BC, { pltFlag: 'P', sisRules: ['760'], cbcFlags: { plt: 'DC' } })],
      [lis(BC, { smearRequiredNote: true })],
    );
    expect(r.issues).toEqual([]);
    const s = r.specimens[0] as Specimen;
    expect(Object.keys(s)).toEqual(['barcode', 'imaging', 'wam', 'lis', 'review']);
    expect([
      s.wam.machine,
      s.wam.location,
      s.wam.cbc.wbc,
      s.wam.flowDc.lymphocyte,
      s.wam.pltFlag,
      s.wam.sisRules,
      s.wam.cbcFlags,
    ]).toEqual(['DI1', '101-1', '6.00', '31.0', 'P', ['760'], { plt: 'DC' }]);
    expect([s.lis.patientId, s.lis.age, s.lis.receivedTime, s.lis.smearRequiredNote]).toEqual([
      'P1',
      40,
      '2025-08-07 09:30',
      true,
    ]);
    expect(JSON.parse(JSON.stringify(s.lis.prevReport))).toEqual({
      date: '2025-07-31',
      cbc: {},
      diff: { lymphocyte: '28.0' },
    });
  });
  it('前次報告：WBC、PLT、其他 CBC 項目與分類分開；LIS 給的其他欄位不收', () => {
    const s = merge(
      [cv(BC)],
      [ai(BC)],
      [wam(BC)],
      [
        lis(BC, {
          prevReport: { wbc: '9.2', plt: '200', hb: '13.1', mcv: '88.0', blast: '2.0', neut: '55.0' } as never,
        }),
      ],
    ).specimens[0] as Specimen;
    expect(s.lis.prevReport).toEqual({
      date: '2025-07-31',
      wbc: '9.2',
      plt: '200',
      cbc: { hb: '13.1', mcv: '88.0' },
      diff: { blast: '2.0' },
    });
    expect('neut' in prevValues(s)).toBe(false);
  });
  it('每顆細胞＝CellaVision 影像＋AI 預分類（依 cellId）；沒有 AI 結果 → Unidentified', () => {
    const s = merge(
      [cv(BC)],
      [ai(BC, { cells: [{ cellId: BC + '-002', category: 'Lymphocyte', confidence: 0.9 }] })],
      [wam(BC)],
      [lis(BC)],
    ).specimens[0] as Specimen;
    expect(s.imaging.cells).toEqual([
      { cellId: BC + '-001', imagePath: 'img/1.jpg', aiCategory: 'Unidentified', aiConfidence: null },
      { cellId: BC + '-002', imagePath: 'img/2.jpg', aiCategory: 'Lymphocyte', aiConfidence: 0.9 },
    ]);
  });
  it('AI 值＝WAM 的 WBC、PLT ＋ AI 分類結果', () => {
    const s = merge([cv(BC)], [ai(BC)], [wam(BC)], [lis(BC)]).specimens[0] as Specimen;
    expect(aiValues(s)).toEqual({
      wbc: '6.00',
      plt: '250',
      segmentedNeutrophil: '60.0',
      lymphocyte: '30.0',
      blast: '-',
    });
  });
  it('模型沒有回傳 AI 分類結果時由逐顆計算：分母＝白血球總數，非白血球另算', () => {
    const v = aiDiffFromCells([
      'Segmented Neutrophil',
      'Segmented Neutrophil',
      'Segmented Neutrophil',
      'Lymphocyte',
      'NRBC',
      'NRBC',
    ]);
    expect([v.segmentedNeutrophil, v.lymphocyte, v.nrbc, v.blast]).toEqual(['75.0', '25.0', '50.0', '-']);
    const s = merge([cv(BC)], [ai(BC, { values: null })], [wam(BC)], [lis(BC)]).specimens[0] as Specimen;
    expect([s.imaging.aiDiff.segmentedNeutrophil, s.imaging.aiDiff.lymphocyte]).toEqual(['50.0', '50.0']);
  });
  it('合併後加膠囊：LIS 註記＋PLT**＋AI 達門檻', () => {
    const s = merge(
      [cv(BC)],
      [ai(BC, { values: { blast: '2.0' } })],
      [wam(BC, { pltFlag: 'P' })],
      [lis(BC, { smearRequiredNote: true })],
    ).specimens[0] as Specimen;
    expect(intakeStatus(s, TH)).toEqual(['Follow-up', 'AI Alert', 'PLT Check']);
  });
  it('條碼比對前去除空白、轉大寫', () => {
    const r = merge([cv(' h5080799001 ')], [ai(BC)], [wam(BC)], [lis('H5080799001\n')]);
    expect([r.specimens.map((s) => s.barcode), r.issues]).toEqual([[BC], []]);
  });
  it('附錄 A #3 有影像、缺 AI 結果／WAM／LIS → 暫不進線，列為進線異常', () => {
    const r = merge([cv(BC), cv(BC2), cv(BC3)], [ai(BC), ai(BC2)], [wam(BC2), wam(BC3)], [lis(BC), lis(BC3)]);
    expect(r.specimens).toHaveLength(0);
    expect(r.issues.map((i) => [i.type, i.source, i.barcode])).toEqual([
      ['missing-source', 'wam', BC],
      ['missing-source', 'lis', BC2],
      ['missing-source', 'ai', BC3],
    ]);
  });
  it('附錄 A #3 有 WAM／LIS、沒有影像 → 尚未取像，不進線、不算異常', () => {
    const r = merge([cv(BC)], [ai(BC)], [wam(BC), wam(BC2)], [lis(BC), lis(BC2)]);
    expect([r.specimens.map((s) => s.barcode), r.issues]).toEqual([[BC], []]);
  });
  it('附錄 A #3 條碼格式不符 → 該筆略過並記錄', () => {
    const r = merge([cv('H508079900'), cv(BC)], [ai(BC)], [wam(BC)], [lis(BC), lis('')]);
    expect(r.specimens.map((s) => s.barcode)).toEqual([BC]);
    expect(r.issues.map((i) => [i.type, i.source])).toEqual([
      ['invalid-barcode', 'cellavision'],
      ['invalid-barcode', 'lis'],
    ]);
  });
  it('附錄 A #3 同一來源同一條碼多筆 → 以最後一筆為準並記錄', () => {
    const r = merge([cv(BC)], [ai(BC)], [wam(BC, { pltFlag: '' }), wam(BC, { pltFlag: 'P' })], [lis(BC)]);
    expect([r.specimens[0]?.wam.pltFlag, r.issues.map((i) => [i.type, i.source])]).toEqual([
      'P',
      [['duplicate', 'wam']],
    ]);
  });
  it('LIS 註記只有明確為 true 才算；WAM 沒給 PLT flag 視為空白', () => {
    const s = merge(
      [cv(BC)],
      [ai(BC)],
      [wam(BC, { pltFlag: undefined })],
      [lis(BC, { smearRequiredNote: 'Y' as never })],
    ).specimens[0] as Specimen;
    expect([s.lis.smearRequiredNote, s.wam.pltFlag, intakeStatus(s, TH)]).toEqual([false, '', ['Digital Review']]);
  });
  it('合併結果不與來源資料共用物件', () => {
    const l = lis(BC);
    const w = wam(BC);
    const a = ai(BC);
    const s = merge([cv(BC)], [a], [w], [l]).specimens[0] as Specimen;
    s.lis.prevReport.diff.lymphocyte = '99';
    s.wam.cbc.wbc = '99';
    s.imaging.aiDiff.lymphocyte = '99';
    (s.imaging.cells[0] as { aiCategory: string }).aiCategory = 'Blast';
    expect([l.prevReport?.lymphocyte, w.cbc?.wbc, a.values?.lymphocyte, a.cells[0]?.category]).toEqual([
      '28.0',
      '6.00',
      '30.0',
      'Segmented Neutrophil',
    ]);
  });
  it('AI 模型（模擬）：依影像資料夾預分類；不認得的為 Unidentified；套用指定誤判與信心值', () => {
    const settings = {
      FOLDER_TO_CATEGORY: { blast: 'Blast', lymphocyte: 'Lymphocyte' },
      CONFIDENCE_BY_CATEGORY: { Blast: 0.9 },
      CELL_OVERRIDES: { 'X-002': { category: 'Blast', confidence: 0.7 } },
      NO_CONFIDENCE_BARCODES: [],
      FIXED_DIFF: { Y: { blast: '1.0' } },
    };
    const r = classifySpecimen(settings, {
      barcode: 'X',
      cells: [
        { cellId: 'X-001', image: 'a/blast/1.jpg' },
        { cellId: 'X-002', image: 'a/lymphocyte/2.jpg' },
        { cellId: 'X-003', image: 'a/other/3.jpg' },
      ],
    });
    expect(r.cells).toEqual([
      { cellId: 'X-001', category: 'Blast', confidence: 0.9 },
      { cellId: 'X-002', category: 'Blast', confidence: 0.7 },
      { cellId: 'X-003', category: 'Unidentified', confidence: null },
    ]);
    expect([r.values, classifySpecimen(settings, { barcode: 'Y', cells: [] }).values]).toEqual([
      null,
      { blast: '1.0' },
    ]);
  });
});

describe('進線加膠囊（第 3 章）', () => {
  it('規則 2 有 LIS 註記 → 需拉片確認；沒有 → 數位閱片', () => {
    expect(intakeStatus(adult({ note: true }), TH)).toEqual(['Follow-up']);
    expect(intakeStatus(adult({ note: false }), TH)).toEqual(['Digital Review']);
  });
  it('規則 3 PLT LIS-flag P、A 加血小板確認；p 與空白不加', () => {
    expect(['P', 'A', 'p', ''].map((f) => intakeStatus(adult({ pltFlag: f }), TH))).toEqual([
      ['Digital Review', 'PLT Check'],
      ['Digital Review', 'PLT Check'],
      ['Digital Review'],
      ['Digital Review'],
    ]);
  });
  it('規則 1～3 合併：LIS 註記＋AI 達門檻＋PLT**', () => {
    expect(intakeStatus(adult({ note: true, pltFlag: 'P', values: { blast: '1' } }), TH)).toEqual([
      'Follow-up',
      'AI Alert',
      'PLT Check',
    ]);
  });
  it('規則 1 進線依年齡判斷（10 歲 Lym 70% 不加、85% 加）', () => {
    expect(intakeStatus(child({ values: { lymphocyte: '70' } }), TH)).toEqual(['Digital Review']);
    expect(intakeStatus(child({ values: { lymphocyte: '85' } }), TH)).toEqual(['Digital Review', 'AI Alert']);
  });
  it('規則 6 鎖定中附加「Locked」顯示，不影響進線判斷', () => {
    expect(intakeStatus(adult({ locked: true }), TH)).toEqual(['Digital Review', 'Locked']);
  });
  it('規則 1、7 修改門檻後重算：達門檻才加 AI 分類警示；單獨的血小板確認不加', () => {
    expect(withRecomputedAiAlert(child({ values: { lymphocyte: '85' } }), TH)).toEqual(['Digital Review', 'AI Alert']);
    expect(withRecomputedAiAlert(child({ values: { lymphocyte: '70' } }), TH)).toEqual(['Digital Review']);
    expect(withRecomputedAiAlert(adult({ status: ['PLT Check'], values: { blast: '3' } }), TH)).toEqual(['PLT Check']);
  });
});

describe('狀態與流程（第 4～8 章）', () => {
  it('規則 5 工作分流：進線 8 種組合', () => {
    const q = (note: boolean, ai: boolean, plt: boolean) =>
      W.workQueue(
        adult({ status: intakeStatus(adult({ note, pltFlag: plt ? 'P' : '', values: ai ? { blast: '1' } : {} }), TH) })
          .review,
      );
    expect([q(false, false, false), q(false, true, false), q(false, false, true), q(false, true, true)]).toEqual([
      'digital',
      'digital',
      'both',
      'both',
    ]);
    expect([q(true, false, false), q(true, true, false), q(true, false, true), q(true, true, true)]).toEqual([
      'entity',
      'entity',
      'entity',
      'entity',
    ]);
  });
  it('規則 5 AI＋需拉片確認（無數位閱片）不進數位閱片清單', () => {
    const r = adult({ status: ['Follow-up', 'AI Alert'] }).review;
    expect([W.inDigitalList(r), W.inEntityList(r)]).toEqual([false, true]);
  });
  it('規則 5 改為人工鏡檢後只在實體作業清單；拉片完成後整體完成', () => {
    const r = adult({
      status: ['Digital Review', 'AI Alert', 'Follow-up'],
      workflowDone: { digitalReview: true, aiAlertConfirmed: true, entityStatusDone: { 'Follow-up': false } },
    }).review;
    expect(W.workQueue(r)).toBe('entity');
    r.workflowDone.entityStatusDone['Follow-up'] = true;
    expect(W.workQueue(r)).toBe('done');
  });
  it('規則 13 改為人工鏡檢後，拉片完成仍維持唯讀', () => {
    expect(
      W.isDigitalReviewReadOnly(
        adult({
          status: ['Digital Review', 'Follow-up', 'PLT Check'],
          workflowDone: { digitalReview: true, entityStatusDone: { 'Follow-up': true } },
        }).review,
      ),
    ).toBe(true);
  });
  it('規則 13 只有需拉片確認的檢體：待辦時可進入閱片，處理完改唯讀', () => {
    const r = adult({
      status: ['Follow-up', 'PLT Check'],
      workflowDone: { entityStatusDone: { 'Follow-up': false } },
    }).review;
    expect(W.isDigitalReviewReadOnly(r)).toBe(false);
    r.workflowDone.entityStatusDone['Follow-up'] = true;
    expect(W.isDigitalReviewReadOnly(r)).toBe(true);
  });
  it('規則 9 綠色簽核：數位完成、AI 一併確認；仍有血小板確認時整體未完成', () => {
    const r = signOff(adult({ status: ['Digital Review', 'AI Alert', 'PLT Check'] }).review, { confirmAiAlert: true });
    expect([W.isDigitalWorkflowDone(r), W.isCompleted(r)]).toEqual([true, false]);
    r.workflowDone.entityStatusDone['PLT Check'] = true;
    expect(W.isCompleted(r)).toBe(true);
  });
  it('規則 9 開鎖簽核：待辦需拉片確認一併完成', () => {
    expect(
      signOff(adult({ status: ['Digital Review', 'Follow-up'] }).review, { unlocked: true }).workflowDone
        .entityStatusDone['Follow-up'],
    ).toBe(true);
  });
  it('規則 10 紅／黃／綠都可改為人工鏡檢（綠色要先開鎖）；改完後數位未簽核、影像頁唯讀', () => {
    const green = adult({ values: { lymphocyte: '30' }, status: ['Digital Review'] });
    expect([W.canSwitchToManualReview(green.review), W.reportLockTarget(green, TH)]).toEqual([true, 'manualReview']);
    const red = adult({ values: { promyelocyte: '2' }, status: ['Digital Review', 'AI Alert'] });
    expect([W.canSwitchToManualReview(red.review), W.reportLockTarget(red, TH)]).toEqual([true, 'signOff']);
    const after = switchToManualReview(red.review);
    expect([after.workflowDone.digitalReviewSignedOff, after.workflowDone.aiAlertConfirmed]).toEqual([false, true]);
    expect([W.needsPendingFollowUp(after), W.isDigitalReviewReadOnly(after), W.canSwitchToManualReview(after)]).toEqual(
      [true, true, false],
    );
    expect(
      W.reportLockTarget({ ...green, review: { ...green.review, status: ['Digital Review', 'Follow-up'] } }, TH),
    ).toBe('signOff');
    expect(
      W.reportLockTarget(
        {
          ...green,
          review: {
            ...green.review,
            workflowDone: W.normalizeWorkflow({ digitalReview: true, digitalReviewSignedOff: true }),
          },
        },
        TH,
      ),
    ).toBeNull();
  });
  it('第 4 章 勾選狀態只列出該狀態還沒完成的檢體', () => {
    const r = adult({ status: ['Digital Review', 'PLT Check'], workflowDone: { digitalReview: true } }).review;
    expect([W.matchesStatusFilter(r, 'Digital Review'), W.matchesStatusFilter(r, 'PLT Check')]).toEqual([false, true]);
  });
  it('第 4 章 時效＝LIS 收件到現在的分鐘數；不為負；沒有收件時間為空白；已完成為 0', () => {
    const s = adult();
    s.lis.receivedTime = '2025-08-07 10:00';
    expect(W.urgencyMinutes(s, new Date(2025, 7, 7, 10, 45, 30))).toBe(45);
    expect(W.urgencyMinutes(s, new Date(2025, 7, 7, 9, 50))).toBe(0);
    s.lis.receivedTime = '';
    expect(W.urgencyMinutes(s, new Date())).toBe('');
    const finished = adult({
      status: ['Digital Review', 'PLT Check'],
      workflowDone: { digitalReview: true, digitalReviewSignedOff: true, entityStatusDone: { 'PLT Check': true } },
    });
    expect([W.isCompleted(finished.review), W.urgencyMinutes(finished, new Date())]).toEqual([true, 0]);
  });
  it('規則 13 是否完成由膠囊與流程旗標計算：數位閱片未完成時，血小板確認完成不算完成', () => {
    expect(done(['Digital Review', 'PLT Check'], { entityStatusDone: { 'PLT Check': true } })).toBe(false);
    expect(
      done(['Digital Review', 'PLT Check'], { digitalReview: true, entityStatusDone: { 'PLT Check': true } }),
    ).toBe(true);
  });
  it('規則 12 已完成不可取消；鎖定中不可點；沒有的膠囊不可點', () => {
    const finished = adult({ status: ['Follow-up'], workflowDone: { entityStatusDone: { 'Follow-up': true } } }).review;
    expect([W.isCompleted(finished), W.canToggleEntityStatus(finished, 'Follow-up')]).toEqual([true, false]);
    const pending = adult({ status: ['Digital Review', 'PLT Check'] }).review;
    expect([
      W.canToggleEntityStatus(pending, 'PLT Check'),
      W.canToggleEntityStatus({ ...pending, locked: true }, 'PLT Check'),
      W.canToggleEntityStatus(pending, 'Follow-up'),
    ]).toEqual([true, false, false]);
  });
  it('規則 12 已簽核的檢體不能取消需拉片確認；血小板確認仍可標記', () => {
    const r = adult({
      status: ['Follow-up', 'PLT Check', 'Digital Review'],
      workflowDone: {
        digitalReview: true,
        digitalReviewSignedOff: true,
        entityStatusDone: { 'Follow-up': true, 'PLT Check': false },
      },
    }).review;
    expect([W.canToggleEntityStatus(r, 'Follow-up'), W.canToggleEntityStatus(r, 'PLT Check')]).toEqual([false, true]);
  });
  it('規則 12 改為人工鏡檢（未簽核）者，需拉片確認仍可在清單點選完成', () => {
    expect(
      W.canToggleEntityStatus(
        adult({
          status: ['Digital Review', 'Follow-up'],
          workflowDone: { digitalReview: true, entityStatusDone: { 'Follow-up': false } },
        }).review,
        'Follow-up',
      ),
    ).toBe(true);
  });
});

describe('細胞類別對照（規則 8）', () => {
  it('每個類別都有唯一的資料欄位；Atypical Lymphocyte 不併入 Abnormal', () => {
    const keys = Object.values(CATEGORY_TO_KEY);
    expect(new Set(keys).size).toBe(keys.length);
    expect(CATEGORY_TO_KEY['Atypical Lymphocyte']).toBe('atypicalLymphocyte');
  });
  it('非白血球不含 Unidentified', () => {
    expect([isNonWbcCategory('Megakaryocyte'), isNonWbcCategory('Unidentified')]).toEqual([true, false]);
  });
});
