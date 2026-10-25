/**
 * 字級與細胞影像縮放的規則（唯一來源）
 *
 * 畫面程式（preferences.ts、image-review/grid-layout.ts）與頁面 <head> 的預先套用小程式都由這裡產生，
 * 不會各寫一份而逐漸不一致。此檔不可依賴瀏覽器 API（vite.config.ts 建置時也會載入）。
 */
import { AppConfig } from '../../config';

/** 四段字級（對應 common.css 的 html.font-size-*） */
export const FONT_CLASSES = ['font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge'] as const;
/** 各字級的根字級倍率（87.5%、100%、112.5%、125%） */
export const FONT_FACTORS = [0.875, 1, 1.125, 1.25] as const;
export const FONT_DEFAULT = 1;

/** 細胞影像縮放（%） */
export const ZOOM_MIN = 50;
export const ZOOM_MAX = 200;
export const ZOOM_DEFAULT = 100;

/** 100% 時每格約 4.5rem，隨全站字級一起縮放 */
export const CELL_BASE_REM = 4.5;

export function clampFont(n: unknown): number {
  const x = parseInt(String(n), 10);
  return Number.isNaN(x) ? FONT_DEFAULT : Math.max(0, Math.min(FONT_CLASSES.length - 1, x));
}

export function clampZoom(n: unknown): number {
  const x = parseInt(String(n), 10);
  return Number.isNaN(x) ? ZOOM_DEFAULT : Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, x));
}

/**
 * 頁面 <head> 最前面的小程式：在畫面出現前先套用字級與縮放，避免先以預設值顯示再跳動。
 * 建置時由 vite.config.ts 填入各頁 HTML 的 <!-- preload-preferences --> 位置。
 */
export function preferencePreloadScript(): string {
  const K = AppConfig.STORAGE_KEYS;
  const j = JSON.stringify;
  return (
    '(function(){try{' +
    `var r=document.documentElement,c=${j(FONT_CLASSES)},l=parseInt(localStorage.getItem(${j(K.FONT_LEVEL)}),10);` +
    `if(isNaN(l))l=${FONT_DEFAULT};l=Math.max(0,Math.min(${FONT_CLASSES.length - 1},l));` +
    'c.forEach(function(x){r.classList.remove(x)});r.classList.add(c[l]);' +
    `var z=parseInt(localStorage.getItem(${j(K.CELL_ZOOM)}),10);if(isNaN(z))z=${ZOOM_DEFAULT};z=Math.max(${ZOOM_MIN},Math.min(${ZOOM_MAX},z));` +
    `var f=${j(FONT_FACTORS)}[l];r.style.setProperty('--cell-zoom-factor',String(z/100));` +
    `r.style.setProperty('--cell-image-size',(${CELL_BASE_REM}*(z/100)*16*f).toFixed(2)+'px')` +
    '}catch(e){}})();'
  );
}
