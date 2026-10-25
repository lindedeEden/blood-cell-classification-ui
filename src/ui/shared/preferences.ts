/**
 * 字級（4 段）與細胞影像縮放（50%～200%），偏好存在瀏覽器、全站共用
 * 規則（範圍、預設值）在 preference-rules.ts；頁面 <head> 另有一段由同一份規則產生的小程式先套用，避免畫面跳動。
 */
import { preferences } from '../../infra/storage';
import { FONT_CLASSES, FONT_DEFAULT, ZOOM_DEFAULT, clampFont, clampZoom } from './preference-rules';

const storedFont = () => {
  const v = preferences.fontLevel();
  return v === null || v === '' ? FONT_DEFAULT : clampFont(v);
};
const storedZoom = () => {
  const v = preferences.cellZoom();
  return v === null || v === '' ? ZOOM_DEFAULT : clampZoom(v);
};

function applyFont(level: number): number {
  const l = clampFont(level);
  const root = document.documentElement;
  root.classList.remove(...FONT_CLASSES);
  root.classList.add(FONT_CLASSES[l] as string);
  preferences.setFontLevel(l);
  return l;
}

export const fontLevel = {
  init: () => applyFont(storedFont()),
  adjust: (delta: number) => applyFont(storedFont() + delta),
};

export function syncZoomCssVar(zoom: number): void {
  document.documentElement.style.setProperty('--cell-zoom-factor', String(clampZoom(zoom) / 100));
}

function applyZoom(zoom: number): number {
  const z = clampZoom(zoom);
  syncZoomCssVar(z);
  preferences.setCellZoom(z);
  return z;
}

export const cellZoom = {
  init: () => applyZoom(storedZoom()),
  adjust: (delta: number) => applyZoom(storedZoom() + delta),
};
