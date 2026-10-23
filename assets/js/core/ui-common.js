/**
 * AppUi — 各頁共用的畫面小工具
 *  - 字級（4 段）與細胞影像縮放（50%～200%），偏好存於瀏覽器
 *  - 狀態膠囊的名稱／顏色／是否完成
 *  - 「分析與歷史報告」表格資料、前次報告欄標
 */
var AppUi = (function () {
  'use strict';

  // ─── 字級 ─────────────────────────────────────────────────
  var FONT_LEVEL_CLASSES = ['font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge'];

  function clampFontLevel(n) {
    var x = parseInt(n, 10);
    if (isNaN(x)) return 1;
    return Math.max(0, Math.min(3, x));
  }
  function storedFontLevel() {
    var v = DemoStorage.getFontLevel();
    return (v === null || v === '') ? 1 : clampFontLevel(v);
  }
  function applyFontLevel(level) {
    level = clampFontLevel(level);
    var root = document.documentElement;
    FONT_LEVEL_CLASSES.forEach(function (c) { root.classList.remove(c); });
    root.classList.add(FONT_LEVEL_CLASSES[level]);
    DemoStorage.setFontLevel(level);
    return level;
  }
  function initFontLevel() { return applyFontLevel(storedFontLevel()); }
  function adjustFontLevel(delta) { return applyFontLevel(storedFontLevel() + delta); }

  // ─── 細胞影像縮放 ─────────────────────────────────────────
  function clampZoom(n) {
    var x = parseInt(n, 10);
    if (isNaN(x)) return 100;
    return Math.max(50, Math.min(200, x));
  }
  function storedZoom() {
    var v = DemoStorage.getCellZoom();
    return (v === null || v === '') ? 100 : clampZoom(v);
  }
  function syncZoomCssVar(level) {
    try {
      document.documentElement.style.setProperty('--cell-zoom-factor', String(clampZoom(level) / 100));
    } catch (e) {}
  }
  function applyZoom(level) {
    level = clampZoom(level);
    syncZoomCssVar(level);
    DemoStorage.setCellZoom(level);
    return level;
  }
  function initCellZoom() { return applyZoom(storedZoom()); }
  function adjustCellZoom(delta) { return applyZoom(storedZoom() + delta); }

  // ─── 狀態膠囊 ─────────────────────────────────────────────
  /**
   * 單一膠囊的顯示資訊：{ label, style, done }
   * done 為 true 時以綠色＋勾號呈現（實際外框大小由各頁決定）。
   */
  function capsuleInfo(spec, statusKey) {
    var done = WorkflowRules.isCapsuleDone(spec, statusKey);
    return {
      label: StatusConstants.LABELS[statusKey] || statusKey,
      style: done ? StatusConstants.DONE_STYLE : (StatusConstants.STYLES[statusKey] || StatusConstants.DEFAULT_STYLE),
      done: done
    };
  }

  /** 要顯示的膠囊（review.status） */
  function displayStatuses(spec) {
    return ((spec && spec.review && spec.review.status) || []).slice();
  }

  // ─── 數值表格 ─────────────────────────────────────────────
  /** 流式計數欄（WAM）：WBC／PLT 取 wam.cbc；其餘取 wam.flowDc（未成熟／異常細胞流式儀無法提供，為 '-'） */
  function flowDcValue(spec, key) {
    if (!spec || !spec.wam) return '-';
    if (key === 'wbc' || key === 'plt') {
      var c = spec.wam.cbc || {};
      return c[key] != null && c[key] !== '' ? c[key] : '-';
    }
    var f = spec.wam.flowDc || {};
    return f[key] !== undefined ? f[key] : '-';
  }

  /** 「分析與歷史報告」各列：{ label, key, flow, ai, prev } */
  function analysisRows(spec) {
    var ai = LeaveRules.aiValues(spec);
    var prev = LeaveRules.prevValues(spec);
    return CellConstants.ANALYSIS_ROWS.map(function (r) {
      return { label: r[0], key: r[1], flow: flowDcValue(spec, r[1]), ai: ai[r[1]], prev: prev[r[1]] };
    });
  }

  /** 前次報告距離本次分析的天數（無資料回傳 null） */
  function prevReportDaysAgo(spec) {
    var date = spec && spec.lis && spec.lis.prevReport && spec.lis.prevReport.date;
    if (!date) return null;
    var prev = LeaveRules.parseDate(date);
    if (!prev) return null;
    var anchor = LeaveRules.parseDate(spec.imaging && spec.imaging.analysisTime) || new Date();
    var diff = anchor.getTime() - prev.getTime();
    if (!isFinite(diff)) return null;
    var days = Math.floor(diff / 86400000);
    return days < 0 ? 0 : days;
  }

  /** 欄標：前次報告（X天前） */
  function prevReportHeaderLabel(spec, baseLabel) {
    var base = baseLabel || '前次報告';
    var days = prevReportDaysAgo(spec);
    return days == null ? base + '（-）' : base + '（' + days + '天前）';
  }

  return {
    initFontLevel: initFontLevel,
    adjustFontLevel: adjustFontLevel,
    initCellZoom: initCellZoom,
    adjustCellZoom: adjustCellZoom,
    syncZoomCssVar: syncZoomCssVar,
    capsuleInfo: capsuleInfo,
    displayStatuses: displayStatuses,
    flowDcValue: flowDcValue,
    analysisRows: analysisRows,
    prevReportHeaderLabel: prevReportHeaderLabel
  };
})();
