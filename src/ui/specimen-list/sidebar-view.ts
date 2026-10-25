/**
 * 檢體管理頁右側摘要：選取檢體的基本資料，以及流式計數、AI、前次報告對照（達留單門檻紅字，規則 1）
 */
import { leaveJudge, patientAge } from '../../domain/rules/leave';
import type { Specimen, Thresholds } from '../../domain/types';
import { byId, html, mustGet, setHtml } from '../shared/dom';
import { analysisRows, prevReportHeader } from '../view-models';

/** id：選取的條碼（沒有選取為 null）；spec：該檢體（找不到為 null） */
export function renderListSidebar(id: string | null, spec: Specimen | null, thresholds: Thresholds): void {
  mustGet('sidebar-specimen-id').textContent = id || '-';
  const prevHeader = byId('sidebar-prev-report-header');
  if (prevHeader) prevHeader.textContent = prevReportHeader(spec, '前次報告');
  mustGet('sidebar-placeholder').classList.toggle('hidden', !!spec);
  mustGet('sidebar-content').classList.toggle('hidden', !spec);
  if (!spec) return;
  const age = patientAge(spec);
  const info: [string, string][] = [
    ['病歷號', spec.lis.patientId],
    ['姓名', `${spec.lis.name} (${spec.lis.gender || ''})`],
    ['生日', `${spec.lis.birthDate || ''} (${age != null ? age + '歲' : ''})`],
    ['檢體來源', spec.lis.department],
  ];
  setHtml(
    mustGet('sidebar-info'),
    html`${info.map(([label, value]) => html`<div><span class="text-text-muted-light">${label}:</span><span class="text-text-light font-medium ml-1">${value || '-'}</span></div>`)}`,
  );
  // AI 值或前次值達門檻者以紅字標示（依病人年齡，規則 1）
  const judge = leaveJudge(thresholds, spec);
  setHtml(
    mustGet('sidebar-metrics'),
    html`${analysisRows(spec).map((r) => {
      const hit = judge.isLeave(r.key, r.ai) || judge.isLeave(r.key, r.prev);
      const cls = hit ? 'font-bold text-danger-text-light' : '';
      return html`<tr class="${hit ? 'bg-danger-light/30' : ''}"><td class="p-2 font-semibold text-text-muted-light">${r.label}</td><td class="p-2">${r.flow || '-'}</td><td class="p-2 ${cls}">${r.ai || '-'}</td><td class="p-2 ${cls}">${r.prev || '-'}</td></tr>`;
    })}`,
  );
}
