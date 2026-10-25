/**
 * 操作、LIS 回寫（規則 9～15）、膠囊狀態空間（規則 5）、模擬資料一致性
 */
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { SpecimenStore } from '../../src/app/specimen-store';
import { ThresholdSettings } from '../../src/app/thresholds';
import { aiDiffFromCells } from '../../src/domain/rules/cell-counts';
import { leaveJudge, prevValues } from '../../src/domain/rules/leave';
import { resultsPayload } from '../../src/domain/lis';
import type { Specimen, StatusKey } from '../../src/domain/types';
import { classifyAll } from '../../src/data/ai-model';
import { loadDatabase } from '../../src/data/database';
import { AI_MODEL_MOCK } from '../../src/data/sources/ai-model-mock';
import { SOURCE_CELLAVISION } from '../../src/data/sources/cellavision-db';
import { SOURCE_LIS } from '../../src/data/sources/lis';
import { SOURCE_WAM } from '../../src/data/sources/wam';
import { enumerate } from '../../tools/state-space';
import { adult } from '../support/specimen';

beforeEach(() => localStorage.clear());

/** 一筆測試檢體的資料庫；LIS 回寫記在 log（不含時間） */
function single(status: StatusKey[]) {
  const spec = adult({ status, values: { segmentedNeutrophil: '60.0', lymphocyte: '40.0', nrbc: '2' } });
  spec.lis.patientId = 'P1';
  spec.wam.cbc = { wbc: '6.0' };
  const log: { path: string; body: Record<string, unknown> }[] = [];
  const store = new SpecimenStore(
    { specimens: [spec], intakeIssues: [], departments: [], machines: [] },
    new ThresholdSettings(),
    {
      lis: {
        sendResults: (s) => (
          log.push({ path: '/lis/results', body: resultsPayload(s) as never }),
          Promise.resolve(true)
        ),
        sendNote: (s, note) => (
          log.push({ path: '/lis/notes', body: { barcode: s.barcode, note } }),
          Promise.resolve(true)
        ),
      },
      notify: () => {},
      account: () => 'tester',
    },
  );
  // 進線時會依資料重新加膠囊；測試要的是指定的處理狀態
  spec.review.status = status.slice();
  return { store, spec, log };
}

describe('結果回傳 LIS（規則 14）', () => {
  it('簽核 → 回寫 WBC Diff%、非白血球數據', () => {
    const { store, log } = single(['Digital Review']);
    store.signOff('S');
    expect(log.map((e) => e.path)).toEqual(['/lis/results']);
    const b = log[0]?.body as { barcode: string; wbcDiff: Record<string, string>; nonWbc: Record<string, string> };
    expect([b.barcode, b.wbcDiff.segmentedNeutrophil, b.wbcDiff.lymphocyte, b.nonWbc.nrbc, 'wbc' in b.wbcDiff]).toEqual(
      ['S', '60.0', '40.0', '2', false],
    );
  });
  it('改為人工鏡檢 → 註記「需拉片確認」（規則 10）', () => {
    const { store, log } = single(['Digital Review']);
    store.switchToManualReview('S');
    expect(log.map((e) => [e.path, e.body.note])).toEqual([['/lis/notes', '需拉片確認']]);
  });
  it('已拉片完成 → 註記「拉片完成」', () => {
    const { store, log } = single(['Follow-up']);
    store.markFollowUpDone('S');
    expect(log.map((e) => e.body.note)).toEqual(['拉片完成']);
  });
  it('清單點膠囊標記完成 →「血小板確認完成」／「拉片完成」；取消完成時不回傳', () => {
    const { store, log } = single(['Follow-up', 'PLT Check']);
    store.toggleEntityStatus('S', 'PLT Check');
    store.toggleEntityStatus('S', 'PLT Check');
    store.toggleEntityStatus('S', 'Follow-up');
    expect(log.map((e) => e.body.note)).toEqual(['血小板確認完成', '拉片完成']);
  });
  it('開鎖後簽核（待辦需拉片確認隨簽核完成）→ 回寫結果＋註記「數位閱片替代拉片鏡檢」', () => {
    const { store, log } = single(['Follow-up']);
    store.signOff('S', { unlocked: true });
    expect(log.map((e) => [e.path, e.body.note ?? ''])).toEqual([
      ['/lis/results', ''],
      ['/lis/notes', '數位閱片替代拉片鏡檢'],
    ]);
  });
  it('規則 12、13 數位閱片待辦時點血小板確認完成 → 檢體仍未完成、不記錄編輯人員', () => {
    const { store, spec } = single(['Digital Review', 'PLT Check']);
    store.toggleEntityStatus('S', 'PLT Check');
    const stored = JSON.parse(localStorage.getItem('blood-morphology-specimen-status') || '{}') as Record<
      string,
      { statusDone: boolean }
    >;
    expect([spec.review.statusDone, spec.review.editor, stored.S?.statusDone]).toEqual([false, '', false]);
  });
  it('需拉片確認已完成後才簽核 → 不再寫「數位閱片替代拉片鏡檢」', () => {
    const { store, log } = single(['Digital Review', 'Follow-up']);
    store.markFollowUpDone('S');
    store.signOff('S');
    expect(log.map((e) => (e.body.note as string) || e.path)).toEqual(['拉片完成', '/lis/results']);
  });
});

describe('多個分頁同時開啟', () => {
  it('另一個分頁先標記血小板確認完成，這一頁再簽核：不會用舊狀態把血小板確認蓋回未完成', () => {
    const a = single(['Digital Review', 'PLT Check']);
    // 第二個分頁：同一份瀏覽器儲存、各自的檢體資料
    const specB = structuredClone(a.spec);
    const storeB = new SpecimenStore(
      { specimens: [specB], intakeIssues: [], departments: [], machines: [] },
      new ThresholdSettings(),
      {
        lis: { sendResults: () => Promise.resolve(true), sendNote: () => Promise.resolve(true) },
        notify: () => {},
        account: () => 'tester',
      },
    );
    specB.review.status = ['Digital Review', 'PLT Check'];
    storeB.toggleEntityStatus('S', 'PLT Check');
    a.store.signOff('S');
    const stored = JSON.parse(localStorage.getItem('blood-morphology-specimen-status') || '{}') as Record<
      string,
      {
        workflowDone: { entityStatusDone: Record<string, boolean>; digitalReviewSignedOff: boolean };
        statusDone: boolean;
      }
    >;
    expect([
      stored.S?.workflowDone.entityStatusDone['PLT Check'],
      stored.S?.workflowDone.digitalReviewSignedOff,
      stored.S?.statusDone,
    ]).toEqual([true, true, true]);
  });
});

describe('LIS 撤回（規則 15）', () => {
  it('只有已簽核的數位閱片結果可以撤回；撤回後回到剛進線的狀態並通知畫面', () => {
    const { store, spec } = single(['Digital Review']);
    expect(store.withdrawFromLis('S')).toBe(false);
    store.signOff('S');
    expect(store.withdrawFromLis('S')).toBe(true);
    expect([spec.review.status, spec.review.statusDone, spec.review.editor, spec.review.editedDiff]).toEqual([
      ['Digital Review'],
      false,
      '',
      undefined,
    ]);
  });
  it('【修正舊版】開鎖簽核完成需拉片確認後撤回：回到進線狀態，不會殘留「已完成」', () => {
    const { store, spec } = single(['Follow-up']);
    spec.lis.smearRequiredNote = true;
    store.signOff('S', { unlocked: true });
    expect(spec.review.statusDone).toBe(true);
    store.withdrawFromLis('S');
    expect([spec.review.status, spec.review.workflowDone.entityStatusDone, spec.review.statusDone]).toEqual([
      ['Follow-up'],
      {},
      false,
    ]);
    const stored = JSON.parse(localStorage.getItem('blood-morphology-specimen-status') || '{}') as Record<
      string,
      { statusDone: boolean }
    >;
    expect(stored.S?.statusDone).toBe(false);
  });
});

describe('膠囊狀態空間（規則 5；文件 2 附錄 D）', () => {
  const space = enumerate();
  it(`共 ${space.states.length} 種狀態、${space.edges.length} 個操作`, () => {
    expect(space.states.length).toBeGreaterThanOrEqual(20);
  });
  it('沒有「未完成卻不在任何清單」的狀態；已完成的不在待辦清單', () => {
    expect(space.states.filter((s) => !s.completed && s.queue === 'done').map((s) => s.key)).toEqual([]);
    expect(space.states.filter((s) => s.completed && s.queue !== 'done').map((s) => s.key)).toEqual([]);
  });
  it('每個未完成的狀態都有下一步；數位閱片清單裡的都能進入閱片', () => {
    expect(space.states.filter((s) => !s.completed && s.actions.length === 0).map((s) => s.key)).toEqual([]);
    expect(
      space.states.filter((s) => (s.queue === 'digital' || s.queue === 'both') && !s.canEnterReview).map((s) => s.key),
    ).toEqual([]);
  });
  it('唯讀狀態不能簽核或改為人工鏡檢', () => {
    expect(
      space.states.filter((s) => s.readOnly && s.actions.some((a) => /簽核|人工鏡檢|報告頁/.test(a))).map((s) => s.key),
    ).toEqual([]);
  });
  it('已完成的檢體不能再操作；只有已簽核的數位閱片結果可由 LIS 撤回', () => {
    expect(
      space.states.filter((s) => s.completed && s.actions.some((a) => a !== 'LIS 撤回')).map((s) => s.key),
    ).toEqual([]);
    expect(
      space.states.filter((s) => s.actions.includes('LIS 撤回') !== /DR✓簽/.test(s.key)).map((s) => s.key),
    ).toEqual([]);
  });
  it('LIS 撤回後一律回到進線時的狀態', () => {
    expect(space.edges.filter((e) => e.action === 'LIS 撤回' && e.to !== e.intakeKey)).toEqual([]);
  });
  it('已簽核的檢體不會有需拉片確認待辦；不會出現「數位閱片待辦＋需拉片確認」', () => {
    expect(space.states.filter((s) => /DR✓簽/.test(s.key) && /FU○/.test(s.key)).map((s) => s.key)).toEqual([]);
    expect(space.states.filter((s) => /DR○/.test(s.key) && /FU/.test(s.key)).map((s) => s.key)).toEqual([]);
  });
  it('規則 1、7 修改門檻後重算 AI 分類警示：任何狀態都不會變成「未完成卻不在任何清單」', () => {
    expect(space.thresholdViolations).toEqual([]);
  });
});

describe('模擬資料一致性', () => {
  const db = loadDatabase();
  const ai = classifyAll(AI_MODEL_MOCK, SOURCE_CELLAVISION);
  it('四份模擬資料的條碼一一對應，合併後沒有進線異常', () => {
    const ids = (list: { barcode: string | null }[]) =>
      list
        .map((r) => r.barcode)
        .sort()
        .join(',');
    for (const list of [ai, SOURCE_WAM, SOURCE_LIS]) expect(ids(list)).toBe(ids(SOURCE_CELLAVISION));
    expect([db.specimens.length, db.intakeIssues]).toEqual([SOURCE_CELLAVISION.length, []]);
  });
  it('每筆檢體都有細胞影像，每顆都有 AI 預分類，影像檔都存在', () => {
    const bad: string[] = [];
    for (const s of db.specimens) {
      if (!s.imaging.cells.length) bad.push(s.barcode + ' 無細胞');
      const predicted = new Set(ai.find((a) => a.barcode === s.barcode)?.cells.map((c) => c.cellId));
      for (const c of s.imaging.cells) {
        if (!predicted.has(c.cellId)) bad.push(c.cellId + ' 無 AI 結果');
        if (!fs.existsSync(path.join('public', c.imagePath))) bad.push(c.cellId + ' 影像不存在 ' + c.imagePath);
      }
    }
    expect(bad).toEqual([]);
  });
  it('AI 模型模擬：每顆預分類＝範例圖所在類別資料夾（指定誤判除外）', () => {
    const bad: string[] = [];
    SOURCE_CELLAVISION.forEach((r) => {
      const result = ai.find((a) => a.barcode === r.barcode);
      r.cells.forEach((c, i) => {
        const want =
          AI_MODEL_MOCK.CELL_OVERRIDES[c.cellId]?.category ??
          AI_MODEL_MOCK.FOLDER_TO_CATEGORY[c.image.split('/')[3] ?? ''];
        if (!want || result?.cells[i]?.category !== want) bad.push(c.cellId);
      });
    });
    expect(bad).toEqual([]);
  });
  it('AI 分類結果：除沿用研究數值的檢體外，一律由逐顆預分類計算', () => {
    for (const s of db.specimens) {
      const fixed = AI_MODEL_MOCK.FIXED_DIFF[s.barcode];
      expect(s.imaging.aiDiff, s.barcode).toEqual(fixed ?? aiDiffFromCells(s.imaging.cells.map((c) => c.aiCategory)));
    }
  });
  it('規則 2 前次報告達留單者，LIS 一定有需推片確認註記', () => {
    const th = new ThresholdSettings().get();
    expect(
      db.specimens
        .filter((s: Specimen) => leaveJudge(th, s).hasAnyLeave(prevValues(s)) && !s.lis.smearRequiredNote)
        .map((s) => s.barcode),
    ).toEqual([]);
  });
  it('每筆都有進線判斷欄位與收件時間；合併後只有 barcode、imaging、wam、lis、review 五組', () => {
    expect(
      db.specimens
        .filter(
          (s) =>
            typeof s.lis.smearRequiredNote !== 'boolean' ||
            typeof s.wam.pltFlag !== 'string' ||
            typeof s.lis.age !== 'number' ||
            !s.lis.receivedTime,
        )
        .map((s) => s.barcode),
    ).toEqual([]);
    expect(
      db.specimens.filter((s) => Object.keys(s).join(',') !== 'barcode,imaging,wam,lis,review').map((s) => s.barcode),
    ).toEqual([]);
  });
});
