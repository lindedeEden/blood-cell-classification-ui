# ADR 0004：建置成單一 HTML，雙擊即可使用

- 狀態：已採用（2026-10-25）

## 背景

原型會在院內電腦展示與做可用性研究：不一定能架伺服器，也不一定能連外網。瀏覽器以 `file://` 開啟時，無法載入外部的 JavaScript 模組與字型。

## 決定

- 每頁分別建置（`scripts/build.mjs` 以 `BUILD_PAGE` 逐頁執行 Vite），以 `vite-plugin-singlefile` 把程式、樣式、字型內嵌進 HTML；細胞圖片放在 `dist/assets/images/`。
- Tailwind CSS、Inter、Material Symbols 都改為本機檔案（舊版從 CDN 載入）。
- 建置最後加上 CSP（以雜湊允許內嵌程式），雙擊開啟也有效。

## 影響

- 每頁 HTML 約 0.2～0.5 MB（同一份共用程式會分別內嵌在各頁）；對原型可接受。
- 正式系統若由伺服器提供，可改回一般的多檔建置，CSP 改由伺服器標頭送出。
- `npm run test:e2e` 同時以 http 與 file:// 跑完整巡覽，確認兩種開法一致。
