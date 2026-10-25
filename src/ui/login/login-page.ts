/**
 * 登入頁：表單檢查、顯示／隱藏密碼、登入後進入檢體管理
 */
import { AppConfig } from '../../config';
import { login } from '../../infra/auth';
import { mustGet } from '../shared/dom';

/** 前端格式檢查（後端仍須再檢查一次） */
export function validateLogin(account: string, password: string): string | null {
  if (!account || !account.trim()) return '請輸入帳號';
  if (account.trim().length > 50) return '帳號長度不得超過 50 字元';
  if (!password) return '請輸入密碼';
  if (password.length > 128) return '密碼長度異常';
  return null;
}

/** 登入後回到原本要去的頁面（只接受同一資料夾內的頁面，避免被導到外部網站） */
export function safeRedirect(search: string, base: string): string {
  const target = new URLSearchParams(search).get('redirect');
  if (target) {
    try {
      const url = new URL(target, base);
      const page = url.pathname.split('/').pop() ?? '';
      const allowed = [AppConfig.ROUTES.SPECIMEN_LIST, AppConfig.ROUTES.IMAGE_REVIEW, AppConfig.ROUTES.REPORT].map(
        encodeURI,
      );
      const from = new URL(base);
      // file:// 開啟時 origin 一律是 "null"（javascript:、data: 網址也是），所以通訊協定也要相同
      const sameSite = from.protocol === url.protocol && from.origin === url.origin && from.host === url.host;
      if (['http:', 'https:', 'file:'].includes(url.protocol) && sameSite && allowed.includes(page)) return url.href;
    } catch {
      /* 格式不對就回到檢體管理 */
    }
  }
  return AppConfig.ROUTES.SPECIMEN_LIST;
}

export function initLoginPage(): void {
  if (new URLSearchParams(window.location.search).get('expired') === '1')
    mustGet('idle-alert').classList.remove('hidden');

  const pwd = mustGet<HTMLInputElement>('password');
  const icon = mustGet('toggle-pwd-icon');
  mustGet('toggle-pwd').addEventListener('click', () => {
    const hidden = pwd.type === 'password';
    pwd.type = hidden ? 'text' : 'password';
    icon.textContent = hidden ? 'visibility' : 'visibility_off';
  });

  const errorEl = mustGet('login-error');
  const button = mustGet<HTMLButtonElement>('login-btn');
  const showError = (msg: string) => {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
    button.disabled = false;
    button.textContent = '登入';
  };

  mustGet<HTMLFormElement>('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const account = mustGet<HTMLInputElement>('account').value;
    const error = validateLogin(account, pwd.value);
    if (error) return showError(error);
    errorEl.classList.add('hidden');
    button.disabled = true;
    button.textContent = '驗證中…';
    const result = await login(account.trim(), pwd.value);
    if (result.ok) window.location.href = safeRedirect(window.location.search, window.location.href);
    else showError(result.error || '登入失敗，請稍後再試');
  });
}
