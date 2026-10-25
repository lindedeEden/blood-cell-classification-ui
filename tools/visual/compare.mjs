/**
 * 新舊截圖比對：node tools/visual/compare.mjs <舊版截圖> <新版截圖> <輸出資料夾>
 * 每張計算不同的像素比例，產生差異圖與報告（report.json、report.html）
 */
import fs from 'node:fs';
import path from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const [legacyDir, newDir, outDir] = process.argv.slice(2).map((p) => path.resolve(p));
fs.mkdirSync(outDir, { recursive: true });
const names = fs
  .readdirSync(legacyDir)
  .filter((f) => f.endsWith('.png'))
  .sort();
const rows = [];
for (const name of names) {
  const a = PNG.sync.read(fs.readFileSync(path.join(legacyDir, name)));
  const bPath = path.join(newDir, name);
  if (!fs.existsSync(bPath)) {
    rows.push({ name, missing: true });
    continue;
  }
  const b = PNG.sync.read(fs.readFileSync(bPath));
  const { width, height } = a;
  const diff = new PNG({ width, height });
  const n = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1, includeAA: false });
  const ratio = n / (width * height);
  if (n > 0) fs.writeFileSync(path.join(outDir, name.replace('.png', '.diff.png')), PNG.sync.write(diff));
  rows.push({ name, pixels: n, percent: +(ratio * 100).toFixed(3) });
}
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(rows, null, 1));
const bad = rows.filter((r) => r.missing || r.percent > 0.1);
console.log(`比對 ${rows.length} 張；差異 > 0.1% 的有 ${bad.length} 張`);
for (const r of rows)
  if (r.missing || r.pixels) console.log(`${r.missing ? '缺少' : r.percent.toFixed(3) + '%'}\t${r.name}`);
