# 程式架構

給接手的工程師：這份說明程式怎麼分層、資料怎麼流動、規則寫在哪裡，以及轉為正式系統時要換掉哪些部分。
規則本身的內容見工程團隊提交文件 2「邏輯規則說明文件」（每條規則都附對應的程式與行號）。

---

## 1. 分層

```text
src/
  domain/   規則 1～15 與資料型別（純函式：不碰畫面、不碰瀏覽器，可在 Node 直接測試）
  data/     四個來源的模擬資料、AI 模型模擬、展示用的初始狀態
  infra/    瀏覽器儲存、模擬 API（登入、LIS）、登入與登出
  app/      SpecimenStore（檢體的各種操作）、門檻設定、回寫 LIS 的出入口
  ui/       四個頁面的畫面程式（每頁一個資料夾）與共用工具
  demo/     展示用：使用教學、情境模擬測試（可整包移除）
  pages/    每頁的進入點：把上面各層組裝起來（composition root）
  config.ts 全域設定（環境、API 網址、儲存鍵名稱、時效更新間隔）
```

**相依方向**：上層可以使用下層，下層不能使用上層：

```text
domain ← data ← infra ← app ← ui ← demo ← pages
```

- `eslint.config.js` 以規則強制檢查（`npm run lint`）；`domain` 另禁止使用 `window`、`document`、`localStorage`。
- 畫面層需要的模組由 `src/ui/context.ts` 定義介面，`src/pages/bootstrap.ts` 組裝後傳入；展示用的情境模擬測試也透過這個介面接入（`ScenarioPanel`），所以 `ui` 不依賴 `demo`。
- 以 Graphify 繪製程式關係圖確認：475 個節點、1,558 條關係，**沒有循環相依、沒有違反相依方向的呼叫**。

## 2. 一筆檢體的資料流

```text
           ┌───────────── data/database.ts loadDatabase() ─────────────┐
CellaVision│  AI 模型模擬           WAM          LIS                   │
 影像紀錄   │  classifySpecimen()   模擬資料      模擬資料               │
           └─────────────┬────────────────────────────────────────────┘
                         ▼
          domain/rules/intake-merge.ts mergeByBarcode()   依條碼合併成 Specimen（第 2 節）
                         ▼
          app/specimen-store.ts new SpecimenStore()
            ├ intakeStatus()            進線加膠囊（規則 1～3）
            ├ 讀回已保存的處理狀態      infra/storage.ts（瀏覽器儲存）
            └ recomputeAiAlerts()       依目前門檻重算 AI 分類警示（規則 7）
                         ▼
          ui/ 各頁顯示：workQueue()／matchesFilters() 分流與篩選（規則 5）
                         ▼
          使用者操作 → SpecimenStore 的方法
            signOff()、switchToManualReview()、markFollowUpDone()、toggleEntityStatus()、withdrawFromLis()
              1. current()：先讀回其他分頁保存的最新狀態
              2. domain/rules/transitions.ts：算出操作後的膠囊與流程旗標（純函式）
              3. apply()：判斷是否完成、記錄編輯人員、保存
              4. app/lis-sync.ts：回寫 LIS（規則 14）
```

`Specimen` 的結構（`src/domain/types.ts`）依來源分組，與文件 3「合併後欄位」一致：

| 分組 | 來源 | 內容 |
|---|---|---|
| `barcode` | 四個來源共同 | 檢體條碼 |
| `imaging` | CellaVision 資料庫＋AI 模型 | 取像時間、逐顆細胞（影像、預分類、信心值）、AI 分類結果 |
| `wam` | WAM | CBC、流式計數、flag、SIS rule、機台、歸位 |
| `lis` | LIS | 病患資料、年齡、收件時間、需推片確認註記、前次報告 |
| `review` | 新介面 | 膠囊、流程旗標、是否完成、編輯人員、鎖定中、人員編輯值 |

## 3. 規則在哪裡

| 規則 | 主要程式 |
|---|---|
| 第 2 節 進線與合併 | `domain/rules/intake-merge.ts`、`domain/rules/cell-counts.ts`、`data/ai-model.ts` |
| 1 AI 分類警示 | `domain/rules/leave.ts`（`leaveJudge`、`shouldHaveAiAlert`） |
| 2、3 需拉片確認、血小板確認 | `domain/rules/intake.ts` |
| 4 新發／延續 | `domain/rules/leave.ts`（`riskState`、`effectiveValues`） |
| 5 工作分流 | `domain/rules/workflow.ts`（`workQueue`、`inDigitalList`、`inEntityList`） |
| 6 鎖定中 | `ui/shared/navigation.ts`、各頁進入點的檢查 |
| 7 門檻設定 | `app/thresholds.ts`、`domain/rules/leave.ts`（`thresholdsFromForm`、`mergeThresholds`） |
| 8 閱片與重新歸類 | `domain/rules/cell-counts.ts`、`ui/image-review/` |
| 9～12 簽核、改人工鏡檢、已拉片完成、實體作業 | `domain/rules/transitions.ts`、`domain/rules/workflow.ts`、`app/specimen-store.ts` |
| 13 整體完成與唯讀 | `domain/rules/workflow.ts`（`isCompleted`、`isDigitalReviewReadOnly`） |
| 14 結果回傳 LIS | `domain/lis.ts`（內容）、`app/lis-sync.ts`（出入口） |
| 15 LIS 撤回 | `domain/rules/transitions.ts`（`canWithdraw`、`withdrawToIntake`）、`SpecimenStore.withdrawFromLis()` |

## 4. 頁面

| 頁面 | HTML | 進入點 | 畫面程式 |
|---|---|---|---|
| 登入 | `index.html` | `pages/login.ts` | `ui/login/` |
| 檢體管理 | `檢體管理.html` | `pages/specimen-list.ts` | `ui/specimen-list/`（清單列、右側摘要、篩選排序、留單門檻視窗、情境模擬視窗、返回提示） |
| 影像檢視與細胞編輯 | `影像檢視與細胞編輯.html` | `pages/image-review.ts` | `ui/image-review/`（細胞區塊、選取、右鍵選單、排版、左側摘要） |
| 報告簽核 | `報告核發.html` | `pages/report.ts` | `ui/report/`（只內嵌在影像檢視頁） |

- 各頁 HTML 保留舊版的版面結構與 Tailwind class，畫面才會完全相同；動態部分由 `ui/` 以 `html` 樣板產生（自動跳脫）。
- **報告簽核頁 → 影像檢視頁**：以 `postMessage` 通知（`ui/report/messages.ts` 定義訊息種類）；外層只接受自己開的內嵌視窗。
- **分頁之間**：檢體狀態存在瀏覽器儲存；其他分頁變更時，檢體管理頁收到 `storage` 事件後重繪；每次操作前也會先讀回最新狀態。
- **頁面之間的一次性提示**（例「簽核完成」）：前一頁排入 sessionStorage，下一頁顯示一次（`infra/storage.ts` 的 `toasts`）。

## 5. 建置

- `npm run build` 逐頁建置成**單一 HTML**（程式、樣式、字型都內嵌），圖片放 `dist/assets/images/`；雙擊 `dist/index.html` 即可使用，不需伺服器、不需連網。
- Tailwind CSS 3 以本機建置取代舊版的 CDN；各頁沿用舊版各自的 Tailwind 設定（`tailwind/*.config.js`），CSS 疊加順序也與舊版相同（字型 → common.css → tutorial.css → Tailwind → 頁面樣式）。
- 字型：Inter 用 `@fontsource/inter`；Material Symbols 只取用到的 33 個圖示（`tools/build-icon-font.py`，23 KB）。
- 每頁 `<head>` 的字級與縮放預先套用程式，由 `ui/shared/preference-rules.ts` 產生（與畫面程式同一份規則）。
- 最後加上內容安全政策（CSP），見 [`SECURITY.md`](SECURITY.md)。

## 6. 測試

| 指令 | 內容 |
|---|---|
| `npm test` | 規則單元測試（移植舊版全部規則測試並擴充）、操作與 LIS 回寫、膠囊狀態空間（所有可到達的狀態）、模擬資料一致性、整頁測試（以實際頁面 HTML 執行） |
| `npm test`（`tests/parity`） | **與舊版對照**：舊版程式唯讀載入產生的結果（`tests/parity/golden/domain.json`，由 `tools/legacy-capture/capture-domain.cjs` 產生），與新版跑同一組輸入比對 |
| `npm run test:e2e` | 建置後以 Playwright 跑 75 個畫面的操作巡覽（`tools/visual/tour.mjs`）：每個畫面的 DOM 指紋（與平台無關）、12 張代表截圖、沒有頁面錯誤、沒有被 CSP 擋下的內容、沒有對外連線；http 與雙擊開啟（file://）都跑；另有操作流程測試（`tests/e2e/flows.spec.ts`，使用者回報的情境） |
| `npm run state-space` | 列出所有膠囊狀態與可做的操作（文件 2 附錄 D 的資料來源） |
| `node tools/visual/capture.mjs`、`compare.mjs` | 新舊版逐張截圖比對（與舊版對照時使用） |

截圖基準依作業系統存放（`tests/e2e/__screenshots__/<平台>/`）：在新電腦第一次執行時用 `npm run test:e2e -- --update-snapshots` 產生該平台的基準；DOM 指紋則各平台共用。

## 7. 轉為正式系統

| 原型 | 正式系統 | 要改的地方 |
|---|---|---|
| 四個來源的模擬資料 | 後端提供合併好的檢體（`GET /specimens`） | `data/database.ts` 改呼叫 API；`mergeByBarcode()` 可移到後端沿用 |
| AI 模型模擬 | 林口人工智慧中心的 AI 模型 | `data/ai-model.ts`（回傳格式維持 `AiModelRecord`） |
| 模擬登入、模擬 LIS | 後端驗證、後端寫入 LIS | `config.ts` 的 `ENV`、`API_BASE_URL`；`infra/api.ts` 的真實請求已寫好 |
| 狀態存在瀏覽器 | 存後端，多人一致 | `infra/storage.ts` 的 `reviewStorage`、`editedStorage`、`thresholdStorage` 改呼叫 API（各儲存鍵的去處見文件 3「原型暫存」頁） |
| 鎖定中為展示值 | 後端管理鎖定與釋放 | `data/demo-state.ts` 移除，改讀後端 |
| 展示功能 | 不需要 | 移除 `src/demo/` 與 `pages/*.ts` 標註「展示用」的行 |

規則（`src/domain/`）不需修改；後端也應以同一套規則重新檢查每個操作（見 [`SECURITY.md`](SECURITY.md)）。

## 8. 設計決定

見 [`docs/adr/`](adr/)：

- [ADR 0001](adr/0001-typescript-vite-no-framework.md)　TypeScript + Vite，不用前端框架
- [ADR 0002](adr/0002-pure-domain-layer.md)　規則寫成純函式，集中在 domain 層
- [ADR 0003](adr/0003-parity-testing.md)　以「與舊版對照」證明功能與畫面相同
- [ADR 0004](adr/0004-single-file-build.md)　建置成單一 HTML，雙擊即可使用
