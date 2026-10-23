/**
 * LeaveRules — 留單判斷規則（單一來源）
 *
 * 對應《邏輯規則說明文件》第 3 節：規則 1（AI 分類警示：留單門檻、年齡）與規則 4（新發／延續）。
 *
 * 設計原則：
 *  - 純邏輯模組：不操作畫面、不讀寫瀏覽器儲存或 API，方便移植與單元測試（tests/run-tests.js）
 *  - 預設門檻唯一來源：AppConfig.DEFAULT_LEAVE_THRESHOLDS（src/config/config.js）
 *  - 執行中門檻（thresholds）只有一份；設定畫面修改後以 setThresholds() 寫入
 *  - 門檻的讀取／儲存（Demo：localStorage；正式：後端 /settings/thresholds）由呼叫端負責
 *
 * 載入順序：config.js → leave-rules.js
 */
var LeaveRules = (function () {
  'use strict';

  var CFG = (typeof AppConfig !== 'undefined') ? AppConfig : {};

  /** 預設門檻（唯讀） */
  var DEFAULTS = Object.freeze(JSON.parse(JSON.stringify(CFG.DEFAULT_LEAVE_THRESHOLDS || {})));

  /** 年齡分界（規則 1）：年齡 < 此值適用兒童規則；年齡未知視為成人（規則 1） */
  var PEDIATRIC_AGE_CUTOFF = CFG.LEAVE_PEDIATRIC_AGE_CUTOFF || 18;

  /** 僅供設定畫面使用、不直接對應數值欄位的門檻 key */
  var SETTING_ONLY_KEYS = Object.freeze(['lymphocytePediatric']);

  /** 設定畫面顯示順序 */
  var KEY_ORDER = Object.freeze([
    'wbc', 'lymphocyte', 'lymphocytePediatric', 'monocyte', 'eosinophil', 'basophil',
    'atypicalLymphocyte', 'blast', 'promyelocyte', 'myelocyte', 'metamyelocyte',
    'hypersegmented', 'promonocyte', 'plasmaCell', 'abnormalLymphocyte', 'megakaryocyte'
  ]);

  /** 設定畫面中文標籤 */
  var LABELS = Object.freeze({
    wbc: 'WBC',
    lymphocyte: 'Lymphocyte (%)（18 歲以上）',
    lymphocytePediatric: 'Lymphocyte (%)（未滿 18 歲）',
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
    abnormalLymphocyte: 'Abnormal lymphocyte',
    megakaryocyte: 'Megakaryocyte（18 歲以上）'
  });

  /** 執行中門檻（單一物件，原地更新） */
  var thresholds = JSON.parse(JSON.stringify(DEFAULTS));

  // ─── 門檻管理 ──────────────────────────────────────────────

  function getThresholds() { return thresholds; }

  /**
   * 以外部來源（localStorage、後端）覆寫門檻；只接受 DEFAULTS 內已定義的 key。
   * present 項目只能是 'present'；數字項目須為 ≥0 的數值，否則保留原值。
   */
  function setThresholds(source) {
    if (!source || typeof source !== 'object') return thresholds;
    Object.keys(DEFAULTS).forEach(function (k) {
      var v = source[k];
      var def = DEFAULTS[k];
      if (v === undefined || v === null) return;
      if (def === 'present') {
        if (v === 'present') thresholds[k] = 'present';
        return;
      }
      var n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));
      if (!isNaN(n) && n >= 0) thresholds[k] = n;
    });
    return thresholds;
  }

  function resetThresholds() {
    Object.keys(thresholds).forEach(function (k) { delete thresholds[k]; });
    Object.keys(DEFAULTS).forEach(function (k) { thresholds[k] = DEFAULTS[k]; });
    return thresholds;
  }

  // ─── 共用解析 ──────────────────────────────────────────────

  /** 數值解析：'-'、空白、null 視為無值（null），不等於 0 */
  function parseNum(v) {
    if (v === '-' || v === '' || v == null) return null;
    var n = parseFloat(String(v).replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  /** 日期解析：接受 YYYY-MM-DD 或 YYYY/MM/DD，可帶 HH:mm */
  function parseDate(v) {
    if (!v) return null;
    var s = String(v).trim().replace(/\//g, '-').replace('T', ' ');
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2})(?::(\d{1,2}))?)?$/);
    if (!m) return null;
    var dt = new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0, 0, 0);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // ─── 年齡（規則 1）───────────────────────────────────

  /** 病人年齡（歲）：直接用 LIS 提供的年齡（lis.age）；沒有時回傳 null（視為成人） */
  function getAgeYears(spec) {
    var a = spec && spec.lis ? parseFloat(spec.lis.age) : NaN;
    return isNaN(a) ? null : a;
  }

  /** 是否適用兒童規則：年齡 < 18；年齡未知視為成人 */
  function isPediatric(spec) {
    var age = getAgeYears(spec);
    return age != null && age < PEDIATRIC_AGE_CUTOFF;
  }

  // ─── 門檻判定（規則 1）───────────────────────────────

  /**
   * 依病人年齡取得某項目之留單門檻（規則 1）。
   * - Lymphocyte：<18 歲用 lymphocytePediatric（80），≥18 歲用 lymphocyte（60）
   * - Megakaryocyte：僅 ≥18 歲適用（出現即留單）
   * 回傳 undefined 表示該項目對此病人不適用。未傳 spec 時視為成人。
   */
  function thresholdFor(key, spec) {
    if (SETTING_ONLY_KEYS.indexOf(key) !== -1) return undefined;
    var child = isPediatric(spec);
    if (key === 'lymphocyte' && child) return thresholds.lymphocytePediatric;
    if (key === 'megakaryocyte' && child) return undefined;
    return thresholds[key];
  }

  /** 參與留單判定的數值 key（不含僅供設定用的 key） */
  function metricKeys() {
    return Object.keys(thresholds).filter(function (k) { return SETTING_ONLY_KEYS.indexOf(k) === -1; });
  }

  /** 規則 1：單項是否達留單門檻 */
  function isLeave(key, value, spec) {
    var th = thresholdFor(key, spec);
    if (th == null) return false;
    var n = parseNum(value);
    if (n == null) return false;
    if (th === 'present') return n > 0;
    return typeof th === 'number' && n >= th;
  }

  /** 規則 4：單項新發（本次達標、前次同項目未達標） */
  function isNewLeave(key, current, previous, spec) {
    return isLeave(key, current, spec) && !isLeave(key, previous, spec);
  }

  /** 規則 1：任一項目達標（values：{ wbc, 各分類 key: 值 }） */
  function hasAnyLeave(values, spec) {
    var m = values || {};
    return metricKeys().some(function (k) { return isLeave(k, m[k], spec); });
  }

  /** 規則 4：任一項目新發 */
  function hasAnyNewLeave(current, previous, spec) {
    var c = current || {};
    var p = previous || {};
    return metricKeys().some(function (k) { return isNewLeave(k, c[k], p[k], spec); });
  }

  // ─── 判斷用的數值（各畫面的 AI 值、前次報告、人員編輯值）─────────────

  /** AI 值＝WAM 的 WBC、PLT（wam.cbc）＋AI 分類結果（Diff%）（imaging.aiDiff）；判斷 1 與留單判斷用 */
  function aiValues(spec) {
    var cbc = (spec && spec.wam && spec.wam.cbc) || {};
    var aiDiff = (spec && spec.imaging && spec.imaging.aiDiff) || {};
    return Object.assign({ wbc: cbc.wbc, plt: cbc.plt }, aiDiff);
  }

  /** 前次報告的數值（LIS 最近一次）：{ wbc, plt, 各分類 key: 值 } */
  function prevValues(spec) {
    var p = (spec && spec.lis && spec.lis.prevReport) || {};
    return Object.assign({ wbc: p.wbc, plt: p.plt }, p.diff || {});
  }

  /**
   * 規則 4：判定用的數值。醫檢師已重新歸類（review.editedDiff）、且人員編輯值與 AI 值在任一門檻項目上不同時，
   * 以人員編輯值覆寫分類；否則用 AI 值。WBC、PLT 一律取分析儀值。
   */
  function effectiveValues(spec) {
    var ai = aiValues(spec);
    var edited = (spec && spec.review && spec.review.editedDiff) || {};
    if (Object.keys(edited).length === 0) return ai;
    var differs = Object.keys(thresholds).some(function (k) {
      return parseNum(edited[k]) !== parseNum(ai[k]);
    });
    return differs ? Object.assign({}, ai, edited) : ai;
  }

  /**
   * 風險狀態（報告核發頁橫幅，規則 9）
   * current：判定用數值；省略時依規則 4 由 effectiveValues(spec) 取得
   */
  function riskState(spec, current) {
    var cur = current || effectiveValues(spec);
    var prev = prevValues(spec);
    var leaveNow = hasAnyLeave(cur, spec);
    var newLeave = hasAnyNewLeave(cur, prev, spec);
    return { hasNewLeave: newLeave, hasLeaveNow: leaveNow, isPersistentLeave: leaveNow && !newLeave };
  }

  /** 規則 1：AI 值（WBC＋AI 分類結果（Diff%））任一項達門檻 → 應有 AI 分類警示 */
  function shouldHaveAiAlert(spec) {
    return !!spec && hasAnyLeave(aiValues(spec), spec);
  }

  return {
    DEFAULTS: DEFAULTS,
    LABELS: LABELS,
    KEY_ORDER: KEY_ORDER,
    SETTING_ONLY_KEYS: SETTING_ONLY_KEYS,
    PEDIATRIC_AGE_CUTOFF: PEDIATRIC_AGE_CUTOFF,
    getThresholds: getThresholds,
    setThresholds: setThresholds,
    resetThresholds: resetThresholds,
    parseNum: parseNum,
    parseDate: parseDate,
    getAgeYears: getAgeYears,
    isPediatric: isPediatric,
    thresholdFor: thresholdFor,
    metricKeys: metricKeys,
    isLeave: isLeave,
    isNewLeave: isNewLeave,
    hasAnyLeave: hasAnyLeave,
    hasAnyNewLeave: hasAnyNewLeave,
    aiValues: aiValues,
    prevValues: prevValues,
    effectiveValues: effectiveValues,
    riskState: riskState,
    shouldHaveAiAlert: shouldHaveAiAlert
  };
})();
