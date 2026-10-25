/**
 * 檢體管理頁（第 4 章）
 *  - 模式（數位閱片／實體作業）、狀態篩選、日期／科別／機台／搜尋、排序
 *  - 點選列：右側摘要；雙擊或「進入閱片」：影像檢視頁
 *  - 點實體作業膠囊切換完成（規則 12）；撤回只能在 LIS 執行（規則 15），收到通知時跳出視窗
 *  - 留單標準設定（規則 7）
 *  - 返回本頁時顯示一次性提示（改為人工鏡檢、拉片完成、簽核完成）
 */
import { AppConfig } from '../../config';
import type { AppContext } from '../context';
import { LIS_WITHDRAWN_EVENT } from '../../app/specimen-store';
import { ALL_FILTER_STATUSES, MODE_DEFAULT_STATUS, isEntityStatus } from '../../domain/constants/status';
import { entityToggleBlockReason, isDigitalReviewReadOnly, isEntityStatusCompleted } from '../../domain/rules/workflow';
import type { FilterKey, ListMode, Specimen, StatusKey } from '../../domain/types';
import { parseDate } from '../../domain/values';
import { logout } from '../../infra/auth';
import { preferences, reviewStorage, toasts } from '../../infra/storage';
import { byId, mustGet, setHtml } from '../shared/dom';
import { goToImageReview } from '../shared/navigation';
import { fontLevel } from '../shared/preferences';
import { compareSpecimens, matchesFilters, type ListFilters, type SortKey } from './filtering';
import { followUpDoneToastText, manualReviewToastText, reportVerifiedToastText } from './return-toasts';
import { specimenRowsHtml } from './rows-view';
import { renderListSidebar } from './sidebar-view';
import { bindScenarioModal } from './scenario-modal';
import { bindThresholdModal } from './threshold-modal';

/** 預設排序：時效由久到短（等最久的在最上面） */
const DEFAULT_SORT: { key: SortKey; asc: boolean } = { key: 'urgency', asc: false };

interface UiState extends ListFilters {
  mode: ListMode | null;
  sortKey: SortKey;
  sortAsc: boolean;
}

export function initSpecimenListPage(ctx: AppContext): void {
  const { store, thresholds, study } = ctx;
  let selectedId: string | null = null;
  let listed: Specimen[] = [];
  let mode: ListMode | null = null;
  let sortKey: SortKey = DEFAULT_SORT.key;
  let sortAsc = DEFAULT_SORT.asc;

  /** 時效用的「現在」：正式系統用目前時間；原型從 DEMO_NOW 起算，依開啟後實際經過時間往前走 */
  const openedAt = Date.now();
  const now = (): Date => {
    const demo = AppConfig.DEMO_NOW ? parseDate(AppConfig.DEMO_NOW) : null;
    return demo ? new Date(demo.getTime() + (Date.now() - openedAt)) : new Date();
  };
  const input = <T extends HTMLInputElement | HTMLSelectElement>(id: string) => mustGet<T>(id);
  const setFooter = (text: string) => {
    const el = byId('footer-status');
    if (el) el.textContent = text;
  };
  /** 情境模擬測試中：新增的提示不顯示，維持研究當時的畫面 */
  const inStudy = () => !!study?.isActive();

  // ─── 模式與篩選條件 ──────────────────────────────────────────────

  function setModeTabs(next: ListMode | null): void {
    mode = next;
    document.querySelectorAll<HTMLElement>('.mode-tab').forEach((tab) => {
      tab.classList.remove('bg-primary', 'text-white', 'border-primary');
      tab.classList.add('border-border-light', 'bg-surface-light', 'text-text-muted-light');
      if (next != null && tab.dataset.mode === next) {
        tab.classList.remove('border-border-light', 'text-text-muted-light', 'bg-surface-light');
        tab.classList.add('bg-primary', 'text-white', 'border-primary');
      }
    });
  }
  const selectedStatuses = (): FilterKey[] =>
    Array.from(document.querySelectorAll<HTMLInputElement>('.status-filter:checked')).map(
      (cb) => cb.value as FilterKey,
    );
  const checkStatuses = (keys: readonly FilterKey[]) =>
    document
      .querySelectorAll<HTMLInputElement>('.status-filter')
      .forEach((cb) => (cb.checked = keys.includes(cb.value as FilterKey)));

  const currentFilters = (): ListFilters => ({
    dateStart: input('analysis-date-start').value,
    dateEnd: input('analysis-date-end').value,
    department: input('filter-department').value,
    machine: input('filter-machine').value,
    search: (input('specimen-search').value || '').trim(),
    exactMatch: input<HTMLInputElement>('exact-match').checked,
    statuses: selectedStatuses(),
  });

  const defaultState = (): UiState => ({
    mode: null,
    sortKey: DEFAULT_SORT.key,
    sortAsc: DEFAULT_SORT.asc,
    statuses: ALL_FILTER_STATUSES.slice(),
    dateStart: AppConfig.DEMO_DATE,
    dateEnd: AppConfig.DEMO_DATE,
    department: '',
    machine: '',
    search: '',
    exactMatch: false,
  });

  /** 保存目前條件（返回本頁時還原） */
  function saveUiState(): void {
    const f = currentFilters();
    preferences.setListUiState({ mode, sortKey, sortAsc, ...f });
  }

  function applyUiState(state: Partial<UiState>): void {
    const m = state.mode === 'digital' || state.mode === 'entity' ? state.mode : preferences.listMode();
    setModeTabs(m);
    preferences.setListMode(m);
    sortKey = state.sortKey || DEFAULT_SORT.key;
    sortAsc = typeof state.sortAsc === 'boolean' ? state.sortAsc : DEFAULT_SORT.asc;
    checkStatuses(Array.isArray(state.statuses) ? state.statuses : ALL_FILTER_STATUSES);
    input('analysis-date-start').value = state.dateStart || AppConfig.DEMO_DATE;
    input('analysis-date-end').value = state.dateEnd || AppConfig.DEMO_DATE;
    input('filter-department').value = state.department || '';
    input('filter-machine').value = state.machine || '';
    input('specimen-search').value = state.search || '';
    input<HTMLInputElement>('exact-match').checked = !!state.exactMatch;
  }

  /** 進入本頁時還原條件；從影像檢視返回時切回原本的模式 */
  function restoreUiState(): void {
    const returnMode = preferences.returnMode();
    if (returnMode) preferences.setListMode(returnMode);
    preferences.clearReturnMode();
    const saved = preferences.listUiState() as Partial<UiState> | null;
    if (saved) {
      if (saved.mode !== 'digital' && saved.mode !== 'entity') {
        const restored = preferences.listMode() || returnMode;
        if (restored) {
          saved.mode = restored;
          saved.statuses = MODE_DEFAULT_STATUS[restored].slice();
        }
      }
      return applyUiState(saved);
    }
    const state = defaultState();
    const m = preferences.listMode() || returnMode;
    if (m) {
      state.mode = m;
      state.statuses = MODE_DEFAULT_STATUS[m].slice();
    }
    applyUiState(state);
  }

  // ─── 清單 ───────────────────────────────────────────────────────

  function refreshList(): Specimen[] {
    const f = currentFilters();
    listed = store.listForDisplay().filter((s) => matchesFilters(s, f, mode));
    const t = now();
    listed.sort((a, b) => compareSpecimens(a, b, sortKey, sortAsc, t));
    return listed;
  }

  function renderTable(): void {
    refreshList();
    const t = now();
    setHtml(mustGet('specimen-tbody'), specimenRowsHtml(listed, selectedId, t));
    setFooter(`已篩選 ${listed.length} 筆`);
  }

  const isListed = (id: string) => listed.some((s) => s.barcode === id);

  function selectRow(id: string | null): void {
    selectedId = id;
    document
      .querySelectorAll<HTMLElement>('#specimen-tbody tr')
      .forEach((tr) => tr.classList.toggle('tr-selected', tr.dataset.specimenId === id));
    updateSidebar(id);
  }

  function updateSortIcons(): void {
    document.querySelectorAll<HTMLElement>('th.sortable').forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      const up = th.querySelector('.sort-icon-asc');
      const down = th.querySelector('.sort-icon-desc');
      up?.classList.add('hidden');
      down?.classList.add('hidden');
      if (th.dataset.sort === sortKey) {
        th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');
        up?.classList.toggle('hidden', !sortAsc);
        down?.classList.toggle('hidden', sortAsc);
      }
    });
  }

  function openImageReview(id: string): void {
    saveUiState();
    goToImageReview(id, { locked: store.getById(id)?.review.locked });
  }

  // ─── 右側摘要 ───────────────────────────────────────────────────

  const updateSidebar = (id: string | null) => renderListSidebar(id, id ? store.getById(id) : null, thresholds.get());

  // ─── 點實體作業膠囊（規則 12）──────────────────────────────────────

  function onCapsuleClick(capsule: HTMLElement): void {
    const id = capsule.closest('tr')?.getAttribute('data-specimen-id') ?? '';
    const spec = store.getById(id);
    const key = capsule.getAttribute('data-status') as StatusKey;
    const blocked = spec && entityToggleBlockReason(spec.review, key);
    if (spec && blocked === 'completed') {
      // 規則 15：只有已簽核的數位閱片結果可在 LIS 撤回；人工鏡檢結果在 LIS 細胞計數程式處理
      setFooter(
        `${id} 流程已完成，無法點選膠囊取消${spec.review.workflowDone.digitalReviewSignedOff ? '；如需撤回數位閱片結果，請由實體作業醫檢師在 LIS 撤回' : ''}`,
      );
      return;
    }
    if (blocked === 'followUpSignedOff') {
      setFooter(`${id} 已簽核，需拉片確認已隨簽核完成，無法取消；如需撤回，請由實體作業醫檢師在 LIS 撤回`);
      return;
    }
    if (!isEntityStatus(key) || !store.toggleEntityStatus(id, key)) return;
    const toggled = store.getById(id);
    renderTable();
    if (!inStudy() && toggled && isEntityStatusCompleted(toggled.review, key)) {
      setFooter(
        `${id} ${key === 'Follow-up' ? '需拉片確認完成；已在 LIS 檢驗註記「拉片完成」' : '血小板確認完成；已在 LIS 檢驗註記「血小板確認完成」'}`,
      );
    }
    // 維持原本的選取；原選取已不在清單中時改選第一筆
    if (listed.length && selectedId) selectRow(isListed(selectedId) ? selectedId : (listed[0]?.barcode ?? null));
    else updateSidebar(null);
  }

  // ─── 返回本頁的一次性提示 ─────────────────────────────────────────

  function showToast(text: string): void {
    const box = byId('specimen-list-toast');
    const label = byId('specimen-list-toast-text');
    if (!box || !label) return;
    label.textContent = text;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), 6000);
  }

  /** 顯示前一頁排入的提示；選取剛處理的檢體（仍在清單上時），否則選第一筆 */
  function showReturnToasts(): void {
    const manual = toasts.manualReview.consume();
    if (manual) showToast(manualReviewToastText(manual));
    const followUp = toasts.followUpDone.consume();
    if (followUp) showToast(followUpDoneToastText(followUp, inStudy()));
    const verified = toasts.reportVerified.consume();
    if (verified) showToast(reportVerifiedToastText(verified));
    const processed = (manual ?? followUp ?? verified)?.specimenId;
    if (processed && isListed(processed)) selectRow(processed);
    else if (listed[0]) selectRow(listed[0].barcode);
  }

  // ─── LIS 撤回通知（規則 15）────────────────────────────────────────

  /** 收到撤回：重繪清單並跳出視窗（視窗開著時再收到，加在同一個視窗） */
  function onLisWithdrawn(e: Event): void {
    const barcode = (e as CustomEvent<{ barcode?: string }>).detail?.barcode ?? '';
    renderTable();
    if (selectedId) selectRow(isListed(selectedId) ? selectedId : (listed[0]?.barcode ?? null));
    if (!barcode) return;
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = barcode;
    li.append(b, ' 的 DC 結果已從 LIS 撤回，檢體已回到進線狀態。');
    mustGet('modal-lis-withdraw-body').appendChild(li);
    mustGet('modal-lis-withdraw').classList.remove('hidden');
  }

  // ─── 事件 ───────────────────────────────────────────────────────

  const onFilterChanged = () => {
    renderTable();
    saveUiState();
  };

  function bindEvents(): void {
    const tbody = mustGet('specimen-tbody');
    // 清單是動態產生的：事件綁在表格本身（事件委派），不必每次重繪都重新綁
    tbody.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const capsule = target.closest<HTMLElement>('.status-capsule');
      if (capsule) return onCapsuleClick(capsule);
      const enter = target.closest<HTMLButtonElement>('.enter-review-btn');
      if (enter) return void (!enter.disabled && enter.dataset.id && openImageReview(enter.dataset.id));
      const readonly = target.closest<HTMLElement>('.readonly-review-btn');
      if (readonly?.dataset.id) return void goToImageReview(readonly.dataset.id, { readonly: true });
      if ((target as HTMLInputElement).type === 'checkbox') return;
      const tr = target.closest<HTMLElement>('tr');
      if (tr?.dataset.specimenId) selectRow(tr.dataset.specimenId);
    });
    tbody.addEventListener('dblclick', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'checkbox') return;
      const spec = store.getById(target.closest<HTMLElement>('tr')?.dataset.specimenId ?? '');
      if (!spec || spec.review.locked || isDigitalReviewReadOnly(spec.review)) return;
      openImageReview(spec.barcode);
    });
    // 表頭全選：勾選／取消清單上所有列（目前沒有批次操作，僅供勾選）
    mustGet<HTMLInputElement>('select-all').addEventListener('change', (e) => {
      const checked = (e.target as HTMLInputElement).checked;
      tbody.querySelectorAll<HTMLInputElement>('.row-check').forEach((cb) => (cb.checked = checked));
    });

    mustGet('btn-filter').addEventListener('click', function (this: HTMLElement) {
      const panel = mustGet('filter-panel');
      const open = !panel.classList.contains('hidden');
      panel.classList.toggle('hidden', open);
      this.setAttribute('aria-expanded', String(!open));
    });
    document.querySelectorAll('.status-filter').forEach((cb) => cb.addEventListener('change', onFilterChanged));

    document.querySelectorAll<HTMLElement>('.mode-tab').forEach((tab) =>
      tab.addEventListener('click', () => {
        const next = tab.dataset.mode as ListMode;
        if (mode === next) {
          // 再點一次同一模式＝取消模式
          setModeTabs(null);
          preferences.setListMode(null);
          checkStatuses(ALL_FILTER_STATUSES);
        } else {
          setModeTabs(next);
          preferences.setListMode(next);
          checkStatuses(MODE_DEFAULT_STATUS[next]);
        }
        onFilterChanged();
        if (listed[0]) selectRow(listed[0].barcode);
      }),
    );

    document.querySelectorAll<HTMLElement>('th.sortable').forEach((th) =>
      th.addEventListener('click', () => {
        const key = th.dataset.sort as SortKey;
        if (sortKey === key) sortAsc = !sortAsc;
        else {
          sortKey = key;
          sortAsc = true;
        }
        updateSortIcons();
        onFilterChanged();
        if (listed.length && selectedId) selectRow(selectedId);
      }),
    );

    mustGet('btn-search').addEventListener('click', onFilterChanged);
    mustGet('specimen-search').addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') mustGet('btn-search').click();
    });
    mustGet('specimen-search').addEventListener('input', saveUiState);
    for (const id of [
      'analysis-date-start',
      'analysis-date-end',
      'exact-match',
      'filter-department',
      'filter-machine',
    ]) {
      mustGet(id).addEventListener('change', onFilterChanged);
    }

    mustGet('font-smaller').addEventListener('click', () => fontLevel.adjust(-1));
    mustGet('font-larger').addEventListener('click', () => fontLevel.adjust(1));
    mustGet('btn-logout').addEventListener('click', () => logout('manual'));

    window.addEventListener(LIS_WITHDRAWN_EVENT, onLisWithdrawn);
    mustGet('modal-lis-withdraw-ok').addEventListener('click', () => {
      mustGet('modal-lis-withdraw').classList.add('hidden');
      mustGet('modal-lis-withdraw-body').replaceChildren();
    });

    // 其他分頁／視窗變更檢體狀態後，同步並重繪
    window.addEventListener('storage', (e) => {
      if (!reviewStorage.isStatusKey(e.key)) return;
      store.applyStoredReviews();
      updateSortIcons();
      renderTable();
      if (listed.length && selectedId) selectRow(selectedId);
    });
  }

  function fillFilterOptions(): void {
    const add = (select: HTMLElement, values: string[]) =>
      values.forEach((v) => {
        const option = document.createElement('option');
        option.value = v;
        option.textContent = v;
        select.appendChild(option);
      });
    add(mustGet('filter-department'), store.departments());
    add(mustGet('filter-machine'), store.machines());
  }

  /** 展示用：套用情境時重設所有條件 */
  function resetFiltersForScenario(): void {
    setModeTabs(null);
    preferences.setListMode(null);
    checkStatuses(ALL_FILTER_STATUSES);
    input('analysis-date-start').value = AppConfig.DEMO_DATE;
    input('analysis-date-end').value = AppConfig.DEMO_DATE;
    input('filter-department').value = '';
    input('filter-machine').value = '';
    input('specimen-search').value = '';
    input<HTMLInputElement>('exact-match').checked = false;
  }

  /** 展示用：「情境模擬測試」視窗 */
  function bindScenarioPanel(): void {
    if (!study) return;
    bindScenarioModal(
      study,
      (nextId) => {
        if (nextId) resetFiltersForScenario();
        selectedId = null;
        mustGet('sidebar-placeholder').classList.remove('hidden');
        mustGet('sidebar-content').classList.add('hidden');
        renderTable();
        saveUiState();
      },
      setFooter,
    );
  }

  // ─── 初始化 ─────────────────────────────────────────────────────

  fontLevel.init();
  bindEvents();
  bindThresholdModal(thresholds, () => {
    store.recomputeAiAlerts();
    renderTable();
    setFooter('留單標準已儲存');
  });
  fillFilterOptions();
  restoreUiState();
  updateSortIcons();
  renderTable();
  saveUiState();
  showReturnToasts();
  // 時效（收件後經過分鐘數）定時更新（暫定 120 秒）；重繪後保留選取與勾選
  setInterval(() => {
    const checked = new Set(
      Array.from(document.querySelectorAll<HTMLInputElement>('#specimen-tbody .row-check:checked')).map(
        (cb) => cb.dataset.id,
      ),
    );
    renderTable();
    document
      .querySelectorAll<HTMLInputElement>('#specimen-tbody .row-check')
      .forEach((cb) => (cb.checked = checked.has(cb.dataset.id)));
  }, AppConfig.URGENCY_REFRESH_MS);
  bindScenarioPanel();
}
