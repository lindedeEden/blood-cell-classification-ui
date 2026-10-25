/**
 * 前端與後端之間的唯一 HTTP 出入口
 *  - ENV = 'development'：使用下方「模擬路由」，不需要後端
 *  - ENV = 'production' ：呼叫 API_BASE_URL 的真實 REST API（附加 Token、逾時、統一錯誤格式）
 *
 * 原型實際呼叫的路由：
 *  POST /auth/login、POST /auth/logout   登入／登出
 *  POST /lis/results                    簽核後回寫 WBC Diff%、非白血球數據（規則 14）
 *  POST /lis/notes                      回寫 LIS 檢驗註記（規則 10、14）
 * 正式系統規劃的其他路由見 docs/ARCHITECTURE.md。
 */
import { AppConfig } from '../config';
import { resetDemoData, sessionInfo } from './storage';

export interface ApiError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'SERVER_ERROR' | 'HTTP_ERROR' | 'TIMEOUT' | 'NETWORK_ERROR';
  message: string;
  detail?: unknown;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** 收到 401 且已登入（登入逾期）時要做的事；由 auth.ts 設定，避免互相 import */
let onSessionExpired: () => void = () => {};
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

function httpError(status: number, body: { message?: string } | undefined): ApiError {
  if (status === 401) {
    if (sessionInfo.token()) {
      onSessionExpired();
      return { code: 'UNAUTHORIZED', message: '認證已過期，請重新登入' };
    }
    return { code: 'UNAUTHORIZED', message: body?.message || '帳號或密碼錯誤' };
  }
  if (status === 403) return { code: 'FORBIDDEN', message: '您沒有執行此操作的權限' };
  if (status === 404) return { code: 'NOT_FOUND', message: '找不到請求的資源' };
  if (status >= 500) return { code: 'SERVER_ERROR', message: '伺服器發生錯誤，請稍後重試', detail: body };
  return { code: 'HTTP_ERROR', message: body?.message || `請求失敗 (${status})` };
}

// ─── 真實 HTTP 請求 ───────────────────────────────────────────────

async function realRequest(method: Method, path: string, body?: unknown): Promise<unknown> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = sessionInfo.token();
  if (token) headers.Authorization = 'Bearer ' + token;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AppConfig.API_TIMEOUT_MS);
  try {
    const res = await fetch(AppConfig.API_BASE_URL + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    if (!res.ok) throw httpError(res.status, data);
    return data;
  } catch (err) {
    if ((err as Error)?.name === 'AbortError')
      throw { code: 'TIMEOUT', message: '請求逾時，請確認網路狀態' } satisfies ApiError;
    if ((err as ApiError)?.code) throw err;
    throw { code: 'NETWORK_ERROR', message: '網路連線失敗，請確認網路狀態' } satisfies ApiError;
  } finally {
    clearTimeout(timer);
  }
}

// ─── 模擬路由（開發模式；上線時刪除此區塊）──────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** ⚠️ 原型的測試帳號，上線時完全移除：驗證只能在後端 */
const DEMO_ACCOUNTS: Record<string, { password: string; user: { id: string; name: string; role: string } }> = {
  admin: { password: 'admin', user: { id: 'F12630E', name: '管理員', role: 'admin' } },
  user: { password: 'user', user: { id: 'F99999', name: '一般使用者', role: 'staff' } },
};

interface MockRoute {
  method: Method;
  pattern: RegExp;
  handler: (body: Record<string, unknown>) => Promise<unknown>;
}

const mockRoutes: MockRoute[] = [
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: async (body) => {
      await delay(300);
      const account = DEMO_ACCOUNTS[String(body.account)];
      if (!account || account.password !== body.password) throw httpError(401, { message: '帳號或密碼錯誤' });
      // 原型：記下登入帳號（全部完成時寫入編輯人員），並把檢體狀態重設回模擬資料的原始狀態
      sessionInfo.setAccount(String(body.account));
      resetDemoData();
      return { token: 'mock_jwt_' + Date.now(), user: account.user };
    },
  },
  { method: 'POST', pattern: /^\/auth\/logout$/, handler: async () => (await delay(50), { ok: true }) },
  {
    method: 'POST',
    pattern: /^\/lis\/results$/,
    handler: async (body) => (
      await delay(200),
      { ok: true, barcode: body.barcode, syncedAt: new Date().toISOString() }
    ),
  },
  {
    method: 'POST',
    pattern: /^\/lis\/notes$/,
    handler: async (body) => (
      await delay(200),
      {
        ok: true,
        barcode: body.barcode,
        patientId: body.patientId,
        note: body.note,
        syncedAt: new Date().toISOString(),
      }
    ),
  },
];

async function mockRequest(method: Method, path: string, body?: unknown): Promise<unknown> {
  const route = mockRoutes.find((r) => r.method === method && r.pattern.test(path));
  if (!route) throw { code: 'NOT_FOUND', message: `[模擬] 找不到路由：${method} ${path}` } satisfies ApiError;
  return route.handler((body ?? {}) as Record<string, unknown>);
}

// ─── 公開 API ──────────────────────────────────────────────────────

const request = (method: Method, path: string, body?: unknown) =>
  AppConfig.ENV === 'development' ? mockRequest(method, path, body) : realRequest(method, path, body);

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body: unknown) => request('POST', path, body),
  patch: (path: string, body: unknown) => request('PATCH', path, body),
  put: (path: string, body: unknown) => request('PUT', path, body),
  delete: (path: string) => request('DELETE', path),
};
