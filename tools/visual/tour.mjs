/* global SpecimenStore -- 舊版頁面的全域物件，只在截圖舊版時用到 */
/**
 * 畫面巡覽：同一套操作步驟在舊版與新版各跑一次，逐張截圖比對（SPEC 第 8 節「畫面」）
 *
 * 只依賴頁面上的元素 id／class 與看得到的文字，不依賴程式內部寫法，所以新舊版可共用。
 * 每一步呼叫 shot(name) 存一張截圖；時間固定為模擬資料的「現在」，避免時效欄每次不同。
 */

const FIXED_NOW = new Date('2025-08-07T22:15:00+08:00');

const LIST = '檢體管理.html';
const IMAGE = '影像檢視與細胞編輯.html';
const REPORT = '報告核發.html';

async function settle(page, ms = 250) {
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.waitForTimeout(ms);
}

/** 影像頁：把細胞區捲到底，讓每顆細胞都進入過視野（儲存結果的條件，規則 8） */
async function viewAllCells(page) {
  for (let i = 0; i < 80; i++) {
    const done = await page.evaluate(() => {
      const el = document.querySelector('.image-review-scroll');
      el.style.scrollBehavior = 'auto';
      const before = el.scrollTop;
      el.scrollTop = before + el.clientHeight * 0.5;
      return el.scrollTop === before;
    });
    await page.waitForTimeout(60);
    if (done) break;
  }
  await page.evaluate(() => {
    const el = document.querySelector('.image-review-scroll');
    el.scrollTop = 0;
  });
  await page.waitForTimeout(150);
}

function cellLocator(page, n) {
  return page.locator('#main-cell-groups .cell-image-container').nth(n);
}

function reportFrame(page) {
  return page.frameLocator('#report-issue-iframe');
}

export async function runTour(page, base, shot) {
  await page.clock.setFixedTime(FIXED_NOW);
  const go = async (file, query = '') => {
    await page.goto(base + encodeURI(file) + query);
    await settle(page);
  };

  // ─── 登入 ───────────────────────────────────────────────
  await go('index.html');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await go('index.html');
  await shot('login-01-default');
  await page.click('#toggle-pwd');
  await shot('login-02-password-visible');
  await page.fill('#account', '');
  await page.click('#login-btn');
  await shot('login-03-error-empty-account');
  await go('index.html', '?expired=1');
  await shot('login-04-session-expired');
  await page.fill('#account', 'admin');
  await page.fill('#password', 'admin');
  await Promise.all([page.waitForURL(/檢體管理|%E6%AA%A2/), page.click('#login-btn')]);
  await settle(page, 400);

  // ─── 使用教學（第一次進入檢體管理自動開始）──────────────
  for (let i = 1; i <= 5; i++) {
    await shot('tutorial-list-' + i);
    await page.click('#tutorial-card .tutorial-btn-next');
    await page.waitForTimeout(150);
  }
  await shot('list-01-after-tutorial');

  // ─── 檢體管理 ───────────────────────────────────────────
  const row = (id) => page.locator(`#specimen-tbody tr[data-specimen-id="${id}"]`);
  await row('H5080720647').locator('td').nth(4).click();
  await shot('list-02-select-row');
  await page.click('#tab-digital');
  await shot('list-03-mode-digital');
  await page.click('#tab-entity');
  await shot('list-04-mode-entity');
  await page.click('#tab-entity');
  await shot('list-05-mode-off');
  await page.click('#btn-filter');
  await shot('list-06-filter-open');
  await page.click('.status-filter[value="AI Alert"]');
  await shot('list-07-filter-uncheck-ai');
  await page.click('.status-filter[value="AI Alert"]');
  await page.click('#btn-filter');
  await page.click('th.sort-id');
  await shot('list-08-sort-id-asc');
  await page.click('th.sort-id');
  await shot('list-09-sort-id-desc');
  await page.click('th.sort-urgency');
  await shot('list-10-sort-urgency');
  await page.click('th.sort-time');
  await page.click('th.sort-time');
  await page.fill('#specimen-search', '0647');
  await page.press('#specimen-search', 'Enter');
  await shot('list-11-search');
  await page.check('#exact-match');
  await shot('list-12-exact-no-match');
  await page.uncheck('#exact-match');
  await page.fill('#specimen-search', '');
  await page.press('#specimen-search', 'Enter');
  await page.selectOption('#filter-department', '心臟外科');
  await shot('list-13-department');
  await page.selectOption('#filter-department', '');
  await page.click('#btn-settings');
  await shot('list-14-settings-modal');
  await page.fill('#leave-inp-wbc', '5');
  await page.click('#modal-leave-settings-save');
  await shot('list-15-settings-saved-wbc5');
  await page.click('#btn-settings');
  await page.click('#modal-leave-settings-reset');
  await shot('list-16-settings-reset');
  await page.click('#modal-leave-settings-save');
  await page.click('#btn-scenario-simulation');
  await shot('list-17-scenario-modal');
  await page.click('input[name="usability-scenario"][value="scenario-1"]');
  await shot('list-18-scenario-preview');
  await page.click('#modal-scenario-simulation-apply');
  await shot('list-19-scenario-applied');
  await page.click('#btn-scenario-simulation');
  await page.click('input[name="usability-scenario"][value=""]');
  await page.click('#modal-scenario-simulation-apply');
  await shot('list-20-scenario-normal');
  await page.click('#font-larger');
  await shot('list-21-font-larger');
  await page.click('#font-smaller');
  await page.click('#font-smaller');
  await shot('list-22-font-smaller');
  await page.click('#font-larger');
  await page.click('#tab-entity');
  await row('H5080720647').locator('.status-capsule[data-status="PLT Check"]').click();
  await shot('list-23-toggle-plt-done');
  await row('H5080720647').locator('.status-capsule[data-status="PLT Check"]').click();
  await shot('list-24-toggle-plt-undo');
  await page.click('#tab-entity');
  await page.click('#btn-filter');
  await page.check('.status-filter[value="Verified"]');
  await page.click('#btn-filter');
  await row('H5080706301').locator('.status-capsule[data-status="Follow-up"]').click();
  await shot('list-25-completed-capsule-click');

  // 唯讀檢視（已完成的需拉片確認）；影像頁教學留到下一段再看
  await page.evaluate(() => {
    localStorage.setItem('bloodCellTutorialCompleted', '1');
    localStorage.setItem('bloodCellTutorialPhase', '');
  });
  await row('H5080706301').locator('.readonly-review-btn').click();
  await settle(page, 500);
  await shot('image-01-readonly-followup-done');
  await page.click('#back-to-list');
  await settle(page);

  // ─── 影像檢視（綠色；同時有血小板確認）──────────────────
  await page.evaluate(() => {
    localStorage.setItem('bloodCellTutorialPhase', 'image');
    localStorage.setItem('bloodCellTutorialStep', '0');
  });
  await row('H5080720847').dblclick();
  await settle(page, 700);
  for (let i = 1; i <= 5; i++) {
    await shot('tutorial-image-' + i);
    await page.click('#tutorial-card .tutorial-btn-next');
    await page.waitForTimeout(150);
  }
  await shot('image-02-top');
  await cellLocator(page, 0).click();
  await shot('image-03-select-one');
  await cellLocator(page, 4).click({ modifiers: ['Shift'] });
  await shot('image-04-shift-range');
  await cellLocator(page, 7).click({ modifiers: ['Control'] });
  await shot('image-05-ctrl-add');
  await cellLocator(page, 2).click({ button: 'right' });
  await shot('image-06-context-menu');
  await page.click('#context-menu .menu-item[data-category="Lymphocyte"]');
  await shot('image-07-moved-to-lymphocyte');
  await page.click('#zoom-in');
  await page.click('#zoom-in');
  await shot('image-08-zoom-120');
  await page.click('#zoom-out');
  await page.click('#zoom-out');
  await page.click('#font-larger');
  await shot('image-09-font-larger');
  await page.click('#font-smaller');
  await page.locator('#main-cell-groups .section-header').first().click();
  await shot('image-10-group-collapsed');
  await page.locator('#main-cell-groups .section-header').first().click();
  await viewAllCells(page);
  await shot('image-11-all-viewed');
  await page.click('#btn-save-report');
  await page.waitForTimeout(1200);
  for (let i = 1; i <= 5; i++) {
    await shot('tutorial-report-' + i);
    await reportFrame(page).locator('#tutorial-card .tutorial-btn-next').click();
    await page.waitForTimeout(150);
  }
  await shot('report-01-green-manual-locked');
  await reportFrame(page).locator('#verify-lock-btn').click();
  await shot('report-02-green-unlocked');
  await reportFrame(page).locator('#btn-close').click();
  await page.waitForTimeout(200);
  await shot('image-12-report-closed');

  // ─── 紅色：開鎖強制簽核 ─────────────────────────────────
  await go(IMAGE, '?specimen=H5080721103');
  await shot('image-13-red-top');
  await viewAllCells(page);
  await page.click('#btn-save-report');
  await page.waitForTimeout(1200);
  await shot('report-03-red-locked');
  await reportFrame(page).locator('#verify-lock-btn').click();
  await shot('report-04-red-unlocked');
  await Promise.all([page.waitForURL(/檢體管理|%E6%AA%A2/), reportFrame(page).locator('#confirm-btn').click()]);
  await settle(page, 400);
  await shot('list-28-after-red-signoff');

  // ─── AI 建議（含信心值）的右鍵選單 ─────────────────────
  await go(IMAGE, '?specimen=H5080721104');
  await page
    .locator('#main-cell-groups .cell-image-container[data-category="Blast"]')
    .first()
    .click({ button: 'right' });
  await shot('image-14-context-ai-suggestion');
  await page.keyboard.press('Escape');

  // ─── 改為人工鏡檢 ──────────────────────────────────────
  await viewAllCells(page);
  await page.click('#btn-save-report');
  await page.waitForTimeout(1200);
  await shot('report-05-red-manual');
  await Promise.all([page.waitForURL(/檢體管理|%E6%AA%A2/), reportFrame(page).locator('#manual-alert-btn').click()]);
  await settle(page, 400);
  await shot('list-29-after-manual-review');

  // ─── 黃色＋待辦需拉片：已拉片完成 ────────────────────────
  await go(IMAGE, '?specimen=H5080720647');
  await shot('image-15-yellow-followup');
  await viewAllCells(page);
  await page.click('#btn-save-report');
  await page.waitForTimeout(1200);
  await shot('report-06-yellow-followup');
  await Promise.all([page.waitForURL(/檢體管理|%E6%AA%A2/), reportFrame(page).locator('#follow-up-done-btn').click()]);
  await settle(page, 400);
  await shot('list-30-after-followup-done');

  // ─── 綠色簽核 → 自動開下一筆 ─────────────────────────────
  await go(IMAGE, '?specimen=H5080721101');
  await viewAllCells(page);
  await page.click('#btn-save-report');
  await page.waitForTimeout(1200);
  await Promise.all([page.waitForURL(/H5080721102/), reportFrame(page).locator('#confirm-btn').click()]);
  await settle(page, 500);
  await shot('image-16-next-after-signoff');

  // ─── 唯讀：已簽核 ───────────────────────────────────────
  await go(IMAGE, '?specimen=H5080721101');
  await shot('image-17-readonly-signed');

  // ─── LIS 撤回通知（規則 15；新介面沒有按鈕，由 LIS 通知觸發）──
  await go(LIST);
  await page.evaluate(() =>
    window.__demo ? window.__demo.withdrawFromLis('H5080721101') : SpecimenStore.withdrawFromLis('H5080721101'),
  );
  await page.waitForTimeout(200);
  await shot('list-26-lis-withdraw-modal');
  await page.click('#modal-lis-withdraw-ok');
  await shot('list-27-after-withdraw');

  // ─── 直接用網址開啟（新版：報告頁只能內嵌在影像檢視頁；條碼不存在不改開其他檢體）──
  // 舊版會單獨顯示報告頁、或改開第一筆檢體；新版一律回到檢體管理（docs/CHANGES-FROM-LEGACY.md）
  await go(REPORT, '?specimen=H5080721202');
  await settle(page, 400);
  await shot('direct-url-report');
  await go(IMAGE, '?specimen=NOT-A-BARCODE');
  await settle(page, 400);
  await shot('direct-url-unknown-specimen');
  await go(LIST);
  await shot('list-31-final');
}
