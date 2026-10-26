/**
 * 全域設定（唯一來源）
 * 上線前：ENV 改為 'production'、API_BASE_URL 指向真實後端。機密（API Key 等）絕不放在前端。
 */
export const AppConfig = Object.freeze({
  /** 'development'：模擬 API（不需後端）；'production'：呼叫真實 REST API */
  ENV: 'development' as 'development' | 'production',
  API_BASE_URL: 'https://api.example-hematology.com/v1',
  API_TIMEOUT_MS: 15000,

  /** 登入：Token 存 sessionStorage（分頁關閉即清除）。不做閒置自動登出（2026-10-26 Eden 決定：會造成現場困擾） */
  AUTH: Object.freeze({
    TOKEN_KEY: 'bhm_session_token',
    USER_KEY: 'bhm_session_user',
    /** 登入帳號：全部完成時寫入編輯人員 */
    ACCOUNT_KEY: 'blood-morphology-user-account',
  }),

  /**
   * 時效（第 4 章）：清單每 120 秒（暫定）更新一次。
   * DEMO_NOW：原型的模擬「現在」（模擬資料是 2025-08-07），開頁後依實際經過時間往前走；正式系統設為 null。
   */
  URGENCY_REFRESH_MS: 120 * 1000,
  DEMO_NOW: '2025-08-07 22:15' as string | null,
  /** 原型的分析日期篩選預設值（模擬資料的日期） */
  DEMO_DATE: '2025-08-07',

  /** 頁面檔名 */
  ROUTES: Object.freeze({
    LOGIN: 'index.html',
    SPECIMEN_LIST: '檢體管理.html',
    IMAGE_REVIEW: '影像檢視與細胞編輯.html',
    REPORT: '報告核發.html',
  }),

  /**
   * 瀏覽器儲存的 key（讀寫一律經由 infra/storage.ts）
   * 「原型暫存」的業務資料在正式系統改存後端，多人才會一致（文件 2 第 11 章）。
   */
  STORAGE_KEYS: Object.freeze({
    // 介面偏好（localStorage，可保留）
    FONT_LEVEL: 'blood-morphology-font-level',
    CELL_ZOOM: 'blood-morphology-cell-image-zoom',
    LIST_MODE: 'blood-morphology-specimen-list-mode',
    LIST_UI_STATE: 'blood-morphology-specimen-list-ui-state-v2', // v2：預設排序改為時效（2026-10-26），舊的清單狀態不再沿用
    // 原型暫存：業務資料（localStorage；正式系統改存後端）
    LEAVE_THRESHOLDS: 'blood-morphology-leave-thresholds',
    SPECIMEN_STATUS: 'blood-morphology-specimen-status',
    EDITED_CELLS_PREFIX: 'editedCells:',
    EDITED_DIFF_PREFIX: 'editedDiff:',
    LIS_WRITEBACK_LOG: 'blood-morphology-lis-writeback-log',
    // 跨頁一次性訊息（sessionStorage）
    REVIEW_RETURN_MODE: 'blood-morphology-review-return-list-mode',
    TOAST_MANUAL_REVIEW: 'blood-morphology-manual-alert-toast',
    TOAST_FOLLOW_UP_DONE: 'blood-morphology-follow-up-done-toast',
    TOAST_REPORT_VERIFIED: 'blood-morphology-report-verified-toast',
    // 展示用（src/demo）
    USABILITY_SCENARIO: 'blood-morphology-usability-scenario',
    TUTORIAL_COMPLETED: 'bloodCellTutorialCompleted',
    TUTORIAL_PHASE: 'bloodCellTutorialPhase',
    TUTORIAL_STEP: 'bloodCellTutorialStep',
  }),
});
