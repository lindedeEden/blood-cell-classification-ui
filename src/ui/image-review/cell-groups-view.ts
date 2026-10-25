/**
 * 影像檢視頁的細胞區塊（第 5 章、規則 8）：依類別分組，達留單門檻的類別置頂並標紅
 */
import type { ReviewCell } from '../../app/specimen-store';
import { isNonWbcCategory } from '../../domain/constants/cell-types';
import { categoryReachesLeave, countCells, reviewCategoryOrder } from '../../domain/rules/cell-counts';
import type { leaveJudge } from '../../domain/rules/leave';
import { html, raw, type SafeHtml } from '../shared/dom';

/** selected：目前選取的細胞；readOnly：唯讀時細胞不能拖曳 */
export function cellGroupsHtml(
  cells: readonly ReviewCell[],
  judge: ReturnType<typeof leaveJudge>,
  selected: ReadonlySet<string>,
  readOnly: boolean,
): SafeHtml {
  const { counts, wbcTotal } = countCells(cells.map((c) => c.category));
  const byCategory = new Map<string, ReviewCell[]>();
  for (const c of cells) byCategory.set(c.category, [...(byCategory.get(c.category) ?? []), c]);
  const groups = reviewCategoryOrder(judge, counts, wbcTotal)
    .filter((cat) => byCategory.get(cat)?.length)
    .map((cat) => {
      const list = byCategory.get(cat) as ReviewCell[];
      const nonWbc = isNonWbcCategory(cat);
      const pctRaw = !nonWbc && wbcTotal ? (list.length / wbcTotal) * 100 : 0;
      // 非白血球不計 %；但 Megakaryocyte 對 18 歲以上為「出現即算」（規則 1），仍要判斷
      const hit = categoryReachesLeave(judge, cat, list.length, pctRaw);
      const countLabel = nonWbc
        ? `(${list.length} Cells，非白血球)`
        : `(${list.length} Cells, ${wbcTotal ? Math.round(pctRaw) : 0}%)`;
      return html`<div class="group section-card ${hit ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-300'} rounded-xl overflow-hidden" data-category="${cat}"><div class="flex items-center justify-between p-4 cursor-pointer hover:opacity-90 transition-colors section-header"><div class="flex items-center gap-3">${hit ? raw('<span class="material-symbols-outlined text-red-500 font-bold">warning</span>') : ''}<div class="flex items-baseline gap-2"><h2 class="text-lg font-bold ${hit ? 'text-red-800' : 'text-gray-800'}">${cat}</h2><span class="text-sm font-medium ${hit ? 'text-red-600' : 'text-gray-600'} section-count">${countLabel}</span></div></div><span class="toggle-icon material-symbols-outlined text-gray-400 transition-transform duration-200 icon-rotate-180">expand_more</span></div><div class="grid-content px-4 pb-4 grid-expanded transition-all duration-300 section-content"><div class="grid gap-2 mt-2 cell-grid" data-category="${cat}">${list.map(
        (cell) =>
          html`<div class="cell-image-container relative aspect-square cursor-pointer transition-all rounded-lg border-2 border-gray-300${selected.has(cell.id) ? ' ring-2 ring-primary' : ''}" data-cell-id="${cell.id}" data-category="${cat}" draggable="${readOnly ? 'false' : 'true'}"><img alt="Cell" class="w-full h-full object-cover rounded-lg" src="${cell.imageUrl || ''}"/></div>`,
      )}</div></div></div>`;
    });
  return html`${groups}`;
}
