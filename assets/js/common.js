/**
 * 血球分類軟體 - 共用資料與工具
 * 病患／檢體資料請由 assets/data/database.js 載入後使用 APP_DATABASE。
 */

/** 與檢體管理／影像檢視／報告核發共用的字型段階（0 小、1 中、2 大、3 最大），存於 localStorage */
var APP_FONT_LEVEL_STORAGE_KEY = 'blood-morphology-font-level';
var APP_FONT_LEVEL_CLASSES = ['font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge'];

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

// 狀態標籤樣式對應（規格：PLT Check 藍、AI Alert 橘、Follow-up 紅、Digital Review 紫、Verified 綠、Locked 灰）
const STATUS_STYLES = {
  'PLT Check': 'bg-blue-100 text-blue-800',
  'Digital Review': 'bg-purple-100 text-purple-800',
  'AI Alert': 'bg-orange-100 text-orange-800',
  'Follow-up': 'bg-red-100 text-red-800',
  'Verified': 'bg-green-100 text-green-800',
  'Locked': 'bg-gray-200 text-gray-800 border border-gray-300'
};

// 模式預設勾選的狀態（數位閱片 / 實體作業）；兩種模式預設都含 Verified，使用者可自行取消勾選以隱藏已完成檢體
const MODE_DEFAULT_STATUS = {
  digital: ['Digital Review', 'Verified'],
  entity: ['Follow-up', 'PLT Check', 'AI Alert', 'Verified']
};
