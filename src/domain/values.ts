/**
 * 外部資料的數值與日期解析（各規則共用）
 */
import type { RawValue } from './types';

/** 數值：'-'、空白、null 視為「沒有值」（null），不等於 0；接受逗號小數點（'10,5'） */
export function parseNum(value: RawValue): number | null {
  if (value === '-' || value === '' || value == null) return null;
  const n = parseFloat(String(value).replace(',', '.'));
  return Number.isNaN(n) ? null : n;
}

/** 日期：接受 YYYY-MM-DD 或 YYYY/MM/DD，可帶 HH:mm（當地時間） */
export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const s = String(value).trim().replace(/\//g, '-').replace('T', ' ');
  const m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d), h ? Number(h) : 0, mi ? Number(mi) : 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}
