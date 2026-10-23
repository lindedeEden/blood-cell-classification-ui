/**
 * 規則單元測試（不需瀏覽器、不需安裝套件）
 *
 * 執行方式：在專案資料夾執行  node tests/run-tests.js
 * 測試對象：src/rules/intake-merge.js（進線與合併：CellaVision 影像＋AI 模型＋WAM＋LIS）、src/rules/leave-rules.js（留單）、src/rules/workflow-rules.js（狀態與流程）
 * 案例對應《邏輯規則說明文件》第 2～10 節。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 依瀏覽器載入順序執行規則檔
const ctx = vm.createContext({ console });
['src/config/config.js', 'src/constants/status.js', 'src/constants/cell-types.js', 'src/rules/leave-rules.js', 'src/rules/workflow-rules.js', 'src/rules/intake-merge.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f }));
const { LeaveRules: L, WorkflowRules: W, CellConstants: C, IntakeMerge: M } = vm.runInContext('({ LeaveRules, WorkflowRules, CellConstants, IntakeMerge })', ctx);

let pass = 0, fail = 0;
function test(name, fn) {
  L.resetThresholds();
  try { fn(); pass++; console.log('  ✓ ' + name); }
  catch (e) { fail++; console.log('  ✗ ' + name + '\n      ' + e.message); }
}
function eq(actual, expected, msg) {
  const a = JSON.stringify(actual), b = JSON.stringify(expected);
  if (a !== b) throw new Error((msg ? msg + '：' : '') + '預期 ' + b + '，實際 ' + a);
}
// 測試用檢體：結構與合併後相同（imaging／wam／lis／review）。
// 選項：age（換算成生日）、values（AI 值，含 wbc、plt）、prev（前次報告，含 wbc、plt）、edited（人員編輯值）、
//       note（LIS 需推片確認註記）、pltFlag，以及處理狀態 status、workflowDone、locked
const ANALYSIS_TIME = '2025-08-07 10:00';
function mkSpec(o) {
  o = o || {};
  const split = (v) => { const d = Object.assign({}, v || {}); const w = d.wbc, p = d.plt; delete d.wbc; delete d.plt; return { w, p, d }; };
  const cur = split(o.values), prev = split(o.prev);
  const review = { status: o.status || ['Digital Review'] };
  ['workflowDone', 'locked', 'editor'].forEach(k => { if (o[k] !== undefined) review[k] = o[k]; });
  if (o.edited) review.editedDiff = o.edited;
  return {
    barcode: o.barcode || 'S',
    imaging: { analysisTime: ANALYSIS_TIME, cells: [], aiDiff: cur.d },
    wam: { cbc: { wbc: cur.w, plt: cur.p }, pltFlag: o.pltFlag || '' },
    lis: { age: o.age == null ? null : o.age, smearRequiredNote: !!o.note, prevReport: { date: '', wbc: prev.w, plt: prev.p, diff: prev.d } },
    review: review
  };
}
const adult = (o) => mkSpec(Object.assign({ age: 40 }, o));
const child = (o) => mkSpec(Object.assign({ age: 10 }, o));
/** 套用處理狀態的變更（例：workflowOnReportVerified 的回傳值）到檢體副本 */
const withReview = (spec, patch) => Object.assign({}, spec, { review: Object.assign({}, spec.review, patch) });

console.log('\n留單判斷（第 3 節）');
test('規則 1 數字門檻：≥ 即達標；「-」或空白不達標', () => {
  eq(L.isLeave('wbc', '30', adult()), true);
  eq(L.isLeave('wbc', '29.9', adult()), false);
  eq(L.isLeave('wbc', '-', adult()), false);
  eq(L.isLeave('wbc', '', adult()), false);
});
test('規則 1 present 門檻：> 0 即達標', () => {
  eq(L.isLeave('blast', '1', adult()), true);
  eq(L.isLeave('blast', '0', adult()), false);
});
test('規則 1 Lymphocyte：成人 ≥60、未滿 18 歲 ≥80', () => {
  eq(L.isLeave('lymphocyte', '60', adult()), true);
  eq(L.isLeave('lymphocyte', '70', child()), false);
  eq(L.isLeave('lymphocyte', '80', child()), true);
});
test('規則 1 Megakaryocyte：成人出現即留單；兒童不適用', () => {
  eq(L.isLeave('megakaryocyte', '1', adult()), true);
  eq(L.isLeave('megakaryocyte', '1', child()), false);
});
test('規則 1 年齡直接用 LIS 提供的值（18 歲適用成人規則、17 歲適用兒童規則）', () => {
  const s = { lis: { age: 18 } };
  eq(L.getAgeYears({ lis: { age: 17 } }), 17);
  eq(L.isLeave('lymphocyte', '65', { lis: { age: 17 } }), false);
  eq(L.getAgeYears(s), 18);
  eq(L.isLeave('lymphocyte', '65', s), true);
});
test('規則 1 年齡未知視為成人', () => {
  eq(L.isPediatric({}), false);
  eq(L.isLeave('lymphocyte', '60', {}), true);
});
test('規則 4 新發／延續：同項目前次已達標＝延續（黃）', () => {
  const s = adult({ values: { blast: '6' }, prev: { blast: '2' } });
  eq(L.riskState(s), { hasNewLeave: false, hasLeaveNow: true, isPersistentLeave: true });
});
test('規則 4 本次達標、前次未達標＝新發（紅）', () => {
  const s = adult({ values: { promyelocyte: '2' }, prev: {} });
  eq(L.riskState(s).hasNewLeave, true);
});
test('規則 4 人員編輯值與 AI 不同時以人員編輯值判定', () => {
  const s = adult({ values: { wbc: '8', blast: '3' }, edited: { blast: '-', lymphocyte: '40' } });
  eq(L.effectiveValues(s).blast, '-');
  eq(L.effectiveValues(s).wbc, '8', 'WBC 仍取分析儀值');
  eq(L.riskState(s).hasLeaveNow, false);
});
test('規則 7 門檻可修改，恢復預設後還原', () => {
  L.setThresholds({ lymphocytePediatric: 90 });
  eq(L.isLeave('lymphocyte', '85', child()), false);
  L.resetThresholds();
  eq(L.isLeave('lymphocyte', '85', child()), true);
});
test('規則 7 present 項目不可改成數字；負數不接受', () => {
  L.setThresholds({ blast: 5, wbc: -1 });
  eq(L.getThresholds().blast, 'present');
  eq(L.getThresholds().wbc, 30);
});

console.log('\n進線與合併（第 2 節）');
// 四份資料各一筆的最小資料：CellaVision 資料庫（影像）、AI 模型（預分類）、WAM、LIS
const srcCv = (bc, extra) => Object.assign({ barcode: bc, analysisTime: '2025-08-07 10:00',
  cells: [{ cellId: bc + '-001', image: 'img/1.jpg' }, { cellId: bc + '-002', image: 'img/2.jpg' }] }, extra);
const srcAi = (bc, extra) => Object.assign({ barcode: bc,
  cells: [{ cellId: bc + '-001', category: 'Segmented Neutrophil', confidence: 0.95 }, { cellId: bc + '-002', category: 'Lymphocyte', confidence: null }],
  values: { segmentedNeutrophil: '60.0', lymphocyte: '30.0', blast: '-' } }, extra);
const srcWam = (bc, extra) => Object.assign({ barcode: bc, machine: 'DI1', location: '101-1', cbc: { wbc: '6.00', plt: '250' }, flowDc: { lymphocyte: '31.0' },
  cbcFlags: {}, flowDcFlags: [], pltFlag: '', sisRules: [] }, extra);
const srcLis = (bc, extra) => Object.assign({ barcode: bc, patientId: 'P1', name: '測試', gender: '女', birthDate: '1985-01-01',
  age: 40, department: '一般科', receivedTime: '2025-08-07 09:30', smearRequiredNote: false, prevReportDate: '2025-07-31', prevReport: { lymphocyte: '28.0' } }, extra);
const merge4 = (cv, ai, wam, lis) => M.mergeByBarcode({ cellavision: cv, ai: ai, wam: wam, lis: lis });
const BC = 'H5080799001', BC2 = 'H5080799002';
test('依條碼合併：CellaVision 給影像／取像時間，AI 模型給預分類，WAM 給 CBC／Flow DC／flag／檢體歸位／玻片機台，LIS 給病患資料／時效／前次報告／註記', () => {
  const r = merge4([srcCv(BC)], [srcAi(BC)], [srcWam(BC, { pltFlag: 'P', sisRules: ['760'], cbcFlags: { plt: 'DC' } })], [srcLis(BC, { smearRequiredNote: true })]);
  eq(r.issues, []);
  const s = r.specimens[0];
  eq(Object.keys(s), ['barcode', 'imaging', 'wam', 'lis', 'review'], '依資料來源分組；處理狀態另放 review');
  eq([s.barcode, s.imaging.analysisTime], [BC, '2025-08-07 10:00']);
  eq([s.wam.machine, s.wam.location, s.wam.cbc.wbc, s.wam.flowDc.lymphocyte, s.wam.pltFlag, s.wam.sisRules, s.wam.cbcFlags], ['DI1', '101-1', '6.00', '31.0', 'P', ['760'], { plt: 'DC' }]);
  eq([s.lis.patientId, s.lis.name, s.lis.birthDate, s.lis.age, s.lis.department, s.lis.receivedTime, s.lis.smearRequiredNote], ['P1', '測試', '1985-01-01', 40, '一般科', '2025-08-07 09:30', true]);
  eq(s.lis.prevReport, { date: '2025-07-31', diff: { lymphocyte: '28.0' } });
  eq(L.getAgeYears(s), 40, '年齡用 LIS 提供的值');
});
test('前次報告：WBC、PLT 與分類分開；LIS 給的其他欄位（例如舊的 neut）不收', () => {
  const s = merge4([srcCv(BC)], [srcAi(BC)], [srcWam(BC)], [srcLis(BC, { prevReport: { wbc: '9.2', plt: '200', blast: '2.0', neut: '55.0' } })]).specimens[0];
  eq(s.lis.prevReport, { date: '2025-07-31', wbc: '9.2', plt: '200', diff: { blast: '2.0' } });
  eq([L.prevValues(s).wbc, L.prevValues(s).blast, 'neut' in L.prevValues(s)], ['9.2', '2.0', false]);
});
test('每顆細胞＝CellaVision 影像＋AI 模型預分類（依 cellId 對應）；沒有 AI 結果的細胞列為 Unidentified', () => {
  const ai = srcAi(BC, { cells: [{ cellId: BC + '-002', category: 'Lymphocyte', confidence: 0.9 }] });
  const s = merge4([srcCv(BC)], [ai], [srcWam(BC)], [srcLis(BC)]).specimens[0];
  eq(s.imaging.cells, [{ cellId: BC + '-001', imagePath: 'img/1.jpg', aiCategory: 'Unidentified', aiConfidence: null },
    { cellId: BC + '-002', imagePath: 'img/2.jpg', aiCategory: 'Lymphocyte', aiConfidence: 0.9 }]);
});
test('imaging.aiDiff 只放 AI 分類結果（Diff%）；判斷 1 用的 AI 值＝WAM 的 WBC、PLT ＋ aiDiff', () => {
  const s = merge4([srcCv(BC)], [srcAi(BC)], [srcWam(BC)], [srcLis(BC)]).specimens[0];
  eq(s.imaging.aiDiff, { segmentedNeutrophil: '60.0', lymphocyte: '30.0', blast: '-' });
  eq(L.aiValues(s), { wbc: '6.00', plt: '250', segmentedNeutrophil: '60.0', lymphocyte: '30.0', blast: '-' });
});
test('模型沒有回傳 AI 分類結果（Diff%）時，由逐顆結果計算：一律為 %，分母＝白血球總數（非白血球另算、不併入加總）', () => {
  const cells = ['Segmented Neutrophil', 'Segmented Neutrophil', 'Segmented Neutrophil', 'Lymphocyte', 'NRBC', 'NRBC']
    .map((c, i) => ({ cellId: 'c' + i, aiCategory: c }));
  const v = M.summarizeAiCells(cells);
  eq([v.segmentedNeutrophil, v.lymphocyte, v.nrbc, v.blast], ['75.0', '25.0', '50.0', '-']);
  const s = merge4([srcCv(BC)], [srcAi(BC, { values: undefined })], [srcWam(BC)], [srcLis(BC)]).specimens[0];
  eq([s.imaging.aiDiff.segmentedNeutrophil, s.imaging.aiDiff.lymphocyte], ['50.0', '50.0']);
});
test('合併後交給 intakeStatus()：LIS 註記＋PLT**＋AI 達門檻 → 需拉片確認＋AI 分類警示＋血小板確認', () => {
  const s = merge4([srcCv(BC)], [srcAi(BC, { values: { blast: '2.0' } })], [srcWam(BC, { pltFlag: 'P' })], [srcLis(BC, { smearRequiredNote: true })]).specimens[0];
  eq(W.intakeStatus(s), ['Follow-up', 'AI Alert', 'PLT Check']);
});
test('條碼比對前去除空白、轉大寫', () => {
  const r = merge4([srcCv(' h5080799001 ')], [srcAi(BC)], [srcWam(BC)], [srcLis('H5080799001\n')]);
  eq([r.specimens.map(s => s.barcode), r.issues], [[BC], []]);
});
test('附錄 A #3 CellaVision 資料庫有影像、缺 AI 結果、WAM 或 LIS → 暫不進線，列為進線異常', () => {
  const BC3 = 'H5080799003';
  const r = merge4([srcCv(BC), srcCv(BC2), srcCv(BC3)], [srcAi(BC), srcAi(BC2)], [srcWam(BC2), srcWam(BC3)], [srcLis(BC), srcLis(BC3)]);
  eq(r.specimens.length, 0);
  eq(r.issues.map(i => [i.type, i.source, i.barcode]), [['missing-source', 'wam', BC], ['missing-source', 'lis', BC2], ['missing-source', 'ai', BC3]]);
});
test('附錄 A #3 有 WAM／LIS、CellaVision 資料庫沒有影像 → 尚未取像，不進線、不列異常', () => {
  const r = merge4([srcCv(BC)], [srcAi(BC)], [srcWam(BC), srcWam(BC2)], [srcLis(BC), srcLis(BC2)]);
  eq([r.specimens.map(s => s.barcode), r.issues], [[BC], []]);
});
test('附錄 A #3 條碼格式不符（不是 11 碼英數字）→ 該筆略過並記錄', () => {
  const r = merge4([srcCv('H508079900'), srcCv(BC)], [srcAi(BC)], [srcWam(BC)], [srcLis(BC), srcLis('')]);
  eq(r.specimens.map(s => s.barcode), [BC]);
  eq(r.issues.map(i => [i.type, i.source]), [['invalid-barcode', 'cellavision'], ['invalid-barcode', 'lis']]);
});
test('附錄 A #3 同一來源同一條碼多筆 → 以最後一筆為準並記錄', () => {
  const r = merge4([srcCv(BC)], [srcAi(BC)], [srcWam(BC, { pltFlag: '' }), srcWam(BC, { pltFlag: 'P' })], [srcLis(BC)]);
  eq([r.specimens[0].wam.pltFlag, r.issues.map(i => [i.type, i.source])], ['P', [['duplicate', 'wam']]]);
});
test('LIS 註記只有明確為 true 才算；WAM 沒給 PLT flag 視為空白', () => {
  const s = merge4([srcCv(BC)], [srcAi(BC)], [srcWam(BC, { pltFlag: undefined })], [srcLis(BC, { smearRequiredNote: 'Y' })]).specimens[0];
  eq([s.lis.smearRequiredNote, s.wam.pltFlag, W.intakeStatus(s)], [false, '', ['Digital Review']]);
});
test('合併結果不與來源資料共用物件（之後的編輯不會改到來源）', () => {
  const lis = srcLis(BC), wam = srcWam(BC), ai = srcAi(BC);
  const s = merge4([srcCv(BC)], [ai], [wam], [lis]).specimens[0];
  s.lis.prevReport.diff.lymphocyte = '99'; s.wam.cbc.wbc = '99'; s.imaging.aiDiff.lymphocyte = '99'; s.imaging.cells[0].aiCategory = 'Blast';
  eq([lis.prevReport.lymphocyte, wam.cbc.wbc, ai.values.lymphocyte, ai.cells[0].category], ['28.0', '6.00', '30.0', 'Segmented Neutrophil']);
});

const aiCtx = vm.createContext({ console });
['src/config/config.js', 'src/constants/cell-types.js', 'src/services/ai-model.service.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/^const (\w+) =/m, 'var $1 ='), aiCtx, { filename: f }));
vm.runInContext("var AI_MODEL_MOCK_SETTINGS = { FOLDER_TO_CATEGORY: { 'blast': 'Blast', 'lymphocyte': 'Lymphocyte' }, CONFIDENCE_BY_CATEGORY: { Blast: 0.9 }, " +
  "CELL_OVERRIDES: { 'X-002': { category: 'Blast', confidence: 0.7 } }, NO_CONFIDENCE_BARCODES: [], FIXED_DIFF: { Y: { blast: '1.0' } } };", aiCtx);
const AIS = vm.runInContext('AiModelService', aiCtx);
test('AI 模型（模擬）：讀取 CellaVision 影像逐顆預分類；不認得的影像為 Unidentified；套用指定誤判與信心值', () => {
  const r = AIS.classifySpecimen({ barcode: 'X', cells: [{ cellId: 'X-001', image: 'a/blast/1.jpg' }, { cellId: 'X-002', image: 'a/lymphocyte/2.jpg' }, { cellId: 'X-003', image: 'a/other/3.jpg' }] });
  eq(r.cells, [{ cellId: 'X-001', category: 'Blast', confidence: 0.9 }, { cellId: 'X-002', category: 'Blast', confidence: 0.7 }, { cellId: 'X-003', category: 'Unidentified', confidence: null }]);
  eq([r.values, AIS.classifySpecimen({ barcode: 'Y', cells: [] }).values], [null, { blast: '1.0' }]);
});

console.log('\n進線加膠囊（第 3 節）');
test('規則 2 有 LIS 註記 → 需拉片確認，不加數位閱片', () => {
  eq(W.intakeStatus(adult({ note: true })), ['Follow-up']);
});
test('規則 2 沒有 LIS 註記 → 數位閱片', () => {
  eq(W.intakeStatus(adult({ note: false })), ['Digital Review']);
});
test('規則 3 PLT LIS-flag P、A 加血小板確認；p 與空白不加', () => {
  eq(W.intakeStatus(adult({ pltFlag: 'P' })), ['Digital Review', 'PLT Check']);
  eq(W.intakeStatus(adult({ pltFlag: 'A' })), ['Digital Review', 'PLT Check']);
  eq(W.intakeStatus(adult({ pltFlag: 'p' })), ['Digital Review']);
  eq(W.intakeStatus(adult({ pltFlag: '' })), ['Digital Review']);
});
test('規則 1～3 合併：LIS 註記＋AI 達門檻＋PLT**', () => {
  eq(W.intakeStatus(adult({ note: true, pltFlag: 'P', values: { blast: '1' } })), ['Follow-up', 'AI Alert', 'PLT Check']);
});
test('規則 1 進線依年齡判斷 AI 分類警示（10 歲 Lym 70% 不加、85% 加）', () => {
  eq(W.intakeStatus(child({ values: { lymphocyte: '70' } })), ['Digital Review']);
  eq(W.intakeStatus(child({ values: { lymphocyte: '85' } })), ['Digital Review', 'AI Alert']);
});
test('規則 6 鎖定中附加「Locked」顯示，不影響進線判斷', () => {
  eq(W.intakeStatus(adult({ locked: true })), ['Digital Review', 'Locked']);
});

console.log('\n狀態與流程（第 3～8 節）');
test('規則 1 AI 值達門檻才加 AI Alert；年齡規則即時套用', () => {
  const a = child({ values: { lymphocyte: '85' } });
  W.applyIntakeAiAlert(a);
  eq(a.review.status, ['Digital Review', 'AI Alert']);
  const b = child({ values: { lymphocyte: '70' } });
  W.applyIntakeAiAlert(b);
  eq(b.review.status, ['Digital Review']);
});
test('規則 1 單獨 PLT Check 不加 AI Alert', () => {
  const s = adult({ status: ['PLT Check'], values: { blast: '3' } });
  W.applyIntakeAiAlert(s);
  eq(s.review.status, ['PLT Check']);
});
test('規則 5 工作分流：進線 8 種組合', () => {
  const q = (note, ai, plt) => W.workQueue(adult({ status: W.intakeStatus(adult({ note: note, pltFlag: plt ? 'P' : '', values: ai ? { blast: '1' } : {} })) }));
  eq([q(false, false, false), q(false, true, false), q(false, false, true), q(false, true, true)], ['digital', 'digital', 'both', 'both']);
  eq([q(true, false, false), q(true, true, false), q(true, false, true), q(true, true, true)], ['entity', 'entity', 'entity', 'entity']);
});
test('規則 5 AI＋需拉片確認（無數位閱片）不進數位閱片清單', () => {
  const s = adult({ status: ['Follow-up', 'AI Alert'] });
  eq([W.inDigitalList(s), W.inEntityList(s)], [false, true]);
});
test('規則 5 改為人工鏡檢後只在實體作業清單；拉片完成後整體完成', () => {
  const s = adult({ status: ['Digital Review', 'AI Alert', 'Follow-up'], workflowDone: { digitalReview: true, digitalReviewSignedOff: false, aiAlertConfirmed: true, entityStatusDone: { 'Follow-up': false } } });
  eq(W.workQueue(s), 'entity');
  s.review.workflowDone.entityStatusDone['Follow-up'] = true;
  eq(W.workQueue(s), 'done');
});
test('規則 13 改為人工鏡檢後，拉片完成仍維持唯讀', () => {
  const s = adult({ status: ['Digital Review', 'Follow-up', 'PLT Check'], workflowDone: { digitalReview: true, digitalReviewSignedOff: false, entityStatusDone: { 'Follow-up': true } } });
  eq(W.isDigitalReviewReadOnly(s), true);
});
test('規則 13 只有需拉片確認的檢體：待辦時可進入閱片，處理完改唯讀', () => {
  const s = adult({ status: ['Follow-up', 'PLT Check'], workflowDone: { entityStatusDone: { 'Follow-up': false } } });
  eq(W.isDigitalReviewReadOnly(s), false);
  s.review.workflowDone.entityStatusDone['Follow-up'] = true;
  eq(W.isDigitalReviewReadOnly(s), true);
});
test('規則 9 綠色簽核：數位完成、AI 一併確認；仍有 PLT Check 時整體未完成', () => {
  const s = adult({ status: ['Digital Review', 'AI Alert', 'PLT Check'] });
  const r = W.workflowOnReportVerified(s, { confirmAiOnVerify: true });
  const after = withReview(s, r);
  eq(W.isDigitalWorkflowDone(after), true);
  eq(W.isCompleted(after), false);
  after.review.workflowDone.entityStatusDone['PLT Check'] = true;
  eq(W.isCompleted(after), true);
});
test('規則 9 開鎖強制簽核：待辦 Follow-up 一併完成', () => {
  const s = adult({ status: ['Digital Review', 'Follow-up'] });
  const r = W.workflowOnReportVerified(s, { forceUnlockSignOff: true });
  eq(r.workflowDone.entityStatusDone['Follow-up'], true);
});
test('規則 10 紅／黃／綠都可改為人工鏡檢（綠色要先開鎖）；改完後數位未簽核、影像頁唯讀', () => {
  const green = adult({ values: { lymphocyte: '30' }, status: ['Digital Review'] });
  eq(W.canSwitchToManualReview(green), true);
  eq(W.reportLockTarget(green), 'manualReview', '綠色：鎖住改為人工鏡檢');
  const red = adult({ values: { promyelocyte: '2' }, status: ['Digital Review', 'AI Alert'] });
  eq(W.canSwitchToManualReview(red), true);
  eq(W.reportLockTarget(red), 'signOff', '紅／黃：鎖住簽核');
  const st = red.review.status.concat('Follow-up');
  const after = withReview(red, { status: st, workflowDone: W.workflowAfterManualReview(red, st) });
  eq(after.review.workflowDone.digitalReviewSignedOff, false);
  eq(after.review.workflowDone.aiAlertConfirmed, true);
  eq(W.needsPendingFollowUp(after), true);
  eq(W.isDigitalReviewReadOnly(after), true);
  eq(W.canSwitchToManualReview(after), false, '已有待辦 Follow-up 不重複顯示');
  eq(W.reportLockTarget(withReview(green, { status: ['Digital Review', 'Follow-up'] })), 'signOff', '綠色但有待辦需拉片確認：鎖住簽核');
  eq(W.reportLockTarget(withReview(green, { status: ['Digital Review'], workflowDone: { digitalReview: true, digitalReviewSignedOff: true } })), null, '已簽核：沒有鎖頭');
});
test('第 4 節 勾選狀態只列出該狀態尚未完成者', () => {
  const s = adult({ status: ['Digital Review', 'PLT Check'], workflowDone: { digitalReview: true, entityStatusDone: {} } });
  eq(W.matchesStatusFilter(s, 'Digital Review'), false);
  eq(W.matchesStatusFilter(s, 'PLT Check'), true);
});
test('第 4 節 時效＝LIS 收件時間到現在經過的分鐘數；沒有收件時間為空白', () => {
  const s = adult();
  s.lis.receivedTime = '2025-08-07 10:00';
  eq(W.displayUrgency(s, new Date(2025, 7, 7, 10, 45, 30)), 45);
  eq(W.displayUrgency(s, new Date(2025, 7, 7, 9, 50)), 0, '時間早於收件時間時不為負');
  s.lis.receivedTime = '';
  eq(W.displayUrgency(s, new Date()), '');
});
test('已完成檢體：時效欄顯示 0', () => {
  const s = adult({ status: ['Digital Review', 'PLT Check'], workflowDone: { digitalReview: true, digitalReviewSignedOff: true, entityStatusDone: { 'PLT Check': true } } });
  eq(W.isCompleted(s), true);
  eq(W.displayUrgency(s, new Date()), 0);
});
test('規則 13 statusDone 由膠囊與流程旗標計算：數位閱片未完成時，標記血小板確認完成不會變成已完成', () => {
  eq(W.computeStatusDone(['Digital Review', 'PLT Check'], { entityStatusDone: { 'PLT Check': true } }), false);
  eq(W.computeStatusDone(['Digital Review', 'PLT Check'], { digitalReview: true, entityStatusDone: { 'PLT Check': true } }), true);
});
test('規則 12 已完成的檢體不可由點選膠囊取消；鎖定中不可點', () => {
  const done = adult({ status: ['Follow-up'], workflowDone: { entityStatusDone: { 'Follow-up': true } } });
  eq(W.isCompleted(done), true);
  eq(W.canToggleEntityStatus(done, 'Follow-up'), false);
  const pending = adult({ status: ['Digital Review', 'PLT Check'] });
  eq(W.canToggleEntityStatus(pending, 'PLT Check'), true);
  eq(W.canToggleEntityStatus(withReview(pending, { locked: true }), 'PLT Check'), false);
  eq(W.canToggleEntityStatus(pending, 'Follow-up'), false, '沒有的標籤不可點');
});

test('規則 12 已簽核的檢體不能在清單取消需拉片確認；血小板確認仍可標記', () => {
  const s = adult({ status: ['Follow-up', 'PLT Check', 'Digital Review'], workflowDone: { digitalReview: true, digitalReviewSignedOff: true, entityStatusDone: { 'Follow-up': true, 'PLT Check': false } } });
  eq([W.canToggleEntityStatus(s, 'Follow-up'), W.canToggleEntityStatus(s, 'PLT Check')], [false, true]);
});
test('規則 12 改為人工鏡檢交接（未簽核）者，需拉片確認仍可在清單點選完成', () => {
  const s = adult({ status: ['Digital Review', 'Follow-up'], workflowDone: { digitalReview: true, digitalReviewSignedOff: false, entityStatusDone: { 'Follow-up': false } } });
  eq(W.canToggleEntityStatus(s, 'Follow-up'), true);
});

console.log('\n所有膠囊組合（tests/state-space.js 列舉）');
const space = require('./state-space.js').enumerate();
test('列舉結果：' + space.states.length + ' 種狀態、' + space.edges.length + ' 個操作', () => {
  if (space.states.length < 20) throw new Error('狀態數異常');
});
test('沒有「未完成卻不在任何清單」的狀態', () => {
  const orphan = space.states.filter(s => !s.completed && s.queue === 'done').map(s => s.key);
  eq(orphan, []);
});
test('已完成的狀態不在待辦清單', () => {
  eq(space.states.filter(s => s.completed && s.queue !== 'done').map(s => s.key), []);
});
test('每個未完成狀態都有下一步可做', () => {
  eq(space.states.filter(s => !s.completed && s.actions.length === 0).map(s => s.key), []);
});
test('數位閱片清單中的檢體都能進入閱片', () => {
  eq(space.states.filter(s => (s.queue === 'digital' || s.queue === 'both') && !s.canEnterReview).map(s => s.key), []);
});
test('唯讀狀態不能簽核或改為人工鏡檢', () => {
  const bad = space.states.filter(s => s.readOnly && s.actions.some(a => /簽核|人工鏡檢|報告頁/.test(a))).map(s => s.key);
  eq(bad, []);
});
test('已完成的檢體在新介面不能再操作；只有已簽核的數位閱片結果可由 LIS 撤回（人工鏡檢結果與新介面無關）', () => {
  eq(space.states.filter(s => s.completed && s.actions.some(a => a !== 'LIS 撤回')).map(s => s.key), []);
  eq(space.states.filter(s => s.actions.includes('LIS 撤回') !== /DR✓簽/.test(s.key)).map(s => s.key), []);
});
test('規則 15 LIS 撤回後一律回到進線時的原始狀態', () => {
  eq(space.edges.filter(e => e.action === 'LIS 撤回' && e.to !== e.intakeKey).map(e => e.from + ' → ' + e.to), []);
});
test('已簽核的檢體不會出現需拉片確認待辦', () => {
  eq(space.states.filter(s => /DR✓簽/.test(s.key) && /FU○/.test(s.key)).map(s => s.key), []);
});
test('規則 1、7 修改留單門檻後重算 AI 分類警示：任何狀態都不會變成「未完成卻不在任何清單」', () => {
  eq(space.thresholdViolations, []);
});
test('不會出現「數位閱片待辦＋需拉片確認」（有 LIS 註記的檢體不進數位閱片）', () => {
  eq(space.states.filter(s => /DR○/.test(s.key) && /FU/.test(s.key)).map(s => s.key), []);
});

console.log('\n結果回傳 LIS（規則 14）');
function lisCase(status, extra) {
  const c = require('./state-space.js').createContext();
  const spec = c.SS.getById('S');
  spec.review = Object.assign({ status: status.slice(), workflowDone: c.W.emptyWorkflow(), statusDone: false }, extra || {});
  spec.lis.patientId = 'P1';
  spec.wam.cbc = { wbc: '6.0' };
  spec.imaging.aiDiff = { segmentedNeutrophil: '60.0', lymphocyte: '40.0', nrbc: '2' };
  return { c, spec };
}
test('簽核 → 回寫 WBC Diff%、非白血球數據（/lis/results）', () => {
  const { c } = lisCase(['Digital Review']);
  c.SS.signOffReport('S', {});
  eq(c.lisLog.map(e => e.path), ['/lis/results']);
  const b = c.lisLog[0].body;
  eq([b.barcode, b.wbcDiff.segmentedNeutrophil, b.wbcDiff.lymphocyte, b.nonWbc.nrbc, 'wbc' in b.wbcDiff], ['S', '60.0', '40.0', '2', false]);
});
test('改為人工鏡檢 → LIS 檢驗註記「需拉片確認」（規則 10）', () => {
  const { c, spec } = lisCase(['Digital Review']);
  c.LS.sendNote(spec, c.LS.NOTES.SMEAR_REQUIRED);
  eq(c.lisLog.map(e => [e.path, e.body.note]), [['/lis/notes', '需拉片確認']]);
});
test('已拉片完成 → LIS 檢驗註記「拉片完成」', () => {
  const { c } = lisCase(['Follow-up']);
  c.SS.markFollowUpDone('S');
  eq(c.lisLog.map(e => [e.path, e.body.note]), [['/lis/notes', '拉片完成']]);
});
test('清單點膠囊標記完成 → 「拉片完成」／「血小板確認完成」；取消完成時不回傳（血液組已確認）', () => {
  const { c } = lisCase(['Follow-up', 'PLT Check']);
  c.SS.toggleEntityStatus('S', 'PLT Check');
  c.SS.toggleEntityStatus('S', 'PLT Check');
  c.SS.toggleEntityStatus('S', 'Follow-up');
  eq(c.lisLog.map(e => e.body.note), ['血小板確認完成', '拉片完成']);
});
test('開鎖後直接核發（待辦需拉片確認隨簽核完成）→ 回寫結果＋註記「數位閱片替代拉片鏡檢」', () => {
  const { c } = lisCase(['Follow-up']);
  c.SS.signOffReport('S', { forceUnlockSignOff: true });
  eq(c.lisLog.map(e => [e.path, e.body.note || '']), [['/lis/results', ''], ['/lis/notes', '數位閱片替代拉片鏡檢']]);
});
test('規則 12、13 清單點血小板確認完成（數位閱片待辦）→ 檢體仍未完成、不記錄編輯人員', () => {
  const { c, spec } = lisCase(['Digital Review', 'PLT Check']);
  c.SS.toggleEntityStatus('S', 'PLT Check');
  eq([spec.review.statusDone, spec.review.editor, c.statusMap.S.statusDone], [false, '', false]);
});
test('需拉片確認已完成後才簽核 → 不再寫「數位閱片替代拉片鏡檢」', () => {
  const { c } = lisCase(['Digital Review', 'Follow-up']);
  c.SS.markFollowUpDone('S');
  c.SS.signOffReport('S', {});
  eq(c.lisLog.map(e => e.body.note || e.path), ['拉片完成', '/lis/results']);
});

console.log('\n模擬資料一致性（assets/data/sources/ → database.js）');
const dbCtx = vm.createContext({ console });
['src/config/config.js', 'src/constants/status.js', 'src/constants/cell-types.js', 'src/rules/leave-rules.js', 'src/rules/workflow-rules.js', 'src/rules/intake-merge.js',
  'src/services/ai-model.service.js', 'assets/data/sources/cellavision-db.js', 'assets/data/sources/ai-model-mock.js', 'assets/data/sources/wam.js', 'assets/data/sources/lis.js', 'assets/data/database.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8').replace(/^const (\w+) =/m, 'var $1 ='), dbCtx, { filename: f }));
const DBX = vm.runInContext('({ L: LeaveRules, W: WorkflowRules, M: IntakeMerge, DB: APP_DATABASE, AI: AiModelService, CFG: AI_MODEL_MOCK_SETTINGS, SRC: { cellavision: SOURCE_CELLAVISION, ai: AiModelService.classifyAll(SOURCE_CELLAVISION), wam: SOURCE_WAM, lis: SOURCE_LIS } })', dbCtx);
test('四份模擬資料的條碼一一對應，合併後沒有進線異常', () => {
  const ids = k => DBX.SRC[k].map(r => r.barcode).sort().join(',');
  ['ai', 'wam', 'lis'].forEach(k => eq(ids(k), ids('cellavision'), k));
  eq([DBX.DB.specimens.length, DBX.DB.intakeIssues], [DBX.SRC.cellavision.length, []]);
});
test('每筆檢體都有細胞影像，每顆都有 AI 預分類，影像檔都存在', () => {
  const bad = [];
  DBX.DB.specimens.forEach(s => {
    if (!s.imaging.cells.length) bad.push(s.barcode + ' 無細胞');
    const ai = {}; DBX.SRC.ai.find(a => a.barcode === s.barcode).cells.forEach(c => { ai[c.cellId] = 1; });
    s.imaging.cells.forEach(c => {
      if (!ai[c.cellId]) bad.push(c.cellId + ' 無 AI 結果');
      if (!fs.existsSync(path.join(__dirname, '..', c.imagePath))) bad.push(c.cellId + ' 影像不存在 ' + c.imagePath);
    });
  });
  eq(bad, []);
});
test('AI 模型模擬：每顆預分類＝範例圖所在類別資料夾（指定誤判除外）', () => {
  const bad = [];
  DBX.SRC.cellavision.forEach(r => {
    const ai = DBX.SRC.ai.find(a => a.barcode === r.barcode);
    r.cells.forEach((c, i) => {
      const want = DBX.CFG.CELL_OVERRIDES[c.cellId] ? DBX.CFG.CELL_OVERRIDES[c.cellId].category : DBX.CFG.FOLDER_TO_CATEGORY[c.image.split('/')[3]];
      if (!want || ai.cells[i].category !== want) bad.push(c.cellId);
    });
  });
  eq(bad, []);
});
test('AI 分類結果（Diff%）：除沿用研究數值的檢體外，一律由逐顆預分類計算', () => {
  const fixed = Object.keys(DBX.CFG.FIXED_DIFF);
  DBX.DB.specimens.forEach(s => {
    const calc = DBX.M.summarizeAiCells(s.imaging.cells);
    const bc = s.barcode;
    if (fixed.indexOf(bc) === -1) Object.keys(calc).forEach(k => eq(s.imaging.aiDiff[k], calc[k], bc + ' ' + k));
    else Object.keys(DBX.CFG.FIXED_DIFF[bc]).forEach(k => eq(s.imaging.aiDiff[k], DBX.CFG.FIXED_DIFF[bc][k], bc + ' ' + k));
  });
});
test('規則 2 前次報告達留單者，LIS 一定有需推片確認註記', () => {
  const bad = DBX.DB.specimens.filter(s => DBX.L.hasAnyLeave(DBX.L.prevValues(s), s) && !s.lis.smearRequiredNote).map(s => s.barcode);
  eq(bad, []);
});
test('每筆模擬檢體都有進線判斷欄位（lis.smearRequiredNote、wam.pltFlag、lis.age）與收件時間', () => {
  eq(DBX.DB.specimens.filter(s => typeof s.lis.smearRequiredNote !== 'boolean' || typeof s.wam.pltFlag !== 'string' || typeof s.lis.age !== 'number' || !s.lis.receivedTime).map(s => s.barcode), []);
});
test('合併後的檢體只有 barcode、imaging、wam、lis、review 五組；前次報告不含舊欄位', () => {
  eq(DBX.DB.specimens.filter(s => Object.keys(s).join(',') !== 'barcode,imaging,wam,lis,review').map(s => s.barcode), []);
  const keys = new Set(); DBX.DB.specimens.forEach(s => Object.keys(s.lis.prevReport.diff).forEach(k => keys.add(k)));
  eq(['neut', 'lymph', 'mono', 'eo', 'baso'].filter(k => keys.has(k)), []);
});

console.log('\n細胞類別對照（規則 8）');
test('每個細胞類別都有唯一的資料欄位，反查一致', () => {
  const keys = Object.values(C.CATEGORY_TO_METRIC_KEY);
  eq(keys.length, new Set(keys).size, '欄位 key 不重複');
});
test('Atypical Lymphocyte 對應 atypicalLymphocyte（不再併入 Abnormal Lymphocyte）', () => {
  eq(C.CATEGORY_TO_METRIC_KEY['Atypical Lymphocyte'], 'atypicalLymphocyte');
});
test('非白血球類別不含 Unidentified', () => {
  eq(C.isNonWbcCategory('Megakaryocyte'), true);
  eq(C.isNonWbcCategory('Unidentified'), false);
});

console.log('\n結果：' + pass + ' 通過，' + fail + ' 失敗\n');
process.exit(fail ? 1 : 0);
