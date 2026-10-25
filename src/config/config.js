/**
 * AppConfig — 應用程式全域設定（唯一來源）
 *
 * - 可調整的設定值集中在此，避免「魔法數字」散落各處。
 * - 上線前請將 ENV 切換為 'production'，API_BASE_URL 指向真實後端。
 * - 真正的機密（API Key、JWT Secret）絕不可放在前端，需由後端環境變數管理。
 */

const AppConfig = Object.freeze({

  /**
   * 執行環境：'development' | 'production'
   * development → ApiService 使用模擬路由（不需要後端）
   * production  → ApiService 呼叫真實 REST API
   */
  ENV: 'development',

  /** 後端 API 根路徑（上線時改為實際網址） */
  API_BASE_URL: 'https://api.example-hematology.com/v1',

  /** API 請求逾時（毫秒） */
  API_TIMEOUT_MS: 15000,

  /**
   * 登入設定
   * - TOKEN_STORAGE_KEY／USER_KEY：登入資訊存 sessionStorage（不用 localStorage，降低 XSS 竊取風險）
   * - USER_ACCOUNT_KEY：登入帳號（標記完成時寫入 review.editor「編輯人員」）
   * - SESSION_TIMEOUT_MS：閒置自動登出時間（文件 1.1 節「登入」，30 分鐘）
   */
  AUTH: Object.freeze({
    TOKEN_STORAGE_KEY: 'bhm_session_token',
    USER_KEY: 'bhm_session_user',
    USER_ACCOUNT_KEY: 'blood-morphology-user-account',
    SESSION_TIMEOUT_MS: 30 * 60 * 1000,
    IDLE_CHECK_INTERVAL_MS: 60 * 1000,
  }),

  /**
   * 留單門檻預設值（本科標準，邏輯規則說明文件第 3 節）
   * 執行中門檻由 LeaveRules 管理；Demo 存 localStorage，正式系統改存後端（規則 7）。
   */
  DEFAULT_LEAVE_THRESHOLDS: Object.freeze({
    wbc: 30,
    lymphocyte: 60,
    monocyte: 20,
    eosinophil: 20,
    basophil: 5,
    atypicalLymphocyte: 10,
    blast: 'present',
    promyelocyte: 'present',
    myelocyte: 5,
    metamyelocyte: 10,
    hypersegmented: 10,
    promonocyte: 'present',
    plasmaCell: 'present',
    abnormalLymphocyte: 'present',
    // 規則 1 年齡相關：<18 歲 Lymphocyte ≥80%；≥18 歲出現 Megakaryocyte 即留單
    lymphocytePediatric: 80,
    megakaryocyte: 'present',
  }),

  /** 留單年齡分界（規則 1）：年齡 < 18 適用兒童規則；年齡未知視為成人（規則 1） */
  LEAVE_PEDIATRIC_AGE_CUTOFF: 18,

  /**
   * AI 模型串接設定（預留；原型尚未使用，以 AiModelService＋sources/ai-model-mock.js 模擬）
   * 林口人工智慧中心的 AI 模型讀取 CellaVision 資料庫影像並預分類，結果由後端接收（附錄 A #5）；
   * CONFIDENCE_THRESHOLD：低信心提示門檻（預留）
   */
  AI: Object.freeze({
    ENDPOINT: '/ai/classify',
    CONFIDENCE_THRESHOLD: 0.80,
    MAX_CELLS_PER_REQUEST: 50,
  }),

  /**
   * 時效（第 4 節）：清單的時效欄＝LIS 收件時間到現在經過的分鐘數
   * - URGENCY_REFRESH_MS：時效更新頻率（暫定 120 秒）
   * - DEMO_NOW：原型的模擬「現在」時間（模擬資料是 2025-08-07）；開啟頁面後依實際經過時間往前走。正式系統設為 null，用目前時間
   */
  URGENCY_REFRESH_MS: 120 * 1000,
  DEMO_NOW: '2025-08-07 22:15',

  /** 頁面檔名（多頁應用） */
  ROUTES: Object.freeze({
    LOGIN: 'index.html',
    SPECIMEN_LIST: '檢體管理.html',
    IMAGE_REVIEW: '影像檢視與細胞編輯.html',
    REPORT_ISSUE: '報告核發.html',
  }),

  /**
   * 瀏覽器儲存 key 一覽（唯一來源；讀寫一律經由 assets/js/core/storage.js）
   *
   * ⚠️ 標示「Demo」者為原型暫存：正式系統應改存後端資料庫，多人才會一致（第 11 節）。
   * 例外：font-preload.js 在 <head> 最早執行、此設定尚未載入，FONT_LEVEL 於該檔另寫一次。
   */
  STORAGE_KEYS: Object.freeze({
    // ── 使用者介面偏好（localStorage，可保留在瀏覽器）
    FONT_LEVEL: 'blood-morphology-font-level',
    CELL_ZOOM: 'blood-morphology-cell-image-zoom',
    LIST_MODE: 'blood-morphology-specimen-list-mode',
    LIST_UI_STATE: 'blood-morphology-specimen-list-ui-state-v2',   // v2：預設排序改為時效（2026-10-26），舊的清單狀態不再沿用
    // ── Demo：業務資料（localStorage；正式系統改存後端）
    LEAVE_THRESHOLDS: 'blood-morphology-leave-thresholds',
    SPECIMEN_STATUS: 'blood-morphology-specimen-status',
    EDITED_CELLS_PREFIX: 'editedCells:',
    EDITED_DIFF_PREFIX: 'editedDiff:',                         // 人員編輯值（review.editedDiff）
    LIS_WRITEBACK_LOG: 'blood-morphology-lis-writeback-log',   // 規則 14 原型的 LIS 回寫紀錄
    // ── 跨頁一次性訊息（sessionStorage）
    REVIEW_RETURN_MODE: 'blood-morphology-review-return-list-mode',
    TOAST_MANUAL_REVIEW: 'blood-morphology-manual-alert-toast',
    TOAST_FOLLOW_UP_DONE: 'blood-morphology-follow-up-done-toast',
    TOAST_REPORT_VERIFIED: 'blood-morphology-report-verified-toast',
    // ── 展示用（demo/ 資料夾）
    USABILITY_SCENARIO: 'blood-morphology-usability-scenario',
  }),

});
