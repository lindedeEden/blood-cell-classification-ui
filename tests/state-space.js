/**
 * 膠囊狀態空間列舉（規則 5 工作分流的完整性檢查）
 *
 * 從進線的 8 種膠囊組合（規則 1～3：有無 LIS 註記 × 有無 AI 分類警示 × 有無 PLT**）出發，
 * 依介面上實際允許的操作（與各頁按鈕的啟用條件相同）一路往下走，列出所有可能出現的膠囊／流程狀態，
 * 並計算每個狀態的工作分流（WorkflowRules.workQueue）。
 *
 * 用法：
 *   node tests/state-space.js          列出所有狀態（表格）
 *   node tests/state-space.js --json   輸出 JSON（文件產生用）
 *   tests/run-tests.js 會呼叫 enumerate() 檢查：沒有「未完成卻不在任何清單」的狀態、每個未完成狀態都有下一步可做、
 *   只有已簽核數位閱片結果可由 LIS 撤回，撤回後一律回到進線狀態
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const FILES = ['src/config/config.js', 'src/constants/status.js', 'src/constants/cell-types.js',
  'src/rules/leave-rules.js', 'src/rules/workflow-rules.js', 'assets/js/core/lis-sync.js', 'assets/js/core/specimen-store.js'];

function createContext() {
  const statusMap = {};
  const lisLog = [];   // LisSync 回寫紀錄（規則 14）
  const ctx = vm.createContext({
    console,
    // DemoStorage 替身：狀態只存在記憶體
    DemoStorage: {
      loadThresholds: () => null, saveThresholds() {}, clearThresholds() {},
      readStatusMap: () => JSON.parse(JSON.stringify(statusMap)),
      writeStatusMap: (m) => { Object.keys(statusMap).forEach(k => delete statusMap[k]); Object.assign(statusMap, m); },
      getCurrentUserAccount: () => 'tester', clearEditedResult() {},
      saveEditedDiff() {}, saveEditedCells() {}, loadEditedDiff: () => null,
      appendLisLog: (e) => lisLog.push(e),
    },
    // 一筆測試檢體（結構與合併後相同；40 歲）
    APP_DATABASE: { specimens: [{ barcode: 'S',
      imaging: { analysisTime: '2025-08-07 10:00', cells: [], aiDiff: {} },
      wam: { cbc: {}, pltFlag: '' },
      lis: { age: 40, smearRequiredNote: false, prevReport: { date: '', diff: {} } },
      review: { status: [] } }] },
  });
  FILES.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^const (\w+) =/m, 'var $1 ='), ctx, { filename: f }));
  const api = vm.runInContext('({ W: WorkflowRules, SS: SpecimenStore, LS: LisSync })', ctx);
  api.statusMap = statusMap;
  api.lisLog = lisLog;
  return api;
}

/** 狀態代號：DR／AI／FU／PLT ＋ ○待辦 ✓完成；數位閱片完成再分「簽」（已簽核）與「交接」（改為人工鏡檢） */
function stateKey(W, spec) {
  const wf = W.normalizeWorkflowDone(spec.review.workflowDone);
  const e = wf.entityStatusDone || {};
  const has = k => W.hasStatus(spec, k);
  const parts = [];
  if (has('Digital Review')) parts.push('DR' + (wf.digitalReview ? (wf.digitalReviewSignedOff ? '✓簽' : '✓交接') : '○'));
  if (has('AI Alert')) parts.push('AI' + (wf.aiAlertConfirmed ? '✓' : '○'));
  if (has('Follow-up')) parts.push('FU' + (e['Follow-up'] ? '✓' : '○'));
  if (has('PLT Check')) parts.push('PLT' + (e['PLT Check'] ? '✓' : '○'));
  return parts.join(' ');
}

function enumerate() {
  const { W, SS, statusMap } = createContext();
  const spec = SS.getById('S');
  const clone = o => JSON.parse(JSON.stringify(o));
  function load(st) {
    Object.keys(statusMap).forEach(k => delete statusMap[k]);
    spec.review = { status: st.status.slice(), workflowDone: clone(st.workflowDone), locked: false };
    spec.review.statusDone = W.computeStatusDone(spec.review.status, spec.review.workflowDone);
    // 進線資料（規則 1～3 的判斷欄位）跟著狀態走，LIS 撤回時用來重新判斷
    spec.lis.smearRequiredNote = st.intakeData.note;
    spec.wam.pltFlag = st.intakeData.pltFlag;
    spec.imaging.aiDiff = Object.assign({}, st.intakeData.aiDiff);
    spec.lis.prevReport = { date: '', diff: {} };
  }
  let current = null;
  const snapshot = () => ({ status: spec.review.status.slice(), workflowDone: W.normalizeWorkflowDone(spec.review.workflowDone), intakeData: current.intakeData, intakeKey: current.intakeKey });
  const canEnterReview = () => !spec.review.locked && !W.isDigitalReviewReadOnly(spec);   // 清單「進入閱片」按鈕可按

  // 介面上的操作與啟用條件（留單結果紅／黃／綠都可能，視醫檢師編輯而定）
  const ACTIONS = {
    '確認並簽核（綠）': () => canEnterReview() && !W.needsPendingFollowUp(spec)
      && !!SS.signOffReport('S', { confirmAiOnVerify: W.hasStatus(spec, 'AI Alert'), forceUnlockSignOff: false }),
    '開鎖後強制簽核': () => canEnterReview()
      && !!SS.signOffReport('S', { confirmAiOnVerify: false, forceUnlockSignOff: true }),
    '改為人工鏡檢': () => {
      if (!canEnterReview()) return false;
      spec.imaging.aiDiff = { blast: '1' };   // 紅色橫幅
      if (!W.canSwitchToManualReview(spec)) return false;
      SS.switchToManualReview(spec);
      return true;
    },
    '已拉片完成（報告頁）': () => canEnterReview() && W.needsPendingFollowUp(spec) && !!SS.markFollowUpDone('S'),
    '點需拉片確認膠囊': () => SS.toggleEntityStatus('S', 'Follow-up'),
    '點血小板確認膠囊': () => SS.toggleEntityStatus('S', 'PLT Check'),
    // 規則 15：只有已簽核的數位閱片結果可由 LIS 撤回（新介面沒有按鈕；withdrawFromLis 會擋下其他狀態）
    'LIS 撤回': () => !current.intake && SS.withdrawFromLis('S'),
  };

  const seen = new Map();
  const queue = [];
  const edges = [];
  // 進線：8 種組合由 WorkflowRules.intakeStatus() 產生
  [false, true].forEach(note => [false, true].forEach(ai => [false, true].forEach(plt => {
    const intake = { note: note, pltFlag: plt ? 'P' : '', aiDiff: ai ? { blast: '1' } : {} };
    const asSpec = { imaging: { analysisTime: '2025-08-07 10:00', aiDiff: intake.aiDiff }, wam: { cbc: {}, pltFlag: intake.pltFlag },
      lis: { age: 40, smearRequiredNote: note }, review: {} };
    const st = { status: W.intakeStatus(asSpec), workflowDone: W.emptyWorkflow(), intake: true, intakeData: intake };
    load(st);
    const k = stateKey(W, spec);
    st.intakeKey = k;
    if (!seen.has(k)) { seen.set(k, st); queue.push(st); }
  })));
  while (queue.length) {
    const st = queue.shift();
    Object.keys(ACTIONS).forEach((name) => {
      current = st;
      load(st);
      const from = stateKey(W, spec);
      if (!ACTIONS[name]()) return;
      const next = snapshot();
      const to = stateKey(W, spec);
      edges.push({ from, action: name, to, intakeKey: st.intakeKey });
      if (!seen.has(to)) { seen.set(to, next); queue.push(next); }
    });
  }
  const states = [];
  seen.forEach((st, key) => {
    current = st;
    load(st);
    const row = {
      key, intake: !!st.intake,
      queue: W.workQueue(spec),
      completed: W.isCompleted(spec),
      readOnly: W.isDigitalReviewReadOnly(spec),
      canEnterReview: canEnterReview(),
      intakeKey: st.intakeKey,
      actions: Object.keys(ACTIONS).filter((name) => { load(st); return ACTIONS[name](); }),
    };
    states.push(row);
  });
  // 規則 1、7：修改留單門檻後重算 AI 分類警示（SpecimenStore.recomputeAiAlerts）。
  // 從每個可到達的狀態出發，模擬門檻變更使 AI 分類警示出現或消失，檢查不會產生「未完成卻不在任何清單」的檢體。
  const thresholdViolations = [];
  seen.forEach((st, key) => {
    [{ blast: '1' }, {}].forEach((m) => {
      current = st;
      load(st);
      spec.imaging.aiDiff = m;
      SS.recomputeAiAlerts();
      // 重算後再依介面操作一路往下走，所有之後的狀態都要符合
      const start = snapshot();
      const q = [start];
      const visited = new Set([stateKey(W, spec)]);
      while (q.length) {
        const cur = q.shift();
        load(cur);
        if (!W.isCompleted(spec) && W.workQueue(spec) === 'done') {
          thresholdViolations.push({ from: key, aiWanted: !!m.blast, to: stateKey(W, spec) });
        }
        Object.keys(ACTIONS).forEach((name) => {
          if (name === 'LIS 撤回') return;
          load(cur);
          if (!ACTIONS[name]()) return;
          const k2 = stateKey(W, spec);
          if (!visited.has(k2)) { visited.add(k2); q.push(snapshot()); }
        });
      }
    });
  });
  return { states, edges, thresholdViolations };
}

module.exports = { enumerate, createContext };

if (require.main === module) {
  const { states, edges } = enumerate();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ states, edges }, null, 1));
  } else {
    const Q = { digital: '數位', entity: '實體', both: '數位＋實體', done: '—' };
    states.forEach(s => console.log((s.intake ? '進線 ' : '     ') + s.key.padEnd(24) + (Q[s.queue]).padEnd(8)
      + (s.completed ? '已完成 ' : '       ') + (s.readOnly ? '唯讀 ' : '     ') + s.actions.join('／')));
    console.log('\n狀態數 ' + states.length + '，操作 ' + edges.length);
  }
}
