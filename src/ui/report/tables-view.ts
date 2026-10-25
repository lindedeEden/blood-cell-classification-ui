/**
 * 報告簽核頁的白血球分類表與其他發現表（流式計數、AI、人員編輯、前次報告；達留單門檻紅字，規則 1）
 */
import { REPORT_ROWS } from '../../domain/constants/cell-types';
import { aiValues, editedOrAiValue, leaveJudge, prevValues } from '../../domain/rules/leave';
import type { RawValue, Specimen, Thresholds } from '../../domain/types';
import { html, raw, type SafeHtml } from '../shared/dom';
import { flowDcValue } from '../view-models';

export function wbcTableHtml(spec: Specimen, thresholds: Thresholds): SafeHtml {
  const judge = leaveJudge(thresholds, spec);
  const ai = aiValues(spec) as Record<string, RawValue>;
  const prev = prevValues(spec) as Record<string, RawValue>;
  const section = (label: string) =>
    html`<tr class="bg-zinc-50/30 dark:bg-zinc-800/10"><td class="px-4 py-1.5 text-xs font-bold text-zinc-600 uppercase tracking-widest" colspan="5">${label}</td></tr>`;
  const row = ([label, key]: readonly [string, string]) => {
    const editedValue = editedOrAiValue(spec, key);
    const abnormal = judge.isLeave(key, editedValue);
    const valueClass = abnormal ? 'text-medical-red font-bold' : 'text-zinc-600';
    const editedClass = abnormal
      ? 'text-medical-red font-black bg-red-50 dark:bg-red-900/30 ring-1 ring-inset ring-red-200/60'
      : 'text-blue-900 dark:text-blue-100 font-extrabold bg-blue-100/80 dark:bg-blue-900/40 ring-1 ring-inset ring-blue-200/70 dark:ring-blue-700/40';
    return html`<tr class="${abnormal ? 'bg-medical-red/5 hover:bg-medical-red/10' : 'hover:bg-zinc-50/50'}"><td class="px-4 py-2 text-base ${abnormal ? 'text-medical-red font-bold' : 'text-zinc-800 dark:text-zinc-200 font-semibold'}">${abnormal ? html`${label} <span class="material-symbols-outlined text-[18px] align-middle">error</span>` : label}</td><td class="px-2 py-2 text-base text-right tabular ${valueClass}">${flowDcValue(spec, key as never) || '-'}</td><td class="px-2 py-2 text-base text-right tabular ${valueClass}">${ai[key] || '-'}</td><td class="px-2 py-2 text-base text-right tabular ${editedClass}">${editedValue || '-'}</td><td class="px-2 py-2 text-base text-right tabular text-zinc-600">${prev[key] || '-'}</td></tr>`;
  };
  return html`${section('常見細胞')}${REPORT_ROWS.COMMON.map(row)}${section('未成熟與異常細胞')}${REPORT_ROWS.ABNORMAL.map(row)}`;
}

/** 其他發現（非白血球）：同為 %，分母＝白血球總數 */
export function otherTableHtml(spec: Specimen, thresholds: Thresholds): SafeHtml {
  const judge = leaveJudge(thresholds, spec);
  const ai = aiValues(spec) as Record<string, RawValue>;
  const prev = prevValues(spec) as Record<string, RawValue>;
  return html`${REPORT_ROWS.OTHER.map(([label, key]) => {
    const editedValue = editedOrAiValue(spec, key);
    // 規則 1：18 歲以上出現 Megakaryocyte 即達留單，紅字標示
    const abnormal = judge.isLeave(key, editedValue);
    return html`<tr class="${abnormal ? 'bg-medical-red/5 hover:bg-medical-red/10' : 'hover:bg-zinc-50/30'}"><td class="px-3 py-1.5 text-xs font-semibold ${abnormal ? 'text-medical-red font-bold' : 'text-zinc-700 dark:text-zinc-300'}">${label}${abnormal ? raw(' <span class="material-symbols-outlined text-[14px] align-middle">error</span>') : ''}</td><td class="px-2 py-1.5 text-zinc-600 text-xs text-right tabular">${flowDcValue(spec, key) || '-'}</td><td class="px-2 py-1.5 text-zinc-600 text-xs text-right tabular">${ai[key] || '-'}</td><td class="px-2 py-1.5 text-blue-900 dark:text-blue-100 text-xs font-extrabold text-right tabular bg-blue-100/80 dark:bg-blue-900/40 ring-1 ring-inset ring-blue-200/70 dark:ring-blue-700/40">${editedValue || '-'}</td><td class="px-2 py-1.5 text-zinc-600 text-xs text-right tabular">${prev[key] || '-'}</td></tr>`;
  })}`;
}
