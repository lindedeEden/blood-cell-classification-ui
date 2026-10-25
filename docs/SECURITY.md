# 安全設計與上線前檢查

依 Agent Skills `security-and-hardening` 檢查清單逐項檢視（2026-10-25）。本專案是**純前端原型**：沒有後端、資料為模擬資料；以下分成「原型已做到的」與「正式系統必須由後端負責的」。

---

## 1. 威脅與界線

| 威脅 | 原型的處理 | 正式系統 |
|---|---|---|
| 病人資料被注入成程式（XSS） | 動態 HTML 一律經 `html` 樣板自動跳脫；CSP 只允許建置時的程式 | 同左，另由伺服器送出 CSP 標頭 |
| 被導到外部網站（登入後導向） | 只接受本系統的三個頁面，且通訊協定與來源相同 | 同左 |
| 他頁偽造報告簽核訊息 | 只接受自己開的內嵌視窗（檢查 `event.source`）；以網址開啟時只送給同一網站 | 同左 |
| 繞過畫面直接改狀態 | **原型做不到**：狀態存在瀏覽器 | **後端必須重新檢查每條規則**（鎖定、唯讀、可否簽核），前端的檢查只是使用者體驗 |
| 共用電腦留下病人資料 | 登出時清除處理狀態、人員編輯結果、LIS 回寫紀錄；登入憑證存 sessionStorage（關閉分頁即清除） | 病人資料不存瀏覽器；登入憑證改用 HttpOnly Cookie |
| 閒置未登出 | 每頁閒置 30 分鐘自動登出（報告視窗裡的操作也算） | 伺服器端的工作階段逾時 |
| 套件弱點 | `npm audit`：0 項 | 定期掃描（CI） |

## 2. 已完成的項目

### 輸出跳脫

- `src/ui/shared/dom.ts` 的 `html` 樣板：插入的值一律跳脫（`& < > " '`）；固定標記才用 `raw()`。
- ESLint 規則禁止在 `dom.ts` 以外直接設定 `innerHTML`（`eslint.config.js`）。
- 測試：`tests/unit/ui.test.ts`「HTML 樣板會跳脫外部資料」。

### 內容安全政策（CSP）

建置時（`scripts/build.mjs`）在每頁加上：

```text
default-src 'none'; script-src 'sha256-…'（只有該頁的內嵌程式）; style-src 'unsafe-inline';
img-src 'self' data:; font-src data:; frame-src 'self'; connect-src 'self';
form-action 'self'; base-uri 'none'; object-src 'none'
```

- 程式以 SHA-256 雜湊指定：被注入的 `<script>`、外部程式、`onclick=` 等都不會執行。
- `style-src 'unsafe-inline'`：Tailwind 產生的樣式與標記上的 `style` 屬性需要；樣式無法執行程式，風險低。
- 測試：`tests/e2e/tour.spec.ts` 在 http 與雙擊開啟（file://）兩種方式下，確認沒有被 CSP 擋下的內容、注入的程式不會執行。
- 正式系統：改由伺服器送出 CSP 標頭，並加上 `frame-ancestors 'self'`（meta 標籤不支援）；`connect-src` 改為 API 網址。

### 頁面之間的通訊

- 報告簽核頁（內嵌視窗）→ 影像檢視頁：`postMessage`，外層只接受 `event.source` 是自己開的視窗。
- 報告簽核頁只能內嵌開啟；直接用網址開啟會回到檢體管理（`src/ui/report/report-page.ts`）。
- 以 http(s) 開啟時，訊息只送給同一網站；雙擊開啟（file://）時來源無法指定，由外層的 `event.source` 檢查把關。

### 登入與工作階段

- 登入後導向：`safeRedirect()` 只接受本系統的三個頁面，通訊協定、來源、主機都要相同（`javascript:`、`data:`、外部網址一律擋下）。測試：`tests/unit/ui.test.ts`。
- 登入前先清除舊的登入資訊；帳密錯誤不會被誤判為登入逾期。測試：`tests/unit/auth.test.ts`。
- 登出：清除登入資訊與瀏覽器裡的病人資料。

### 原型專用的功能

- 模擬帳號（`admin/admin`、`user/user`）與模擬 API 只在 `AppConfig.ENV = 'development'` 時使用（`src/infra/api.ts`）。
- 開發者工具指令 `__demo.*`（模擬 LIS 撤回、查看回寫紀錄）在 `ENV = 'production'` 時不提供。
- 展示功能（使用教學、情境模擬測試）集中在 `src/demo/`，可整包移除。

### 機密與資料

- 程式中沒有 API Key、密碼等機密（前端無法保密，機密一律放後端）。
- 所有病人資料為虛構；細胞影像為公開範例圖。

## 3. 上線前必做（正式系統）

- [ ] `src/config.ts`：`ENV` 改為 `'production'`、`API_BASE_URL` 指向真實後端
- [ ] 移除 `src/demo/` 與各頁的展示呼叫（`src/pages/*.ts` 標註「展示用」的行）
- [ ] 後端重新實作並強制執行規則（可直接沿用 `src/domain/` 的純函式）：鎖定、唯讀、簽核條件、門檻修改權限（文件 2 附錄 A #2）
- [ ] 登入改用 HttpOnly、Secure、SameSite Cookie；伺服器端工作階段逾時
- [ ] 病人資料、處理狀態、人員編輯結果改存後端（文件 3「原型暫存」頁列出每個儲存鍵的去處）
- [ ] 伺服器回應標頭：CSP（含 `frame-ancestors`）、`Strict-Transport-Security`、`X-Content-Type-Options: nosniff`、`Referrer-Policy: same-origin`
- [ ] 操作紀錄（誰在何時簽核、改為人工鏡檢、標記完成、修改門檻）
- [ ] 依院內規範做弱點掃描（見下節 Strix）

## 4. 用 Strix 做弱點掃描（在您的電腦上）

Strix 是開源的 AI 弱點掃描工具，需要 Docker 與一組 AI 服務金鑰；雲端開發環境無法執行，所以留給您在自己的電腦上跑。

1. 確認 Docker Desktop 已啟動。
2. 安裝（Windows 建議在 WSL 的 Ubuntu 視窗執行；或在 PowerShell 以 `pip install strix-agent` 安裝）：

   ```bash
   curl -sSL https://strix.ai/install | bash
   ```

3. 設定 AI 服務（以 Anthropic 為例；金鑰不要寫進任何檔案或程式）：

   ```bash
   export STRIX_LLM="anthropic/claude-sonnet-4-6"
   export LLM_API_KEY="您的金鑰"
   ```

4. 掃描程式資料夾（程式碼會送給上面設定的 AI 服務分析；本專案沒有真實病人資料）：

   ```bash
   cd 血球分類軟體介面_優化版/程式
   strix --target ./ --scan-mode quick
   ```

5. 結果在 `strix_runs/` 資料夾。請不要把 `strix_runs/` 放上 GitHub（`.gitignore` 已排除）。
