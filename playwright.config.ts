/**
 * 端對端測試（npm run test:e2e：先建置，再以 vite preview 與 file:// 各跑一次畫面巡覽）
 *
 * 截圖基準與作業系統的字型繪製有關，依平台分資料夾存放；
 * 在新電腦第一次執行時用 npm run test:e2e -- --update-snapshots 產生該平台的基準。
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 5 * 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002 } },
  use: {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npx vite preview --port 4317 --strictPort',
    url: 'http://localhost:4317/',
    reuseExistingServer: !process.env.CI,
  },
});
