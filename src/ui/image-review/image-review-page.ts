/**
 * 影像檢視與細胞編輯頁（第 5 章、規則 8）
 *  - 左側：檢體資訊、狀態膠囊（僅顯示）、分析與歷史報告
 *  - 右側：依類別分組的細胞影像（影像來自 CellaVision、預分類來自 AI 模型）；達留單門檻的類別置頂標紅
 *  - 選取（含單手模式，見 selection.ts）、拖曳或右鍵選單重新歸類
 *  - 儲存結果 → 以內嵌視窗開啟報告簽核頁，接收它的通知完成簽核等操作（規則 9～11）
 */
import type { ReviewCell } from '../../app/specimen-store';
import type { AppContext } from '../context';
import { UNIDENTIFIED } from '../../domain/constants/cell-types';
import { editedDiffFromCells } from '../../domain/rules/cell-counts';
import { leaveJudge, patientAge } from '../../domain/rules/leave';
import {
  hasStatus,
  inDigitalList,
  isCompleted,
  isDigitalReviewReadOnly,
  isHandoffToFollowUp,
  nextPendingSpecimen,
} from '../../domain/rules/workflow';
import type { Specimen } from '../../domain/types';
import { noteActivity } from '../../infra/auth';
import { toasts } from '../../infra/storage';
import { byId, mustGet, setHtml } from '../shared/dom';
import {
  basePath,
  goToSpecimenList,
  isReadonlyFromUrl,
  reportUrl,
  specimenIdFromUrl,
  switchImageReviewSpecimen,
} from '../shared/navigation';
import { cellZoom, fontLevel } from '../shared/preferences';
import { aiSuggestion } from '../view-models';
import type { ReportMessage } from '../report/messages';
import { cellGroupsHtml } from './cell-groups-view';
import { createContextMenu } from './context-menu';
import { createGridLayout } from './grid-layout';
import { CellSelection, type CellLocation } from './selection';
import { analysisTableHtml, statusTagsHtml } from './sidebar-view';

/** 影像缺漏時的占位圖（內嵌 SVG，不需連外） */
const CELL_PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="g" cx="40%" cy="40%" r="50%"><stop offset="0%" stop-color="#e8e4f0"/><stop offset="70%" stop-color="#c4bed4"/><stop offset="100%" stop-color="#9a92a8"/></radialGradient></defs><ellipse cx="60" cy="60" rx="48" ry="52" fill="url(#g)" stroke="#8a8299" stroke-width="1.5"/><ellipse cx="52" cy="55" rx="18" ry="20" fill="rgba(255,255,255,0.4)"/></svg>',
  );

/** 細胞要在畫面上露出這個比例才算「看過」（規則 8） */
const VIEWED_RATIO = 0.35;

export function initImageReviewPage(ctx: AppContext, onReady?: () => void): void {
  const { store, thresholds } = ctx;
  const urlId = specimenIdFromUrl();
  // 網址沒有指定檢體時開第一筆；指定的條碼不存在時回到檢體管理（不可改開另一位病人的檢體）
  const spec: Specimen | null = urlId ? store.getById(urlId) : (store.all()[0] ?? null);
  if (!spec) return goToSpecimenList();
  // 規則 6：鎖定中（他人編輯中）的檢體完全不能開啟（含用網址直接開啟）
  if (spec.review.locked) return goToSpecimenList();

  const judge = leaveJudge(thresholds.get(), spec);
  const readOnly = isReadonlyFromUrl() || isDigitalReviewReadOnly(spec.review);
  let zoom = cellZoom.init();
  const viewed = new Set<string>();
  const cells: ReviewCell[] = loadCells();
  const scrollRoot = mustGet('main-cell-groups').parentElement as HTMLElement;

  /** 待數位閱片的檢體（上一筆／下一筆、簽核後自動開下一筆，規則 9） */
  const pendingDigital = () => store.listForDisplay().filter((s) => !s.review.locked && inDigitalList(s.review));
  let digitalList = pendingDigital();

  /** 細胞資料：已儲存的人員編輯結果優先；否則用進線時合併好的細胞（起始分類＝AI 預分類） */
  function loadCells(): ReviewCell[] {
    const saved = store.loadEditedCells(spec!.barcode);
    if (saved) return saved.slice();
    return spec!.imaging.cells.map((c, i) => ({
      id: 'cell-' + (i + 1),
      cellId: c.cellId,
      category: c.aiCategory,
      imageUrl: c.imagePath ? basePath() + c.imagePath : CELL_PLACEHOLDER,
      aiSuggestion: aiSuggestion(c),
    }));
  }

  // ─── 選取 ───────────────────────────────────────────────────────

  const cellEl = (id: string) =>
    document.querySelector<HTMLElement>(`.cell-image-container[data-cell-id="${CSS.escape(id)}"]`);
  const locate = (id: string): CellLocation => {
    const el = cellEl(id);
    if (!el) return { category: null, index: -1, list: [] };
    const category = el.getAttribute('data-category') || '';
    const list = Array.from(
      document.querySelectorAll<HTMLElement>(`.cell-image-container[data-category="${CSS.escape(category)}"]`),
    ).map((e) => e.dataset.cellId ?? '');
    return { category, index: list.indexOf(id), list };
  };
  const selection = new CellSelection(locate);
  const paintSelection = () =>
    document.querySelectorAll<HTMLElement>('.cell-image-container').forEach((el) => {
      const on = selection.selected.has(el.dataset.cellId ?? '');
      el.classList.toggle('ring-2', on);
      el.classList.toggle('ring-primary', on);
    });

  // ─── 左側 ───────────────────────────────────────────────────────

  function renderSidebar(): void {
    mustGet('specimen-id-title').textContent = spec!.barcode;
    setHtml(byId('sidebar-status-tags'), statusTagsHtml(spec!));
    const summary = document.querySelector('#sidebar-patient-details .patient-name-summary');
    if (summary) {
      const age = patientAge(spec!);
      let text = ` - ${spec!.lis.name || ''} (${spec!.lis.gender || ''})`;
      if (spec!.lis.birthDate) text += ` / ${spec!.lis.birthDate}` + (age != null ? ` (${age} 歲)` : '');
      summary.textContent = text;
    }
    mustGet('sidebar-patient-id').textContent = spec!.lis.patientId || '';
    mustGet('sidebar-patient-dept').textContent = spec!.lis.department || '';
    mustGet('sidebar-patient-machine').textContent = spec!.wam.machine || '';
    mustGet('sidebar-patient-location').textContent = spec!.wam.location || '';

    setHtml(byId('sidebar-analysis-table'), analysisTableHtml(spec!, judge));
  }

  function goPrevNext(delta: number): void {
    let i = digitalList.findIndex((s) => s.barcode === spec!.barcode) + delta;
    if (i < 0) i = digitalList.length - 1;
    if (i >= digitalList.length) i = 0;
    const next = digitalList[i];
    if (next) switchImageReviewSpecimen(next.barcode);
  }

  // ─── 細胞區塊 ────────────────────────────────────────────────────

  function renderCellGroups(): void {
    setHtml(mustGet('main-cell-groups'), cellGroupsHtml(cells, judge, selection.selected, readOnly));
    observeViewedCells();
    scheduleLayout();
  }

  function moveSelectedTo(category: string): void {
    if (readOnly) return;
    for (const id of selection.selected) {
      const cell = cells.find((c) => c.id === id);
      if (cell) cell.category = category;
    }
    selection.clear();
    renderCellGroups();
  }

  // ─── 看過的細胞（規則 8）與儲存按鈕 ────────────────────────────────

  let viewObserver: IntersectionObserver | null = null;
  function observeViewedCells(): void {
    viewObserver?.disconnect();
    const els = document.querySelectorAll('#main-cell-groups .cell-image-container');
    if (!els.length) return updateProgress();
    viewObserver = new IntersectionObserver(
      (entries) => {
        let changed = false;
        for (const entry of entries) {
          const id = entry.target.getAttribute('data-cell-id');
          if (!entry.isIntersecting || entry.intersectionRatio < VIEWED_RATIO || !id || viewed.has(id)) continue;
          viewed.add(id);
          changed = true;
        }
        if (changed) updateProgress();
      },
      { root: scrollRoot, rootMargin: '0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => viewObserver?.observe(el));
    updateProgress();
  }

  const unidentifiedCount = () => cells.filter((c) => c.category === UNIDENTIFIED).length;

  function updateProgress(): void {
    const total = cells.length;
    const text = byId('toolbar-progress-text');
    if (text) text.textContent = `已檢視 ${viewed.size} / ${total} · Unidentified ${unidentifiedCount()}`;
    const bar = byId('toolbar-progress-bar');
    if (bar) bar.style.width = (total ? (viewed.size / total) * 100 : 100) + '%';
    updateSaveButton();
  }

  /** 唯讀或還沒看完所有細胞時，「儲存結果」反灰不能按 */
  function updateSaveButton(): void {
    const btn = byId<HTMLButtonElement>('btn-save-report');
    if (!btn) return;
    const total = cells.length;
    const blocked = readOnly || !(total > 0 && viewed.size >= total);
    btn.disabled = blocked;
    btn.setAttribute('aria-disabled', String(blocked));
    btn.classList.toggle('opacity-50', blocked);
    btn.classList.toggle('cursor-not-allowed', blocked);
    if (readOnly) btn.title = spec!.review.locked ? '檢體已鎖定' : '數位閱片已完成';
    else if (blocked) btn.title = total === 0 ? '尚無細胞資料' : `請先檢視所有細胞（${viewed.size} / ${total}）`;
    else btn.removeAttribute('title');
  }

  function applyReadOnlyChrome(): void {
    const banner = byId('image-review-readonly-banner');
    if (banner) {
      banner.classList.toggle('hidden', !readOnly);
      if (readOnly) {
        banner.textContent = spec!.review.locked
          ? '此檢體已鎖定（他人編輯中），僅能檢視影像與縮放，無法變更細胞分類或核發報告。'
          : isHandoffToFollowUp(spec!.review)
            ? '唯讀模式：已交接至需拉片確認，以下為數位閱片人員編輯快照，僅供檢視。'
            : !hasStatus(spec!.review, 'Digital Review')
              ? '唯讀模式：需拉片確認已處理完成，僅能檢視影像與縮放。'
              : '唯讀模式：數位閱片已簽核結案，僅能檢視影像與縮放，無法變更細胞分類或核發報告。';
      }
    }
    updateSaveButton();
  }

  // ─── 縮放與排版 ──────────────────────────────────────────────────

  const { layoutGrids, scheduleLayout } = createGridLayout(() => zoom);

  // ─── 右鍵選單 ────────────────────────────────────────────────────

  const contextMenu = createContextMenu(mustGet('context-menu'), moveSelectedTo);
  function showContextMenu(e: MouseEvent, cellId: string | undefined): void {
    if (readOnly) return;
    contextMenu.show(
      e,
      cells.find((c) => c.id === cellId),
    );
  }

  // ─── 儲存結果 → 報告簽核（規則 8、9）─────────────────────────────────

  const reportModal = mustGet('report-issue-modal');
  const reportFrame = mustGet<HTMLIFrameElement>('report-issue-iframe');

  function showSaveBlocked(message: string): void {
    const modal = mustGet('modal-save-block');
    const text = modal.querySelector('.modal-message');
    if (text) text.textContent = message;
    modal.classList.remove('hidden');
  }

  function onSave(): void {
    const btn = byId<HTMLButtonElement>('btn-save-report');
    if (readOnly || btn?.disabled) return;
    const total = cells.length;
    const unidentified = unidentifiedCount();
    if (total === 0) return showSaveBlocked('尚無細胞資料，無法儲存。');
    if (unidentified > 0 || viewed.size < total) {
      const parts: string[] = [];
      if (viewed.size < total)
        parts.push(`尚有 ${total - viewed.size} 張細胞未檢視（請於主內容區捲動，使所有細胞曾進入視野）。`);
      if (unidentified > 0) parts.push(`尚有 Unidentified 未分類細胞（${unidentified}）。`);
      return showSaveBlocked(parts.join(' '));
    }
    // 規則 8：依調整後的分類算出人員編輯值，與細胞分類一起保存，報告簽核頁讀取
    store.saveEditedResult(spec!, editedDiffFromCells(cells.map((c) => c.category)), cells);
    reportFrame.src = reportUrl(spec!.barcode);
    reportModal.classList.remove('hidden');
  }

  const hideReport = () => reportModal.classList.add('hidden');

  const nextPendingAfter = (barcode: string) => nextPendingSpecimen(store.listForDisplay(), pendingDigital(), barcode);

  /** 接收報告簽核頁（內嵌視窗）的通知；只接受自己開的那個視窗 */
  function onReportMessage(e: MessageEvent): void {
    if (e.source !== reportFrame.contentWindow) return;
    const msg = e.data as ReportMessage;
    if (msg.type === 'reportActivity') return noteActivity();
    const id = msg.specimenId || spec!.barcode;
    if (msg.type === 'reportCancel') return hideReport();
    if (msg.type === 'reportManualAlert') {
      // 規則 10：改為人工鏡檢（報告頁已完成狀態變更與 LIS 註記）
      store.applyStoredReviews();
      hideReport();
      toasts.manualReview.queue({
        specimenId: id,
        addedFollowUp: msg.addedFollowUp !== false,
        lisSynced: !!msg.lisSynced,
      });
      return goToSpecimenList('digital');
    }
    if (msg.type === 'reportFollowUpDone') {
      // 規則 11：已拉片完成
      store.markFollowUpDone(id);
      const after = store.getById(id);
      toasts.followUpDone.queue(id, !!after && isCompleted(after.review));
      hideReport();
      return goToSpecimenList();
    }
    if (msg.type !== 'reportVerified') return;
    // 規則 9：簽核
    const signed = store.signOff(id, { confirmAiAlert: !!msg.confirmAiAlert, unlocked: !!msg.unlocked });
    if (!signed) return;
    digitalList = pendingDigital();
    renderSidebar();
    hideReport();
    if (msg.navigateNext) {
      const next = nextPendingAfter(id);
      if (next) return switchImageReviewSpecimen(next.barcode);
    }
    // 「簽核完成」提示只在回到檢體管理時排入；直接開下一筆時不排，避免之後回到清單才跳出舊的提示
    if (signed.review.statusDone) toasts.reportVerified.queue(id, isCompleted(signed.review));
    goToSpecimenList('digital');
  }

  // ─── 事件 ───────────────────────────────────────────────────────

  function bindEvents(): void {
    const groups = mustGet('main-cell-groups');
    groups.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const header = target.closest('.section-header');
      if (header) return toggleGroup(header);
      const cell = target.closest<HTMLElement>('.cell-image-container');
      if (!cell?.dataset.cellId) return;
      selection.click(cell.dataset.cellId, { ctrl: e.ctrlKey, shift: e.shiftKey });
      paintSelection();
    });
    groups.addEventListener('contextmenu', (e) => {
      const cell = (e.target as HTMLElement).closest<HTMLElement>('.cell-image-container');
      if (!cell?.dataset.cellId) return;
      e.preventDefault();
      if (readOnly) return;
      const shown = selection.forContextMenu(cell.dataset.cellId);
      paintSelection();
      showContextMenu(e, shown);
    });
    groups.addEventListener('dragstart', (e) => {
      const cell = (e.target as HTMLElement).closest<HTMLElement>('.cell-image-container');
      if (!cell?.dataset.cellId) return;
      if (readOnly) return e.preventDefault();
      const ids = selection.forDrag(cell.dataset.cellId);
      e.dataTransfer?.setData('text/plain', JSON.stringify(ids)); // Firefox 沒有 setData 就不會開始拖曳
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    });
    groups.addEventListener('dragover', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.cell-image-container, .section-content')) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      target.closest('.section-content')?.classList.add('bg-primary/5');
    });
    groups.addEventListener('dragleave', (e) => {
      const content = (e.target as HTMLElement).closest('.section-content');
      if (content && e.target === content) content.classList.remove('bg-primary/5');
    });
    groups.addEventListener('drop', (e) => {
      const target = e.target as HTMLElement;
      const content = target.closest('.section-content');
      const cell = target.closest<HTMLElement>('.cell-image-container');
      if (!content && !cell) return;
      e.preventDefault();
      content?.classList.remove('bg-primary/5');
      if (readOnly) return;
      const category = cell?.dataset.category || content?.closest<HTMLElement>('.section-card')?.dataset.category;
      if (category) moveSelectedTo(category);
    });

    byId('back-to-list')?.addEventListener('click', (e) => {
      e.preventDefault();
      goToSpecimenList();
    });
    const search = mustGet<HTMLInputElement>('sidebar-search');
    search.placeholder = '檢體 ID 搜尋…';
    search.value = '';
    search.addEventListener('keydown', (e) => {
      const id = search.value.trim();
      if (e.key === 'Enter' && id && store.getById(id)) switchImageReviewSpecimen(id);
    });
    mustGet('sidebar-prev').addEventListener('click', () => goPrevNext(-1));
    mustGet('sidebar-next').addEventListener('click', () => goPrevNext(1));

    // 單手模式：按住右鍵時用左鍵點選
    document.addEventListener('mousedown', (e) => e.button === 2 && selection.rightButtonDown());
    document.addEventListener('mouseup', (e) => e.button === 2 && selection.rightButtonUp());

    byId('btn-save-report')?.addEventListener('click', onSave);
    const zoomLabel = byId('zoom-value');
    const adjustZoom = (delta: number) => {
      zoom = cellZoom.adjust(delta);
      if (zoomLabel) zoomLabel.textContent = zoom + '%';
      scheduleLayout();
    };
    if (zoomLabel) zoomLabel.textContent = zoom + '%';
    byId('zoom-in')?.addEventListener('click', () => adjustZoom(10));
    byId('zoom-out')?.addEventListener('click', () => adjustZoom(-10));
    let resizeTimer: ReturnType<typeof setTimeout>;
    addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(scheduleLayout, 100);
    });
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => layoutGrids());
      ro.observe(groups);
      ro.observe(scrollRoot);
    }
    byId('font-smaller')?.addEventListener('click', () => (fontLevel.adjust(-1), scheduleLayout()));
    byId('font-larger')?.addEventListener('click', () => (fontLevel.adjust(1), scheduleLayout()));

    byId('report-issue-close')?.addEventListener('click', hideReport);
    reportModal.addEventListener('click', (e) => e.target === reportModal && hideReport());
    byId('modal-save-block-close')?.addEventListener('click', () =>
      mustGet('modal-save-block').classList.add('hidden'),
    );
    addEventListener('message', onReportMessage);
  }

  function toggleGroup(header: Element): void {
    const card = header.closest('.section-card');
    const content = card?.querySelector('.grid-content');
    const icon = card?.querySelector('.toggle-icon');
    if (!content) return;
    const expanded = content.classList.contains('grid-expanded');
    content.classList.toggle('grid-expanded', !expanded);
    content.classList.toggle('grid-collapsed', expanded);
    icon?.classList.toggle('icon-rotate-180', !expanded);
  }

  // ─── 初始化 ─────────────────────────────────────────────────────

  fontLevel.init();
  bindEvents();
  renderSidebar();
  renderCellGroups();
  applyReadOnlyChrome();
  onReady?.();
}
