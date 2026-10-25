/**
 * 舊版（純 JS 原型）行為擷取：產生新舊對照測試用的「標準答案」
 *
 * 用法：node tools/legacy-capture/capture-domain.cjs <舊版專案資料夾> [輸出檔]
 *   預設輸出 tests/parity/golden/domain.json
 *
 * 只在搬遷時執行一次；新版的 tests/parity/*.test.ts 讀取輸出的 JSON，
 * 以同一組輸入跑新版程式，結果必須與舊版完全相同（SPEC 第 8 節「新舊對照」）。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LEGACY = path.resolve(process.argv[2] || '');
const OUT = path.resolve(process.argv[3] || path.join(__dirname, '../../tests/parity/golden/domain.json'));
if (!fs.existsSync(path.join(LEGACY, 'src/rules/workflow-rules.js'))) {
  console.error('請指定舊版專案資料夾，例如：node tools/legacy-capture/capture-domain.cjs ../血球分類軟體介面設計專案');
  process.exit(1);
}
const read = (f) => fs.readFileSync(path.join(LEGACY, f), 'utf8').replace(/^const (\w+) =/m, 'var $1 =');
const clone = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));

/** 依瀏覽器載入順序建立舊版執行環境（瀏覽器儲存以記憶體替身代替） */
function legacyContext(opts) {
  opts = opts || {};
  const ls = {};
  const account = opts.account === undefined ? 'tester' : opts.account;
  const ss = account ? { 'blood-morphology-user-account': account } : {};
  const lisLog = [];
  const storage = (bag) => ({
    getItem: (k) => (k in bag ? bag[k] : null),
    setItem: (k, v) => {
      bag[k] = String(v);
    },
    removeItem: (k) => {
      delete bag[k];
    },
    key: (i) => Object.keys(bag)[i] || null,
    get length() {
      return Object.keys(bag).length;
    },
  });
  const ctx = vm.createContext({
    console: { warn() {}, log() {}, error() {} },
    localStorage: storage(ls),
    sessionStorage: storage(ss),
    JSON,
    Object,
    Array,
    Math,
    Date,
    String,
    Number,
    parseFloat,
    parseInt,
    isNaN,
    isFinite,
    Promise,
    Set,
    Map,
    RegExp,
    setTimeout,
    clearTimeout,
  });
  const files = [
    'src/config/config.js',
    'src/constants/cell-types.js',
    'src/constants/status.js',
    'src/rules/leave-rules.js',
    'src/rules/workflow-rules.js',
    'src/rules/intake-merge.js',
    'src/services/ai-model.service.js',
    'assets/data/sources/cellavision-db.js',
    'assets/data/sources/ai-model-mock.js',
    'assets/data/sources/wam.js',
    'assets/data/sources/lis.js',
    'assets/data/database.js',
    'assets/js/core/storage.js',
    'assets/js/core/lis-sync.js',
    'assets/js/core/specimen-store.js',
    'assets/js/core/ui-common.js',
  ];
  if (opts.beforeStore) opts.beforeStore(ctx, ls);
  files.forEach((f) => {
    if (f === 'assets/js/core/specimen-store.js' && opts.seed) opts.seed(ctx, ls);
    vm.runInContext(read(f), ctx, { filename: f });
  });
  // LIS 回寫紀錄：攔截 DemoStorage.appendLisLog（去掉時間戳記以便比對）
  vm.runInContext(
    'DemoStorage.appendLisLog = function (e) { __lisLog.push({ path: e.path, body: JSON.parse(JSON.stringify(e.body)) }); };',
    Object.assign(ctx, { __lisLog: lisLog }),
  );
  const g = vm.runInContext(
    '({ AppConfig, CellConstants, StatusConstants, LeaveRules, WorkflowRules, IntakeMerge, AiModelService, SpecimenStore, LisSync, AppUi, DemoStorage, APP_DATABASE, SOURCE_CELLAVISION, SOURCE_WAM, SOURCE_LIS })',
    ctx,
  );
  g.ctx = ctx;
  g.ls = ls;
  g.ss = ss;
  g.lisLog = lisLog;
  return g;
}

/** 從舊版頁面程式擷取純計算函式（影像檢視、檢體管理），在同一個執行環境中執行 */
function extractFunctions(g, file, names, prelude) {
  const src = fs.readFileSync(path.join(LEGACY, file), 'utf8');
  const parts = names.map((n) => {
    const start = src.indexOf('function ' + n + '(');
    if (start < 0) throw new Error('找不到函式 ' + n);
    let i = src.indexOf('{', start),
      depth = 0;
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}' && --depth === 0) break;
    }
    return src.slice(start, i + 1);
  });
  const code =
    '(function(){ ' +
    (prelude || '') +
    '\n' +
    parts.join('\n') +
    '\n return {' +
    names.map((n) => n + ':' + n).join(',') +
    ', __set: function(k, v){ eval(k + " = v"); }, __get: function(k){ return eval(k); } }; })()';
  return vm.runInContext(code, g.ctx);
}

const out = {};

// ─── 1. 進線與合併（第 2 節）────────────────────────────────────────────
{
  const g = legacyContext();
  const M = g.IntakeMerge;
  out.intakeReal = clone(
    M.mergeByBarcode({
      cellavision: g.SOURCE_CELLAVISION,
      ai: g.AiModelService.classifyAll(g.SOURCE_CELLAVISION),
      wam: g.SOURCE_WAM,
      lis: g.SOURCE_LIS,
    }),
  );
  const cv = clone(g.SOURCE_CELLAVISION.slice(0, 3));
  const ai = g.AiModelService.classifyAll(cv);
  const wam = clone(g.SOURCE_WAM.slice(0, 3));
  const lis = clone(g.SOURCE_LIS.slice(0, 3));
  const synthetic = {
    cellavision: cv.concat([
      { barcode: ' h5080720847 ', analysisTime: 'x', cells: [] },
      { barcode: 'BAD', cells: [] },
      {
        barcode: 'H9999999999',
        analysisTime: '2025-08-07 09:00',
        cells: [{ cellId: 'Z-1', image: 'assets/images/cells/blast/x.jpg' }],
      },
    ]),
    ai: ai.concat([{ barcode: 'H9999999999', cells: [], values: null }]),
    wam: wam.concat([clone(wam[1])]),
    lis: lis.concat([{ barcode: null }]),
  };
  out.intakeSynthetic = { input: clone(synthetic), output: clone(M.mergeByBarcode(synthetic)) };
  out.aiClassifyAll = clone(g.AiModelService.classifyAll(g.SOURCE_CELLAVISION));
  out.summarize = [];
  const cats = g.CellConstants.REVIEW_CATEGORY_ORDER;
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let n = 0; n < 60; n++) {
    const len = Math.floor(rnd() * 120);
    const cells = [];
    for (let i = 0; i < len; i++) cells.push({ aiCategory: cats[Math.floor(rnd() * cats.length)] });
    out.summarize.push({ cells, result: clone(M.summarizeAiCells(cells)) });
  }
  out.normalizeBarcode = [' h5080720847 ', 'H5080720847', null, undefined, 'ab c', 12345].map((v) => [
    v === undefined ? '__undef' : v,
    M.normalizeBarcode(v),
  ]);
}

// ─── 2. 初始化後的檢體狀態與各項衍生值 ─────────────────────────────────
const NOW = new Date(2025, 7, 7, 22, 15, 0, 0);
function derived(g, spec) {
  const L = g.LeaveRules,
    W = g.WorkflowRules,
    U = g.AppUi;
  const statuses = ['Digital Review', 'AI Alert', 'Follow-up', 'PLT Check', 'Verified', 'Locked'];
  return clone({
    review: spec.review,
    intakeStatus: W.intakeStatus(spec),
    aiValues: L.aiValues(spec),
    prevValues: L.prevValues(spec),
    effectiveValues: L.effectiveValues(spec),
    riskState: L.riskState(spec),
    shouldHaveAiAlert: L.shouldHaveAiAlert(spec),
    ageYears: L.getAgeYears(spec),
    isPediatric: L.isPediatric(spec),
    isDigitalReviewDone: W.isDigitalReviewDone(spec),
    isAiAlertConfirmed: W.isAiAlertConfirmed(spec),
    isEntityReviewDone: W.isEntityReviewDone(spec),
    isCompleted: W.isCompleted(spec),
    needsPendingFollowUp: W.needsPendingFollowUp(spec),
    isHandoffToFollowUp: W.isHandoffToFollowUp(spec),
    isDigitalReviewReadOnly: W.isDigitalReviewReadOnly(spec),
    isAiAlertWithFollowUp: W.isAiAlertWithFollowUp(spec),
    inDigitalList: W.inDigitalList(spec),
    inEntityList: W.inEntityList(spec),
    workQueue: W.workQueue(spec),
    matchesStatusFilter: statuses.map((s) => W.matchesStatusFilter(spec, s)),
    capsules: (spec.review.status || []).map((s) => U.capsuleInfo(spec, s)),
    canToggle: ['PLT Check', 'Follow-up'].map((s) => W.canToggleEntityStatus(spec, s)),
    urgency: W.displayUrgency(spec, NOW),
    canSwitchToManualReview: W.canSwitchToManualReview(spec),
    reportLockTarget: W.reportLockTarget(spec),
    analysisRows: U.analysisRows(spec),
    prevHeader: U.prevReportHeaderLabel(spec, '前次報告'),
    prevHeaderPct: U.prevReportHeaderLabel(spec, '前次報告(%)'),
    flowDc: ['wbc', 'plt', 'band', 'segmentedNeutrophil', 'blast', 'nrbc', 'giantPlt'].map((k) =>
      U.flowDcValue(spec, k),
    ),
    resultsPayload: g.LisSync.resultsPayload(spec),
  });
}
{
  const g = legacyContext();
  out.initial = g.SpecimenStore.all().map((s) => ({ barcode: s.barcode, ...derived(g, s) }));
  out.departments = clone(g.APP_DATABASE.departments);
  out.machines = clone(g.APP_DATABASE.machines);
}

// ─── 3. 門檻：isLeave／thresholdFor 格點、setThresholds 輸入檢查 ─────────
{
  const g = legacyContext();
  const L = g.LeaveRules;
  const keys = Object.keys(L.DEFAULTS).concat(['plt', 'nrbc', 'unknownKey']);
  const values = [
    '-',
    '',
    null,
    undefined,
    '0',
    '0.0',
    '0.1',
    '1',
    '4.9',
    '5',
    '9.99',
    '10',
    '10,5',
    '19.9',
    '20',
    '29.99',
    '30',
    '59.9',
    '60',
    '79.9',
    '80',
    'abc',
    ' 7 ',
    0,
    5,
    100,
    -1,
  ];
  const ages = [null, 0, 10, 17.9, 18, 40, 'x'];
  out.isLeaveGrid = [];
  ages.forEach((age) => {
    const spec = { lis: { age } };
    keys.forEach((k) => {
      out.isLeaveGrid.push({
        age,
        key: k,
        threshold: L.thresholdFor(k, spec) === undefined ? '__undef' : L.thresholdFor(k, spec),
        results: values.map((v) => L.isLeave(k, v, spec)),
      });
    });
  });
  out.isLeaveValues = values.map((v) => (v === undefined ? '__undef' : v));
  out.parseNum = values.map((v) => [v === undefined ? '__undef' : v, L.parseNum(v)]);
  out.parseDate = [
    '2025-08-07',
    '2025/8/7 9:05',
    '2025-08-07T10:30',
    '2025-13-40',
    'abc',
    '',
    null,
    '2025-08-07 22',
  ].map((v) => {
    const d = L.parseDate(v);
    return [v, d ? [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()] : null];
  });
  const variants = [
    {},
    { wbc: 20 },
    { wbc: '25,5' },
    { lymphocyte: 50, lymphocytePediatric: 70 },
    { blast: 5, promyelocyte: 'present' },
    { monocyte: -1, eosinophil: 'abc', basophil: '' },
    { megakaryocyte: 3 },
    { notAKey: 1, myelocyte: 1 },
    null,
    'str',
  ];
  out.setThresholds = variants.map((v) => {
    L.resetThresholds();
    return { input: v, result: clone(L.setThresholds(v)) };
  });
  L.resetThresholds();
  out.defaults = clone(L.DEFAULTS);
  out.keyOrder = clone(L.KEY_ORDER);
  out.labels = clone(L.LABELS);
}

// ─── 4. 修改門檻後重算 AI 分類警示（規則 7） ────────────────────────────
{
  const variants = [
    { wbc: 5 },
    {
      wbc: 100,
      lymphocyte: 100,
      lymphocytePediatric: 100,
      monocyte: 100,
      eosinophil: 100,
      basophil: 100,
      atypicalLymphocyte: 100,
      myelocyte: 100,
      metamyelocyte: 100,
      hypersegmented: 100,
    },
    { lymphocyte: 10 },
  ];
  out.recompute = variants.map((v) => {
    const g = legacyContext();
    g.LeaveRules.setThresholds(v);
    g.SpecimenStore.recomputeAiAlerts();
    return {
      thresholds: v,
      specimens: g.SpecimenStore.all().map((s) => ({
        barcode: s.barcode,
        status: clone(s.review.status),
        statusDone: s.review.statusDone,
        riskState: clone(g.LeaveRules.riskState(s)),
        lock: g.WorkflowRules.reportLockTarget(s),
      })),
    };
  });
}

// ─── 5. 各檢體逐一套用每個動作（規則 9～12、15） ──────────────────────────
const ACTIONS = [
  ['signOff', (g, id) => g.SpecimenStore.signOffReport(id, {})],
  ['signOffConfirmAi', (g, id) => g.SpecimenStore.signOffReport(id, { confirmAiOnVerify: true })],
  ['signOffForce', (g, id) => g.SpecimenStore.signOffReport(id, { forceUnlockSignOff: true })],
  ['manualReview', (g, id) => g.SpecimenStore.switchToManualReview(g.SpecimenStore.getById(id))],
  ['followUpDone', (g, id) => g.SpecimenStore.markFollowUpDone(id)],
  ['toggleFU', (g, id) => g.SpecimenStore.toggleEntityStatus(id, 'Follow-up')],
  ['togglePLT', (g, id) => g.SpecimenStore.toggleEntityStatus(id, 'PLT Check')],
  ['withdraw', (g, id) => g.SpecimenStore.withdrawFromLis(id)],
];
function runSequence(seq, account) {
  const g = legacyContext({ account });
  const ids = g.SpecimenStore.all().map((s) => s.barcode);
  return ids.map((id) => {
    const g2 = legacyContext({ account });
    const steps = seq.map((name) => {
      const fn = ACTIONS.find((a) => a[0] === name)[1];
      const before = g2.lisLog.length;
      const ret = fn(g2, id);
      const spec = g2.SpecimenStore.getById(id);
      return {
        action: name,
        ret: ret && typeof ret === 'object' && ret.barcode ? '__spec' : clone(ret === undefined ? '__undef' : ret),
        review: clone(spec.review),
        lis: clone(g2.lisLog.slice(before)),
        stored: JSON.parse(g2.ls['blood-morphology-specimen-status'] || '{}')[id] || null,
      };
    });
    return { barcode: id, steps };
  });
}
out.actions = {};
ACTIONS.forEach(([name]) => {
  out.actions[name] = runSequence([name]);
});
out.sequences = {};
[
  ['manualReview', 'followUpDone'],
  ['manualReview', 'toggleFU', 'toggleFU'],
  ['signOff', 'withdraw'],
  ['signOffForce', 'withdraw', 'signOff'],
  ['togglePLT', 'togglePLT', 'togglePLT'],
  ['toggleFU', 'signOffForce', 'toggleFU'],
  ['signOffConfirmAi', 'togglePLT', 'withdraw'],
  ['manualReview', 'withdraw', 'signOff'],
  ['followUpDone', 'signOff'],
].forEach((seq) => {
  out.sequences[seq.join('>')] = runSequence(seq);
});
out.sequencesNoAccount = runSequence(['signOffConfirmAi', 'togglePLT', 'toggleFU'], '');

// ─── 6. 已保存狀態的讀回（applyStoredStatus／init 的容錯） ─────────────────
{
  const seeds = [
    {
      H5080720847: {
        status: ['Digital Review', 'AI Alert'],
        workflowDone: { digitalReview: true, digitalReviewSignedOff: true, aiAlertConfirmed: true },
        editor: 'X',
        statusDone: true,
      },
    },
    { H5080720847: { status: 'bad' }, H5080720276: null, NOPE: { status: [] } },
    {
      H5080720647: {
        status: ['Digital Review', 'PLT Check'],
        workflowDone: { entityStatusDone: { 'PLT Check': 1, Junk: true } },
        editor: 5,
      },
    },
  ];
  out.stored = seeds.map((seed) => {
    const g = legacyContext({
      seed: (ctx, ls) => {
        ls['blood-morphology-specimen-status'] = JSON.stringify(seed);
      },
    });
    return { seed, specimens: g.SpecimenStore.all().map((s) => ({ barcode: s.barcode, review: clone(s.review) })) };
  });
  const g = legacyContext({
    seed: (ctx, ls) => {
      ls['blood-morphology-leave-thresholds'] = JSON.stringify({ wbc: 5, blast: 'present', monocyte: 'x' });
    },
  });
  out.storedThresholds = {
    thresholds: clone(g.LeaveRules.getThresholds()),
    statuses: g.SpecimenStore.all().map((s) => clone(s.review.status)),
  };
}

// ─── 7. LIS 回寫內容（規則 14）：人員編輯值各種情形 ─────────────────────────
{
  const g = legacyContext();
  const edits = [
    null,
    {},
    { lymphocyte: '70' },
    { blast: '-', segmentedNeutrophil: '90', nrbc: '3' },
    { wbc: '99', plt: '1' },
  ];
  out.resultsPayload = g.SpecimenStore.all()
    .slice(0, 12)
    .map((s) => ({
      barcode: s.barcode,
      variants: edits.map((e) => {
        const spec = clone(s);
        if (e) spec.review.editedDiff = e;
        else delete spec.review.editedDiff;
        return {
          edited: e,
          payload: clone(g.LisSync.resultsPayload(spec)),
          effective: clone(g.LeaveRules.effectiveValues(spec)),
          risk: clone(g.LeaveRules.riskState(spec)),
        };
      }),
    }));
}

// ─── 8. 膠囊狀態空間（規則 5，沿用舊版 tests/state-space.js） ──────────────
{
  const ss = require(path.join(LEGACY, 'tests/state-space.js'));
  out.stateSpace = clone(ss.enumerate());
}

// ─── 9. 影像檢視頁的計算（人員編輯值、類別排序、達門檻判斷） ───────────────
{
  const g = legacyContext();
  const fx = extractFunctions(
    g,
    'assets/js/pages/image-review.js',
    [
      'getWbcDenominator',
      'computeEditedDiffFromCells',
      'isLeaveConditionReachedByCurrentCells',
      'getSortedCategoryOrder',
      'toAiSuggestion',
    ],
    'var CC = CellConstants; var currentSpecimen = null; var cellData = []; var __saved = null; var SpecimenStore = { saveEditedResult: function (s, e) { __saved = e; } }; function __get(){ return __saved; }',
  );
  const cats = g.CellConstants.REVIEW_CATEGORY_ORDER;
  let seed = 11;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const specs = g.SpecimenStore.all();
  out.imageReview = [];
  for (let n = 0; n < 80; n++) {
    const spec = specs[n % specs.length];
    const len = n === 0 ? 0 : Math.floor(rnd() * 150);
    const cells = [];
    for (let i = 0; i < len; i++)
      cells.push({ id: 'cell-' + (i + 1), category: cats[Math.floor(rnd() * cats.length)] });
    fx.__set('currentSpecimen', spec);
    fx.__set('cellData', cells);
    fx.__set('__saved', null);
    fx.computeEditedDiffFromCells();
    const saved = fx.__get('__saved');
    const byCat = {};
    cells.forEach((c) => {
      (byCat[c.category] = byCat[c.category] || []).push(c);
    });
    const total = fx.getWbcDenominator(cells);
    out.imageReview.push({
      barcode: spec.barcode,
      cells: cells.map((c) => c.category),
      edited: clone(saved),
      total,
      order: clone(fx.getSortedCategoryOrder(byCat, total)),
      leaveHit: cats.map((c) =>
        byCat[c]
          ? fx.isLeaveConditionReachedByCurrentCells(c, byCat[c].length, total ? (byCat[c].length / total) * 100 : 0)
          : null,
      ),
    });
  }
  out.aiSuggestion = [
    { aiCategory: 'Segmented Neutrophil', aiConfidence: 0.92 },
    { aiCategory: 'Blast', aiConfidence: 0.876 },
    { aiCategory: 'Band', aiConfidence: null },
    { aiCategory: 'Unidentified', aiConfidence: 0 },
  ].map((c) => [c, clone(fx.toAiSuggestion(c))]);
}

// ─── 10. 檢體管理頁的篩選與排序 ─────────────────────────────────────────
{
  const g = legacyContext();
  const fx = extractFunctions(
    g,
    'assets/js/pages/specimen-list.js',
    ['currentTime', 'matchesFilters', 'compareSpecimens'],
    'var WR = WorkflowRules; var currentMode = null; var sortKey = "time"; var sortAsc = false; var PAGE_OPENED_AT = Date.now();',
  );
  const specs = g.SpecimenStore.all();
  const filters = [
    { statuses: ['PLT Check', 'AI Alert', 'Follow-up', 'Digital Review', 'Verified', 'Locked'] },
    { statuses: ['Digital Review', 'AI Alert'] },
    { statuses: ['Follow-up', 'PLT Check'] },
    { statuses: [] },
    { statuses: ['Verified'] },
    { statuses: ['Locked'] },
    { search: '0647', statuses: [] },
    { search: 'h5080720647', exactMatch: true, statuses: [] },
    { search: '21415340', exactMatch: true, statuses: [] },
    { department: '心臟外科', statuses: [] },
    { machine: 'DI2', statuses: [] },
    { dateStart: '2025-08-08', statuses: [] },
    { dateEnd: '2025-08-06', statuses: [] },
  ];
  out.listFilter = [];
  [null, 'digital', 'entity'].forEach((mode) => {
    fx.__set('currentMode', mode);
    filters.forEach((f) => {
      const full = Object.assign(
        { dateStart: '2025-08-07', dateEnd: '2025-08-07', department: '', machine: '', search: '', exactMatch: false },
        f,
      );
      out.listFilter.push({
        mode,
        filter: full,
        ids: specs.filter((s) => fx.matchesFilters(s, full)).map((s) => s.barcode),
      });
    });
  });
  out.listSort = [];
  ['id', 'time', 'urgency'].forEach((key) =>
    [true, false].forEach((asc) => {
      fx.__set('sortKey', key);
      fx.__set('sortAsc', asc);
      out.listSort.push({
        key,
        asc,
        ids: specs
          .slice()
          .sort(fx.compareSpecimens)
          .map((s) => s.barcode),
      });
    }),
  );
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('已輸出 ' + path.relative(process.cwd(), OUT) + '（' + Math.round(fs.statSync(OUT).size / 1024) + ' KB）');
