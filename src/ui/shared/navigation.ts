/**
 * 頁面之間的跳轉（檔名由 AppConfig.ROUTES 統一提供）
 */
import { AppConfig } from '../../config';
import type { ListMode } from '../../domain/types';
import { preferences } from '../../infra/storage';

const R = AppConfig.ROUTES;

/** 目前頁面所在資料夾（放在子資料夾時連結才不會錯） */
export function basePath(): string {
  const path = window.location.pathname;
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '' : path.substring(0, slash + 1);
}

/** 網址的檢體條碼（?specimen=） */
export function specimenIdFromUrl(): string {
  return new URLSearchParams(window.location.search).get('specimen') || '';
}

export function isReadonlyFromUrl(): boolean {
  return new URLSearchParams(window.location.search).get('readonly') === '1';
}

export function imageReviewUrl(barcode: string, readonly = false): string {
  return basePath() + R.IMAGE_REVIEW + '?specimen=' + encodeURIComponent(barcode) + (readonly ? '&readonly=1' : '');
}

export function reportUrl(barcode: string): string {
  return basePath() + R.REPORT + (barcode ? '?specimen=' + encodeURIComponent(barcode) : '');
}

/** 從檢體管理進入影像檢視（記住清單模式，返回時還原）；鎖定中的檢體完全不能開啟（規則 6） */
export function goToImageReview(barcode: string, opts: { readonly?: boolean; locked?: boolean } = {}): boolean {
  if (!barcode || opts.locked) return false;
  preferences.rememberReturnMode();
  window.location.href = imageReviewUrl(barcode, !!opts.readonly);
  return true;
}

/** 影像檢視頁內切換到另一筆（不改變返回清單的模式） */
export function switchImageReviewSpecimen(barcode: string): void {
  window.location.href = imageReviewUrl(barcode);
}

/** 返回檢體管理；preferMode：返回後切到指定模式 */
export function goToSpecimenList(preferMode?: ListMode): void {
  const mode = preferMode ?? preferences.returnMode();
  if (mode) preferences.setListMode(mode);
  window.location.href = basePath() + R.SPECIMEN_LIST;
}
