/**
 * 登入頁面行為：
 * - 簡單驗證帳號密碼（admin/admin 或 user/user）
 * - 顯示錯誤訊息
 * - 驗證通過後導向檢體管理介面
 *
 * 若未來要改成真正後端驗證，只要在這支檔案中替換 submit handler 的邏輯即可。
 */
(function () {
  var form = document.getElementById('login-form');
  var errorEl = document.getElementById('login-error');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var account = (document.getElementById('account').value || '').trim();
    var password = document.getElementById('password').value;

    errorEl.classList.add('hidden');
    errorEl.textContent = '';

    if (!account) {
      errorEl.textContent = '請輸入帳號';
      errorEl.classList.remove('hidden');
      return;
    }
    if (!password) {
      errorEl.textContent = '請輸入密碼';
      errorEl.classList.remove('hidden');
      return;
    }

    // 簡易本機驗證：demo 用帳號密碼
    // TODO: 未來可改為呼叫後端 API 檢查帳密
    if ((account === 'admin' && password === 'admin') || (account === 'user' && password === 'user')) {
      window.location.href = '檢體管理.html';
      return;
    }

    errorEl.textContent = '帳號或密碼錯誤，請再試一次';
    errorEl.classList.remove('hidden');
  });
})();

