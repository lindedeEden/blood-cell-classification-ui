/**
 * 檢體管理的篩選與排序（第 4 章、規則 5）
 */
import {
  inDigitalList,
  inEntityList,
  isCompleted,
  matchesStatusFilter,
  urgencyMinutes,
} from '../../domain/rules/workflow';
import type { FilterKey, ListMode, Specimen } from '../../domain/types';

export interface ListFilters {
  dateStart: string;
  dateEnd: string;
  department: string;
  machine: string;
  search: string;
  exactMatch: boolean;
  statuses: FilterKey[];
}

export type SortKey = 'id' | 'time' | 'urgency';

/**
 * 模式決定工作清單（數位閱片／實體作業，規則 5），狀態勾選再從中篩出「還沒完成」的檢體；
 * 已完成的檢體只在勾選「已完成」時顯示。
 */
export function matchesFilters(spec: Specimen, f: ListFilters, mode: ListMode | null): boolean {
  const time = spec.imaging.analysisTime;
  const date = time ? time.slice(0, 10).replace(/\//g, '-') : '';
  if (f.dateStart && time && date < f.dateStart) return false;
  if (f.dateEnd && time && date > f.dateEnd) return false;
  if (f.department && spec.lis.department !== f.department) return false;
  if (f.machine && spec.wam.machine !== f.machine) return false;
  if (f.search) {
    const id = (spec.barcode || '').toUpperCase();
    const pid = (spec.lis.patientId || '').toUpperCase();
    const q = f.search.toUpperCase();
    const hit = f.exactMatch ? id === q || pid === q : id.includes(q) || pid.includes(q);
    if (!hit) return false;
  }
  const selected = f.statuses || [];
  if (isCompleted(spec.review)) return selected.includes('Verified');
  if (mode === 'digital' && !inDigitalList(spec.review)) return false;
  if (mode === 'entity' && !inEntityList(spec.review)) return false;
  if (selected.length === 0) return true;
  return selected.some((key) => matchesStatusFilter(spec.review, key));
}

/** 排序：全部完成的檢體排最下方；還有待辦的（即使部分膠囊已完成）依選擇的欄位排序 */
export function compareSpecimens(a: Specimen, b: Specimen, key: SortKey, asc: boolean, now: Date): number {
  const ca = isCompleted(a.review);
  const cb = isCompleted(b.review);
  if (ca !== cb) return ca ? 1 : -1;
  let cmp = 0;
  if (key === 'id') {
    cmp = (a.barcode || '').slice(-5).localeCompare((b.barcode || '').slice(-5), undefined, { numeric: true });
  } else if (key === 'time') {
    const ta = (a.imaging.analysisTime || '').replace(/-/g, '').replace(/[:\s]/g, '');
    const tb = (b.imaging.analysisTime || '').replace(/-/g, '').replace(/[:\s]/g, '');
    cmp = ta.localeCompare(tb);
  } else {
    const ua = Number(urgencyMinutes(a, now));
    const ub = Number(urgencyMinutes(b, now));
    cmp = (Number.isNaN(ua) ? 0 : ua) - (Number.isNaN(ub) ? 0 : ub);
  }
  return asc ? cmp : -cmp;
}
