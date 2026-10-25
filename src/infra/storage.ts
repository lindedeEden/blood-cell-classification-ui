/**
 * 瀏覽器儲存（localStorage／sessionStorage）的唯一出入口
 *
 * 原型沒有後端，需要保存的資料都經由這裡寫進瀏覽器：
 *  - 介面偏好：字級、細胞縮放、清單模式與篩選條件
 *  - 原型暫存的業務資料：留單門檻、檢體處理狀態、人員編輯結果、LIS 回寫紀錄
 *    ⚠️ 正式系統改由後端 API 保存，只需替換本檔
 *  - 跨頁一次性訊息：返回清單後顯示的提示
 * 瀏覽器禁止儲存時（例如隱私模式）一律安靜略過，不影響畫面。
 */
import { AppConfig } from '../config';
import type { ListMode, StatusKey, WorkflowFlags } from '../domain/types';

const K = AppConfig.STORAGE_KEYS;

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}
const local = {
  get: (key: string): string | null => safe(() => localStorage.getItem(key), null),
  set: (key: string, value: string): void => safe(() => localStorage.setItem(key, value), undefined),
  remove: (key: string): void => safe(() => localStorage.removeItem(key), undefined),
  keys: (): string[] =>
    safe(() => Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i) ?? ''), []),
};
const session = {
  get: (key: string): string | null => safe(() => sessionStorage.getItem(key), null),
  set: (key: string, value: string): void => safe(() => sessionStorage.setItem(key, value), undefined),
  remove: (key: string): void => safe(() => sessionStorage.removeItem(key), undefined),
};
function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  return safe(() => JSON.parse(raw) as unknown, null);
}
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';
const isMode = (v: unknown): v is ListMode => v === 'digital' || v === 'entity';

// ─── 介面偏好 ───────────────────────────────────────────────────────

export const preferences = {
  fontLevel: () => local.get(K.FONT_LEVEL),
  setFontLevel: (level: number) => local.set(K.FONT_LEVEL, String(level)),
  cellZoom: () => local.get(K.CELL_ZOOM),
  setCellZoom: (zoom: number) => local.set(K.CELL_ZOOM, String(zoom)),

  /** 檢體管理模式；null＝未選 */
  listMode: (): ListMode | null => {
    const v = local.get(K.LIST_MODE);
    return isMode(v) ? v : null;
  },
  setListMode: (mode: ListMode | null) => (isMode(mode) ? local.set(K.LIST_MODE, mode) : local.remove(K.LIST_MODE)),
  listUiState: (): Record<string, unknown> | null => {
    const v = parseJson(local.get(K.LIST_UI_STATE));
    return isObject(v) ? v : null;
  },
  setListUiState: (state: object) => local.set(K.LIST_UI_STATE, JSON.stringify(state)),

  /** 進入影像檢視前記住清單模式，返回清單時還原 */
  rememberReturnMode: () => session.set(K.REVIEW_RETURN_MODE, preferences.listMode() || 'digital'),
  returnMode: (): ListMode | null => {
    const v = session.get(K.REVIEW_RETURN_MODE);
    return isMode(v) ? v : null;
  },
  clearReturnMode: () => session.remove(K.REVIEW_RETURN_MODE),
};

// ─── 原型暫存：留單門檻（規則 7）──────────────────────────────────────

export const thresholdStorage = {
  load: (): unknown => parseJson(local.get(K.LEAVE_THRESHOLDS)),
  save: (thresholds: object) => local.set(K.LEAVE_THRESHOLDS, JSON.stringify(thresholds)),
  clear: () => local.remove(K.LEAVE_THRESHOLDS),
};

// ─── 原型暫存：檢體處理狀態（key＝檢體條碼）──────────────────────────────

export interface StoredReview {
  status: StatusKey[];
  statusDone: boolean;
  workflowDone: WorkflowFlags;
  editor: string;
}

export const reviewStorage = {
  /** 原始內容（格式由 app/specimen-store.ts 檢查） */
  readAll: (): Record<string, unknown> => {
    const v = parseJson(local.get(K.SPECIMEN_STATUS));
    return isObject(v) ? v : {};
  },
  save: (barcode: string, entry: StoredReview) => {
    const all = reviewStorage.readAll();
    all[barcode] = entry;
    local.set(K.SPECIMEN_STATUS, JSON.stringify(all));
  },
  remove: (barcodes: readonly string[]) => {
    if (local.get(K.SPECIMEN_STATUS) == null) return;
    const all = reviewStorage.readAll();
    for (const id of barcodes) delete all[id];
    local.set(K.SPECIMEN_STATUS, JSON.stringify(all));
  },
  /** 其他分頁改了檢體狀態（storage 事件） */
  isStatusKey: (key: string | null) => key === K.SPECIMEN_STATUS,
};

// ─── 原型暫存：人員編輯結果（規則 8）─────────────────────────────────────

export const editedStorage = {
  saveCells: (barcode: string, cells: readonly object[]) => {
    if (barcode && cells.length) local.set(K.EDITED_CELLS_PREFIX + barcode, JSON.stringify(cells));
  },
  loadCells: <T>(barcode: string): T[] | null => {
    const v = parseJson(local.get(K.EDITED_CELLS_PREFIX + barcode));
    return Array.isArray(v) && v.length > 0 ? (v as T[]) : null;
  },
  removeCells: (barcode: string) => local.remove(K.EDITED_CELLS_PREFIX + barcode),
  saveDiff: (barcode: string, diff: object) => local.set(K.EDITED_DIFF_PREFIX + barcode, JSON.stringify(diff)),
  loadDiff: (barcode: string): Record<string, string> | null => {
    const v = parseJson(local.get(K.EDITED_DIFF_PREFIX + barcode));
    return isObject(v) ? (v as Record<string, string>) : null;
  },
  /** LIS 撤回時清除（規則 15） */
  clear: (barcode: string) => {
    local.remove(K.EDITED_CELLS_PREFIX + barcode);
    local.remove(K.EDITED_DIFF_PREFIX + barcode);
  },
};

// ─── 原型暫存：LIS 回寫紀錄（規則 14；開發者工具可查看）───────────────────────

export interface LisLogEntry {
  path: string;
  body: unknown;
  at: string;
}
export const lisLog = {
  read: (): LisLogEntry[] => {
    const v = parseJson(local.get(K.LIS_WRITEBACK_LOG));
    return Array.isArray(v) ? (v as LisLogEntry[]) : [];
  },
  append: (entry: LisLogEntry) =>
    local.set(K.LIS_WRITEBACK_LOG, JSON.stringify(lisLog.read().concat(entry).slice(-200))),
};

/** 登入時重設原型：清除檢體狀態、所有人員編輯結果與 LIS 回寫紀錄（留單門檻保留） */
export function resetDemoData(): void {
  local.remove(K.SPECIMEN_STATUS);
  local.remove(K.LIS_WRITEBACK_LOG);
  for (const key of local.keys()) {
    if (key.startsWith(K.EDITED_CELLS_PREFIX) || key.startsWith(K.EDITED_DIFF_PREFIX)) local.remove(key);
  }
}

// ─── 登入資訊（sessionStorage）──────────────────────────────────────

export const sessionInfo = {
  token: () => session.get(AppConfig.AUTH.TOKEN_KEY),
  setToken: (token: string) => session.set(AppConfig.AUTH.TOKEN_KEY, token),
  user: (): Record<string, unknown> | null => {
    const v = parseJson(session.get(AppConfig.AUTH.USER_KEY));
    return isObject(v) ? v : null;
  },
  setUser: (user: object) => session.set(AppConfig.AUTH.USER_KEY, JSON.stringify(user)),
  /** 登入帳號：全部完成時寫入編輯人員 */
  account: () => session.get(AppConfig.AUTH.ACCOUNT_KEY) || '',
  setAccount: (account: string) => session.set(AppConfig.AUTH.ACCOUNT_KEY, account),
  clear: () => {
    session.remove(AppConfig.AUTH.TOKEN_KEY);
    session.remove(AppConfig.AUTH.USER_KEY);
    session.remove(AppConfig.AUTH.ACCOUNT_KEY);
  },
};

// ─── 跨頁提示（返回檢體管理後顯示一次）────────────────────────────────

export interface ManualReviewToast {
  specimenId: string;
  addedFollowUp: boolean;
  lisSynced: boolean;
}
export interface DoneToast {
  specimenId: string;
  workflowCompleted: boolean;
}

function consume(key: string): Record<string, unknown> | null {
  const raw = session.get(key);
  if (!raw) return null;
  session.remove(key);
  const v = parseJson(raw);
  return isObject(v) && v.specimenId ? v : null;
}
function doneToast(key: string) {
  return {
    queue: (specimenId: string, workflowCompleted: boolean) => {
      if (specimenId) session.set(key, JSON.stringify({ specimenId, workflowCompleted }));
    },
    consume: (): DoneToast | null => {
      const v = consume(key);
      return v ? { specimenId: String(v.specimenId), workflowCompleted: !!v.workflowCompleted } : null;
    },
  };
}
export const toasts = {
  manualReview: {
    queue: (t: ManualReviewToast) => {
      if (t.specimenId) session.set(K.TOAST_MANUAL_REVIEW, JSON.stringify(t));
    },
    consume: (): ManualReviewToast | null => {
      const v = consume(K.TOAST_MANUAL_REVIEW);
      return v
        ? { specimenId: String(v.specimenId), addedFollowUp: v.addedFollowUp !== false, lisSynced: !!v.lisSynced }
        : null;
    },
  },
  followUpDone: doneToast(K.TOAST_FOLLOW_UP_DONE),
  reportVerified: doneToast(K.TOAST_REPORT_VERIFIED),
  /** 清掉所有還沒顯示的提示（登入、登出時：不帶到下一次登入） */
  clearAll: () => {
    for (const key of [K.TOAST_MANUAL_REVIEW, K.TOAST_FOLLOW_UP_DONE, K.TOAST_REPORT_VERIFIED]) session.remove(key);
  },
};

// ─── 展示用 ────────────────────────────────────────────────────────

export const demoStorage = {
  scenarioId: () => local.get(K.USABILITY_SCENARIO) || '',
  setScenarioId: (id: string) => (id ? local.set(K.USABILITY_SCENARIO, id) : local.remove(K.USABILITY_SCENARIO)),
  tutorial: () => ({
    completed: local.get(K.TUTORIAL_COMPLETED) === '1',
    phase: local.get(K.TUTORIAL_PHASE) || '',
    step: parseInt(local.get(K.TUTORIAL_STEP) || '0', 10),
  }),
  setTutorial: (completed: boolean | undefined, phase: string | undefined, step: number | undefined) => {
    if (completed !== undefined) local.set(K.TUTORIAL_COMPLETED, completed ? '1' : '');
    if (phase !== undefined) local.set(K.TUTORIAL_PHASE, phase);
    if (step !== undefined) local.set(K.TUTORIAL_STEP, String(step));
  },
};
