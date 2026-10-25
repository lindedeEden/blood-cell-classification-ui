# ADR 0001：TypeScript + Vite，不用前端框架

- 狀態：已採用（2026-10-25，Eden 確認）

## 背景

舊版原型以原生 JavaScript 寫成，靠全域物件與 `<script>` 載入順序串接；規則與畫面程式混在一起，沒有型別。目標是在「功能、畫面、規則結果完全相同」的前提下，改寫成工程團隊好讀、好測、好移植的版本。

## 決定

- 語言：TypeScript（strict、`noUncheckedIndexedAccess`），檢體資料結構寫成型別（`src/domain/types.ts`）。
- 建置：Vite（多頁面、開發時即時預覽）。
- **不使用 React／Vue 等框架**：畫面以 TypeScript 模組＋原生 DOM 實作，四頁的 HTML 版面沿用舊版。

## 理由

- 畫面要與舊版逐像素相同：沿用舊版 HTML 與 Tailwind class 最可靠；改用框架等於重做版面，難以保證相同。
- 原型的價值在規則與流程；正式系統會依院內技術選擇框架，`src/domain` 的規則與框架無關，可直接沿用。

## 影響

- 畫面程式比框架寫法冗長，但每頁已拆成小模組（清單列、摘要、視窗、選取、排版等）。
- 動態 HTML 統一用 `html` 樣板（自動跳脫），避免 XSS。
