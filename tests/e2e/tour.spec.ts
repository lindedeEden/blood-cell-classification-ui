/**
 * 畫面巡覽（tools/visual/tour.mjs 的 75 個畫面，涵蓋登入、檢體管理、影像檢視、報告核發、教學與情境模擬）
 *
 * 每個畫面檢查兩件事：
 * 1. DOM 指紋：所有 frame 的 body HTML 雜湊，與 dom-fingerprints.json 比對（與平台無關；
 *    重構時只要指紋不變，畫面輸出的 HTML 就一字不差）
 * 2. 截圖：挑選的代表畫面與 __screenshots__/<平台>/ 比對（含 CSS 與字型）
 *
 * 另外確認：沒有頁面錯誤、沒有被 CSP 擋下的內容、沒有任何對外連線。
 * 兩種開啟方式都跑：vite preview（http）與直接開 dist 檔案（file://，等同雙擊開啟）。
 * 更新基準：npm run test:e2e -- --update-snapshots
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
// @ts-expect-error -- 純 JS 工具模組（與舊版共用的巡覽步驟）
import { runTour } from '../../tools/visual/tour.mjs';

const FINGERPRINTS = path.join(import.meta.dirname, 'dom-fingerprints.json');
const DIST = path.resolve(import.meta.dirname, '../../dist');

/** 代表畫面：每頁的主要狀態各一張（全部 77 張的逐張比對用 tools/visual） */
const KEY_SCREENS = new Set([
  'login-01-default',
  'list-01-after-tutorial',
  'list-02-select-row',
  'list-14-settings-modal',
  'list-17-scenario-modal',
  'list-26-lis-withdraw-modal',
  'image-02-top',
  'image-06-context-menu',
  'image-14-context-ai-suggestion',
  'report-03-red-locked',
  'report-06-yellow-followup',
  'tutorial-list-1',
]);

/**
 * 與開啟方式、字型量測無關的 DOM 內容：去掉網址前綴、把 px 數值換成 N（教學聚光燈、右鍵選單位置）、
 * 去掉瀏覽器自動填入留下的空 style 屬性
 */
async function domText(page: Page, base: string): Promise<string> {
  const prefix = new URL(base).pathname;
  const bodies = await Promise.all(
    page.frames().map((f) => f.evaluate(() => document.body?.innerHTML ?? '').catch(() => '')),
  );
  const text = bodies
    .join('\n<!-- frame -->\n')
    .replaceAll(`src="${prefix}`, 'src="/')
    .replace(/-?\d+(\.\d+)?px/g, 'Npx')
    .replaceAll(' style=""', '');
  return text;
}

const hash = (text: string) => createHash('sha256').update(text).digest('hex').slice(0, 16);

for (const mode of ['http', 'file'] as const) {
  test(`畫面巡覽（${mode === 'http' ? 'vite preview' : 'file:// 雙擊開啟'}）`, async ({ page }, testInfo) => {
    const base = mode === 'http' ? 'http://localhost:4317/' : pathToFileURL(DIST).href + '/';
    const errors: string[] = [];
    const external: string[] = [];
    let injecting = false;
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error' && /Content Security Policy|Refused to/.test(m.text()) && !injecting)
        errors.push('CSP：' + m.text());
    });
    await page.route(/^https?:\/\/(?!localhost)/, (r) => (external.push(r.request().url()), r.abort()));

    const prints: Record<string, string> = {};
    await runTour(page, base, async (name: string) => {
      await page.waitForTimeout(300);
      const broken = await page.evaluate(() =>
        [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      );
      if (broken.length) errors.push(`${name} 圖片載入失敗：${broken.join(', ')}`);
      const text = await domText(page, base);
      prints[name] = hash(text);
      fs.mkdirSync(testInfo.outputPath('dom'), { recursive: true });
      fs.writeFileSync(testInfo.outputPath('dom', name + '.html'), text);
      if (mode === 'http' && KEY_SCREENS.has(name)) await expect.soft(page).toHaveScreenshot(name + '.png');
    });

    expect(errors, '頁面錯誤或 CSP 阻擋').toEqual([]);
    expect(external, '不應有任何對外連線').toEqual([]);
    expect(Object.keys(prints)).toHaveLength(75);

    // CSP：被注入的 <script> 不會執行
    injecting = true;
    const injected = await page.evaluate(() => {
      const el = document.createElement('script');
      el.textContent = 'window.__injected = true';
      document.head.append(el);
      return (window as unknown as { __injected?: boolean }).__injected === true;
    });
    expect(injected, '注入的程式不應執行').toBe(false);

    const update = ['all', 'changed'].includes(testInfo.config.updateSnapshots) || !fs.existsSync(FINGERPRINTS);
    if (update && mode === 'http') {
      fs.writeFileSync(FINGERPRINTS, JSON.stringify(prints, null, 2) + '\n');
      return;
    }
    const golden = JSON.parse(fs.readFileSync(FINGERPRINTS, 'utf8')) as Record<string, string>;
    const changed = [...new Set([...Object.keys(golden), ...Object.keys(prints)])].filter(
      (k) => golden[k] !== prints[k],
    );
    expect(changed, 'DOM 與基準不同的畫面').toEqual([]);
  });
}
