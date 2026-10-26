/**
 * 登入、登出、頁面登入檢查
 * 帳密驗證在後端（原型由 api.ts 的模擬路由代替）；前端只存 Token 於 sessionStorage。
 * 不做閒置自動登出（2026-10-26 Eden 決定：醫檢師離開電腦後被登出，反而造成現場困擾）。
 */
import { AppConfig } from '../config';
import { api, setSessionExpiredHandler, type ApiError } from './api';
import { demoStorage, resetDemoData, sessionInfo, toasts } from './storage';

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

/** 登出：manual＝使用者按登出；session_expired＝後端回覆登入已失效（401） */
export function logout(reason: 'manual' | 'session_expired' = 'manual'): void {
  sessionInfo.clear();
  toasts.clearAll();
  resetDemoData(); // 共用電腦：登出後不在瀏覽器留下病人資料（處理狀態、人員編輯結果、LIS 回寫紀錄）
  api.post('/auth/logout', {}).catch(() => {}); // 通知後端 Token 失效
  window.location.href = AppConfig.ROUTES.LOGIN + (reason === 'session_expired' ? '?expired=1' : '');
}

/** 頁面守衛：未登入立即導回登入頁（防止直接輸入網址跳過登入）。回傳是否已登入 */
export function requireAuth(): boolean {
  if (sessionInfo.token()) return true;
  window.location.href = AppConfig.ROUTES.LOGIN + '?redirect=' + encodeURIComponent(window.location.href);
  return false;
}

/** 目前登入的使用者（後端回傳 { id, name, role }） */
export function currentUser(): { id?: string; name?: string; role?: string } | null {
  return sessionInfo.user() as { id?: string; name?: string; role?: string } | null;
}

setSessionExpiredHandler(() => logout('session_expired'));
