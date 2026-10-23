/**
 * ApiService — 前端與後端之間的唯一 HTTP 出入口
 *
 *  - AppConfig.ENV = 'development'：使用下方「模擬路由」回應，不需要後端
 *  - AppConfig.ENV = 'production'：呼叫 AppConfig.API_BASE_URL 的真實 REST API
 *  - 自動附加登入 Token（Authorization: Bearer）、逾時處理、統一錯誤格式 { code, message, detail }
 *
 * 目前原型實際呼叫的路由：
 *  POST /auth/login、POST /auth/logout             登入／登出（AuthService）
 *  POST /lis/results                                簽核後回寫 WBC Diff%、非白血球數據（規則 14）
 *  POST /lis/notes                                  回寫 LIS 檢驗註記：需拉片確認（規則 10）、拉片完成、血小板確認完成、數位閱片替代拉片鏡檢（規則 14）
 * 正式系統規劃的其他路由（檢體、流程狀態、門檻設定等）列於 ARCHITECTURE.md；
 * 原型只用到 POST，get／patch／put／delete 為串接預留。
 */

const ApiService = (function () {
  'use strict';

  const BASE_URL = AppConfig.API_BASE_URL;
  const IS_MOCK = AppConfig.ENV === 'development';
  const TIMEOUT = AppConfig.API_TIMEOUT_MS;

  // ─── 私有工具 ────────────────────────────────────────────────

  function _buildHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    // AuthService 可能尚未載入（如登入頁），需防呼叫
    if (typeof AuthService !== 'undefined') {
      const token = AuthService.getToken();
      if (token) headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
  }

  function _handleHttpError(status, body) {
    if (status === 401) {
      // 已登入者收到 401＝登入逾期，自動登出；尚未登入（例如帳密錯誤）則只回傳錯誤訊息
      if (typeof AuthService !== 'undefined' && AuthService.getToken()) {
        AuthService.logout();
        throw { code: 'UNAUTHORIZED', message: '認證已過期，請重新登入' };
      }
      throw { code: 'UNAUTHORIZED', message: body?.message || '帳號或密碼錯誤' };
    }
    if (status === 403) throw { code: 'FORBIDDEN', message: '您沒有執行此操作的權限' };
    if (status === 404) throw { code: 'NOT_FOUND', message: '找不到請求的資源' };
    if (status >= 500) throw { code: 'SERVER_ERROR', message: '伺服器發生錯誤，請稍後重試', detail: body };
    throw { code: 'HTTP_ERROR', message: body?.message || `請求失敗 (${status})` };
  }

  async function _fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) _handleHttpError(res.status, data);
      return data;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw { code: 'TIMEOUT', message: '請求逾時，請確認網路狀態' };
      if (err.code) throw err; // 已格式化的錯誤
      throw { code: 'NETWORK_ERROR', message: '網路連線失敗，請確認網路狀態' };
    }
  }

  // ─── 真實 HTTP 請求 ──────────────────────────────────────────

  async function _realRequest(method, path, body) {
    const url = BASE_URL + path;
    const options = { method, headers: _buildHeaders() };
    if (body !== undefined) options.body = JSON.stringify(body);
    return _fetchWithTimeout(url, options);
  }

  // ─── 模擬路由（開發模式）─────────────────────────────────────
  // 格式：{ method, pattern: RegExp, handler(matches, body) }
  // 上線時刪除此區塊即可，其他程式碼不需更改。

  const _mockRoutes = [
    {
      method: 'POST', pattern: /^\/auth\/login$/,
      handler: async (_, body) => {
        // Demo 帳號：在後端實作前提供測試入口
        // ⚠️ 上線時此段完全移除，驗證邏輯只存在後端
        const DEMO_ACCOUNTS = {
          'admin': { password: 'admin', user: { id: 'F12630E', name: '管理員', role: 'admin' } },
          'user':  { password: 'user',  user: { id: 'F99999', name: '一般使用者', role: 'staff' } },
        };
        await _mockDelay(300);
        const acc = DEMO_ACCOUNTS[body.account];
        if (acc && acc.password === body.password) {
          // Demo：記下登入帳號（簽核時寫入編輯人員），並重設檢體狀態為 database.js 原始資料
          DemoStorage.setCurrentUserAccount(body.account);
          DemoStorage.resetDemoData();
          return { token: 'mock_jwt_' + Date.now(), user: acc.user };
        }
        _handleHttpError(401, { message: '帳號或密碼錯誤' });
      }
    },
    {
      method: 'POST', pattern: /^\/auth\/logout$/,
      handler: async () => { await _mockDelay(50); return { ok: true }; }
    },
    {
      // 規則 14：簽核後回寫 WBC Diff%、非白血球數據（Demo 模擬；正式系統由後端寫入 LIS）
      method: 'POST', pattern: /^\/lis\/results$/,
      handler: async (_, body) => {
        await _mockDelay(200);
        return { ok: true, barcode: body && body.barcode, syncedAt: new Date().toISOString() };
      }
    },
    {
      // 規則 10、14：回寫 LIS 檢驗註記（需拉片確認／拉片完成／血小板確認完成／數位閱片替代拉片鏡檢）（Demo 模擬）
      method: 'POST', pattern: /^\/lis\/notes$/,
      handler: async (_, body) => {
        await _mockDelay(200);
        return {
          ok: true,
          barcode: body && body.barcode,
          patientId: body && body.patientId,
          note: body && body.note,
          syncedAt: new Date().toISOString(),
        };
      }
    },
  ];

  function _mockDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function _mockRequest(method, path, body) {
    for (const route of _mockRoutes) {
      if (route.method !== method) continue;
      const matches = path.match(route.pattern);
      if (!matches) continue;
      return route.handler(matches, body);
    }
    throw { code: 'NOT_FOUND', message: `[Mock] 找不到路由: ${method} ${path}` };
  }

  // ─── 公開 API ────────────────────────────────────────────────

  // get／patch／put／delete：原型尚未使用，預留給正式系統規劃的路由（ARCHITECTURE.md：GET /specimens、PATCH …/workflow、PUT …/edited-result）
  async function get(path) {
    return IS_MOCK ? _mockRequest('GET', path) : _realRequest('GET', path);
  }

  async function post(path, body) {
    return IS_MOCK ? _mockRequest('POST', path, body) : _realRequest('POST', path, body);
  }

  async function patch(path, body) {
    return IS_MOCK ? _mockRequest('PATCH', path, body) : _realRequest('PATCH', path, body);
  }

  async function put(path, body) {
    return IS_MOCK ? _mockRequest('PUT', path, body) : _realRequest('PUT', path, body);
  }

  async function del(path) {
    return IS_MOCK ? _mockRequest('DELETE', path) : _realRequest('DELETE', path);
  }

  return { get, post, patch, put, delete: del };
})();
