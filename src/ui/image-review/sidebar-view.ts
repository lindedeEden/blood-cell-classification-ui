/**
 * 影像檢視頁左側：狀態膠囊（僅顯示）與分析對照表（流式計數、AI、前次報告；AI 值達門檻標紅，規則 8）
 */
import type { leaveJudge } from '../../domain/rules/leave';
import type { Specimen } from '../../domain/types';
import { html, raw, type SafeHtml } from '../shared/dom';
import { CHECK_ICON } from '../shared/icons';
import { analysisRows, capsuleView, prevReportHeader } from '../view-models';

type Judge = ReturnType<typeof leaveJudge>;

export function statusTagsHtml(spec: Specimen): SafeHtml {
  return html`${spec.review.status.map((key) => {
    const cap = capsuleView(spec, key);
    return html`<div class="inline-flex items-center gap-1 px-3 py-1 rounded-full ${cap.style} text-[10px] font-bold uppercase tracking-wider" data-status="${key}" title="狀態標籤僅供顯示">${cap.done ? CHECK_ICON : ''}${cap.label}</div>`;
  })}`;
}

export function analysisTableHtml(spec: Specimen, judge: Judge): SafeHtml {
  const header = html`<div class="grid grid-cols-4 gap-2 font-semibold text-gray-600 py-1.5 border-b border-gray-300/80 sticky top-0 bg-card z-[1] text-[10px] uppercase tracking-wider"><div class="col-span-1"></div><div class="col-span-1 text-right">流式計數</div><div class="col-span-1 text-right">AI</div><div class="col-span-1 text-right">${prevReportHeader(spec, '前次報告')}</div></div>`;
  const rows = analysisRows(spec).map((r) => {
    const hit = judge.isLeave(r.key, r.ai); // 規則 8：AI 值達門檻標紅
    const label = r.label.includes('WBC') ? raw('WBC<br/><span class="text-[9px]">(10e9/L)</span>') : r.label;
    const valueClass = hit ? 'font-bold text-red-600' : 'text-gray-800';
    return html`<div class="grid grid-cols-4 gap-2 items-center py-1.5 ${hit ? 'bg-red-50 border-b border-red-100' : 'border-b border-gray-200'}"><div class="col-span-1 ${hit ? 'text-red-700 font-semibold px-0.5' : 'text-gray-600 font-medium leading-tight'}">${label}</div><div class="col-span-1 text-right ${hit ? 'text-gray-400' : 'text-gray-800'}">${r.flow || '-'}</div><div class="col-span-1 text-right ${valueClass}">${r.ai || '-'}</div><div class="col-span-1 text-right ${valueClass}">${r.prev || '-'}</div></div>`;
  });
  return html`${header}<div class="space-y-0 text-xs">${rows}</div>`;
}
