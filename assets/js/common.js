/**
 * 血球分類軟體 - 共用資料與工具
 * 病患／檢體資料請由 assets/data/database.js 載入後使用 APP_DATABASE。
 */

/** 與檢體管理／影像檢視／報告核發共用的字型段階（0 小、1 中、2 大、3 最大），存於 localStorage */
var APP_FONT_LEVEL_STORAGE_KEY = 'blood-morphology-font-level';
var APP_FONT_LEVEL_CLASSES = ['font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge'];
var APP_CELL_IMAGE_ZOOM_STORAGE_KEY = 'blood-morphology-cell-image-zoom';

function clampAppFontLevel(n) {
  var x = parseInt(n, 10);
  if (isNaN(x)) return 1;
  return Math.max(0, Math.min(3, x));
}

function getStoredFontLevel() {
  try {
    var v = localStorage.getItem(APP_FONT_LEVEL_STORAGE_KEY);
    if (v === null || v === '') return 1;
    return clampAppFontLevel(v);
  } catch (e) {
    return 1;
  }
}

function applyAppFontLevel(level) {
  level = clampAppFontLevel(level);
  var root = document.documentElement;
  APP_FONT_LEVEL_CLASSES.forEach(function (c) { root.classList.remove(c); });
  root.classList.add(APP_FONT_LEVEL_CLASSES[level]);
  try {
    localStorage.setItem(APP_FONT_LEVEL_STORAGE_KEY, String(level));
  } catch (e) {}
  return level;
}

/** 進入頁面時呼叫：自 localStorage 還原並套用至 html */
function initAppFontLevel() {
  return applyAppFontLevel(getStoredFontLevel());
}

/** 相對於目前儲存段階增減（例如 -1 / +1） */
function adjustAppFontLevel(delta) {
  return applyAppFontLevel(getStoredFontLevel() + delta);
}

function clampCellImageZoomLevel(n) {
  var x = parseInt(n, 10);
  if (isNaN(x)) return 100;
  return Math.max(50, Math.min(200, x));
}

function getStoredCellImageZoomLevel() {
  try {
    var v = localStorage.getItem(APP_CELL_IMAGE_ZOOM_STORAGE_KEY);
    if (v === null || v === '') return 100;
    return clampCellImageZoomLevel(v);
  } catch (e) {
    return 100;
  }
}

function applyCellImageZoomLevel(level) {
  level = clampCellImageZoomLevel(level);
  try {
    localStorage.setItem(APP_CELL_IMAGE_ZOOM_STORAGE_KEY, String(level));
  } catch (e) {}
  return level;
}

function initCellImageZoomLevel() {
  return applyCellImageZoomLevel(getStoredCellImageZoomLevel());
}

function adjustCellImageZoomLevel(delta) {
  return applyCellImageZoomLevel(getStoredCellImageZoomLevel() + delta);
}

/**
 * 留單門檻預設值（林口長庚留單標準對應之數值／Present）
 * 與影像檢視分析表高亮、報告核發風險橫幅共用；執行時以 LEAVE_THRESHOLDS 為準（可自檢體管理「系統設定」覆寫並存 localStorage）。
 */
var DEFAULT_LEAVE_THRESHOLDS = {
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
  abnormalLymphocyte: 'present'
};

/** 列表／設定畫面用中文標籤（key 同 DEFAULT_LEAVE_THRESHOLDS） */
var LEAVE_THRESHOLD_LABELS = {
  wbc: 'WBC',
  lymphocyte: 'Lymphocyte (%)',
  monocyte: 'Monocyte (%)',
  eosinophil: 'Eosinophil (%)',
  basophil: 'Basophil (%)',
  atypicalLymphocyte: 'Atypical lymphocyte (%)',
  blast: 'Blast',
  promyelocyte: 'Promyelocyte',
  myelocyte: 'Myelocyte (%)',
  metamyelocyte: 'Metamyelocyte (%)',
  hypersegmented: 'Hypersegmented (%)',
  promonocyte: 'Promonocyte',
  plasmaCell: 'Plasma cell',
  abnormalLymphocyte: 'Abnormal lymphocyte'
};

var APP_LEAVE_THRESHOLDS_STORAGE_KEY = 'blood-morphology-leave-thresholds';

function cloneLeaveThresholds(source) {
  return JSON.parse(JSON.stringify(source || DEFAULT_LEAVE_THRESHOLDS));
}

/** 執行中門檻（可與預設不同） */
var LEAVE_THRESHOLDS = cloneLeaveThresholds(DEFAULT_LEAVE_THRESHOLDS);

function loadLeaveThresholdsFromStorage() {
  try {
    var raw = localStorage.getItem(APP_LEAVE_THRESHOLDS_STORAGE_KEY);
    if (!raw) return;
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;
    Object.keys(DEFAULT_LEAVE_THRESHOLDS).forEach(function (k) {
      var pv = parsed[k];
      var def = DEFAULT_LEAVE_THRESHOLDS[k];
      if (pv === undefined || pv === null) return;
      if (def === 'present') {
        if (pv === 'present') LEAVE_THRESHOLDS[k] = 'present';
        return;
      }
      if (typeof def === 'number') {
        var n = typeof pv === 'number' ? pv : parseFloat(String(pv).replace(',', '.'), 10);
        if (!isNaN(n) && n >= 0) LEAVE_THRESHOLDS[k] = n;
      }
    });
  } catch (e) {}
}

function persistLeaveThresholdsToStorage() {
  try {
    localStorage.setItem(APP_LEAVE_THRESHOLDS_STORAGE_KEY, JSON.stringify(LEAVE_THRESHOLDS));
  } catch (e) {}
}

function resetLeaveThresholdsToDefaults() {
  var fresh = cloneLeaveThresholds(DEFAULT_LEAVE_THRESHOLDS);
  Object.keys(DEFAULT_LEAVE_THRESHOLDS).forEach(function (k) {
    LEAVE_THRESHOLDS[k] = fresh[k];
  });
  try {
    localStorage.removeItem(APP_LEAVE_THRESHOLDS_STORAGE_KEY);
  } catch (e) {}
}

function parseMetricNum(v) {
  if (v === '-' || v === '' || v == null) return null;
  var n = parseFloat(String(v).replace(',', '.'), 10);
  return isNaN(n) ? null : n;
}

function isAbnormalMetricValue(key, value) {
  var th = LEAVE_THRESHOLDS[key];
  if (th == null) return false;
  var num = parseMetricNum(value);
  if (th === 'present') return num != null && num > 0;
  if (typeof th === 'number') return num != null && num >= th;
  return false;
}

function parseFlexibleDateTime(v) {
  if (!v) return null;
  var s = String(v).trim().replace(/\//g, '-').replace('T', ' ');
  var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!m) return null;
  var y = parseInt(m[1], 10);
  var mo = parseInt(m[2], 10) - 1;
  var d = parseInt(m[3], 10);
  var hh = m[4] ? parseInt(m[4], 10) : 0;
  var mm = m[5] ? parseInt(m[5], 10) : 0;
  var dt = new Date(y, mo, d, hh, mm, 0, 0);
  return isNaN(dt.getTime()) ? null : dt;
}

/** 取得前次報告距離目前檢體分析時間的天數（null 表示無資料） */
function getPrevReportDaysAgo(spec) {
  if (!spec || !spec.prevReportDate) return null;
  var prev = parseFlexibleDateTime(spec.prevReportDate);
  if (!prev) return null;
  var anchor = parseFlexibleDateTime(spec.analysisTime) || new Date();
  var diff = anchor.getTime() - prev.getTime();
  if (!isFinite(diff)) return null;
  var days = Math.floor(diff / 86400000);
  return days < 0 ? 0 : days;
}

/** 產生欄標：前次報告（X天前） */
function getPrevReportHeaderLabel(spec, baseLabel) {
  var base = baseLabel || '前次報告';
  var days = getPrevReportDaysAgo(spec);
  if (days == null) return base + '（-）';
  return base + '（' + days + '天前）';
}

// 檢體清單：由數據資料庫提供，未載入時為空陣列
var MOCK_SPECIMENS = (typeof APP_DATABASE !== 'undefined' && APP_DATABASE.specimens) ? APP_DATABASE.specimens : [];

// 從 URL 取得目前檢體 ID（用於影像檢視、報告核發）
function getSpecimenIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('specimen') || params.get('id') || '';
}

// 導向影像檢視頁
function goToImageReview(specimenId) {
  const base = getBasePath();
  window.location.href = base + '影像檢視與細胞編輯.html?specimen=' + encodeURIComponent(specimenId);
}

// 導向報告核發頁（可帶檢體 ID）
function goToReportIssue(specimenId) {
  const base = getBasePath();
  let url = base + '報告核發.html';
  if (specimenId) url += '?specimen=' + encodeURIComponent(specimenId);
  window.location.href = url;
}

// 返回檢體管理
function goToSpecimenList() {
  const base = getBasePath();
  window.location.href = base + '檢體管理.html';
}

// 取得目前路徑的 base（避免子資料夾時連結錯誤）
function getBasePath() {
  const path = window.location.pathname;
  const lastSlash = path.lastIndexOf('/');
  if (lastSlash === -1) return '';
  return path.substring(0, lastSlash + 1);
}

// 依 ID 取得檢體
function getSpecimenById(id) {
  return MOCK_SPECIMENS.find(function (s) { return s.id === id; }) || null;
}

// 狀態標籤樣式對應；影像頁 Add Flag 選項前小圓點請用同色調之 *-500（如 orange-500、red-500）
const STATUS_STYLES = {
  'PLT Check': 'bg-blue-100 text-blue-800',
  'Digital Review': 'bg-purple-100 text-purple-800',
  'AI Alert': 'bg-orange-100 text-orange-800',
  'Follow-up': 'bg-red-100 text-red-800',
  'Manual Alert': 'bg-amber-100 text-amber-950',
  'Verified': 'bg-green-100 text-green-800',
  'Locked': 'bg-gray-200 text-gray-800 border border-gray-300'
};

// 模式預設勾選的狀態（數位閱片 / 實體作業）
const MODE_DEFAULT_STATUS = {
  digital: ['Digital Review'],
  entity: ['Follow-up', 'PLT Check', 'AI Alert', 'Manual Alert']
};

/** 手動增刪 flag／簽核完成狀態覆寫（新版：status + workflowDone） */
var APP_SPECIMEN_STATUS_STORAGE_KEY = 'blood-morphology-specimen-status';
var ENTITY_REVIEW_STATUS_SET = ['PLT Check', 'Follow-up', 'AI Alert', 'Manual Alert'];

function normalizeWorkflowDone(rawWorkflow, rawStatusDone) {
  var digitalReview = false;
  var entityReview = false;
  if (rawWorkflow && typeof rawWorkflow === 'object') {
    digitalReview = !!rawWorkflow.digitalReview;
    entityReview = !!rawWorkflow.entityReview;
  }
  if (rawStatusDone) {
    // 舊版 statusDone 視為整體完成，兩條流程都視為已完成
    digitalReview = true;
    entityReview = true;
  }
  return { digitalReview: digitalReview, entityReview: entityReview };
}

function normalizeStatusStorageEntry(raw) {
  if (raw == null) return { status: [], statusDone: false, workflowDone: normalizeWorkflowDone(null, false), editor: '' };
  if (Array.isArray(raw)) {
    return {
      status: raw.slice().filter(function (x) { return x !== 'Verified'; }),
      statusDone: false,
      workflowDone: normalizeWorkflowDone(null, false),
      editor: ''
    };
  }
  if (raw && typeof raw === 'object' && Array.isArray(raw.status)) {
    return {
      status: raw.status.slice().filter(function (x) { return x !== 'Verified'; }),
      statusDone: !!raw.statusDone,
      workflowDone: normalizeWorkflowDone(raw.workflowDone, raw.statusDone),
      editor: typeof raw.editor === 'string' ? raw.editor : ''
    };
  }
  return { status: [], statusDone: false, workflowDone: normalizeWorkflowDone(null, false), editor: '' };
}

function hasStatus(spec, statusKey) {
  if (!spec || !Array.isArray(spec.status)) return false;
  return spec.status.indexOf(statusKey) !== -1;
}

function hasAnyEntityReviewTask(spec) {
  if (!spec || !Array.isArray(spec.status)) return false;
  return spec.status.some(function (s) { return ENTITY_REVIEW_STATUS_SET.indexOf(s) !== -1; });
}

function isDigitalReviewDone(spec) {
  if (!spec) return false;
  if (!hasStatus(spec, 'Digital Review')) return true;
  var wf = normalizeWorkflowDone(spec.workflowDone, spec.statusDone);
  return !!wf.digitalReview;
}

function isEntityReviewDone(spec) {
  if (!spec) return false;
  if (!hasAnyEntityReviewTask(spec)) return true;
  var wf = normalizeWorkflowDone(spec.workflowDone, spec.statusDone);
  return !!wf.entityReview;
}

function isEntityStatusCompleted(spec, statusKey) {
  if (!spec) return false;
  if (ENTITY_REVIEW_STATUS_SET.indexOf(statusKey) === -1) return false;
  return isEntityReviewDone(spec);
}

function persistSpecimenStatusOverride(specimenId, statusArray, options) {
  if (!specimenId) return;
  try {
    var raw = localStorage.getItem(APP_SPECIMEN_STATUS_STORAGE_KEY);
    var map = {};
    if (raw) {
      try { map = JSON.parse(raw) || {}; } catch (e2) { map = {}; }
    }
    if (!map || typeof map !== 'object') map = {};
    var prev = normalizeStatusStorageEntry(map[specimenId]);
    var nextStatus = Array.isArray(statusArray) ? statusArray.slice().filter(function (x) { return x !== 'Verified'; }) : [];
    var workflowInput = prev.workflowDone;
    if (options && options.workflowDone && typeof options.workflowDone === 'object') {
      workflowInput = {
        digitalReview: options.workflowDone.digitalReview !== undefined ? options.workflowDone.digitalReview : prev.workflowDone.digitalReview,
        entityReview: options.workflowDone.entityReview !== undefined ? options.workflowDone.entityReview : prev.workflowDone.entityReview
      };
    }
    var nextWorkflowDone = normalizeWorkflowDone(
      workflowInput,
      options && options.statusDone !== undefined ? !!options.statusDone : prev.statusDone
    );
    var nextDone = !!(nextWorkflowDone.digitalReview && nextWorkflowDone.entityReview);
    var nextEditor = options && options.editor !== undefined ? options.editor : prev.editor;
    map[specimenId] = { status: nextStatus, statusDone: nextDone, workflowDone: nextWorkflowDone, editor: nextEditor || '' };
    localStorage.setItem(APP_SPECIMEN_STATUS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {}
}

function applySpecimenStatusOverridesFromStorage() {
  if (typeof APP_DATABASE === 'undefined' || !APP_DATABASE.specimens) return;
  try {
    var raw = localStorage.getItem(APP_SPECIMEN_STATUS_STORAGE_KEY);
    if (!raw) return;
    var map = JSON.parse(raw);
    if (!map || typeof map !== 'object') return;
    Object.keys(map).forEach(function (id) {
      var spec = APP_DATABASE.specimens.find(function (s) { return s.id === id; });
      if (!spec) return;
      var ent = normalizeStatusStorageEntry(map[id]);
      spec.status = ent.status;
      spec.workflowDone = normalizeWorkflowDone(ent.workflowDone, ent.statusDone);
      spec.statusDone = !!(spec.workflowDone.digitalReview && spec.workflowDone.entityReview);
      if (ent.editor) spec.editor = ent.editor;
    });
  } catch (e) {}
}

/** 登入後寫入 sessionStorage，供簽核完成時帶入編輯人員帳號 */
function getCurrentUserAccount() {
  try {
    return sessionStorage.getItem('blood-morphology-user-account') || '';
  } catch (e) {
    return '';
  }
}

/**
 * 檢體是否為「已完成」狀態：數位閱片與實體作業兩條流程都完成。
 * 規則：已完成時列表時效顯示與排序皆視為 0。
 */
function isSpecimenWorkflowCompleted(spec) {
  if (!spec) return false;
  return isDigitalReviewDone(spec) && isEntityReviewDone(spec);
}

/** 列表／依時效排序用：已完成一律 0；未完成則用 urgency 欄位（空則空字串） */
function getSpecimenDisplayUrgency(spec) {
  if (!spec) return '';
  if (isSpecimenWorkflowCompleted(spec)) return 0;
  var u = spec.urgency;
  if (u == null || u === '') return '';
  return u;
}

(function () {
  loadLeaveThresholdsFromStorage();
  if (typeof APP_DATABASE !== 'undefined' && Array.isArray(APP_DATABASE.specimens)) {
    APP_DATABASE.specimens.forEach(function (spec) {
      spec.workflowDone = normalizeWorkflowDone(spec.workflowDone, spec.statusDone);
      spec.statusDone = !!(spec.workflowDone.digitalReview && spec.workflowDone.entityReview);
    });
  }
  applySpecimenStatusOverridesFromStorage();
})();
