/**
 * 檢體管理頁的清單列（第 4 章）：狀態膠囊、時效、按鈕；只產生 HTML，事件由頁面以事件委派處理
 */
import { isCompleted, isDigitalReviewReadOnly, urgencyMinutes } from '../../domain/rules/workflow';
import type { Specimen } from '../../domain/types';
import { html, type SafeHtml } from '../shared/dom';
import { capsuleView } from '../view-models';

const statusCapsules = (spec: Specimen) =>
  spec.review.status.map((key) => {
    const cap = capsuleView(spec, key);
    return html`<span class="status-capsule ${cap.style}" data-status="${key}">${cap.done ? html`<span class="material-symbols-outlined text-xs mr-1">check</span>` : ''}${key === 'Locked' ? html`<span class="material-symbols-outlined text-xs mr-1">lock</span>` : ''}${cap.label}</span>`;
  });

function rowClass(spec: Specimen, index: number): string {
  if (spec.review.locked) return 'bg-striped';
  if (isCompleted(spec.review)) return 'bg-gray-50';
  return index % 2 ? 'bg-gray-50' : 'bg-white';
}

function rowHtml(spec: Specimen, index: number, t: Date, selectedId: string | null): SafeHtml {
  const locked = spec.review.locked;
  const readOnly = !locked && isDigitalReviewReadOnly(spec.review);
  const cell = (v: unknown) => html`<td class="p-2 py-4">${v}</td>`;
  return html`<tr class="hover:bg-gray-50 ${rowClass(spec, index)}${spec.barcode === selectedId ? ' tr-selected' : ''}" data-specimen-id="${spec.barcode}"><td class="p-2 py-4"><input type="checkbox" class="row-check rounded border-gray-300 text-primary focus:ring-primary" data-id="${spec.barcode}"/></td><td class="p-2 py-4"><div class="flex flex-col gap-1 items-start">${statusCapsules(spec)}</div></td>${cell(urgencyMinutes(spec, t))}${cell(spec.barcode)}${cell(spec.lis.patientId)}${cell(spec.lis.name)}${cell(spec.lis.department)}${cell(spec.wam.machine)}${cell(spec.wam.location)}${cell(spec.imaging.analysisTime)}${cell(spec.review.editor || '')}<td class="p-2 py-4"><div class="flex flex-wrap items-center gap-2"><button type="button" class="text-primary text-xs hover:underline enter-review-btn${readOnly ? ' opacity-50 cursor-not-allowed' : ''}" data-id="${spec.barcode}"${locked || readOnly ? html` disabled` : ''}${readOnly ? html` title="已結束，僅能唯讀檢視"` : ''}>${locked ? '已鎖定' : '進入閱片'}</button>${readOnly ? html`<button type="button" class="readonly-review-btn text-amber-800 text-xs font-semibold hover:underline whitespace-nowrap" data-id="${spec.barcode}">唯讀檢視</button>` : ''}</div></td></tr>`;
}

/** 清單所有列；t＝時效計算用的「現在」 */
export function specimenRowsHtml(listed: readonly Specimen[], selectedId: string | null, t: Date): SafeHtml {
  return html`${listed.map((s, i) => rowHtml(s, i, t, selectedId))}`;
}
