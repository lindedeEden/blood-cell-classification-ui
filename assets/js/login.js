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
      try {
        sessionStorage.setItem('blood-morphology-user-account', account);
        /** 展示用：下次開啟檢體管理時套用固定預設排序／篩選 */
        sessionStorage.setItem('blood-morphology-specimen-ui-reset', '1');
        /** 展示用：清除閱片／Add Flag 等寫入的檢體狀態覆寫，重新登入後還原 database.js 原始資料 */
        localStorage.removeItem('blood-morphology-specimen-status');
      } catch (err) {}
      window.location.href = '檢體管理.html';
      return;
    }

    errorEl.textContent = '帳號或密碼錯誤，請再試一次';
    errorEl.classList.remove('hidden');
  });
})();

