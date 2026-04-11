# 血球型態分類軟體介面（前端 Demo）

本專案為**林口長庚醫院檢驗醫學科血液組**血球型態閱片流程之**前端示範（Demo）**，模擬醫檢師從：

**登入 → 檢體管理 → 影像檢視與細胞編輯 → 報告核發**

的完整操作路徑。資料來自內建 **`assets/data/database.js`**；部分狀態會寫入瀏覽器 **本機儲存**，以便連續操作（詳見下文「本機資料與重設」）。

更精簡的條列說明可同時參考 **`血球分類軟體介面說明.txt`**。

---

## 專案結構與主要檔案

```text
血球分類軟體介面設計專案/
├── index.html                      # 登入頁（demo：admin/admin 或 user/user）
├── 檢體管理.html                   # 檢體管理主介面
├── 影像檢視與細胞編輯.html         # 影像閱片與細胞編輯
├── 報告核發.html                   # 報告核發（由閱片頁以 iframe 彈出）
├── 血球分類軟體介面說明.txt        # 定稿摘要（條列）
├── 附件一  林口長庚醫院留單標準.txt # 留單標準參考
├── README.md                       # 本檔：完整說明
└── assets/
    ├── data/
    │   └── database.js             # 模擬資料庫（檢體／指標／CBC／狀態等）
    ├── css/
    │   ├── common.css
    │   └── tutorial.css            # 使用教學覆蓋層
    ├── js/
    │   ├── common.js               # 導頁、留單門檻、workflow、狀態持久化等
    │   ├── login.js
    │   ├── image-review.js         # 閱片、細胞群組、單手模式、報告 iframe
    │   ├── report-issue.js         # 報告畫面、風險橫幅、簽核 postMessage
    │   └── tutorial.js             # 步驟式教學（跨頁狀態）
    └── images/
        └── README.txt              # 細胞示意圖放置說明
```

---

## 使用流程（定稿）

### 1. 登入（`index.html`）

1. 以瀏覽器開啟 `index.html`（建議 Chrome / Edge）。
2. 帳密：`admin / admin` 或 `user / user`。
3. 成功後寫入 **sessionStorage**（目前登入帳號），並導向 `檢體管理.html`。
4. **建議務必由此登入**：列表「**編輯人員**」於檢體**整體流程完成**時，會使用登入帳號寫入；未登入則通常為空白。

> **重設 Demo 狀態**：再次登入成功時會清除檢體狀態覆寫鍵（`blood-morphology-specimen-status`），還原為 `database.js` 初始資料，方便重新展示。

---

### 2. 檢體管理（`檢體管理.html`）

- **日期預設**：為便於測試，預設檢驗日期為 **2025-08-07 ~ 2025-08-07**（可改）。
- **雙模式分流**（可再點同一模式還原較寬鬆篩選）  
  - **數位閱片模式**：優先列出尚待完成**數位閱片**之檢體（含 `Digital Review` 且未完成者）。  
  - **實體作業模式**：列出需**實體處置**之檢體（拉片、血小板、AI／人工警示等）。
- **篩選**：可勾選 PLT Check、AI Alert、Follow-up、Digital Review、Manual Alert、Verified、Locked 等；並支援日期區間、送檢單位、機台、檢體 ID／病歷號（可完全相符）、表頭排序（時效、檢體 ID、分析時間）。
- **模式與條件記憶**：模式、勾選、日期、單位、機台、搜尋字串、排序等會保存，返回本頁時還原。
- **列表與右側總覽**：點列可於右側看檢體資訊與流式／AI／前次報告對照；異常達門檻者紅色強調（門檻由右上角 **系統設定** 調整，與閱片側欄、報告風險共用）。
- **狀態膠囊**：依檢體 `status` 動態產生。實體相關膠囊在 **實體作業** 模式下可**直接點擊**切換完成（PLT Check / Follow-up / AI Alert / Manual Alert）；完成後視覺上轉為綠底打勾（依流程而定）。
- **Locked**：他人編輯中；列表無法由此進入**編輯**閱片（可搭配唯讀規則，見閱片頁）。
- **進入閱片**：雙擊列或按「進入閱片」。數位閱片已完成者可「**唯讀檢視**」。符合條件時可於列上**右鍵**將個案**退回 Digital Review**。
- **「編輯人員」欄**：於檢體 **整體流程完成**（見下節）時寫入最後關閉者；流程退回未完成則清空。完成與否的判定與 **`isSpecimenWorkflowCompleted`** 一致（無須數位或無須實體之檢體，該邊不強制兩個 workflow 旗標皆為 `true`）。

---

### 3. 整體完成判定（數位 + 實體）

- **數位閱片**：若檢體狀態**不含** `Digital Review`，視為無須數位閱片，該邊完成。  
- **實體作業**：若**沒有任何**實體相關狀態（PLT Check、Follow-up、AI Alert、Manual Alert），視為無須實體流程；否則需完成對應膠囊／流程旗標。  
- 持久化時 **`statusDone`／是否清空編輯人員** 與 **`computeSpecimenStatusDoneFromWorkflow`**（`common.js`）一致，**不**僅以 `digitalReview && entityReview` 兩個布林簡單相乘，以免「僅 Digital Review」或「僅 AI Alert」等檢體無法正確顯示完成與編輯人員。

---

### 4. 影像檢視與細胞編輯（`影像檢視與細胞編輯.html`）

- **唯讀**：若檢體 **Locked**，或數位閱片已完成且進入唯讀情境，頁面會顯示橫幅，**無法**改分類、無法按「儲存並核發報告」。
- **左側**：返回列表、檢體 ID、狀態膠囊、**Add Flag**（Manual Alert 與 Digital Review 互斥）、搜尋／上一筆／下一筆（待數位閱片清單會**略過 Locked**）、檢體資訊與分析表（門檻同系統設定）。
- **右側**：細胞依類別分群，達留單門檻者強調；異常群組（如 Blast）置頂並紅色樣式。
- **操作**：左鍵／Ctrl 多選／同群組 Shift 範圍選；拖曳或右鍵選單改分類；**單手模式**（長按右鍵搭配左鍵錨點與範圍）；細胞縮放 50%～200%。
- **儲存並核發報告**：進度與 Unidentified 防呆通過後，於同頁開啟覆蓋層，內嵌 **`報告核發.html?specimen=ID`**。人工修訂後之比例可寫入 **`localStorage`**（`editedMetrics:<檢體ID>`），供報告「人員編輯」欄優先顯示。

---

### 5. 報告核發（`報告核發.html`，iframe）

- **版面**：此頁 Tailwind 設定 **`darkMode: 'class'`** 且根節點不帶 `dark`，**固定淺色**，避免與系統深色模式併用時在 Chrome／Edge 呈現不一致。
- **風險橫幅（三色）**（依 `LEAVE_THRESHOLDS`、前次報告與有效指標判定）  
  - **紅色**：本次出現**新發**留單條件。  
  - **黃色**：**延續性**異常（前次已同條件留單）。  
  - **綠色**：未達留單標準。  
  若醫檢師曾修改細胞分類，風險判讀可改以與 AI 不同之**人員編輯**為準（見 `report-issue.js`）。
- **紅色橫幅時**：可顯示「改為人工鏡檢」等動作，將檢體標為 **Manual Alert**、返回列表，轉由**實體作業**待辦處理。
- **WBC 表**：橫向為流式計數、AI、人員編輯、前次報告；分「常見細胞」與「未成熟與異常細胞」兩段；達門檻列紅色強調。
- **簽核**：按「確認並簽核」透過 **`postMessage`**（`reportVerified`）通知外層，標記該檢體 **數位閱片流程完成**（`workflowDone.digitalReview`）。  
  - **綠／黃**：可依設定**帶往下一筆**待數位閱片。  
  - **紅（新發留單）**：預設**不**自動跳下一筆（見 `report-issue.js`）。

> 未實際呼叫 LIS；正式上線時可在 `report-issue.js` 於成功 API 後再 `postMessage`。

---

### 6. 使用教學（`assets/js/tutorial.js`）

- 由 **檢體管理** 頂部「**使用教學**」開啟；步驟與文案以程式內嵌為準（定稿與 **教學模式** 同步）。
- 跨頁延續使用 `localStorage` 鍵（如 `bloodCellTutorialPhase`）；完成或跳過後可再次從選單重播。

---

## 技術與實作重點

- **樣式**：Tailwind CSS（CDN）、Material Symbols、共用 `common.css`／`tutorial.css`。
- **資料**：`database.js` 啟動時可補齊 flow／CBC／其他發現等欄位（見檔案內註解與函式）。
- **`common.js`（摘要）**  
  - 導頁、`getSpecimenById`、`LEAVE_THRESHOLDS`、留單與異常判定。  
  - `workflowDone`：`isDigitalReviewDone`、`isEntityReviewDone`、`isSpecimenWorkflowCompleted`。  
  - **`persistSpecimenStatusOverride` / `applySpecimenStatusOverridesFromStorage`**：與列表、簽核、膠囊點擊共用；未完成整體流程時**不保留**「編輯人員」字串。  
  - **`getCurrentUserAccount()`**：由 sessionStorage 讀取登入帳號。  
  - **`goToImageReview`**：Locked 且非唯讀時不導向編輯閱片。
- **`report-issue.js`**：`getRiskState`、`applyRiskBanner`、表格建置、`reportVerified`／`reportManualAlert` 與父頁通訊。

---

## 開發與維護建議

- 列表／篩選主要邏輯在 **`檢體管理.html`** 內嵌腳本；其餘行為分散於上表 JS。
- 接後端時優先替換 **`database.js`** 資料來源、**`common.js`** 身分與 ID 規則、**`report-issue.js`** 簽核 API。
- 更新 **HTML 內嵌之 `?v=`** 查詢參數，可避免瀏覽器快取舊版腳本。

本 README 以**定稿**程式行為為準；若日後功能變更，請同步更新 **README.md**、**血球分類軟體介面說明.txt** 與 **`tutorial.js`** 教學文案。

---

## 版權聲明

本專案「血球型態分類軟體介面」之所有程式碼、介面設計、版面配置、圖示配置與互動流程，
由林晏德創作與設計，享有著作權及相關智慧財產權。
除法律明文許可或事先取得林晏德之授權外，
任何人不得對本專案內容進行下列行為：
- 複製、重製、散布、公開傳輸、公開展示或改作；
- 將本專案全部或一部，以任何形式整合至其他軟體或服務中；
- 以營利或非營利目的，對第三人提供下載、出租、出借或再授權。
