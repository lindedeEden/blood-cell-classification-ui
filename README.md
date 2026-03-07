# 血球型態分類軟體介面（前端 Demo）

本專案是「血球型態分類軟體」的前端介面 Demo，模擬醫檢師在實務工作中從：

**登入 → 檢體管理 → 影像檢視與細胞編輯 → 報告核發**

的一整套操作流程，所有資料來自前端內建的模擬資料庫 `assets/data/database.js`。

---

## 專案結構與主要檔案

```text
血球分類軟體介面設計專案/
├── index.html                      # 登入頁（demo，用帳密 admin/admin 或 user/user）
├── 檢體管理.html                   # 檢體管理主介面
├── 影像檢視與細胞編輯.html         # 影像檢視與細胞編輯介面
├── 報告核發.html                   # 報告核發介面（在影像檢視頁內以 iframe 彈出）
├── 血球分類軟體介面說明.txt        # 介面與規格說明
├── 附件一  林口長庚醫院留單標準.txt # 留單標準參考
├── README.md
└── assets/
    ├── data/
    │   └── database.js             # 模擬資料庫（病患 / 檢體 / 指標 / CBC / 其他發現 / 狀態）
    ├── css/
    │   └── common.css              # 共用樣式
    ├── js/
    │   ├── common.js               # 共用工具與導頁（取得檢體 ID、頁面跳轉等）
    │   ├── login.js                # 登入頁行為
    │   ├── specimen-list.js        # 檢體管理頁邏輯
    │   ├── image-review.js         # 影像檢視與細胞編輯行為（細胞顯示 / 多選 / 拖曳 / 單手模式等）
    │   └── report-issue.js         # 報告核發頁邏輯（風險橫幅 / 數據表格 / 簽核事件）
    └── images/
        └── README.txt              # 圖片資源說明
```

---

## 使用流程

### 1. 登入 (`index.html`)

1. 用瀏覽器直接開啟 `index.html`（建議 Chrome / Edge）。
2. 使用以下任一組帳密登入：
   - `admin / admin`
   - `user / user`
3. 驗證成功後自動導向 `檢體管理.html`。

### 2. 檢體管理 (`檢體管理.html`)

- **日期預設**：為方便測試，系統預設檢驗日期為 **2025-08-07 ~ 2025-08-07**。
- **篩選條件**：
  - 檢驗日期區間
  - 送檢單位
  - 機台 (DI1 / DI2)
  - 檢體 ID / 病歷號（可選擇完全相符或模糊搜尋）
  - 狀態（Digital Review / PLT Check / AI Alert / Follow-up / Verified）
- **列表操作**：
  - 單擊一列：右側「檢體總覽」顯示該檢體的病歷號、姓名、生日、科別與 WBC 差異表。
  - 雙擊一列或點「進入閱片」按鈕：帶著該檢體 ID 進入 `影像檢視與細胞編輯.html?specimen=ID`。
- **狀態膠囊**：
  - 依 `database.js` 中 `status` 陣列動態產生，例如 `PLT Check`、`Digital Review`、`AI Alert` 等。
  - `statusDone === true` 時（已在報告核發簽核完），會以 **綠色＋打勾** 標示。

### 3. 影像檢視與細胞編輯 (`影像檢視與細胞編輯.html`)

- **檢體資訊**（左側）：
  - 病歷號 / 姓名(性別) / 生日(年齡) / 科別 / 機台 / 檢體歸位。
  - 上方小字固定顯示「姓名(性別) / 生日(年齡)」，展開與收合皆可看到。
- **分析與歷史報告**（左側）：
  - 由 `metrics` / `prevReport` 生成，異常值會以紅色高亮（規則與規格文件一致）。
- **細胞區塊（右側主畫面）**：
  - 依檢體 `metrics` 內各百分比 → 動態產生各群組（Segmented / Lymphocyte / Blast...）與單一通用細胞圖示。
  - 不再有任何靜態 Demo HTML，完全由 `image-review.js` 控制。
- **細胞編輯操作**：
  - 左鍵單點 / Ctrl 多選 / Shift 連續選取（限定在同一群組）。
  - 單手模式：**按住右鍵不放 + 左鍵點擊多顆 → 放開右鍵跳出分類選單**。
  - 右鍵打開 context menu，可批次把選取細胞移到新分類。
  - 拖曳：選取多顆後拖到其他群組，也會一起改分類。
- **縮放功能**：
  - 右上方 `- 100% +` 控制整體細胞卡片大小（50%～200%），會重新調整 cell grid 排版，不會重疊。
- **儲存並核發報告**：
  - 若尚有未分類細胞或檢視進度 < 100%，會跳出防呆提示。
  - 條件通過時，會在同一頁開啟覆蓋層，內嵌 `報告核發.html?specimen=ID`。

### 4. 報告核發 (`報告核發.html`)

此頁面以 **iframe** 方式嵌在影像檢視頁的彈出視窗內。

- **頂部標題列**：
  - 僅顯示：檢體編號 `H5080xxxxx` ＋ 目前狀態膠囊（如 Digital Review / PLT Check 等）。
  - 若該檢體已被簽核（含 `Verified`），`Digital Review` 會變成 **綠色＋打勾** 的樣式。
- **風險警示橫幅**（紅 / 黃 / 綠）：
  - 根據 `metrics` 與門檻 `LEAVE_THRESHOLDS`：
    - 紅色：有留單條件細胞（例如 Blast / Promyelocyte present）。
    - 黃色：有異常血球但未達留單標準。
    - 綠色：目前指標皆在正常範圍。
- **血球分類計數 (WBC) 表格**：
  - 依規格分成兩段：
    - 常見細胞：Band → Seg → Eo → Mono → Baso → Lym → Atypical Lym。
    - 未成熟與異常細胞：Blast → Promyelocyte → Myelocyte → Metamyelocyte → Hypersegmented → Promonocyte → Plasma cell → Abnormal Lym。
  - 每列橫向展示四種數據：
    - Flow Cyt（`spec.flowCyt`）
    - AI（`spec.metrics`）
    - 人員編輯（目前同樣從 `metrics` 取值並以藍底高亮，可日後改成真實人工輸入）
    - 前次報告（`spec.prevReport`）
  - Flow Cyt 對於未成熟與異常細胞一律顯示 `-`，符合「流式儀不提供這些分類」的規格。
- **其他發現**：
  - 表格項目：NRBC, Giant PLT, Megakaryocyte, Smudge cell, Artefact。
  - 資料來源：`spec.metrics.nrbc` 等與 `prevReport` 中對應欄位（若無則顯示 `-`）。
- **CBC 數值**：
  - 顯示 WBC, RBC, Hb, HCT, MCV, MCH, MCHC, PLT。
  - 來源：`spec.cbc`，其中 WBC / PLT 直接沿用 `metrics.wbc` / `metrics.plt`，確保與 PLT Check 判斷一致。

- **簽核行為**：
  - 按「確認並簽核」：
    - 先跳出簡單確認視窗。
    - 通過後，透過 `postMessage` 回傳 `reportVerified` 事件給外層影像檢視頁。
    - 外層會：
      - 將該檢體 `status` 加上 `'Verified'`，並設定 `statusDone = true`。
      - 更新左側狀態膠囊（Digital Review 變綠色＋打勾）。
      - 從 Digital Review 清單中移除該檢體。
      - 關閉報告核發 overlay，導回 `檢體管理.html`。

> 目前沒有真正呼叫 LIS API，上述簽核流程是前端模擬；未來可在 `report-issue.js` 內補上實際 API 呼叫，再於成功後送出 `postMessage`。

---

## 技術與實作重點

- **樣式 / UI**
  - Tailwind CSS（CDN，含 `forms`、`container-queries` plugin）。
  - Google Fonts：`Inter`、`Noto Sans TC`。
  - Material Symbols 圖示（`<span class="material-symbols-outlined">`）。
  - 共用樣式：`assets/css/common.css`。

- **資料來源**
  - 單一模擬資料庫檔案：`assets/data/database.js`，包含：
    - `APP_DATABASE.specimens`：每筆檢體的病患資訊、狀態、指標、前次報告等。
    - `departments` / `machines`：供檢體管理篩選用。
  - 啟動時會額外做：
    - `ensureOtherFindingsFields()`：補齊 NRBC / Giant PLT / Megakaryocyte / Smudge cell / Artefact 欄位。
    - `ensureFlowCytData()`：依 `metrics` 產生 `flowCyt`，並對未成熟/異常欄位填 `-`。
    - `ensureCbcData()`：產生 `cbc` 數值（WBC / PLT 直接沿用原指標）。

- **共用工具 (`assets/js/common.js`)**
  - `getSpecimenIdFromUrl()`：從 URL query 取出 `specimen` 或 `id`。
  - `goToImageReview()` / `goToReportIssue()` / `goToSpecimenList()`：統一處理頁面間導頁。
  - `getSpecimenById()`：從 `MOCK_SPECIMENS`（由資料庫拷貝）中找到對應檢體。

---

## 開發與維護建議

- **檔案分工清楚**
  - 各頁面的邏輯已拆出到對應的 JS 檔案：`login.js`、`specimen-list.js`、`image-review.js`、`report-issue.js`，維護時只需要打開對應檔案即可。

- **未來要接後端 API 時**：
  - 優先修改的地方：
    - `database.js`：改為從後端拉資料或以 API 回傳取代內建常數。
    - `common.js`：將頁面跳轉與 `getSpecimenById` 改為與後端 ID 命名規則一致。
    - `report-issue.js`：「確認並簽核」處改為呼叫 LIS 上傳 API，成功後再 `postMessage`。

- **若要再拆 Tailwind 設定 / 共用 CSS**：
  - 可以把各 HTML 頁中 `<style type="text/tailwindcss">` 的共用部份集中成一支 CSS 檔，或改為 Tailwind CLI 編譯產出單一 CSS 檔，以利生產環境最佳化。

本 README 以目前最新版的程式碼為準，之後若有再增修功能（例如真正接後端、權限管理、更多報告欄位），建議更新此文件，補上資料流與流程變更說明。

---

## 版權聲明

本專案「血球型態分類軟體介面」之所有程式碼、介面設計、版面配置、圖示配置與互動流程，
由林晏德創作與設計，享有著作權及相關智慧財產權。
除法律明文許可或事先取得林晏德之授權外，
任何人不得對本專案內容進行下列行為：
- 複製、重製、散布、公開傳輸、公開展示或改作；
- 將本專案全部或一部，以任何形式整合至其他軟體或服務中；
- 以營利或非營利目的，對第三人提供下載、出租、出借或再授權。
