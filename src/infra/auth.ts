/**
 * 登入、登出、閒置自動登出、頁面登入檢查
 * 帳密驗證在後端（原型由 api.ts 的模擬路由代替）；前端只存 Token 於 sessionStorage。
 */
import { AppConfig } from '../config';
import { api, setSessionExpiredHandler, type ApiError } from './api';
import { demoStorage, resetDemoData, sessionInfo, toasts } from './storage';

const { SESSION_TIMEOUT_MS, IDLE_CHECK_INTERVAL_MS } = AppConfig.AUTH;

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export async function login(account: string, password: string): Promise<LoginResult> {
  // 先清掉舊的登入資訊（例：按上一頁回到登入頁）；否則密碼打錯的 401 會被當成登入逾期而自動登出
  sessionInfo.clear();
  toasts.clearAll();
  try {
    const result = (await api.post('/auth/login', { account, password })) as { token?: string; user?: object };
    if (!result.token) throw new Error('伺服器未回傳 Token');
    sessionInfo.setToken(result.token);
    sessionInfo.setUser(result.user ?? {});
    // 編輯人員：模擬登入已記下登入帳號；正式環境用後端回傳的使用者代號（沒有時用登入帳號）
    if (!sessionInfo.account())
      sessionInfo.setAccount(String((result.user as { id?: string } | undefined)?.id ?? account));
    demoStorage.setScenarioId(''); // 每次登入都從正式清單開始
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as ApiError | Error).message || '登入失敗，請稍後再試' };
  }
}

export function logout(reason: 'manual' | 'idle_timeout' = 'manual'): void {
  sessionInfo.clear();
  toasts.clearAll();
  resetDemoData(); // 共用電腦：登出後不在瀏覽器留下病人資料（處理狀態、人員編輯結果、LIS 回寫紀錄）
  api.post('/auth/logout', {}).catch(() => {}); // 通知後端 Token 失效
  window.location.href = AppConfig.ROUTES.LOGIN + (reason === 'idle_timeout' ? '?expired=1' : '');
}

/** 頁面守衛：未登入立即導回登入頁（防止直接輸入網址跳過登入）。回傳是否已登入 */
export function requireAuth(): boolean {
  if (sessionInfo.token()) return true;
  window.location.href = AppConfig.ROUTES.LOGIN + '?redirect=' + encodeURIComponent(window.location.href);
  return false;
}

let lastActivity = Date.now();
/** 記下使用者有操作（內嵌視窗轉來的操作也由這裡記錄） */
export function noteActivity(): void {
  lastActivity = Date.now();
}

/** 使用者操作的事件（閒置計時用） */
export const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'touchstart'] as const;

/** 閒置 30 分鐘自動登出：每個需要登入的最外層頁面都要啟動 */
export function startIdleWatcher(): void {
  lastActivity = Date.now();
  const touch = noteActivity;
  for (const evt of ACTIVITY_EVENTS) document.addEventListener(evt, touch, { passive: true });
  setInterval(() => {
    if (Date.now() - lastActivity > SESSION_TIMEOUT_MS) logout('idle_timeout');
  }, IDLE_CHECK_INTERVAL_MS);
}

/** 目前登入的使用者（後端回傳 { id, name, role }） */
export function currentUser(): { id?: string; name?: string; role?: string } | null {
  return sessionInfo.user() as { id?: string; name?: string; role?: string } | null;
}

setSessionExpiredHandler(() => logout('idle_timeout'));
