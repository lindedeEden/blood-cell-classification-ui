/**
 * 操作流程（使用者回報的情境）
 */
import { expect, test, type Page } from '@playwright/test';

const BASE = 'http://localhost:4317/';
const LIST = /E6%AA%A2|檢體管理/;

async function login(page: Page) {
  await page.clock.setFixedTime(new Date('2025-08-07T22:15:00+08:00'));
  await page.goto(BASE + 'index.html');
  await page.evaluate(() => localStorage.setItem('bloodCellTutorialCompleted', '1'));
  await page.fill('#account', 'admin');
  await page.fill('#password', 'admin');
  await Promise.all([page.waitForURL(LIST), page.click('#login-btn')]);
}

/** 影像頁：看完所有細胞後按「儲存結果」，回傳報告簽核頁（內嵌視窗） */
async function saveResult(page: Page) {
  await page.waitForLoadState('load');
  for (let i = 0; i < 80; i++) {
    const done = await page.evaluate(() => {
      const el = document.querySelector('.image-review-scroll') as HTMLElement;
      el.style.scrollBehavior = 'auto';
      const before = el.scrollTop;
      el.scrollTop = before + el.clientHeight * 0.5;
      return el.scrollTop === before;
    });
    await page.waitForTimeout(60);
    if (done) break;
  }
  await page.click('#btn-save-report');
  const report = page.frameLocator('#report-issue-iframe');
  await expect(report.locator('#risk-text')).not.toBeEmpty();
  return report;
}

test('簽核後自動開下一筆，再改為人工鏡檢：回到清單只顯示改為人工鏡檢的提示（不會跳出前一筆的「簽核完成」）', async ({
  page,
}) => {
  await login(page);
  await page.goto(BASE + encodeURI('影像檢視與細胞編輯.html') + '?specimen=H5080721105');
  let report = await saveResult(page);
  await expect(report.locator('#risk-text')).toContainText('狀態良好'); // 綠色：簽核後自動開下一筆
  await report.locator('#confirm-btn').click();
  await page.waitForURL(/specimen=H5080721106/);
  report = await saveResult(page);
  await report.locator('#verify-lock-btn').click();
  await report.locator('#manual-alert-btn').click();
  await page.waitForURL(LIST);
  await expect(page.locator('#specimen-list-toast-text')).toHaveText(/^H5080721106 已歸入需拉片確認/);
});

test('Eden 回報的步驟：H5080721102 簽核 → 自動開 H5080721103 → 改為人工鏡檢：提示是 H5080721103，不是 H5080721102', async ({
  page,
}) => {
  await login(page);
  await page.goto(BASE + encodeURI('影像檢視與細胞編輯.html') + '?specimen=H5080721102');
  let report = await saveResult(page);
  await report.locator('#confirm-btn').click();
  await page.waitForURL(/specimen=H5080721103/);
  report = await saveResult(page);
  await report.locator('#manual-alert-btn').click(); // 紅色：改為人工鏡檢不需開鎖
  await page.waitForURL(LIST);
  await expect(page.locator('#specimen-list-toast-text')).toHaveText(/^H5080721103 已歸入需拉片確認/);
  await expect(page.locator('#specimen-list-toast-text')).not.toContainText('H5080721102');
});
