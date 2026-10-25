/**
 * 檢體管理頁（整頁）：以實際的頁面 HTML 執行 initSpecimenListPage
 */
import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SpecimenStore } from '../../src/app/specimen-store';
import { ThresholdSettings } from '../../src/app/thresholds';
import { loadDatabase } from '../../src/data/database';
import { toasts } from '../../src/infra/storage';
import { initSpecimenListPage } from '../../src/ui/specimen-list/specimen-list-page';

const PAGE_HTML = fs.readFileSync('檢體管理.html', 'utf8');

function openListPage() {
  document.body.innerHTML = PAGE_HTML.slice(PAGE_HTML.indexOf('<body'), PAGE_HTML.lastIndexOf('</body>')).replace(
    /^<body[^>]*>/,
    '',
  );
  const thresholds = new ThresholdSettings();
  const store = new SpecimenStore(loadDatabase(), thresholds);
  initSpecimenListPage({ store, thresholds, study: null });
  const selected = () => document.querySelector<HTMLElement>('#specimen-tbody tr.tr-selected')?.dataset.specimenId;
  const rows = () =>
    [...document.querySelectorAll<HTMLElement>('#specimen-tbody tr')].map((tr) => tr.dataset.specimenId);
  return { store, selected, rows };
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.useFakeTimers();
});

describe('返回檢體管理頁', () => {
  it('從報告頁返回：選取剛處理的檢體（仍在清單上時），否則選第一筆', () => {
    const first = openListPage();
    const target = first.rows()[3]!;
    toasts.followUpDone.queue(target, false);
    const back = openListPage();
    expect(back.selected()).toBe(target);
    toasts.reportVerified.queue('NOT-LISTED', true);
    const again = openListPage();
    expect(again.selected()).toBe(again.rows()[0]);
  });
  it('定時更新時效（120 秒）後，已勾選的列仍維持勾選', () => {
    openListPage();
    const box = document.querySelectorAll<HTMLInputElement>('#specimen-tbody .row-check')[2]!;
    box.checked = true;
    const id = box.dataset.id;
    vi.advanceTimersByTime(120_000);
    const after = document.querySelector<HTMLInputElement>(`#specimen-tbody .row-check[data-id="${id}"]`)!;
    expect([after === box, after.checked]).toEqual([false, true]);
  });
});

describe('清單排序（第 4 章）', () => {
  it('預設依時效由久到短排序', () => {
    openListPage();
    const th = document.querySelector<HTMLElement>('th[data-sort="urgency"]')!;
    expect(th.classList.contains('sort-desc')).toBe(true);
    const mins = [...document.querySelectorAll<HTMLElement>('#specimen-tbody tr')].map((tr) =>
      Number(tr.children[2]?.textContent?.replace(/\D/g, '') || 0),
    );
    expect(mins.length).toBeGreaterThan(3);
    expect(mins).toEqual([...mins].sort((a, b) => b - a));
  });
  it('實體作業模式：H5080720647 點「需拉片確認」標記完成後，還有血小板確認待辦，留在原位（2026-10-26 Eden 回報）', () => {
    const page = openListPage();
    document.getElementById('tab-entity')!.click();
    const before = page.rows();
    const capsule = document.querySelector<HTMLElement>(
      '#specimen-tbody tr[data-specimen-id="H5080720647"] .status-capsule[data-status="Follow-up"]',
    )!;
    capsule.click();
    expect(page.store.getById('H5080720647')!.review.workflowDone.entityStatusDone['Follow-up']).toBe(true);
    expect(page.rows()).toEqual(before);
  });
});
