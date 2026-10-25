/**
 * 影像檢視頁細胞格的排版：依縮放比例與容器寬度算出每列幾格
 */
import { CELL_BASE_REM } from '../shared/preference-rules';
import { syncZoomCssVar } from '../shared/preferences';

/** zoom：目前的縮放比例（%） */
export function createGridLayout(zoom: () => number): { layoutGrids: () => void; scheduleLayout: () => void } {
  /** 依容器寬度算出每列幾格（px），避免 Edge 與 Chrome 在 auto-fill＋rem 下顯示不一致 */
  function layoutGrids(): void {
    syncZoomCssVar(zoom());
    const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const cellPx = CELL_BASE_REM * (zoom() / 100) * rootPx;
    const size = cellPx.toFixed(2) + 'px';
    document.documentElement.style.setProperty('--cell-image-size', size);
    document.querySelectorAll<HTMLElement>('.cell-grid').forEach((grid) => {
      const width = grid.clientWidth;
      if (width <= 0) {
        grid.style.gridTemplateColumns = `repeat(auto-fill, ${size})`;
        return;
      }
      const style = getComputedStyle(grid);
      const gapRaw = parseFloat(style.columnGap || style.gap);
      const gap = Number.isNaN(gapRaw) || gapRaw < 0 ? 8 : gapRaw;
      const cols = Math.max(1, Math.floor((width + gap) / (cellPx + gap)));
      grid.style.gridTemplateColumns = `repeat(${cols}, ${size})`;
    });
  }
  /** 捲軸、字型載入後版面才穩定，需延後再算一次 */
  function scheduleLayout(): void {
    layoutGrids();
    requestAnimationFrame(() => {
      layoutGrids();
      requestAnimationFrame(layoutGrids);
    });
    document.fonts?.ready.then(layoutGrids).catch(() => {});
  }
  return { layoutGrids, scheduleLayout };
}
