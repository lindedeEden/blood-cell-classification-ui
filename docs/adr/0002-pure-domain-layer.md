# ADR 0002：規則寫成純函式，集中在 domain 層

- 狀態：已採用（2026-10-25）

## 背景

舊版的規則散在 `src/rules/`、`assets/js/core/` 與各頁畫面程式，同一個判斷有時寫在兩處（例：簽核方式在報告頁、膠囊不能切換的原因在清單頁）。

## 決定

- 規則 1～15 全部寫成**純函式**放在 `src/domain/`：輸入檢體（與門檻），回傳結果，不改傳入的物件、不碰畫面與瀏覽器。
- 操作分兩步：`domain/rules/transitions.ts` 算出操作後的狀態（純函式）→ `app/specimen-store.ts` 保存並回寫 LIS。
- 畫面程式只負責顯示與呼叫，不自己做規則判斷（例：`signOffPlan()`、`entityToggleBlockReason()`、`thresholdsFromForm()` 由畫面移到 domain）。
- 分層相依方向以 ESLint 強制（`eslint.config.js`）。

## 理由

- 規則只寫一處，前端、後端、測試共用；正式系統的後端可直接沿用同一套規則重新檢查每個操作。
- 純函式可在 Node 直接測試，並能列舉所有膠囊狀態（`tools/state-space.ts`）。

## 影響

- 文件 2 的每條規則都能指到 `src/domain/` 的函式與行號。
