/**
 * 影像檢視頁的右鍵選單（第 5 章）：AI 建議（預分類與信心值）、移到指定類別；點其他地方或 Esc 關閉
 */
import type { ReviewCell } from '../../app/specimen-store';
import { aiSuggestionCategory } from '../view-models';

/** onMove：把目前選取的細胞移到指定類別 */
export function createContextMenu(
  menu: HTMLElement,
  onMove: (category: string) => void,
): { show: (e: MouseEvent, cell: ReviewCell | undefined) => void; hide: () => void } {
  function show(e: MouseEvent, cell: ReviewCell | undefined): void {
    const ai = cell?.aiSuggestion ?? null;
    const aiBlock = menu.querySelector<HTMLElement>('.context-ai-block');
    if (aiBlock) {
      aiBlock.style.display = ai ? 'block' : 'none';
      if (ai) {
        const label = aiBlock.querySelector('.ai-suggestion-label');
        if (label) label.textContent = (ai.label || '') + (ai.pct != null ? ` ${ai.pct}%` : '');
        const target = (ai.label && aiSuggestionCategory(ai.label)) || cell?.category || '';
        const move = aiBlock.querySelector<HTMLButtonElement>('.ai-move-btn');
        if (move) {
          move.textContent = 'Move to ' + (target || ai.label || '');
          move.onclick = () => onMove(target);
        }
      }
    }
    // 先顯示再量尺寸；先套用視窗高度上限，避免底部超出畫面
    const pad = 8;
    Object.assign(menu.style, {
      display: 'flex',
      flexDirection: 'column',
      visibility: 'hidden',
      maxHeight: Math.max(120, innerHeight - 2 * pad) + 'px',
      overflowY: 'auto',
      boxSizing: 'border-box',
    });
    const rect = menu.getBoundingClientRect();
    let x = e.clientX;
    let y = e.clientY;
    if (x + rect.width > innerWidth - pad) x = innerWidth - pad - rect.width;
    if (y + rect.height > innerHeight - pad) y = innerHeight - pad - rect.height;
    Object.assign(menu.style, { left: Math.max(pad, x) + 'px', top: Math.max(pad, y) + 'px', visibility: 'visible' });
  }
  function hide(): void {
    Object.assign(menu.style, { display: 'none', maxHeight: '', overflowY: '', boxSizing: '' });
  }

  // 右鍵選單：點其他地方或 Esc 關閉
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target as Node)) hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
  menu.addEventListener('contextmenu', (e) => e.preventDefault());
  menu.querySelectorAll<HTMLElement>('.menu-item, .menu-item-danger').forEach((btn) =>
    btn.addEventListener('click', () => {
      onMove(btn.getAttribute('data-category') || (btn.textContent ?? '').trim());
      hide();
    }),
  );

  return { show, hide };
}
