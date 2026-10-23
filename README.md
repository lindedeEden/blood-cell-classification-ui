# 血球型態分類軟體介面（前端 Demo）

林口長庚醫院檢驗醫學科血液組的**介面設計原型**。以 AI 預分類的血球影像為基礎，模擬醫檢師從檢體進線、數位閱片到報告簽核回寫 LIS 的完整流程，供工程團隊開發正式系統時參考。

> 本專案僅供研究與介面設計示範使用，非正式醫療資訊系統；所有資料皆為模擬資料。

---

## 快速開始

1. 以瀏覽器開啟 `index.html`（建議 Chrome／Edge）
2. 測試帳密：`admin / admin` 或 `user / user`
3. 登入後進入檢體管理

GitHub Pages：`https://lindedeEden.github.io/blood-cell-classification-ui/`

---

## 使用角色

| 角色 | 工作 |
|------|------|
| **數位閱片醫檢師** | 在新介面閱片、調整細胞分類、簽核報告；需要時改為人工鏡檢，並以顯微鏡鏡檢 |
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

## 專案結構

```text
index.html                    登入
檢體管理.html                 檢體清單、留單標準設定
影像檢視與細胞編輯.html       閱片與重新歸類
報告核發.html                 報告簽核
src/                          規則邏輯、設定、常數、API 服務（不含畫面）
  rules/                      留單、工作流程、進線合併規則
assets/js/core/               各頁共用：檢體資料與動作、LIS 回寫、頁面跳轉
assets/js/pages/              各頁畫面程式
assets/data/                  模擬資料（四個來源）
assets/images/                細胞範例圖
demo/                         展示用：使用教學、情境模擬測試（可整個移除）
tests/                        規則測試與狀態列舉
```

分層、載入順序與轉為正式系統時要替換的地方，見 **`ARCHITECTURE.md`**。

---

## 測試

```bash
node tests/run-tests.js       # 規則單元測試
node tests/state-space.js     # 列舉所有狀態膠囊組合與可做的操作
```

---

## 開發提示

| 要改的東西 | 位置 |
|------|------|
| 留單規則與門檻 | `src/rules/leave-rules.js`、`src/config/config.js` |
| 狀態膠囊與工作流程 | `src/rules/workflow-rules.js` |
| 細胞類別 | `src/constants/cell-types.js` |
| 接後端 | `src/services/api.service.js` |
| 避免瀏覽器快取舊檔 | 修改 js／css 後更新各 HTML 的 `?v=` |
