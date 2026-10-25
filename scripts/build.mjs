/**
 * 建置：逐頁建置成單一 HTML（程式、樣式、字型都內嵌），圖片放在 dist/assets/images
 * 用法：npm run build
 *
 * 最後替每頁加上內容安全政策（CSP）：只允許頁面裡這幾段內嵌程式（以 SHA-256 雜湊指定）執行，
 * 擋掉被注入的 <script>、外部程式與 inline 事件屬性。見 docs/SECURITY.md。
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'vite';

rmSync('dist', { recursive: true, force: true });
for (const page of ['login', 'list', 'image', 'report']) {
  process.env.BUILD_PAGE = page;
  await build({ logLevel: 'warn' });
  console.log('✓ ' + page);
}

const sha256 = (s) => "'sha256-" + createHash('sha256').update(s, 'utf8').digest('base64') + "'";

for (const file of readdirSync('dist').filter((f) => f.endsWith('.html'))) {
  const path = 'dist/' + file;
  const html = readFileSync(path, 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => sha256(m[1]));
  const policy = [
    "default-src 'none'",
    `script-src ${scripts.join(' ')}`,
    "style-src 'unsafe-inline'", // Tailwind 產生的 <style> 與標記上的 style 屬性
    "img-src 'self' data:",
    'font-src data:', // 字型已內嵌
    "frame-src 'self'", // 影像檢視頁內嵌報告頁
    "connect-src 'self'", // 正式環境改為 API 網址（AppConfig.API_BASE_URL）
    "form-action 'self'",
    "base-uri 'none'",
    "object-src 'none'",
  ].join('; ');
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}"/>`;
  if (!html.includes('<meta charset="utf-8"/>')) throw new Error(file + '：找不到 <meta charset>，無法加入 CSP');
  writeFileSync(path, html.replace('<meta charset="utf-8"/>', '<meta charset="utf-8"/>\n  ' + meta));
  console.log(`✓ CSP ${file}（${scripts.length} 段內嵌程式）`);
}
