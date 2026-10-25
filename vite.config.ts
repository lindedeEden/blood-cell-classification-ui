/**
 * Vite 設定
 *  - 開發：npm run dev，四個頁面一起預覽
 *  - 建置：npm run build（scripts/build.mjs）逐頁建置，每頁的程式與樣式都內嵌在 HTML 裡，
 *    建置後雙擊 dist/index.html 就能使用（file:// 不能載入外部的 JS 模組與字型）
 */
import { defineConfig, type Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { preferencePreloadScript } from './src/ui/shared/preference-rules';

/** 各頁 <head> 的字級與縮放預先套用程式：由 preference-rules.ts 產生，避免與畫面程式各寫一份 */
const preloadPreferences = (): Plugin => ({
  name: 'preload-preferences',
  transformIndexHtml: (html) =>
    html
      .replace(/<!-- preload-preferences[^>]*-->/, `<script>${preferencePreloadScript()}</script>`)
      // 原始檔被直接雙擊時的提示：開發與建置都不需要
      .replace(/<!-- source-file-notice[\s\S]*?<!-- \/source-file-notice -->\n/, ''),
});

export const PAGES = {
  login: 'index.html',
  list: '檢體管理.html',
  image: '影像檢視與細胞編輯.html',
  report: '報告核發.html',
} as const;

export default defineConfig(() => {
  const page = process.env.BUILD_PAGE as keyof typeof PAGES | undefined;
  return {
    base: './',
    plugins: [preloadPreferences(), ...(page ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      copyPublicDir: page === 'login' || !page,
      assetsInlineLimit: 100_000_000,
      rollupOptions: { input: page ? PAGES[page] : Object.values(PAGES) },
    },
  };
});
