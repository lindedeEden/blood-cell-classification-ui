/**
 * 狀態膠囊（文件 2 第 3 章開頭「膠囊圖例」）
 * key 一律用英文（資料與規則使用）；畫面顯示中文。
 */
import type { EntityStatusKey, FilterKey, ListMode, StatusKey } from '../types';

export const STATUS_LABELS: Readonly<Record<StatusKey, string>> = {
  'PLT Check': '血小板確認',
  'Digital Review': '數位閱片',
  'AI Alert': 'AI分類警示',
  'Follow-up': '需拉片確認',
  Locked: '鎖定中',
};

/** 膠囊顏色（Tailwind class） */
export const STATUS_STYLES: Readonly<Record<StatusKey, string>> = {
  'PLT Check': 'bg-blue-100 text-blue-800',
  'Digital Review': 'bg-purple-100 text-purple-800',
  'AI Alert': 'bg-orange-100 text-orange-800',
  'Follow-up': 'bg-red-100 text-red-800',
  Locked: 'bg-gray-200 text-gray-800 border border-gray-300',
};

/** 已完成的膠囊（綠色＋打勾） */
export const DONE_STYLE = 'bg-green-100 text-green-800';

/** 實體作業膠囊（規則 5、12）；AI 分類警示不在此列，跟著數位閱片或需拉片確認走 */
export const ENTITY_STATUSES: readonly EntityStatusKey[] = ['PLT Check', 'Follow-up'];

export function isEntityStatus(key: string): key is EntityStatusKey {
  return (ENTITY_STATUSES as readonly string[]).includes(key);
}

/** 檢體管理各模式預設勾選的狀態（第 4 章） */
export const MODE_DEFAULT_STATUS: Readonly<Record<ListMode, readonly FilterKey[]>> = {
  digital: ['Digital Review', 'AI Alert'],
  entity: ['Follow-up', 'PLT Check'],
};

/** 未選模式時全部勾選（'Verified'＝「已完成」選項，不是膠囊） */
export const ALL_FILTER_STATUSES: readonly FilterKey[] = [
  'PLT Check',
  'AI Alert',
  'Follow-up',
  'Digital Review',
  'Verified',
  'Locked',
];
