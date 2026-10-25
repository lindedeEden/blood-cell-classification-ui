/**
 * 「留單標準設定」視窗（規則 7）：顯示目前門檻、儲存、還原預設值
 */
import type { ThresholdSettings } from '../../app/thresholds';
import { DEFAULT_THRESHOLDS, THRESHOLD_FORM_ORDER, THRESHOLD_LABELS } from '../../domain/constants/thresholds';
import { thresholdsFromForm } from '../../domain/rules/leave';
import type { ThresholdKey } from '../../domain/types';
import { byId, html, mustGet, setHtml } from '../shared/dom';

/** onSaved：儲存後要做的事（重算 AI 分類警示、重繪清單、頁尾訊息） */
export function bindThresholdModal(thresholds: ThresholdSettings, onSaved: () => void): void {
  function buildThresholdForm(): void {
    const current = thresholds.get();
    setHtml(
      mustGet('modal-leave-settings-body'),
      html`${THRESHOLD_FORM_ORDER.map((k) =>
        DEFAULT_THRESHOLDS[k] === 'present'
          ? html`<div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-2.5 border-b border-gray-100 items-start sm:items-center"><div><span class="font-medium text-text-light text-sm">${THRESHOLD_LABELS[k]}</span><p class="text-[11px] text-text-muted-light mt-0.5">有數值（&gt;0）即視為達留單標準（Present）</p></div><span class="text-xs font-medium text-text-muted-light shrink-0 sm:text-right">Present</span></div>`
          : html`<div class="grid grid-cols-1 sm:grid-cols-[1fr_minmax(0,7rem)] gap-x-3 gap-y-1 py-2.5 border-b border-gray-100 items-center"><label class="font-medium text-text-light text-sm" for="leave-inp-${k}">${THRESHOLD_LABELS[k]}</label><input id="leave-inp-${k}" type="number" min="0" step="0.1" data-key="${k}" class="w-full px-2 py-1.5 text-sm border border-border-light rounded-md focus:ring-primary focus:border-primary" value="${String(current[k])}"/></div>`,
      )}`,
    );
  }
  const openThresholds = () => {
    buildThresholdForm();
    mustGet('modal-leave-settings').classList.remove('hidden');
  };
  const closeThresholds = () => mustGet('modal-leave-settings').classList.add('hidden');

  /** 儲存門檻：非數字或負數沿用預設值；儲存後立即重算未簽核檢體的 AI 分類警示（規則 1） */
  function saveThresholds(): void {
    const fields: Partial<Record<ThresholdKey, string>> = {};
    document.querySelectorAll<HTMLInputElement>('#modal-leave-settings input[data-key]').forEach((field) => {
      fields[field.dataset.key as ThresholdKey] = field.value;
    });
    thresholds.save(thresholdsFromForm(fields, THRESHOLD_FORM_ORDER));
    closeThresholds();
    onSaved();
  }

  mustGet('btn-settings').addEventListener('click', openThresholds);
  for (const id of ['modal-leave-settings-close', 'modal-leave-settings-backdrop', 'modal-leave-settings-cancel']) {
    byId(id)?.addEventListener('click', closeThresholds);
  }
  mustGet('modal-leave-settings-reset').addEventListener('click', () => {
    thresholds.reset();
    buildThresholdForm();
  });
  mustGet('modal-leave-settings-save').addEventListener('click', saveThresholds);
}
