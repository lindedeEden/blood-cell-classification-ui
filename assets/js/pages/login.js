/**
 * 登入頁：表單驗證、顯示／隱藏密碼、呼叫 AuthService 登入後進入檢體管理
 */
(function () {
  'use strict';

  /** 登入表單格式檢查，回傳 { valid, error } */
  function validateLoginForm(account, password) {
    if (!account || !account.trim()) return { valid: false, error: '請輸入帳號' };
    if (account.trim().length > 50) return { valid: false, error: '帳號長度不得超過 50 字元' };
    if (!password) return { valid: false, error: '請輸入密碼' };
    if (password.length > 128) return { valid: false, error: '密碼長度異常' };
    return { valid: true };
  }

  // 閒置逾時提示
  if (new URLSearchParams(window.location.search).get('expired') === '1') {
    document.getElementById('idle-alert').classList.remove('hidden');
  }

  // 顯示/隱藏密碼
  const toggleBtn = document.getElementById('toggle-pwd');
  const pwdInput  = document.getElementById('password');
  const toggleIcon = document.getElementById('toggle-pwd-icon');
  toggleBtn.addEventListener('click', () => {
    const isHidden = pwdInput.type === 'password';
    pwdInput.type = isHidden ? 'text' : 'password';
    toggleIcon.textContent = isHidden ? 'visibility' : 'visibility_off';
  });

  // 表單提交
  const form     = document.getElementById('login-form');
  const errorEl  = document.getElementById('login-error');
  const loginBtn = document.getElementById('login-btn');

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
    loginBtn.disabled = false;
    loginBtn.textContent = '登入';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const account  = document.getElementById('account').value;
    const password = document.getElementById('password').value;

    // 前端格式驗證（後端仍須再驗證一次）
    const validation = validateLoginForm(account, password);
    if (!validation.valid) { showError(validation.error); return; }

    // 鎖定按鈕，避免重複送出
    errorEl.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.textContent = '驗證中…';

    // 呼叫 AuthService（後端驗證）
    const result = await AuthService.login(account.trim(), password);
    if (result.ok) {
      if (typeof DemoStorage !== 'undefined') DemoStorage.clearToasts();   // 不顯示上一次登入留下的提示
      window.location.href = AppConfig.ROUTES.SPECIMEN_LIST;
    } else {
      showError(result.error || '登入失敗，請稍後再試');
    }
  });
})();
