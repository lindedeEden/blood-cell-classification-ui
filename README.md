# 血球型態分類軟體介面（前端 Demo）

本專案為**林口長庚醫院檢驗醫學科血液組**血球型態閱片流程之**前端示範（Demo）**，模擬醫檢師從：

**登入 → 檢體管理 → 影像檢視與細胞編輯 → 報告核發**

的完整操作路徑。資料來自內建 **`assets/data/database.js`**；檢體狀態、閱片編輯快照、留單門檻等會寫入瀏覽器 **localStorage**，以便連續操作。

狀態膠囊與雙流程（數位／實體）的詳細說明可另參考 **`狀態膠囊流程說明.docx`**；留單數值標準可參考 **`附件一  林口長庚醫院留單標準.txt`**。

---

## 專案結構與主要檔案

```text
血球分類軟體介面設計專案/
├── index.html                          # 登入頁（demo：admin/admin 或 user/user）
├── 檢體管理.html                       # 檢體管理主介面（含大量內嵌腳本）
├── 影像檢視與細胞編輯.html             # 影像閱片與細胞編輯
├── 報告核發.html                       # 報告核發（由閱片頁以 iframe 彈出）
├── 狀態膠囊流程說明.docx               # 狀態膠囊流程圖與文字說明（可由腳本重新產生）
├── 狀態膠囊樣式對照圖.png              # 膠囊待辦／完成樣式對照圖
├── 附件一  林口長庚醫院留單標準.txt    # 留單標準參考
├── build_status_capsule_flow_docx.py   # 產生「狀態膠囊流程說明.docx」
├── generate_status_capsule_chart.py    # 產生「狀態膠囊樣式對照圖.png」
├── README.md                           # 本檔：完整說明
└── assets/
    ├── data/
    │   ├── database.js                 # 模擬資料庫（檢體／指標／CBC／狀態等）
    │   └── cell-sample-images.js       # 細胞示意圖路徑對照
    ├── css/
    │   ├── common.css
    │   └── tutorial.css                # 使用教學覆蓋層
    ├── js/
    │   ├── common.js                   # 導頁、留單門檻、workflow、狀態持久化等
    │   ├── login.js
    │   ├── image-review.js             # 閱片、細胞群組、單手模式、報告 iframe
    │   ├── report-issue.js             # 報告畫面、風險橫幅、簽核 postMessage
    │   └── tutorial.js                 # 步驟式教學（跨頁狀態）
    └── images/
        └── cells/                      # 細胞示意圖
```

---

## 使用流程

### 1. 登入（`index.html`）

1. 以瀏覽器開啟 `index.html`（建議 Chrome / Edge）。
2. 帳密：`admin / admin` 或 `user / user`。
3. 成功後寫入 **sessionStorage** 鍵 `blood-morphology-user-account`（目前登入帳號），並導向 `檢體管理.html`。
4. **建議務必由此登入**：列表「**編輯人員**」於檢體**整體流程完成**時，會使用登入帳號寫入；未登入則通常為空白。

> **重設 Demo 狀態（部分）**：再次登入成功時，`login.js` 會清除 localStorage 鍵 **`blood-morphology-specimen-status`**（檢體狀態／workflow 覆寫），使檢體流程還原為 `database.js` 初始值。  
> 另會嘗試清除 `editedCells:*`、`editedMetrics:*` 閱片編輯快照，但登入頁**未載入** `common.js`，該清除函式可能無法執行；若 Demo 後報告「人員編輯」仍顯示舊值，請手動清除瀏覽器 localStorage 或於開發者工具刪除對應鍵。  
> 列表的篩選／模式／排序等 UI 狀態保存在 **`blood-morphology-specimen-list-ui-state`**，重新登入**不一定**重設（除非手動清除或點同一模式 tab 還原）。

業務頁面**未強制**登入守衛，可直接開啟 `檢體管理.html` 等 URL（Demo 用途）。

---

### 2. 檢體管理（`檢體管理.html`）

#### 雙模式分流

再點同一模式 tab 可還原為較寬鬆篩選（狀態全勾）。

| 模式 | 預設狀態篩選 | 清單邏輯 |
|------|-------------|---------|
| **數位閱片** | Digital Review、AI Alert | 套用 `shouldExcludeFromDigitalSpecimenList()`：列出仍有**數位待辦**者；**排除** AI + Follow-up 雙旗標、以及數位已完成僅剩實體待辦者 |
| **實體作業** | Follow-up、PLT Check | 依勾選狀態篩選；無專用 exclude 演算法 |

**清單歸屬重點（`common.js`）：**

- **僅 AI Alert** → 數位閱片清單。
- **AI + Follow-up** → **僅**實體作業清單（數位清單排除）；拉片完成時一併確認 AI。
- **AI + PLT Check** → **數位與實體清單皆可能出現**（兩軌獨立待辦，無雙旗標特殊規則）；PLT 完成**不會**自動確認 AI。
- **整體已完成** → 勾選 Verified 篩選時仍可見。

#### 篩選與列表

- **日期預設**：2025-08-07 ~ 2025-08-07（Demo 用，可改）。
- **狀態勾選**：PLT Check、AI Alert、Follow-up、Digital Review、Verified、Locked（**無** Manual Alert 勾選；舊版 Manual Alert 已併入 Follow-up）。
- 另支援：日期區間、送檢單位、機台、檢體 ID／病歷號（可完全相符）、表頭排序（時效、檢體 ID、分析時間）。
- **模式與條件記憶**：保存於 localStorage，返回本頁時還原。
- **列表右側總覽**：流式／AI／前次報告對照；異常列紅色標示。**注意**：此處高亮目前為**內嵌固定門檻**，與右上角「系統設定」尚未完全同步；**閱片頁分析表**與**報告風險橫幅**則共用 `LEAVE_THRESHOLDS`（可自系統設定覆寫）。

#### 狀態膠囊

依檢體 `status` 動態產生；待辦為原色，完成後轉**綠底打勾**（依 `workflowDone` 判定）。

| 膠囊（內部 key） | 顯示名稱 | 所屬流程 | 列表點擊切換完成 |
|-----------------|---------|---------|----------------|
| Digital Review | 數位閱片 | 數位 | 否（簽核／改為人工鏡檢時標完成） |
| AI Alert | AI分類警示 | 數位 | 否（簽核或改為人工鏡檢時確認） |
| PLT Check | 血小板確認 | 實體 | **是**（實體模式） |
| Follow-up | 需拉片確認 | 實體 | **是**（實體模式） |
| Locked | 鎖定中 | — | 否（`spec.locked`，資料庫欄位） |
| Verified | 已完成 | — | 不渲染膠囊，僅作篩選 |

> 舊版 **Manual Alert** 讀取時由 `migrateLegacyManualAlertStatus()` 自動併入 **Follow-up**。

#### 進入閱片與唯讀

- **雙擊列**或按「**進入閱片**」。
- **唯讀檢視**：數位閱片已完成（`isDigitalReviewReadOnly()`）時顯示；含**簽核結案**或**改為人工鏡檢交接後**兩種唯讀情境。
- **Locked**：無法進入編輯閱片。
- **右鍵選單**：數位閱片已完成之列可「**退回 Digital Review**」（`reopenDigitalReview()`），重開數位流程。

#### 編輯人員欄

檢體**整體流程完成**（`isSpecimenWorkflowCompleted`）時寫入登入帳號；流程退回未完成則清空。

---

### 3. 整體完成判定（數位 + 實體）

由 `common.js` 的 `isSpecimenWorkflowCompleted()` 判定：**數位流程完成** 且 **實體流程完成**。

#### 數位流程（`isDigitalWorkflowDone`）

| 條件 | 判定 |
|------|------|
| 狀態**不含** Digital Review | 視為該項無須處理 → 通過 |
| 含 Digital Review | 需 `workflowDone.digitalReview === true` |
| 狀態**不含** AI Alert | 視為該項無須處理 → 通過 |
| 含 AI Alert | 需 `workflowDone.aiAlertConfirmed === true` |

#### 實體流程（`isEntityReviewDone`）

實體膠囊集合為 **`ENTITY_REVIEW_STATUS_SET = ['PLT Check', 'Follow-up']`**（**不含** AI Alert）。

| 條件 | 判定 |
|------|------|
| 狀態**不含** PLT Check 且**不含** Follow-up | 視為無須實體流程 → 通過 |
| 含 PLT Check 或 Follow-up | 各膠囊需 `workflowDone.entityStatusDone[key] === true` |

持久化時 **`statusDone`／是否清空編輯人員** 與 **`computeSpecimenStatusDoneFromWorkflow`** 一致。已完成檢體列表**時效顯示為 0**、排序沉底。

---

### 4. 影像檢視與細胞編輯（`影像檢視與細胞編輯.html`）

#### 唯讀模式（`isDigitalReviewReadOnly` / `spec.locked`）

| 情境 | 橫幅語意 |
|------|---------|
| Locked | 他人編輯中 |
| 改為人工鏡檢交接後 | 已交接至需拉片確認，顯示數位編輯快照 |
| 數位閱片已簽核結案 | 已簽核結案，僅能檢視 |

唯讀時：可瀏覽、縮放；**不可**改分類、Add Flag、「儲存並核發報告」。

#### 操作

- **左側**：返回列表、檢體 ID、狀態膠囊、**Add Flag**（AI Alert / PLT Check / Follow-up / Digital Review）、搜尋／上一筆／下一筆（待數位閱片清單**略過 Locked**）、檢體資訊與分析表。
- **右側**：細胞依類別分群，達留單門檻者強調；異常群組置頂。
- 左鍵／Ctrl 多選／Shift 範圍選；拖曳或右鍵改分類；**單手模式**；細胞縮放 50%～200%。
- **儲存並核發報告**：須全部細胞已檢視且無 Unidentified；開啟 iframe **`報告核發.html?specimen=ID`**。人工修訂寫入 localStorage（`editedMetrics:<檢體ID>`、`editedCells:<檢體ID>`）。

Add Flag 選項中的 Manual Alert 會映射為 **Follow-up**（`image-review.js`）。

---

### 5. 報告核發（`報告核發.html`，iframe）

- **版面**：Tailwind `darkMode: 'class'`，根節點不帶 `dark`，固定淺色。
- **風險橫幅**（依 `LEAVE_THRESHOLDS`、前次報告、有效指標；人員編輯優先）  
  - **紅色**：本次**新發**留單條件。  
  - **黃色**：**延續性**異常。  
  - **綠色**：未達留單標準。
- **紅色橫幅 — 改為人工鏡檢**：標記數位閱片完成（交接）、確認 AI（若有）、加入 **Follow-up** 待辦，返回列表轉**實體作業**；數位閱片頁進入**交接唯讀**。
- **已拉片完成**：有待辦 Follow-up 時顯示；標記拉片完成（`markFollowUpReviewDone`）。
- **開鎖強制簽核**：紅色留單或待拉片時，可開鎖後強制簽核（略過拉片條件）。
- **WBC 表**：流式計數、AI、人員編輯、前次報告；達門檻列紅色強調。
- **簽核**：「確認並簽核」→ `postMessage({ type: 'reportVerified', ... })`  
  - **綠／黃**：可**自動帶往下一筆**待數位閱片。  
  - **紅（新發留單）**：預設**不**自動跳下一筆。

> 未實際呼叫 LIS；正式上線時請在 API 成功後再 `postMessage`。

---

### 6. 使用教學（`assets/js/tutorial.js`）

- 由檢體管理頂部「**使用教學**」開啟；跨頁延續使用 localStorage（如 `bloodCellTutorialPhase`）。
- 功能變更時請同步更新 **`tutorial.js`** 文案（部分教學仍可能與最新程式略有落差）。

---

## 本機資料與儲存鍵

| 鍵 | 用途 |
|----|------|
| `blood-morphology-specimen-status` | 檢體 status、workflowDone、editor 覆寫 |
| `editedCells:<檢體ID>` | 閱片細胞分類快照 |
| `editedMetrics:<檢體ID>` | 人員編輯比例（報告優先顯示） |
| `blood-morphology-leave-thresholds` | 留單門檻（系統設定） |
| `blood-morphology-specimen-list-ui-state` | 列表模式、篩選、排序等 UI |
| `blood-morphology-specimen-list-mode` | 數位／實體模式 tab |
| `blood-morphology-user-account`（sessionStorage） | 登入帳號 |
| `bloodCellTutorial*` | 教學進度 |

---

## 技術與實作重點

- **樣式**：Tailwind CSS（CDN）、Material Symbols、`common.css`／`tutorial.css`。
- **資料**：`database.js` 啟動時補齊 flow／CBC／其他發現等欄位；`MOCK_SPECIMENS` 與記憶體物件可被 localStorage 覆寫。
- **`common.js`（核心 API）**  
  - 導頁：`goToImageReview`、`goToSpecimenList`、`goToReportIssue`  
  - 留單：`LEAVE_THRESHOLDS`、`isAbnormalMetricValue`、`hasAnyNewLeaveCondition`  
  - Workflow：`isDigitalReviewDone`、`isAiAlertConfirmed`、`isEntityReviewDone`、`isSpecimenWorkflowCompleted`、`isDigitalReviewReadOnly`、`reopenDigitalReview`  
  - 清單：`shouldExcludeFromDigitalSpecimenList`、`hasPendingDigitalReviewWork`、`isAiAlertAndFollowUpSpecimen`  
  - 持久化：`persistSpecimenStatusOverride`、`applySpecimenStatusOverridesFromStorage`  
  - 身分：`getCurrentUserAccount()`
- **`report-issue.js`**：`getRiskState`、`applyRiskBanner`、簽核與父頁 **postMessage** 契約：
  - `reportVerified` — 簽核完成  
  - `reportManualAlert` — 改為人工鏡檢（加入 Follow-up）  
  - `reportFollowUpDone` — 已拉片完成  
  - `specimenDataUpdated` — 父頁通知 iframe 刷新
- **iframe 通訊**：目前 `postMessage` 使用 `targetOrigin: '*'`（Demo）；正式環境應限定 origin。

---

## 開發與維護建議

- 列表／篩選／側欄主要邏輯在 **`檢體管理.html` 內嵌腳本**（約 800+ 行）；workflow 規則以 **`common.js`** 為準，修改時避免三處（列表、閱片、報告）邏輯分叉。
- 接後端時優先替換：**`database.js`** 資料來源、**`common.js`** 身分與持久化、**`report-issue.js`** 簽核 API。
- 更新 HTML 內 **`?v=`** 查詢參數，避免瀏覽器快取舊版腳本。
- 重新產生狀態膠囊說明文件：`python build_status_capsule_flow_docx.py`
- 重新產生膠囊樣式對照圖：`python generate_status_capsule_chart.py`

本 README 以**目前程式行為**為準。功能變更時請同步更新 **README.md**、**`tutorial.js`** 教學文案，以及 **`狀態膠囊流程說明.docx`**（若適用）。

---

## 版權聲明

本專案「血球型態分類軟體介面」之所有程式碼、介面設計、版面配置、圖示配置與互動流程，
由林晏德創作與設計，享有著作權及相關智慧財產權。
除法律明文許可或事先取得林晏德之授權外，
任何人不得對本專案內容進行下列行為：
- 複製、重製、散布、公開傳輸、公開展示或改作；
- 將本專案全部或一部，以任何形式整合至其他軟體或服務中；
- 以營利或非營利目的，對第三人提供下載、出租、出借或再授權。
