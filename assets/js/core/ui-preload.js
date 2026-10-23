/**
 * 介面偏好預先套用：放在 <head> 最前面同步載入，避免畫面先以預設值顯示再跳動。
 *  - 字級（4 段）
 *  - 細胞影像縮放（影像檢視頁使用 --cell-zoom-factor、--cell-image-size）
 * 注意：此時 AppConfig 尚未載入，key 需與 AppConfig.STORAGE_KEYS 的 FONT_LEVEL、CELL_ZOOM 相同。
 */
(function () {
  try {
    var root = document.documentElement;
    var classes = ['font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge'];
    var level = parseInt(window.localStorage.getItem('blood-morphology-font-level'), 10);
    if (isNaN(level)) level = 1;
    level = Math.max(0, Math.min(3, level));
    classes.forEach(function (c) { root.classList.remove(c); });
    root.classList.add(classes[level]);

    var zoom = parseInt(window.localStorage.getItem('blood-morphology-cell-image-zoom'), 10);
    if (isNaN(zoom)) zoom = 100;
    zoom = Math.max(50, Math.min(200, zoom));
    var fontScale = [0.875, 1, 1.125, 1.25][level];
    root.style.setProperty('--cell-zoom-factor', String(zoom / 100));
    root.style.setProperty('--cell-image-size', (4.5 * (zoom / 100) * 16 * fontScale).toFixed(2) + 'px');
  } catch (e) {}
})();
