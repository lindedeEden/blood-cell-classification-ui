# 程式架構說明

> 對象：工程團隊／之後維護原型的人
> 更新：2026-10-23
> 規則內容請以《邏輯規則說明文件》為準；本文件只說明「規則寫在哪個檔案、檔案之間怎麼串」。
> 程式註解與測試名稱中的「規則 N」對應《邏輯規則說明文件》（v4.29）的規則 1～15（依處理流程排序；登入不編規則號，見 1.1 節）。

---

## 1. 定位

這是**前端原型**：沒有後端，檢體資料由 `assets/data/sources/` 的四份模擬資料（CellaVision 資料庫的 DI-60 影像、AI 模型（林口人工智慧中心）的辨識結果、WAM、LIS）依條碼合併而成（`database.js`），操作結果存在瀏覽器（localStorage／sessionStorage）。

程式分成三種性質，放在不同資料夾：

| 性質 | 資料夾 | 正式系統 |
|------|--------|----------|
| 規則、設定、常數、API 介面（不碰畫面） | `src/` | **可直接沿用**或照著移植到後端 |
| 畫面程式、瀏覽器儲存、模擬資料 | `assets/` | 依正式系統的前端技術重寫；`assets/data/` 改由後端 API 提供 |
| 展示用（教學導覽、情境模擬測試） | `demo/` | **不需要**，整個資料夾可移除 |

---

## 2. 資料夾結構

```text
index.html                     登入
檢體管理.html                  檢體清單、篩選、留單標準設定
影像檢視與細胞編輯.html        細胞影像閱片與重新歸類
報告核發.html                  報告簽核（通常以 iframe 嵌在影像檢視頁）

src/                           ── 規則與服務（不含畫面程式）
  config/config.js             AppConfig：環境、API 位址、留單門檻預設值、頁面檔名、儲存 key
  constants/cell-types.js      CellConstants：細胞類別、類別↔欄位對照、各表格的列定義
  constants/status.js          StatusConstants：狀態膠囊名稱、顏色、模式預設篩選
  rules/intake-merge.js        IntakeMerge：進線與合併（第 2 節）：依條碼合併 CellaVision 影像、AI 模型、WAM、LIS
  rules/leave-rules.js         LeaveRules：留單判斷（第 3 節、規則 1）
  rules/workflow-rules.js      WorkflowRules：膠囊、工作分流、簽核與完成（第 3、4、6～8 節）
  services/api.service.js      ApiService：HTTP 出入口；開發模式使用模擬路由
  services/auth.service.js     AuthService：登入、登出、閒置登出、頁面登入檢查
  services/ai-model.service.js AiModelService：AI 模型（林口人工智慧中心）讀取 CellaVision 影像、逐顆預分類（原型為模擬）

assets/
  css/common.css               共用樣式
  data/sources/cellavision-db.js  模擬 CellaVision 資料庫（SOURCE_CELLAVISION）：DI-60 拍的細胞影像（每顆 cellId、影像路徑）、機台、歸位、分析時間
  data/sources/ai-model-mock.js  AI 模型模擬設定（AI_MODEL_MOCK_SETTINGS）：範例圖資料夾→類別、信心值、指定誤判、沿用研究數值的檢體
  data/sources/wam.js          模擬來源 WAM（SOURCE_WAM）：CBC、Flow DC、CBC flag、Flow DC flag、PLT flag、SIS rule
  data/sources/lis.js          模擬來源 LIS（SOURCE_LIS）：病患資料、前次報告、需推片確認註記
  data/database.js             進線後的檢體（APP_DATABASE）＝四份資料合併結果＋展示用狀態（DEMO_STATE）
  images/cells/                細胞範例圖片
  js/core/                     ── 各頁共用
    ui-preload.js              <head> 最先執行：先套用字級與縮放，避免畫面跳動
    storage.js                 DemoStorage：所有瀏覽器儲存的唯一出入口
    lis-sync.js                LisSync：結果回傳 LIS（Diff%、非白血球、檢驗註記；規則 10、14）
    specimen-store.js          SpecimenStore：檢體資料存取與狀態變更動作
    navigation.js              AppNav：頁面跳轉
    ui-common.js               AppUi：字級、縮放、狀態膠囊、分析表資料
  js/pages/                    ── 各頁專屬
    login.js / specimen-list.js / image-review.js / report-issue.js

demo/                          ── 展示用，可整個移除
  tutorial.js, tutorial.css    使用教學（步驟式導覽）
  usability-study.js           情境模擬測試（可用性研究）
  usability-scenarios.js       各情境的檢體清單與任務說明

tests/run-tests.js             規則單元測試（node 執行）
tests/state-space.js           列舉所有膠囊狀態與工作分流（node tests/state-space.js）
```

---

## 3. 分層與載入順序

每個業務頁面依下列順序載入（HTML 內已用註解分段）：

```text
1. src/        config → cell-types → status → leave-rules → workflow-rules → intake-merge → api.service → auth.service → ai-model.service
2. 登入檢查    AuthService.requireAuth()（未登入導回 index.html）
3. 模擬資料    sources/cellavision-db → sources/ai-model-mock → sources/wam → sources/lis → database.js
4. demo/       usability-scenarios → usability-study → tutorial（可整段移除）
5. core/       storage → lis-sync → specimen-store → navigation → ui-common
6. 本頁程式    pages/*.js
```

依賴方向只能「往上」：下層不知道上層存在。

```text
pages/*.js ──► core/ ──► src/rules ──► src/constants ──► src/config
     │            │
     └────────────┴──► demo/（只在存在時使用：typeof UsabilityStudy !== 'undefined'）
```

- `src/rules/` 是**純邏輯**：只讀寫傳入的檢體物件，不碰畫面、不碰瀏覽器儲存，所以可以在 Node 測試。
- `SpecimenStore` 在載入時就完成初始化（套用門檻、計算 AI Alert、讀回已保存狀態），頁面拿到的檢體都是最新狀態。
- `demo/usability-study.js` 必須在 `specimen-store.js` 之前載入：它在載入時先記下情境檢體的原始資料，套用情境時用來還原。

---

## 4. 各模組職責與對應規則

| 模組 | 全域名稱 | 負責 | 主要規則 |
|------|----------|------|----------|
| `config.js` | `AppConfig` | 所有可調整設定（唯一來源） | 規則 1（留單門檻）、規則 7（門檻設定）、第 4 節（時效） |
| `cell-types.js` | `CellConstants` | 細胞類別順序、非白血球、類別↔欄位對照、表格列 | 規則 8（第 5、6 節） |
| `status.js` | `StatusConstants` | 狀態膠囊名稱／顏色、實體標籤、模式預設篩選 | 第 3 節（膠囊圖例）、第 4 節 |
| `intake-merge.js` | `IntakeMerge` | 依條碼合併 CellaVision 影像、AI 模型 結果、WAM、LIS 成檢體；逐顆影像＋預分類對應；AI 分類結果（Diff%）計算；條碼正規化、缺來源／格式不符／重複列為進線異常 | 第 2 節、附錄 A #3 |
| `leave-rules.js` | `LeaveRules` | 門檻、年齡（LIS）、單項判定、新發／延續、橫幅、AI Alert 條件、判定用數值 | 規則 1、4 |
| `workflow-rules.js` | `WorkflowRules` | 流程旗標、完成判定、唯讀、清單歸屬、篩選與排序、簽核／改人工鏡檢後的狀態 | 規則 1、5、9～13（第 4 節） |
| `api.service.js` | `ApiService` | HTTP、Token、逾時、錯誤格式；開發模式模擬路由 | 第 11 節 |
| `auth.service.js` | `AuthService` | 登入、登出、閒置 30 分鐘登出、頁面登入檢查 | 1.1 節（登入） |
| `storage.js` | `DemoStorage` | localStorage／sessionStorage 讀寫（key 見 7 節） | 規則 7（Demo） |
| `lis-sync.js` | `LisSync` | 結果回傳 LIS：簽核 → WBC Diff%、非白血球數據；改為人工鏡檢 → 「需拉片確認」；需拉片確認／血小板確認完成 → 「拉片完成」／「血小板確認完成」註記；開鎖直接核發 → 「數位閱片替代拉片鏡檢」 | 規則 10、14 |
| `specimen-store.js` | `SpecimenStore` | 取檢體、保存狀態、動作：簽核、改人工鏡檢、拉片完成、切換實體標籤、LIS 撤回後回到進線狀態（withdrawFromLis，介面無按鈕）、儲存人員編輯結果 | 規則 1、8～12、15 |
| `navigation.js` | `AppNav` | 頁面網址與跳轉、返回清單時還原模式 | — |
| `ui-common.js` | `AppUi` | 字級、縮放、膠囊顯示資訊、分析表資料、前次報告欄標 | 第 4～6 節 |

**新增或修改規則時：**
- 判斷邏輯 → `src/rules/`，並在 `tests/run-tests.js` 加測試案例
- 門檻數值或設定 → `src/config/config.js`
- 細胞類別、表格列 → `src/constants/cell-types.js`（三個頁面會一起生效）
- 狀態名稱、顏色 → `src/constants/status.js`

---

## 5. 一筆檢體的資料流

### 檢體資料結構（IntakeMerge.toSpecimen）

外部系統給的資料依來源分組，新介面自己產生的處理狀態放在 `review`，兩者不混在一起：

```text
{
  barcode: 'H5080720647',                檢體條碼（四份資料的對應鍵）
  imaging: {                             1. 影像與 AI 預分類結果
    analysisTime,                        CellaVision 資料庫：DI-60 取像時間
    cells: [{ cellId, imagePath, aiCategory, aiConfidence }],   每顆：CellaVision 影像＋AI 模型預分類
    aiDiff: { band, segmentedNeutrophil, …, nrbc, … }           AI 分類結果（Diff%）＝畫面上的「AI 值」（皆為 %，分母＝白血球總數；非白血球另算）
  },
  wam: {                                 2. WAM
    machine, location,                   玻片機台、檢體歸位
    cbc: { wbc, plt, rbc, hb, hct, mcv, mch, mchc },            CBC data
    flowDc: { … },                       Flow DC data
    cbcFlags, flowDcFlags, pltFlag, sisRules                     CBC flag、Flow DC flag、PLT flag（判斷 3）、SIS rule
  },
  lis: {                                 3. LIS
    patientId, name, gender, birthDate, age, department,        病患資料（age＝LIS 提供的年齡，留單門檻的年齡規則用）
    receivedTime,                        收件時間（清單時效＝收件到現在經過的分鐘數，每 120 秒更新，暫定）
    smearRequiredNote,                   「需推片確認」註記（判斷 2）
    prevReport: { date, wbc, plt, diff: { … } }                 前次報告（LIS 最近一次）
  },
  review: {                              新介面的處理狀態（SpecimenStore 管理，正式系統存新介面後端）
    status, workflowDone, statusDone,    膠囊、流程旗標、是否完成
    editor, locked,                      編輯人員、鎖定中（他人編輯中）
    editedDiff                           人員編輯值（影像檢視儲存後產生）
  }
}
```

程式中的 `specimenId`、`id` 參數與網址 `?specimen=` 都是檢體條碼（`spec.barcode`）。

判斷用的數值一律透過 LeaveRules 取得，不直接拼欄位：`aiValues(spec)`（WBC、PLT＋aiDiff）、`prevValues(spec)`（前次報告）、`effectiveValues(spec)`（規則 4：有人員編輯值時用人員編輯值）、`getAgeYears(spec)`（年齡）。

### 資料流

```text
sources/cellavision-db.js（影像）→ AiModelService.classifyAll（AI 模型預分類）；wam.js、lis.js（各以 barcode 為鍵）
  │  IntakeMerge.mergeByBarcode（database.js 載入時呼叫；第 2 節）
  │   - CellaVision 資料庫有影像，且 AI 結果、WAM、LIS 都有 → 合併成一筆檢體；缺任一份 → 暫不進線，記入 APP_DATABASE.intakeIssues
  │   - 檢體依資料來源分組：imaging（影像＋AI 預分類）、wam、lis；新介面的處理狀態另放 review（結構見下方）
  │   - 判斷 1 的 AI 值＝wam.cbc 的 WBC、PLT ＋ imaging.aiDiff（LeaveRules.aiValues）；判斷 2＝lis.smearRequiredNote；判斷 3＝wam.pltFlag
  ▼
database.js（APP_DATABASE.specimens；合併結果＋展示用狀態 DEMO_STATE）
  │  SpecimenStore 初始化：
  │   1. 讀回留單門檻（DemoStorage）
  │   2. WorkflowRules.intakeStatus → 依進線資料加膠囊（規則 1 CBC 與 AI 值、規則 2 LIS 註記、規則 3 PLT**）
  │   3. 整理流程旗標、計算是否完成
  │   4. 套用已保存的狀態（DemoStorage）→ 再依目前門檻校正未簽核者
  ▼
檢體管理（specimen-list.js）
  │  工作分流：WorkflowRules.inDigitalList／inEntityList／workQueue（規則 5）
  │  篩選／排序：WorkflowRules.matchesStatusFilter、showsCheckmark
  │  點實體標籤：SpecimenStore.toggleEntityStatus（規則 12）
  │  進入閱片：AppNav.goToImageReview
  ▼
影像檢視（image-review.js）
  │  細胞來源：已儲存的人員編輯結果 → 進線時合併好的 spec.imaging.cells（CellaVision 影像＋AI 模型 預分類）
  │  儲存結果：計算人員編輯值（規則 8）→ SpecimenStore.saveEditedResult → 開啟報告核發 iframe
  ▼
報告核發（report-issue.js，iframe）
  │  橫幅：LeaveRules.riskState（規則 4 自動選用人員編輯值或 AI 值）
  │  按鈕 → postMessage 給外層影像檢視頁（見 6 節）
  ▼
影像檢視收到訊息 → SpecimenStore.signOffReport／switchToManualReview／markFollowUpDone
  → 存入 DemoStorage → 返回檢體管理並顯示一次性提示
```

---

## 6. 頁面之間的溝通

**報告核發（iframe）→ 影像檢視（外層）：`window.parent.postMessage`**

| type | 時機 | 外層處理 |
|------|------|----------|
| `reportVerified` | 確認並簽核 | `SpecimenStore.signOffReport`；`navigateNextDigitalReview` 為 true 時開下一筆（規則 9） |
| `reportManualAlert` | 改為人工鏡檢（已呼叫 LIS 模擬 API） | 更新狀態，返回清單並提示 |
| `reportFollowUpDone` | 已拉片完成 | `SpecimenStore.markFollowUpDone`，返回清單 |
| `reportCancel` | 關閉 | 關閉 iframe |

外層 → 報告核發：`specimenDataUpdated`（簽核後請 iframe 重新整理）。
報告核發單獨開啟（不在 iframe 內）時，自己完成上述動作並返回清單。

**跨頁一次性提示**：動作完成後寫入 sessionStorage，檢體管理載入時讀出並刪除（`DemoStorage.queue*Toast`／`consume*Toast`）。

---

## 7. 瀏覽器儲存一覽

所有 key 定義在 `AppConfig.STORAGE_KEYS`，讀寫一律經由 `DemoStorage`。

| key | 儲存位置 | 內容 | 正式系統 |
|-----|----------|------|----------|
| `blood-morphology-font-level`、`-cell-image-zoom` | localStorage | 字級、細胞縮放 | 可保留 |
| `blood-morphology-specimen-list-mode`、`-list-ui-state` | localStorage | 清單模式與篩選條件 | 可保留 |
| `blood-morphology-leave-thresholds` | localStorage | 留單門檻 | **改存後端**（規則 7） |
| `blood-morphology-specimen-status` | localStorage | 各檢體狀態與流程旗標 | **改存後端**（第 11 節） |
| `blood-morphology-lis-writeback-log` | localStorage | 原型的 LIS 回寫紀錄（規則 14；`DemoStorage.readLisLog()` 可查看） | **刪除**（正式系統由後端寫入 LIS） |
| `editedCells:<條碼>`、`editedDiff:<條碼>` | localStorage | 人員編輯的細胞分類與人員編輯值（review.editedDiff） | **改存後端** |
| `blood-morphology-*-toast`、`-review-return-list-mode` | sessionStorage | 跨頁一次性訊息 | 可保留 |
| `bhm_session_token`、`bhm_session_user`、`blood-morphology-user-account` | sessionStorage | 登入資訊 | 依後端驗證機制 |
| `blood-morphology-usability-scenario` | localStorage | 展示用：目前情境 | 不需要 |

登入時（模擬路由）會清除檢體狀態與人員編輯結果，讓 Demo 每次從原始資料開始；留單門檻保留。

---

## 8. 展示用功能（demo/）

| 檔案 | 功能 | 與頁面的關係 |
|------|------|--------------|
| `tutorial.js`、`tutorial.css` | 使用教學 | 載入後依 `<body data-page="...">` 自動啟動，並綁定「使用教學」按鈕；頁面程式不呼叫它 |
| `usability-study.js`、`usability-scenarios.js` | 情境模擬測試 | 檢體管理呼叫 `UsabilityStudy.attachToSpecimenList(...)`；`SpecimenStore.listForDisplay()` 在情境啟用時只列出該情境檢體 |

**移除方式**：刪除 `demo/` 資料夾，並刪除各 HTML「4. 展示用」那一段 `<script>` 與 `demo/tutorial.css` 的 `<link>`；檢體管理頁上方的「使用教學」「情境模擬測試」按鈕與情境視窗也可一併刪除。頁面程式都有判斷 demo 是否存在，移除後照常運作（已實測）。

---

## 9. 測試

```bash
node tests/run-tests.js
node tests/state-space.js     # 列出所有可能的膠囊狀態、分流與可做的操作
```

不需安裝任何套件。測試 `LeaveRules`、`WorkflowRules`、`CellConstants` 的規則，案例對應《邏輯規則說明文件》第 2～10 節。修改規則後請先跑一次。

---

## 10. 轉為正式系統要替換的地方

**資料與 API**（`AppConfig.ENV = 'production'`、`API_BASE_URL` 改為實際網址）

| 規劃路由 | 用途 | 原型目前的做法 |
|----------|------|----------------|
| `POST /auth/login`、`POST /auth/logout` | 登入／登出 | 模擬路由（admin/admin、user/user） |
| `GET /specimens`、`GET /specimens/{barcode}` | 檢體清單與明細（第 11 節）；後端接收 AI 模型（讀取 CellaVision 資料庫影像後預分類）的結果，以 `IntakeMerge` 同樣規則與 WAM、LIS 合併 | `sources/*.js` → `IntakeMerge` → `database.js` |
| `PATCH /specimens/{barcode}/workflow` | 狀態與流程旗標 | `SpecimenStore.persistStatus` → localStorage |
| `PUT /specimens/{barcode}/edited-result` | 人員編輯的細胞分類與百分比 | `SpecimenStore.saveEditedResult` → localStorage |
| `GET／PUT /settings/thresholds` | 留單門檻（規則 7） | `SpecimenStore.saveThresholds` → localStorage |
| `POST /lis/withdrawal`（LIS → 新介面通知） | LIS 撤回（只限已簽核的數位閱片結果）：LIS 刪除 DC 數據；檢體回到進線狀態，檢體管理頁跳出撤回通知視窗（規則 15） | `SpecimenStore.withdrawFromLis`（原型未串接） |
| `POST /lis/results` | 簽核後回寫 WBC Diff%、非白血球數據（規則 14） | 模擬路由（LisSync） |
| `POST /lis/notes` | 回寫 LIS 檢驗註記：需拉片確認（規則 10）、拉片完成、血小板確認完成、數位閱片替代拉片鏡檢（規則 14） | 模擬路由（LisSync） |
| AI 模型 → 新介面（路由待確認，附錄 A #5） | 林口人工智慧中心的 AI 模型讀取 CellaVision 資料庫影像，傳入每顆細胞影像、預分類與信心值、AI 分類結果（Diff%） | `AiModelService`（src/services/ai-model.service.js）依範例圖資料夾模擬預分類 |

替換時只需改 `SpecimenStore`（呼叫 API 取代 `DemoStorage`）與 `assets/data/`；`src/rules/` 不需變動（`IntakeMerge` 可直接移植到後端，進線異常的處理待附錄 A #3 確認）。

**上線前必做**
- 帳密驗證只在後端；移除登入頁 Demo 提示與 `api.service.js` 的模擬路由
- 登入頁不載入病患資料（目前已做到）；所有 API 需權限控制、HTTPS、稽核紀錄（誰、何時、看了／改了什麼）
- 鎖定中（規則 6）由後端管理鎖定與釋放
- Tailwind 改為本地打包（目前使用 CDN），並設定 Content Security Policy
- 與 LIS 的介面測試（HL7／ASTM）

---

## 11. 維護慣例

- **快取版本**：HTML 引用的 js／css 都帶 `?v=日期`（目前 `20261026a`）。修改任何 js／css 後，把各 HTML 的版本字串一起改掉（可全域取代），使用者的瀏覽器才會載入新檔。
- **不要在 HTML 內寫程式**：頁面程式放 `assets/js/pages/`，共用放 `assets/js/core/`，規則放 `src/rules/`。HTML 內只保留 Tailwind 主題設定與 `AuthService.requireAuth()`。
- **畫面不直接讀寫 localStorage**：一律經由 `DemoStorage`，正式系統替換時才不會漏。
