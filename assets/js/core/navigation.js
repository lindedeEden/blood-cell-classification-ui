/**
 * AppNav — 頁面之間的跳轉（檔名統一由 AppConfig.ROUTES 提供）
 */
var AppNav = (function () {
  'use strict';

  var R = AppConfig.ROUTES;

  /** 目前頁面所在資料夾（避免放在子資料夾時連結錯誤） */
  function getBasePath() {
    var path = window.location.pathname;
    var lastSlash = path.lastIndexOf('/');
    return lastSlash === -1 ? '' : path.substring(0, lastSlash + 1);
  }

  /** 從網址取得檢體條碼 barcode（?specimen=） */
  function getSpecimenIdFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('specimen') || '';
  }

  function isReadonlyFromUrl() {
    try {
      return new URLSearchParams(window.location.search).get('readonly') === '1';
    } catch (e) {
      return false;
    }
  }

  function imageReviewUrl(specimenId, readonly) {
    var url = getBasePath() + R.IMAGE_REVIEW + '?specimen=' + encodeURIComponent(specimenId);
    if (readonly) url += '&readonly=1';
    return url;
  }

  function reportIssueUrl(specimenId) {
    var url = getBasePath() + R.REPORT_ISSUE;
    if (specimenId) url += '?specimen=' + encodeURIComponent(specimenId);
    return url;
  }

  /** 從檢體管理進入影像檢視（記住目前清單模式，返回時還原）；鎖定中（他人編輯中）的檢體完全不能開啟，含唯讀檢視（規則 6） */
  function goToImageReview(specimenId, opts) {
    if (!specimenId) return false;
    var readonly = !!(opts && opts.readonly);
    var spec = SpecimenStore.getById(specimenId);
    if (spec && spec.review.locked) return false;
    DemoStorage.rememberReviewReturnMode();
    window.location.href = imageReviewUrl(specimenId, readonly);
    return true;
  }

  /** 影像檢視頁內切換到另一筆檢體（不改變返回清單的模式） */
  function switchImageReviewSpecimen(specimenId) {
    window.location.href = imageReviewUrl(specimenId, false);
  }

  /** 返回檢體管理（opts.preferMode：'digital' | 'entity'，返回後強制切到該模式） */
  function goToSpecimenList(opts) {
    var prefer = opts && opts.preferMode;
    if (prefer !== 'digital' && prefer !== 'entity') prefer = DemoStorage.consumeReviewReturnMode();
    if (prefer === 'digital' || prefer === 'entity') DemoStorage.setListMode(prefer);
    window.location.href = getBasePath() + R.SPECIMEN_LIST;
  }

  return {
    getBasePath: getBasePath,
    getSpecimenIdFromUrl: getSpecimenIdFromUrl,
    isReadonlyFromUrl: isReadonlyFromUrl,
    reportIssueUrl: reportIssueUrl,
    goToImageReview: goToImageReview,
    switchImageReviewSpecimen: switchImageReviewSpecimen,
    goToSpecimenList: goToSpecimenList
  };
})();
