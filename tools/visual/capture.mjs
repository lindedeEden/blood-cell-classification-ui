/**
 * 截圖：node tools/visual/capture.mjs --base http://localhost:8801/ --out <資料夾> [--legacy <離線資源資料夾>]
 *
 * --dom：另存每個畫面的 DOM（含 iframe），用來比對重構前後輸出的 HTML 是否完全相同
 * --legacy：舊版從 CDN 載入 Tailwind 與 Google 字型；離線環境以本機副本代替（tailwindcss-cdn、@fontsource/inter、material-symbols）
 * 新版不應有任何對外連線：若有，列在 external-requests.txt
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { runTour } from './tour.mjs';

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce(
      (acc, a, i, arr) =>
        a.startsWith('--')
          ? acc.concat([[a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]])
          : acc,
      [],
    ),
);
const base = args.base;
const out = path.resolve(args.out);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  locale: 'zh-TW',
  timezoneId: 'Asia/Taipei',
  colorScheme: 'light',
});
const external = [];

if (args.legacy) {
  const nm = path.resolve(args.legacy, 'node_modules');
  const cdn = (f) => fs.readFileSync(path.join(nm, 'tailwindcss-cdn/3.4.10', f));
  const fontFile = (f) =>
    fs.readFileSync(
      f.startsWith('material') ? path.join(nm, 'material-symbols', f) : path.join(nm, '@fontsource/inter/files', f),
    );
  await context.route('https://cdn.tailwindcss.com/**', (r) =>
    r.fulfill({
      contentType: 'application/javascript',
      body: cdn(r.request().url().includes('forms') ? 'tailwindcss-with-forms.js' : 'tailwindcss.js'),
    }),
  );
  await context.route('https://cdn.tailwindcss.com/', (r) =>
    r.fulfill({ contentType: 'application/javascript', body: cdn('tailwindcss.js') }),
  );
  await context.route('https://cdn.tailwindcss.com/?*', (r) =>
    r.fulfill({
      contentType: 'application/javascript',
      body: cdn(r.request().url().includes('forms') ? 'tailwindcss-with-forms.js' : 'tailwindcss.js'),
    }),
  );
  await context.route('https://fonts.googleapis.com/**', (r) => {
    const u = decodeURIComponent(r.request().url());
    let css = '';
    if (u.includes('Inter')) {
      css = [400, 500, 600, 700]
        .map(
          (w) =>
            `@font-face{font-family:'Inter';font-style:normal;font-weight:${w};font-display:swap;src:url(https://fonts.local/inter-latin-${w}-normal.woff2) format('woff2');}`,
        )
        .join('\n');
    } else {
      css = fs
        .readFileSync(path.join(nm, 'material-symbols/outlined.css'), 'utf8')
        .replace('./material-symbols-outlined.woff2', 'https://fonts.local/material-symbols-outlined.woff2');
    }
    return r.fulfill({ contentType: 'text/css', body: css });
  });
  await context.route('https://fonts.local/**', (r) =>
    r.fulfill({ contentType: 'font/woff2', body: fontFile(r.request().url().split('/').pop()) }),
  );
} else {
  await context.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => {
    external.push(r.request().url());
    return r.abort();
  });
}

const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
let n = 0;
await runTour(page, base, async (name) => {
  n++;
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, name + '.png') });
  if (args.dom) {
    const frames = await Promise.all(
      page.frames().map((f) => f.evaluate(() => document.body?.innerHTML ?? '').catch(() => '')),
    );
    fs.writeFileSync(path.join(out, name + '.html'), frames.join('\n<!-- frame -->\n'));
  }
});
fs.writeFileSync(
  path.join(out, '_log.txt'),
  `screens: ${n}\npage errors:\n${errors.join('\n')}\nexternal requests:\n${external.join('\n')}\n`,
);
console.log(`${n} 張截圖 → ${out}；頁面錯誤 ${errors.length}；對外連線 ${external.length}`);
await browser.close();
