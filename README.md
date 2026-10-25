# 血球型態分類軟體介面（優化版）

林口長庚醫院檢驗醫學科血液組的**介面設計原型**，以 TypeScript + Vite 重新打造。
以 AI 預分類的血球影像為基礎，模擬醫檢師從檢體進線、數位閱片到報告簽核回寫 LIS 的完整流程，供工程團隊開發正式系統時參考。

功能、畫面與規則結果與舊版原型相同（逐畫面截圖與規則對照測試確認），差異只有已確認的修正，列在 [`docs/CHANGES-FROM-LEGACY.md`](docs/CHANGES-FROM-LEGACY.md)。
舊版（純 JavaScript 原型）保留在標籤 `legacy-v1`。

> 本專案僅供研究與介面設計示範使用，非正式醫療資訊系統；所有資料皆為模擬資料。

---

## 快速開始

**線上展示**：<https://lindedeeden.github.io/blood-cell-classification-ui/>（GitHub Pages 由 `gh-pages` 分支提供，內容就是 `dist/`；`dist/` 更新後要同步更新該分支）

**直接使用**：雙擊 `dist/index.html`（建議 Chrome／Edge），不需安裝、不需連網。
測試帳密：`admin / admin` 或 `user / user`。

**開發**（需要 Node.js 20 以上）：

```text
npm install          安裝
npm run dev          開發預覽（http://localhost:5173）
npm run build        建置到 dist/
npm test             規則測試（含與舊版的對照）
npm run test:e2e     畫面巡覽測試（建置後以瀏覽器跑 75 個畫面）
npm run lint         型別檢查＋程式檢查（含分層規則）
```

---

## 使用角色

| 角色 | 工作 |
|------|------|
| **數位閱片醫檢師** | 在新介面閱片、調整細胞分類、簽核報告；需要時改為人工鏡檢 |
| **實體作業醫檢師** | 依清單取管拉片、取玻片，在清單標記完成 |

檢體依狀態膠囊自動分到「數位閱片清單」或「實體作業清單」，兩位醫檢師可同時處理。

---

## 主要流程

**登入 → 檢體管理 → 影像檢視與細胞編輯 → 報告簽核**

1. **檢體進線**：CellaVision 影像、AI 模型、WAM、LIS 四個來源依條碼合併，系統依規則加上狀態膠囊
2. **檢體管理**：依膠囊分流到兩個清單；可設定留單門檻
3. **影像檢視與細胞編輯**：檢視 AI 預分類的細胞並修正分類
4. **報告簽核**：依留單判斷顯示警示，簽核或改為人工鏡檢，結果回寫 LIS

完整規則（15 條）見工程團隊提交文件 2「邏輯規則說明文件」。

---

## 程式架構（大方向）

```text
domain   規則 1～15（純函式，不碰畫面與瀏覽器）
  ↑
data     四個來源的模擬資料、AI 模型模擬
  ↑
infra    瀏覽器儲存、模擬 API（登入、LIS）
  ↑
app      檢體的各種操作（簽核、改人工鏡檢、標記完成、LIS 撤回、門檻設定）
  ↑
ui       四個頁面的畫面程式
  ↑
demo     展示用：使用教學、情境模擬測試（可整包移除）
```

上層可以使用下層，下層不能使用上層（`npm run lint` 會檢查）。
轉為正式系統時，`domain` 的規則可以直接沿用；要替換的是 `data`（改接後端 API）與 `infra`（改呼叫真實的登入、LIS 介面）。

細節見 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)；安全設計與上線前檢查見 [`docs/SECURITY.md`](docs/SECURITY.md)。

---

## 專案結構

```text
index.html、檢體管理.html、     四個頁面（版面結構）
影像檢視與細胞編輯.html、報告核發.html
src/                           程式（domain、data、infra、app、ui、demo、pages）
public/assets/images/          細胞範例圖
tests/                         規則測試、與舊版的對照、畫面巡覽
tools/                         開發工具（截圖比對、狀態列舉、舊版資料轉換）
docs/                          規格、架構、安全、與舊版差異、設計決定（ADR）
dist/                          建置成品（雙擊 index.html 使用；改程式後執行 npm run build 一併更新）
```
