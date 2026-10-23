# 血球型態分類軟體介面（前端 Demo）

林口長庚醫院檢驗醫學科血液組之**前端示範**，模擬：

**登入 → 檢體管理 → 影像檢視與細胞編輯 → 報告核發**

模擬資料：`assets/data/sources/`（CellaVision 資料庫影像、AI 模型辨識結果、WAM、LIS）依條碼合併成 `assets/data/database.js`；檢體狀態、人員編輯結果等寫入瀏覽器 **localStorage**。架構說明見 **`ARCHITECTURE.md`**。

---

## 快速開始

1. 以瀏覽器開啟 `index.html`（建議 Chrome / Edge）
2. 帳密：`admin / admin` 或 `user / user`
3. 登入後進入檢體管理

GitHub Pages：`https://lindedeEden.github.io/blood-cell-classification-ui/`

---

## 專案結構

```text
index.html                    # 登入
檢體管理.html                 # 清單／篩選／留單標準設定
影像檢視與細胞編輯.html       # 閱片編輯
報告核發.html                 # 報告簽核（iframe）
src/                          # 設定、常數、規則（留單／流程）、API 與登入服務（不含畫面程式）
assets/js/core/               # 各頁共用：瀏覽器儲存、檢體資料與動作、頁面跳轉、共用畫面工具
assets/js/pages/              # 各頁程式
assets/data/                  # 模擬資料、細胞範例圖對照
demo/                         # 展示用：使用教學、情境模擬測試（可整個移除）
tests/run-tests.js            # 規則單元測試：node tests/run-tests.js
```

詳細分層、載入順序、模組職責與轉為正式系統的替換點見 **`ARCHITECTURE.md`**。

---

## 使用流程

### 登入
- 模擬帳密由 `AuthService` 驗證；成功寫入 sessionStorage，導向檢體管理
- 每次登入會還原檢體狀態；閒置逾時（30 分鐘）自動登出

### 檢體管理
- **數位閱片**：預設 Digital Review、AI Alert
- **實體作業**：預設 Follow-up、PLT Check（點膠囊可標記完成）
- 雙擊列或「進入閱片」；數位已完成／鎖定中為唯讀
- 「留單標準設定」修改門檻後，未簽核檢體的 AI 分類警示立即重算
- 「情境模擬測試」（展示用）切換可用性研究情境

### 影像檢視與細胞編輯
- 左側：檢體資訊、狀態（僅顯示）、分析表；右側：細胞分群（達留單門檻者置頂標紅）
- **儲存結果**：須全部細胞已檢視且無 Unidentified；開啟報告核發 iframe

### 報告核發
- 風險橫幅依留單門檻（紅／黃／綠）
- **確認並簽核**、**需拉片確認：改為人工鏡檢**（模擬回寫 LIS；綠色要先開鎖）、**已拉片完成**

---

## 開發提示

| 任務 | 位置 |
|------|------|
| 留單規則 | `src/rules/leave-rules.js`（門檻預設值在 `src/config/config.js`） |
| 狀態與流程規則 | `src/rules/workflow-rules.js` |
| 細胞類別、表格列 | `src/constants/cell-types.js` |
| 狀態名稱與顏色 | `src/constants/status.js` |
| 簽核等動作、狀態保存 | `assets/js/core/specimen-store.js` |
| 接後端 | `src/services/api.service.js`、`AppConfig.ENV` |
| 避免瀏覽器快取舊檔 | 修改 js／css 後更新各 HTML 的 `?v=` |

---

## 用途

本專案僅供**研究與介面設計示範**使用，非正式醫療資訊系統。
