/**
 * 血球分類軟體 - 共用資料與工具
 * 病患／檢體資料請由 assets/data/database.js 載入後使用 APP_DATABASE。
 */

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

// 模式預設勾選的狀態（數位閱片 / 實體作業）
const MODE_DEFAULT_STATUS = {
  digital: ['Digital Review'],
  entity: ['Follow-up', 'PLT Check', 'AI Alert']
};
