# 血球型態分類軟體介面（前端 Demo）

林口長庚醫院檢驗醫學科血液組之**前端示範**，模擬：

**登入 → 檢體管理 → 影像檢視與細胞編輯 → 報告核發**

Mock 資料：`assets/data/database.js`；檢體狀態、閱片快照等寫入 **localStorage**。架構說明見 **`ARCHITECTURE.md`**。

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
檢體管理.html                 # 清單／篩選／情境模擬
影像檢視與細胞編輯.html       # 閱片編輯
報告核發.html                 # 報告簽核（iframe）
src/                          # config、services、store
assets/data|js|css|images/    # Mock 資料、頁面腳本、樣式、細胞圖
```

**業務頁腳本順序（摘要）：**  
`config → cell-types → api/auth/specimen → app.store → requireAuth → database → common → 頁面腳本`

---

## 使用流程

### 登入
- Mock 帳密由 `AuthService` 驗證；成功寫入 sessionStorage，導向檢體管理
- 重新登入會還原檢體狀態；閒置逾時（預設 30 分鐘）自動登出

### 檢體管理
- **數位閱片**：預設 Digital Review、AI Alert
- **實體作業**：預設 Follow-up、PLT Check
- 雙擊列或「進入閱片」；數位已完成／Locked 為唯讀
- 「情境模擬測試」切換成效調查情境（`scenario-specimens.js`）

### 影像檢視與細胞編輯
- 左側：檢體資訊、狀態、分析表；右側：細胞分群
- **儲存結果**：須全部細胞已檢視且無 Unidentified；開啟 `報告核發.html` iframe
- 唯讀時不可改分類或簽核

### 報告核發
- 風險橫幅依留單門檻（紅／黃／綠）
- **改為人工鏡檢**／**簽核** 透過 `postMessage` 回傳父頁
- Demo 未接真實 LIS

### 整體完成
數位流程與實體流程皆完成 → `isSpecimenWorkflowCompleted()`

---

## 主要 localStorage 鍵

| 鍵 | 用途 |
|----|------|
| `blood-morphology-specimen-status` | 檢體狀態／workflow |
| `editedCells:<ID>` / `editedMetrics:<ID>` | 閱片快照 |
| `blood-morphology-leave-thresholds` | 留單門檻 |
| `blood-morphology-usability-scenario` | 成效調查情境 |
| `bhm_session_*`（sessionStorage） | 登入 session |

---

## 開發提示

| 任務 | 位置 |
|------|------|
| workflow／留單規則 | `common.js`、`specimen.service.js` |
| 接後端 | `api.service.js`、`AppConfig.ENV` |
| 情境劇本 | `scenario-specimens.js` |
| 避免快取舊腳本 | 更新 HTML 內 `?v=` |

---

## 用途

本專案僅供**研究與介面設計示範**使用，非正式醫療資訊系統。
