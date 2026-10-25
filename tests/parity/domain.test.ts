/**
 * 新舊對照：同一組輸入，新版的結果必須與舊版完全相同（SPEC 第 8 節）
 * 標準答案由 tools/legacy-capture/capture-domain.cjs 以舊版程式＋目前的模擬資料產生（tests/parity/golden/domain.json）；
 * 模擬資料修改後（例 2026-10-25 補前次 CBC），把舊版程式的 LIS 資料換成新資料再重新產生，比對的仍是「同一份資料、新舊程式」。
 * 刻意修正的舊版錯誤列在 docs/CHANGES-FROM-LEGACY.md，測試裡以 KNOWN_FIX 標示並另外驗證新行為。
 */
import { beforeEach, describe, expect, it } from 'vitest';
import golden from './golden/domain.json';
import { DEFAULT_THRESHOLDS, THRESHOLD_FORM_ORDER, THRESHOLD_LABELS } from '../../src/domain/constants/thresholds';
import {
  aiDiffFromCells,
  categoryReachesLeave,
  countCells,
  editedDiffFromCells,
  reviewCategoryOrder,
} from '../../src/domain/rules/cell-counts';
import { intakeStatus } from '../../src/domain/rules/intake';
import { mergeByBarcode, normalizeBarcode } from '../../src/domain/rules/intake-merge';
import {
  aiValues,
  effectiveValues,
  isPediatric,
  leaveJudge,
  mergeThresholds,
  patientAge,
  prevValues,
  riskState,
  shouldHaveAiAlert,
} from '../../src/domain/rules/leave';
import * as W from '../../src/domain/rules/workflow';
import { resultsPayload } from '../../src/domain/lis';
import { parseDate, parseNum } from '../../src/domain/values';
import type { EntityStatusKey, FilterKey, Specimen, StatusKey } from '../../src/domain/types';
import { classifyAll } from '../../src/data/ai-model';
import { loadDatabase } from '../../src/data/database';
import { AI_MODEL_MOCK } from '../../src/data/sources/ai-model-mock';
import { SOURCE_CELLAVISION } from '../../src/data/sources/cellavision-db';
import { SOURCE_LIS } from '../../src/data/sources/lis';
import { SOURCE_WAM } from '../../src/data/sources/wam';
import { SpecimenStore } from '../../src/app/specimen-store';
import { ThresholdSettings } from '../../src/app/thresholds';
import { aiSuggestion, analysisRows, capsuleView, flowDcValue, prevReportHeader } from '../../src/ui/view-models';
import { compareSpecimens, matchesFilters, type ListFilters, type SortKey } from '../../src/ui/specimen-list/filtering';
import { enumerate } from '../../tools/state-space';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const G = golden as any;
const undef = (v: unknown) => (v === '__undef' ? undefined : v);
/**
 * 比對合併結果時：處理狀態（review）另外比對；前次報告的 CBC（lis.prevReport.cbc）是新版新增的欄位
 * （docs/CHANGES-FROM-LEGACY.md A4，舊版不收），另由 tests/unit/rules.test.ts 驗證
 */
const withoutReview = (s: Specimen) => {
  const { review: _review, ...rest } = s;
  const { cbc: _cbc, ...prevReport } = rest.lis.prevReport;
  return { ...rest, lis: { ...rest.lis, prevReport } };
};
const json = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

interface LisCall {
  path: string;
  body: unknown;
}
function makeStore(account = 'tester') {
  const calls: LisCall[] = [];
  const thresholds = new ThresholdSettings();
  const store = new SpecimenStore(loadDatabase(), thresholds, {
    lis: {
      sendResults: (spec) => (
        calls.push({ path: '/lis/results', body: json(resultsPayload(spec)) }),
        Promise.resolve(true)
      ),
      sendNote: (spec, note) => (
        calls.push({ path: '/lis/notes', body: { barcode: spec.barcode, patientId: spec.lis.patientId, note } }),
        Promise.resolve(true)
      ),
    },
    notify: () => {},
    account: () => account,
  });
  return { store, thresholds, calls };
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('進線與合併（第 2 章）', () => {
  it('四份模擬資料合併的檢體與進線異常相同', () => {
    const out = mergeByBarcode({
      cellavision: SOURCE_CELLAVISION,
      ai: classifyAll(AI_MODEL_MOCK, SOURCE_CELLAVISION),
      wam: SOURCE_WAM,
      lis: SOURCE_LIS,
    });
    expect(json(out.specimens.map(withoutReview))).toEqual(
      G.intakeReal.specimens.map(({ review: _r, ...rest }: Specimen) => rest),
    );
    expect(out.issues).toEqual(G.intakeReal.issues);
  });
  it('格式不符、重複、缺資料的處理相同', () => {
    const out = mergeByBarcode(G.intakeSynthetic.input);
    expect(json(out.specimens.map(withoutReview))).toEqual(
      G.intakeSynthetic.output.specimens.map(({ review: _r, ...rest }: Specimen) => rest),
    );
    expect(out.issues).toEqual(G.intakeSynthetic.output.issues);
  });
  it('AI 模型模擬的預分類相同', () => {
    expect(json(classifyAll(AI_MODEL_MOCK, SOURCE_CELLAVISION))).toEqual(G.aiClassifyAll);
  });
  it('由逐顆預分類計算 AI 分類結果（60 組隨機細胞）', () => {
    for (const c of G.summarize)
      expect(aiDiffFromCells(c.cells.map((x: { aiCategory: string }) => x.aiCategory))).toEqual(c.result);
  });
  it('條碼正規化', () => {
    for (const [input, out] of G.normalizeBarcode) expect(normalizeBarcode(undef(input))).toBe(out);
  });
});

describe('檢體初始狀態與各項衍生值（25 筆）', () => {
  it('膠囊、清單歸屬、篩選、按鈕、分析表、LIS 回寫內容都相同', () => {
    const { store, thresholds } = makeStore();
    const th = thresholds.get();
    const now = new Date(2025, 7, 7, 22, 15, 0, 0);
    const statuses: FilterKey[] = ['Digital Review', 'AI Alert', 'Follow-up', 'PLT Check', 'Verified', 'Locked'];
    const specs = store.all();
    expect(specs.map((s) => s.barcode)).toEqual(G.initial.map((g: { barcode: string }) => g.barcode));
    specs.forEach((spec, i) => {
      const g = G.initial[i];
      const r = spec.review;
      const actual = json({
        review: r,
        intakeStatus: intakeStatus(spec, th),
        aiValues: aiValues(spec),
        prevValues: prevValues(spec),
        effectiveValues: effectiveValues(spec),
        riskState: riskState(spec, th),
        shouldHaveAiAlert: shouldHaveAiAlert(spec, th),
        ageYears: patientAge(spec),
        isPediatric: isPediatric(spec),
        isDigitalReviewDone: W.isDigitalReviewDone(r),
        isAiAlertConfirmed: W.isAiAlertConfirmed(r),
        isEntityReviewDone: W.isEntityReviewDone(r),
        isCompleted: W.isCompleted(r),
        needsPendingFollowUp: W.needsPendingFollowUp(r),
        isHandoffToFollowUp: W.isHandoffToFollowUp(r),
        isDigitalReviewReadOnly: W.isDigitalReviewReadOnly(r),
        isAiAlertWithFollowUp: W.isAiAlertWithFollowUp(r),
        inDigitalList: W.inDigitalList(r),
        inEntityList: W.inEntityList(r),
        workQueue: W.workQueue(r),
        matchesStatusFilter: statuses.map((s) => W.matchesStatusFilter(r, s)),
        capsules: r.status.map((s) => capsuleView(spec, s)),
        canToggle: (['PLT Check', 'Follow-up'] as StatusKey[]).map((s) => W.canToggleEntityStatus(r, s)),
        urgency: W.urgencyMinutes(spec, now),
        canSwitchToManualReview: W.canSwitchToManualReview(r),
        reportLockTarget: W.reportLockTarget(spec, th),
        analysisRows: analysisRows(spec),
        prevHeader: prevReportHeader(spec, '前次報告'),
        prevHeaderPct: prevReportHeader(spec, '前次報告(%)'),
        flowDc: (['wbc', 'plt', 'band', 'segmentedNeutrophil', 'blast', 'nrbc', 'giantPlt'] as const).map((k) =>
          flowDcValue(spec, k),
        ),
        resultsPayload: resultsPayload(spec),
      });
      const { barcode: _b, ...expected } = g;
      expect(actual, spec.barcode).toEqual(expected);
    });
    expect(store.departments()).toEqual(G.departments);
    expect(store.machines()).toEqual(G.machines);
  });
});

describe('留單門檻（規則 1、4、7）', () => {
  it('每個項目 × 27 種數值 × 7 種年齡的達標判斷相同', () => {
    const values = G.isLeaveValues.map(undef);
    for (const row of G.isLeaveGrid) {
      const judge = leaveJudge(DEFAULT_THRESHOLDS, { lis: { age: row.age } } as unknown as Specimen);
      expect(judge.thresholdFor(row.key), `${row.key} age=${row.age}`).toEqual(undef(row.threshold));
      expect(
        values.map((v: string) => judge.isLeave(row.key, v)),
        `${row.key} age=${row.age}`,
      ).toEqual(row.results);
    }
  });
  it('數值與日期解析相同', () => {
    for (const [v, out] of G.parseNum) expect(parseNum(undef(v) as string)).toEqual(out);
    for (const [v, out] of G.parseDate) {
      const d = parseDate(v);
      expect(d ? [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()] : null).toEqual(out);
    }
  });
  it('設定門檻時的輸入檢查相同', () => {
    for (const c of G.setThresholds) expect(mergeThresholds(DEFAULT_THRESHOLDS, c.input)).toEqual(c.result);
    expect({ ...DEFAULT_THRESHOLDS }).toEqual(G.defaults);
    expect(THRESHOLD_FORM_ORDER).toEqual(G.keyOrder);
    expect(THRESHOLD_LABELS).toEqual(G.labels);
  });
  it('修改門檻後重算 AI 分類警示的結果相同', () => {
    for (const v of G.recompute) {
      localStorage.clear();
      const { store, thresholds } = makeStore();
      thresholds.save(v.thresholds);
      store.recomputeAiAlerts();
      const actual = store.all().map((s) => ({
        barcode: s.barcode,
        status: s.review.status,
        statusDone: s.review.statusDone,
        riskState: riskState(s, thresholds.get()),
        lock: W.reportLockTarget(s, thresholds.get()),
      }));
      expect(json(actual)).toEqual(v.specimens);
    }
  });
});

describe('各種操作（規則 9～12、15）', () => {
  type Act = (store: SpecimenStore, id: string) => unknown;
  const ACTIONS: Record<string, Act> = {
    signOff: (s, id) => s.signOff(id, {}),
    signOffConfirmAi: (s, id) => s.signOff(id, { confirmAiAlert: true }),
    signOffForce: (s, id) => s.signOff(id, { unlocked: true }),
    manualReview: (s, id) => s.switchToManualReview(id),
    followUpDone: (s, id) => s.markFollowUpDone(id),
    toggleFU: (s, id) => s.toggleEntityStatus(id, 'Follow-up' as EntityStatusKey),
    togglePLT: (s, id) => s.toggleEntityStatus(id, 'PLT Check' as EntityStatusKey),
    withdraw: (s, id) => s.withdrawFromLis(id),
  };
  const retOf = (name: string, ret: unknown) => {
    if (ret && typeof ret === 'object' && 'barcode' in ret) return '__spec';
    if (name === 'manualReview')
      return ret ? { addedFollowUp: (ret as { addedFollowUp: boolean }).addedFollowUp } : null;
    return ret === undefined ? '__undef' : ret;
  };
  const stored = (id: string) =>
    (JSON.parse(localStorage.getItem('blood-morphology-specimen-status') || '{}') as Record<string, unknown>)[id] ??
    null;

  /**
   * KNOWN_FIX（docs/CHANGES-FROM-LEGACY.md #1）：舊版 LIS 撤回後，若之前保存過「需拉片確認已完成」，
   * 會殘留在流程旗標裡，使撤回的檢體直接顯示為已完成。新版撤回後一律回到剛進線的狀態。
   */
  const isWithdrawLeak = (step: { action: string; ret: unknown; review: Specimen['review'] }) =>
    step.action === 'withdraw' &&
    step.ret === true &&
    Object.keys(step.review.workflowDone.entityStatusDone).length > 0;

  let compared = 0;
  let knownFixes = 0;
  function run(
    seqName: string,
    seq: string[],
    cases: {
      barcode: string;
      steps: { action: string; ret: unknown; review: Specimen['review']; lis: LisCall[]; stored: unknown }[];
    }[],
    account = 'tester',
  ) {
    for (const c of cases) {
      localStorage.clear();
      sessionStorage.clear();
      const { store, thresholds, calls } = makeStore(account);
      for (let i = 0; i < seq.length; i++) {
        const name = seq[i] as string;
        const g = c.steps[i];
        if (!g) throw new Error('missing golden step');
        const before = calls.length;
        const ret = ACTIONS[name]?.(store, c.barcode);
        const spec = store.getById(c.barcode) as Specimen;
        if (isWithdrawLeak(g)) {
          knownFixes++;
          expect(spec.review.status).toEqual(intakeStatus(spec, thresholds.get()));
          expect(spec.review.workflowDone).toEqual(W.emptyWorkflow());
          expect(spec.review.statusDone).toBe(false);
          break; // 之後的步驟以舊版的錯誤狀態為起點，不再比對
        }
        const lis = calls
          .slice(before)
          .filter((x) => !(name === 'manualReview' && (x.body as { note?: string }).note === '需拉片確認'));
        expect(retOf(name, ret), `${seqName} ${c.barcode} #${i} ${name} ret`).toEqual(g.ret);
        expect(json(spec.review), `${seqName} ${c.barcode} #${i} ${name} review`).toEqual(g.review);
        expect(json(lis), `${seqName} ${c.barcode} #${i} ${name} lis`).toEqual(g.lis);
        expect(stored(c.barcode), `${seqName} ${c.barcode} #${i} ${name} stored`).toEqual(g.stored);
        compared++;
      }
    }
  }

  it('每筆檢體套用每個操作（8 種 × 25 筆）', () => {
    for (const name of Object.keys(ACTIONS)) run(name, [name], G.actions[name]);
  });
  it('連續操作（9 組 × 25 筆）', () => {
    for (const [key, cases] of Object.entries(G.sequences)) run(key, key.split('>'), cases as never);
    run('未登入帳號', ['signOffConfirmAi', 'togglePLT', 'toggleFU'], G.sequencesNoAccount, '');
    expect(compared).toBeGreaterThan(400);
    console.log(`操作比對 ${compared} 步；KNOWN_FIX（撤回殘留）${knownFixes} 例`);
  });
});

describe('已保存狀態的讀回', () => {
  it('各種保存內容（含格式錯誤）讀回後相同', () => {
    for (const c of G.stored) {
      localStorage.clear();
      localStorage.setItem('blood-morphology-specimen-status', JSON.stringify(c.seed));
      const { store } = makeStore();
      expect(json(store.all().map((s) => ({ barcode: s.barcode, review: s.review })))).toEqual(c.specimens);
    }
    localStorage.clear();
    localStorage.setItem(
      'blood-morphology-leave-thresholds',
      JSON.stringify({ wbc: 5, blast: 'present', monocyte: 'x' }),
    );
    const { store, thresholds } = makeStore();
    expect(thresholds.get()).toEqual(G.storedThresholds.thresholds);
    expect(store.all().map((s) => s.review.status)).toEqual(G.storedThresholds.statuses);
  });
});

describe('LIS 回寫內容與判斷用數值（規則 4、14）', () => {
  it('人員編輯值的各種情形', () => {
    const { store, thresholds } = makeStore();
    for (const c of G.resultsPayload) {
      const base = store.getById(c.barcode) as Specimen;
      for (const v of c.variants) {
        const spec = json(base);
        if (v.edited) spec.review.editedDiff = v.edited;
        else delete spec.review.editedDiff;
        expect(json(resultsPayload(spec))).toEqual(v.payload);
        expect(json(effectiveValues(spec))).toEqual(v.effective);
        expect(riskState(spec, thresholds.get())).toEqual(v.risk);
      }
    }
  });
});

describe('膠囊狀態空間（規則 5、附錄 D）', () => {
  it('狀態、可做的操作與轉換和舊版相同', () => {
    const now = enumerate();
    expect(now.states).toEqual(G.stateSpace.states);
    expect(now.edges).toEqual(G.stateSpace.edges);
    expect(now.thresholdViolations).toEqual([]);
  });
});

describe('影像檢視頁的計算（規則 8）', () => {
  it('人員編輯值、類別排序、達門檻標紅（80 組隨機分類）', () => {
    const { store, thresholds } = makeStore();
    for (const c of G.imageReview) {
      const spec = store.getById(c.barcode) as Specimen;
      const judge = leaveJudge(thresholds.get(), spec);
      const { counts, wbcTotal } = countCells(c.cells);
      expect(wbcTotal).toBe(c.total);
      if (c.cells.length) expect(editedDiffFromCells(c.cells)).toEqual(c.edited);
      else expect(c.edited).toBeNull(); // 沒有細胞時舊版不儲存
      expect(reviewCategoryOrder(judge, counts, wbcTotal)).toEqual(c.order);
      const order = [
        'Band',
        'Segmented Neutrophil',
        'Eosinophil',
        'Monocyte',
        'Basophil',
        'Lymphocyte',
        'Atypical Lymphocyte',
        'Abnormal Lymphocyte',
        'Blast',
        'Promyelocyte',
        'Myelocyte',
        'Metamyelocyte',
        'Hypersegmented',
        'Promonocyte',
        'Plasma Cell',
        'Megakaryocyte',
        'NRBC',
        'Giant PLT',
        'Smudge Cell',
        'Unidentified',
        'Artefact',
      ];
      expect(
        order.map((cat) => {
          const n = counts.get(cat);
          return n ? categoryReachesLeave(judge, cat, n, wbcTotal ? (n / wbcTotal) * 100 : 0) : null;
        }),
      ).toEqual(c.leaveHit);
    }
    for (const [cell, out] of G.aiSuggestion) expect(aiSuggestion(cell)).toEqual(out);
  });
});

describe('檢體管理的篩選與排序（第 4 章）', () => {
  it('3 種模式 × 13 種條件、3 種欄位 × 升降冪', () => {
    const { store } = makeStore();
    const specs = store.all();
    for (const c of G.listFilter) {
      expect(
        specs.filter((s) => matchesFilters(s, c.filter as ListFilters, c.mode)).map((s) => s.barcode),
        JSON.stringify(c),
      ).toEqual(c.ids);
    }
    const now = parseDate('2025-08-07 22:15') as Date;
    for (const c of G.listSort) {
      expect(
        specs
          .slice()
          .sort((a, b) => compareSpecimens(a, b, c.key as SortKey, c.asc, now))
          .map((s) => s.barcode),
      ).toEqual(c.ids);
    }
  });
});
