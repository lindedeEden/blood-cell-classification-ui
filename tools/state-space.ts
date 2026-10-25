/**
 * 膠囊狀態空間列舉（規則 5 工作分流的完整性檢查；文件 2 附錄 D 的資料來源）
 *
 * 從進線的 8 種膠囊組合（有無 LIS 註記 × 有無 AI 分類警示 × 有無 PLT**）出發，
 * 依介面上實際允許的操作（與各頁按鈕的啟用條件相同）一路往下走，列出所有可能出現的狀態。
 *
 * 用法：npm run state-space（表格）／npm run state-space -- --json
 */
import { DEFAULT_THRESHOLDS } from '../src/domain/constants/thresholds';
import { intakeStatus } from '../src/domain/rules/intake';
import {
  canSwitchToManualReview,
  emptyWorkflow,
  hasStatus,
  isCompleted,
  isDigitalReviewReadOnly,
  needsPendingFollowUp,
  normalizeWorkflow,
  workQueue,
  type WorkQueue,
} from '../src/domain/rules/workflow';
import type { Specimen, StatusKey, WorkflowFlags } from '../src/domain/types';
import { SpecimenStore } from '../src/app/specimen-store';
import { ThresholdSettings } from '../src/app/thresholds';

interface IntakeData {
  note: boolean;
  pltFlag: string;
  aiDiff: Record<string, string>;
}
interface State {
  status: StatusKey[];
  workflowDone: WorkflowFlags;
  intake?: boolean;
  intakeData: IntakeData;
  intakeKey?: string;
}
export interface StateRow {
  key: string;
  intake: boolean;
  queue: WorkQueue;
  completed: boolean;
  readOnly: boolean;
  canEnterReview: boolean;
  intakeKey: string;
  actions: string[];
}
export interface Edge {
  from: string;
  action: string;
  to: string;
  intakeKey: string;
}

const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o)) as T;

/** 命令列（Node）沒有瀏覽器儲存：用記憶體代替 */
function ensureStorage(): void {
  if (typeof globalThis.localStorage !== 'undefined') return;
  const make = (): Storage => {
    const bag = new Map<string, string>();
    return {
      getItem: (k) => bag.get(k) ?? null,
      setItem: (k, v) => void bag.set(k, String(v)),
      removeItem: (k) => void bag.delete(k),
      clear: () => bag.clear(),
      key: (i) => Array.from(bag.keys())[i] ?? null,
      get length() {
        return bag.size;
      },
    };
  };
  Object.assign(globalThis, { localStorage: make(), sessionStorage: make() });
}

/** 狀態代號：DR／AI／FU／PLT ＋ ○待辦 ✓完成；數位閱片完成再分「簽」（已簽核）與「交接」（改為人工鏡檢） */
export function stateKey(spec: Specimen): string {
  const wf = normalizeWorkflow(spec.review.workflowDone);
  const e = wf.entityStatusDone;
  const has = (k: StatusKey) => hasStatus(spec.review, k);
  const parts: string[] = [];
  if (has('Digital Review'))
    parts.push('DR' + (wf.digitalReview ? (wf.digitalReviewSignedOff ? '✓簽' : '✓交接') : '○'));
  if (has('AI Alert')) parts.push('AI' + (wf.aiAlertConfirmed ? '✓' : '○'));
  if (has('Follow-up')) parts.push('FU' + (e['Follow-up'] ? '✓' : '○'));
  if (has('PLT Check')) parts.push('PLT' + (e['PLT Check'] ? '✓' : '○'));
  return parts.join(' ');
}

function testSpecimen(): Specimen {
  return {
    barcode: 'S',
    imaging: { analysisTime: '2025-08-07 10:00', cells: [], aiDiff: {} },
    wam: { machine: '', location: '', cbc: {}, flowDc: {}, cbcFlags: {}, flowDcFlags: [], pltFlag: '', sisRules: [] },
    lis: {
      patientId: '',
      name: '',
      gender: '',
      birthDate: '',
      age: 40,
      department: '',
      receivedTime: '',
      smearRequiredNote: false,
      prevReport: { date: '', cbc: {}, diff: {} },
    },
    review: { status: [], workflowDone: emptyWorkflow(), statusDone: false, editor: '', locked: false },
  };
}

export function enumerate(): {
  states: StateRow[];
  edges: Edge[];
  thresholdViolations: { from: string; aiWanted: boolean; to: string }[];
} {
  ensureStorage();
  localStorage.clear();
  const thresholds = new ThresholdSettings();
  const spec = testSpecimen();
  const store = new SpecimenStore({ specimens: [spec], intakeIssues: [], departments: [], machines: [] }, thresholds, {
    lis: { sendResults: async () => true, sendNote: async () => true },
    notify: () => {},
    account: () => 'tester',
  });
  let current: State;
  const load = (st: State) => {
    localStorage.clear();
    spec.review = {
      status: st.status.slice(),
      workflowDone: clone(st.workflowDone),
      statusDone: false,
      editor: '',
      locked: false,
    };
    spec.review.statusDone = isCompleted(spec.review);
    spec.lis.smearRequiredNote = st.intakeData.note;
    spec.wam.pltFlag = st.intakeData.pltFlag;
    spec.imaging.aiDiff = { ...st.intakeData.aiDiff };
    spec.lis.prevReport = { date: '', cbc: {}, diff: {} };
  };
  const snapshot = (): State => ({
    status: spec.review.status.slice(),
    workflowDone: normalizeWorkflow(spec.review.workflowDone),
    intakeData: current.intakeData,
    intakeKey: current.intakeKey,
  });
  const canEnterReview = () => !spec.review.locked && !isDigitalReviewReadOnly(spec.review);

  const ACTIONS: Record<string, () => boolean> = {
    '確認並簽核（綠）': () =>
      canEnterReview() &&
      !needsPendingFollowUp(spec.review) &&
      !!store.signOff('S', { confirmAiAlert: hasStatus(spec.review, 'AI Alert') }),
    開鎖後強制簽核: () => canEnterReview() && !!store.signOff('S', { unlocked: true }),
    改為人工鏡檢: () => {
      if (!canEnterReview()) return false;
      spec.imaging.aiDiff = { blast: '1' }; // 紅色橫幅
      if (!canSwitchToManualReview(spec.review)) return false;
      store.switchToManualReview('S');
      return true;
    },
    '已拉片完成（報告頁）': () =>
      canEnterReview() && needsPendingFollowUp(spec.review) && !!store.markFollowUpDone('S'),
    點需拉片確認膠囊: () => store.toggleEntityStatus('S', 'Follow-up'),
    點血小板確認膠囊: () => store.toggleEntityStatus('S', 'PLT Check'),
    'LIS 撤回': () => !current.intake && store.withdrawFromLis('S'),
  };

  const seen = new Map<string, State>();
  const queue: State[] = [];
  const edges: Edge[] = [];
  for (const note of [false, true])
    for (const ai of [false, true])
      for (const plt of [false, true]) {
        const intakeData: IntakeData = { note, pltFlag: plt ? 'P' : '', aiDiff: ai ? { blast: '1' } : {} };
        const asSpec = testSpecimen();
        asSpec.lis.smearRequiredNote = note;
        asSpec.wam.pltFlag = intakeData.pltFlag;
        asSpec.imaging.aiDiff = intakeData.aiDiff;
        const st: State = {
          status: intakeStatus(asSpec, DEFAULT_THRESHOLDS),
          workflowDone: emptyWorkflow(),
          intake: true,
          intakeData,
        };
        current = st;
        load(st);
        const k = stateKey(spec);
        st.intakeKey = k;
        if (!seen.has(k)) {
          seen.set(k, st);
          queue.push(st);
        }
      }
  while (queue.length) {
    const st = queue.shift() as State;
    for (const name of Object.keys(ACTIONS)) {
      current = st;
      load(st);
      const from = stateKey(spec);
      if (!ACTIONS[name]?.()) continue;
      const next = snapshot();
      const to = stateKey(spec);
      edges.push({ from, action: name, to, intakeKey: st.intakeKey ?? '' });
      if (!seen.has(to)) {
        seen.set(to, next);
        queue.push(next);
      }
    }
  }
  const states: StateRow[] = [];
  for (const [key, st] of seen) {
    current = st;
    load(st);
    states.push({
      key,
      intake: !!st.intake,
      queue: workQueue(spec.review),
      completed: isCompleted(spec.review),
      readOnly: isDigitalReviewReadOnly(spec.review),
      canEnterReview: canEnterReview(),
      intakeKey: st.intakeKey ?? '',
      actions: Object.keys(ACTIONS).filter((name) => (load(st), ACTIONS[name]?.())),
    });
  }
  // 規則 1、7：修改門檻使 AI 分類警示出現或消失後，之後的每個狀態都不能「未完成卻不在任何清單」
  const thresholdViolations: { from: string; aiWanted: boolean; to: string }[] = [];
  for (const [key, st] of seen) {
    for (const m of [{ blast: '1' }, {}]) {
      current = st;
      load(st);
      spec.imaging.aiDiff = m;
      store.recomputeAiAlerts();
      const q = [snapshot()];
      const visited = new Set([stateKey(spec)]);
      while (q.length) {
        const cur = q.shift() as State;
        load(cur);
        if (!isCompleted(spec.review) && workQueue(spec.review) === 'done') {
          thresholdViolations.push({ from: key, aiWanted: 'blast' in m, to: stateKey(spec) });
        }
        for (const name of Object.keys(ACTIONS)) {
          if (name === 'LIS 撤回') continue;
          load(cur);
          if (!ACTIONS[name]?.()) continue;
          const k2 = stateKey(spec);
          if (!visited.has(k2)) {
            visited.add(k2);
            q.push(snapshot());
          }
        }
      }
    }
  }
  return { states, edges, thresholdViolations };
}

// 命令列：npm run state-space
if (typeof process !== 'undefined' && process.argv[1] && /state-space\.ts$/.test(process.argv[1])) {
  const { states, edges } = enumerate();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ states, edges }, null, 1));
  } else {
    const Q = { digital: '數位', entity: '實體', both: '數位＋實體', done: '—' } as const;
    for (const s of states) {
      console.log(
        (s.intake ? '進線 ' : '     ') +
          s.key.padEnd(24) +
          Q[s.queue].padEnd(8) +
          (s.completed ? '已完成 ' : '       ') +
          (s.readOnly ? '唯讀 ' : '     ') +
          s.actions.join('／'),
      );
    }
    console.log(`\n狀態數 ${states.length}，操作 ${edges.length}`);
  }
}
