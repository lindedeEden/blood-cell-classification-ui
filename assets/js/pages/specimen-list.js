/**
 * 檢體管理頁
 *  - 模式（數位閱片／實體作業）、狀態篩選、日期／科別／機台／搜尋、排序（第 4 節）
 *  - 點選列：右側摘要（第 4 節）；雙擊或「進入閱片」：影像檢視頁
 *  - 點選實體標籤（PLT Check／Follow-up）切換完成（規則 12）；撤回只能在 LIS 執行（規則 15），本頁不提供
 *  - 留單標準設定（規則 7）
 *  - 返回本頁時顯示一次性提示（改為人工鏡檢、拉片完成、簽核完成）
 */
(function () {
  'use strict';

  var WR = WorkflowRules;

  /** Demo 預設：分析日期固定為模擬資料日期 */
  var DEMO_DATE = '2025-08-07';
  var DEFAULT_SORT = { key: 'time', asc: false };

  var currentSpecimenId = null;   // 目前選取的檢體條碼（barcode）
  var filteredList = [];
  var currentMode = null;
  var sortKey = DEFAULT_SORT.key;
  var sortAsc = DEFAULT_SORT.asc;

  /** 時效用的「現在」：正式系統用目前時間；原型從 AppConfig.DEMO_NOW 起算，依開啟後實際經過時間往前走 */
  var PAGE_OPENED_AT = Date.now();
  function currentTime() {
    var demoNow = AppConfig.DEMO_NOW ? LeaveRules.parseDate(AppConfig.DEMO_NOW) : null;
    return demoNow ? new Date(demoNow.getTime() + (Date.now() - PAGE_OPENED_AT)) : new Date();
  }

  function $(id) { return document.getElementById(id); }
  function setFooter(text) { var fs = $('footer-status'); if (fs) fs.textContent = text; }

  /** 情境模擬測試（demo/）啟用中：新增的提示不顯示，維持研究當時的畫面 */
  function inUsabilityStudy() { return typeof UsabilityStudy !== 'undefined' && UsabilityStudy.isActive(); }

  // ─── 模式與篩選條件 ───────────────────────────────────────

  /** mode 為 null 時兩側模式按鈕皆不反白（未選模式） */
  function setModeTabVisual(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-tab').forEach(function (t) {
      t.classList.remove('bg-primary', 'text-white', 'border-primary');
      t.classList.add('border-border-light', 'bg-surface-light', 'text-text-muted-light');
      if (mode != null && t.dataset.mode === mode) {
        t.classList.remove('border-border-light', 'text-text-muted-light', 'bg-surface-light');
        t.classList.add('bg-primary', 'text-white', 'border-primary');
      }
    });
  }

  function modeDefaultStatuses(mode) {
    return (StatusConstants.MODE_DEFAULT_STATUS[mode] || []).slice();
  }

  function getSelectedStatuses() {
    var checked = [];
    document.querySelectorAll('.status-filter:checked').forEach(function (cb) { checked.push(cb.value); });
    return checked;
  }

  function setStatusFilterCheckboxes(keys) {
    document.querySelectorAll('.status-filter').forEach(function (cb) {
      cb.checked = keys.indexOf(cb.value) !== -1;
    });
  }

  function getFilters() {
    return {
      dateStart: $('analysis-date-start').value,
      dateEnd: $('analysis-date-end').value,
      department: $('filter-department').value,
      machine: $('filter-machine').value,
      search: ($('specimen-search').value || '').trim(),
      exactMatch: $('exact-match').checked,
      statuses: getSelectedStatuses()
    };
  }

  function getDefaultUiState() {
    return {
      mode: null,
      sortKey: DEFAULT_SORT.key,
      sortAsc: DEFAULT_SORT.asc,
      statuses: StatusConstants.ALL_FILTER_STATUSES.slice(),
      dateStart: DEMO_DATE,
      dateEnd: DEMO_DATE,
      department: '',
      machine: '',
      search: '',
      exactMatch: false
    };
  }

  /** 保存目前畫面條件（返回本頁時還原） */
  function persistUiState() {
    var f = getFilters();
    DemoStorage.setListUiState({
      mode: currentMode,
      sortKey: sortKey,
      sortAsc: !!sortAsc,
      statuses: f.statuses,
      dateStart: f.dateStart || '',
      dateEnd: f.dateEnd || '',
      department: f.department || '',
      machine: f.machine || '',
      search: f.search,
      exactMatch: !!f.exactMatch
    });
  }

  function applyUiState(state) {
    var data = state || getDefaultUiState();
    var mode = (data.mode === 'digital' || data.mode === 'entity') ? data.mode : DemoStorage.getListMode();
    setModeTabVisual(mode);
    DemoStorage.setListMode(mode);
    sortKey = data.sortKey || DEFAULT_SORT.key;
    sortAsc = typeof data.sortAsc === 'boolean' ? data.sortAsc : DEFAULT_SORT.asc;
    setStatusFilterCheckboxes(Array.isArray(data.statuses) ? data.statuses : StatusConstants.ALL_FILTER_STATUSES);
    $('analysis-date-start').value = data.dateStart || DEMO_DATE;
    $('analysis-date-end').value = data.dateEnd || DEMO_DATE;
    $('filter-department').value = data.department || '';
    $('filter-machine').value = data.machine || '';
    $('specimen-search').value = data.search || '';
    $('exact-match').checked = !!data.exactMatch;
  }

  /** 進入本頁時還原條件；從影像檢視返回時切回原本的模式 */
  function restoreUiState() {
    var returnMode = DemoStorage.consumeReviewReturnMode();
    if (returnMode) DemoStorage.setListMode(returnMode);
    DemoStorage.clearReviewReturnMode();

    var saved = DemoStorage.getListUiState();
    if (saved) {
      if (saved.mode !== 'digital' && saved.mode !== 'entity') {
        var restoredMode = DemoStorage.getListMode() || returnMode;
        if (restoredMode) {
          saved.mode = restoredMode;
          saved.statuses = modeDefaultStatuses(restoredMode);
        }
      }
      applyUiState(saved);
      return;
    }
    var state = getDefaultUiState();
    var mode = DemoStorage.getListMode() || returnMode;
    if (mode) {
      state.mode = mode;
      state.statuses = modeDefaultStatuses(mode);
    }
    applyUiState(state);
  }

  /** 展示用：套用情境時重設所有條件（demo/usability-study.js 呼叫） */
  function resetFiltersForScenario() {
    setModeTabVisual(null);
    DemoStorage.setListMode(null);
    setStatusFilterCheckboxes(StatusConstants.ALL_FILTER_STATUSES.slice());
    $('analysis-date-start').value = DEMO_DATE;
    $('analysis-date-end').value = DEMO_DATE;
    $('filter-department').value = '';
    $('filter-machine').value = '';
    $('specimen-search').value = '';
    $('exact-match').checked = false;
  }

  // ─── 篩選與排序（第 4 節）────────────────────────────

  /**
   * 規則 5（第 4 節）：模式決定工作清單（數位閱片 inDigitalList／實體作業 inEntityList），
   * 狀態勾選再從中篩選尚未完成者；已完成的檢體只在勾選「已完成」時顯示。
   */
  function matchesFilters(s, f) {
    var docDate = s.imaging.analysisTime ? s.imaging.analysisTime.slice(0, 10).replace(/\//g, '-') : '';
    if (f.dateStart && s.imaging.analysisTime && docDate < f.dateStart) return false;
    if (f.dateEnd && s.imaging.analysisTime && docDate > f.dateEnd) return false;
    if (f.department && s.lis.department !== f.department) return false;
    if (f.machine && s.wam.machine !== f.machine) return false;
    if (f.search) {
      var id = (s.barcode || '').toUpperCase();
      var pid = (s.lis.patientId || '').toUpperCase();
      var search = f.search.toUpperCase();
      if (f.exactMatch) {
        if (id !== search && pid !== search) return false;
      } else if (id.indexOf(search) === -1 && pid.indexOf(search) === -1) {
        return false;
      }
    }
    var selected = f.statuses || [];
    if (WR.isCompleted(s)) return selected.indexOf('Verified') !== -1;
    if (currentMode === 'digital' && !WR.inDigitalList(s)) return false;
    if (currentMode === 'entity' && !WR.inEntityList(s)) return false;
    if (selected.length === 0) return true;
    return selected.some(function (st) { return WR.matchesStatusFilter(s, st); });
  }

  /** 排序：打勾／已完成者一律排最下方（第 4 節） */
  function compareSpecimens(a, b) {
    var ca = WR.showsCheckmark(a);
    var cb = WR.showsCheckmark(b);
    if (ca !== cb) return ca ? 1 : -1;
    var cmp = 0;
    if (sortKey === 'id') {
      cmp = (a.barcode || '').slice(-5).localeCompare((b.barcode || '').slice(-5), undefined, { numeric: true });
    } else if (sortKey === 'time') {
      var ta = (a.imaging.analysisTime || '').replace(/-/g, '').replace(/[:\s]/g, '');
      var tb = (b.imaging.analysisTime || '').replace(/-/g, '').replace(/[:\s]/g, '');
      cmp = ta.localeCompare(tb);
    } else if (sortKey === 'urgency') {
      var now = currentTime();
      var ua = Number(WR.displayUrgency(a, now));
      var ub = Number(WR.displayUrgency(b, now));
      cmp = (isNaN(ua) ? 0 : ua) - (isNaN(ub) ? 0 : ub);
    }
    return sortAsc ? cmp : -cmp;
  }

  function applyFilters() {
    var f = getFilters();
    filteredList = SpecimenStore.listForDisplay().filter(function (s) { return matchesFilters(s, f); });
    if (sortKey === 'id' || sortKey === 'time' || sortKey === 'urgency') filteredList.sort(compareSpecimens);
    return filteredList;
  }

  // ─── 清單 ─────────────────────────────────────────────────

  function renderStatus(specimen) {
    return AppUi.displayStatuses(specimen).map(function (st) {
      var cap = AppUi.capsuleInfo(specimen, st);
      var html = '<span class="status-capsule ' + cap.style + '" data-status="' + st + '">';
      if (cap.done) html += '<span class="material-symbols-outlined text-xs mr-1">check</span>';
      if (st === 'Locked') html += '<span class="material-symbols-outlined text-xs mr-1">lock</span>';
      return html + cap.label + '</span>';
    }).join('');
  }

  function rowClass(s, index) {
    if (s.review.locked) return 'bg-striped';
    if (WR.isCompleted(s)) return 'bg-gray-50';
    return index % 2 ? 'bg-gray-50' : 'bg-white';
  }

  function renderTable() {
    applyFilters();
    var now = currentTime();
    var tbody = $('specimen-tbody');
    tbody.innerHTML = '';
    filteredList.forEach(function (s, i) {
      var tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-50 ' + rowClass(s, i);
      tr.dataset.specimenId = s.barcode;
      var drReadOnly = !s.review.locked && WR.isDigitalReviewReadOnly(s);
      var enterDisabled = (s.review.locked || drReadOnly) ? ' disabled' : '';
      var enterText = s.review.locked ? '已鎖定' : '進入閱片';
      var enterTitle = drReadOnly ? ' title="已結束，僅能唯讀檢視"' : '';
      var extraReadonly = drReadOnly ? '<button type="button" class="readonly-review-btn text-amber-800 text-xs font-semibold hover:underline whitespace-nowrap" data-id="' + s.barcode + '">唯讀檢視</button>' : '';
      tr.innerHTML =
        '<td class="p-2 py-4"><input type="checkbox" class="row-check rounded border-gray-300 text-primary focus:ring-primary" data-id="' + s.barcode + '"/></td>' +
        '<td class="p-2 py-4"><div class="flex flex-col gap-1 items-start">' + renderStatus(s) + '</div></td>' +
        '<td class="p-2 py-4">' + WR.displayUrgency(s, now) + '</td>' +
        '<td class="p-2 py-4">' + s.barcode + '</td>' +
        '<td class="p-2 py-4">' + s.lis.patientId + '</td>' +
        '<td class="p-2 py-4">' + s.lis.name + '</td>' +
        '<td class="p-2 py-4">' + s.lis.department + '</td>' +
        '<td class="p-2 py-4">' + s.wam.machine + '</td>' +
        '<td class="p-2 py-4">' + s.wam.location + '</td>' +
        '<td class="p-2 py-4">' + s.imaging.analysisTime + '</td>' +
        '<td class="p-2 py-4">' + (s.review.editor || '') + '</td>' +
        '<td class="p-2 py-4"><div class="flex flex-wrap items-center gap-2">' +
        '<button type="button" class="text-primary text-xs hover:underline enter-review-btn' + (drReadOnly ? ' opacity-50 cursor-not-allowed' : '') + '" data-id="' + s.barcode + '"' + enterDisabled + enterTitle + '>' + enterText + '</button>' +
        extraReadonly +
        '</div></td>';
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('tr').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.type === 'checkbox' || e.target.classList.contains('enter-review-btn')) return;
        if (e.target.closest('.status-capsule')) return;
        selectRow(tr.dataset.specimenId);
      });
      tr.addEventListener('dblclick', function (e) {
        if (e.target.type === 'checkbox') return;
        var spec = SpecimenStore.getById(tr.dataset.specimenId);
        if (!spec || spec.review.locked || WR.isDigitalReviewReadOnly(spec)) return;
        openImageReview(spec.barcode);
      });
    });
    tbody.querySelectorAll('.enter-review-btn:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (btn.dataset.id) openImageReview(btn.dataset.id);
      });
    });
    tbody.querySelectorAll('.readonly-review-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (btn.dataset.id) AppNav.goToImageReview(btn.dataset.id, { readonly: true });
      });
    });
    setFooter('已篩選 ' + filteredList.length + ' 筆');
  }

  function openImageReview(id) {
    persistUiState();
    AppNav.goToImageReview(id);
  }

  function isListed(id) {
    return filteredList.some(function (r) { return r.barcode === id; });
  }

  function selectRow(id) {
    currentSpecimenId = id;
    document.querySelectorAll('#specimen-tbody tr').forEach(function (tr) {
      tr.classList.toggle('tr-selected', tr.dataset.specimenId === id);
    });
    updateSidebar(id);
  }

  function updateSortUI() {
    document.querySelectorAll('th.sortable').forEach(function (th) {
      th.classList.remove('sort-asc', 'sort-desc');
      var iconAsc = th.querySelector('.sort-icon-asc');
      var iconDesc = th.querySelector('.sort-icon-desc');
      if (iconAsc) iconAsc.classList.add('hidden');
      if (iconDesc) iconDesc.classList.add('hidden');
      if (th.dataset.sort === sortKey) {
        th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');
        if (iconAsc) iconAsc.classList.toggle('hidden', !sortAsc);
        if (iconDesc) iconDesc.classList.toggle('hidden', sortAsc);
      }
    });
  }

  // ─── 右側摘要（第 4 節）─────────────────────────────────────

  function updateSidebar(id) {
    var spec = id ? SpecimenStore.getById(id) : null;
    $('sidebar-specimen-id').textContent = id || '-';
    var prevHeader = $('sidebar-prev-report-header');
    if (prevHeader) prevHeader.textContent = AppUi.prevReportHeaderLabel(spec, '前次報告');
    if (!spec) {
      $('sidebar-placeholder').classList.remove('hidden');
      $('sidebar-content').classList.add('hidden');
      return;
    }
    $('sidebar-placeholder').classList.add('hidden');
    $('sidebar-content').classList.remove('hidden');

    var info = [
      ['病歷號', spec.lis.patientId],
      ['姓名', spec.lis.name + ' (' + (spec.lis.gender || '') + ')'],
      ['生日', (spec.lis.birthDate || '') + ' (' + (LeaveRules.getAgeYears(spec) != null ? LeaveRules.getAgeYears(spec) + '歲' : '') + ')'],
      ['檢體來源', spec.lis.department]
    ];
    $('sidebar-info').innerHTML = info.map(function (p) {
      return '<div><span class="text-text-muted-light">' + p[0] + ':</span><span class="text-text-light font-medium ml-1">' + (p[1] || '-') + '</span></div>';
    }).join('');

    // AI 值或前次值達門檻者以紅字標示（依病人年齡，規則 1）
    $('sidebar-metrics').innerHTML = AppUi.analysisRows(spec).map(function (r) {
      var highlight = LeaveRules.isLeave(r.key, r.ai, spec) || LeaveRules.isLeave(r.key, r.prev, spec);
      var rowClassName = highlight ? 'bg-danger-light/30' : '';
      var cellClass = highlight ? 'font-bold text-danger-text-light' : '';
      return '<tr class="' + rowClassName + '"><td class="p-2 font-semibold text-text-muted-light">' + r.label + '</td><td class="p-2">' + (r.flow || '-') + '</td><td class="p-2 ' + cellClass + '">' + (r.ai || '-') + '</td><td class="p-2 ' + cellClass + '">' + (r.prev || '-') + '</td></tr>';
    }).join('');
  }

  // ─── 實體標籤切換（規則 12）──────────────

  function onTableClick(e) {
    var cap = e.target.closest('.status-capsule');
    if (!cap) return;
    var tr = cap.closest('tr');
    var specimenId = tr ? tr.getAttribute('data-specimen-id') : '';
    var spec = SpecimenStore.getById(specimenId);
    var statusKey = cap.getAttribute('data-status');
    if (spec && !spec.review.locked && WR.ENTITY_STATUSES.indexOf(statusKey) !== -1 && WR.isCompleted(spec)) {
      // 規則 15：只有已簽核的數位閱片結果可在 LIS 撤回；人工鏡檢結果在 LIS 細胞計數程式處理
      setFooter(specimenId + ' 流程已完成，無法點選膠囊取消' + (WR.workflowOf(spec).digitalReviewSignedOff ? '；如需撤回數位閱片結果，請由實體作業醫檢師在 LIS 撤回' : ''));
      return;
    }
    if (spec && !spec.review.locked && statusKey === 'Follow-up' && WR.hasStatus(spec, 'Follow-up') && !WR.canToggleEntityStatus(spec, statusKey)) {
      setFooter(specimenId + ' 已簽核，需拉片確認已隨簽核完成，無法取消；如需撤回，請由實體作業醫檢師在 LIS 撤回');
      return;
    }
    if (!SpecimenStore.toggleEntityStatus(specimenId, statusKey)) return;
    // 規則 14：標記完成時已回寫 LIS 檢驗註記（情境模擬測試中不顯示，維持研究當時畫面）
    var toggled = SpecimenStore.getById(specimenId);
    if (!inUsabilityStudy() && WR.isEntityStatusCompleted(toggled, statusKey)) {
      setFooter(specimenId + ' ' + (statusKey === 'Follow-up' ? '需拉片確認完成；已在 LIS 檢驗註記「拉片完成」' : '血小板確認完成；已在 LIS 檢驗註記「血小板確認完成」'));
    }
    renderTable();
    // 維持原本的選取；原選取已不在清單中時改選第一筆
    if (filteredList.length && currentSpecimenId) selectRow(isListed(currentSpecimenId) ? currentSpecimenId : filteredList[0].barcode);
    else updateSidebar(null);
    e.stopPropagation();
  }

  // ─── 留單標準設定（規則 7）─────────────────────────────────

  function buildLeaveSettingsForm() {
    var body = $('modal-leave-settings-body');
    if (!body) return;
    var thresholds = LeaveRules.getThresholds();
    body.innerHTML = LeaveRules.KEY_ORDER.map(function (k) {
      var lab = LeaveRules.LABELS[k] || k;
      if (LeaveRules.DEFAULTS[k] === 'present') {
        return '<div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-3 gap-y-1 py-2.5 border-b border-gray-100 items-start sm:items-center">' +
          '<div><span class="font-medium text-text-light text-sm">' + lab + '</span><p class="text-[11px] text-text-muted-light mt-0.5">有數值（&gt;0）即視為達留單標準（Present）</p></div>' +
          '<span class="text-xs font-medium text-text-muted-light shrink-0 sm:text-right">Present</span></div>';
      }
      return '<div class="grid grid-cols-1 sm:grid-cols-[1fr_minmax(0,7rem)] gap-x-3 gap-y-1 py-2.5 border-b border-gray-100 items-center">' +
        '<label class="font-medium text-text-light text-sm" for="leave-inp-' + k + '">' + lab + '</label>' +
        '<input id="leave-inp-' + k + '" type="number" min="0" step="0.1" data-key="' + k + '" class="w-full px-2 py-1.5 text-sm border border-border-light rounded-md focus:ring-primary focus:border-primary" value="' + String(thresholds[k]) + '"/></div>';
    }).join('');
  }

  function openLeaveSettingsModal() {
    buildLeaveSettingsForm();
    $('modal-leave-settings').classList.remove('hidden');
  }
  function closeLeaveSettingsModal() {
    $('modal-leave-settings').classList.add('hidden');
  }

  /** 儲存門檻：非數字或負數沿用預設值；儲存後即時重算未簽核檢體的 AI 分類警示（規則 1） */
  function saveLeaveSettings() {
    var next = {};
    LeaveRules.KEY_ORDER.forEach(function (k) {
      if (LeaveRules.DEFAULTS[k] === 'present') { next[k] = 'present'; return; }
      var inp = document.querySelector('#modal-leave-settings input[data-key="' + k + '"]');
      if (!inp) return;
      var n = parseFloat(String(inp.value).replace(',', '.'));
      next[k] = (isNaN(n) || n < 0) ? LeaveRules.DEFAULTS[k] : n;
    });
    LeaveRules.setThresholds(next);
    SpecimenStore.saveThresholds();
    SpecimenStore.recomputeAiAlerts();
    renderTable();
    closeLeaveSettingsModal();
    setFooter('留單標準已儲存');
  }

  // ─── 返回本頁的一次性提示 ─────────────────────────────────

  function showToast(text) {
    var toastEl = $('specimen-list-toast');
    var toastText = $('specimen-list-toast-text');
    if (!toastEl || !toastText) return;
    toastText.textContent = text;
    toastEl.classList.remove('hidden');
    setTimeout(function () { toastEl.classList.add('hidden'); }, 6000);
  }

  function showReturnToasts() {
    var manual = DemoStorage.consumeManualReviewToast();
    if (manual) {
      showToast(manual.addedFollowUp
        ? manual.specimenId + ' 已歸入需拉片確認，等待人工鏡檢' + (manual.lisSynced ? '；已同步 LIS 需拉片確認註記' : '；LIS 註記同步失敗，請手動註記')
        : manual.specimenId + ' 已確認 AI分類警示');
    }
    var followUp = DemoStorage.consumeFollowUpDoneToast();
    if (followUp) {
      showToast(followUp.specimenId + (followUp.workflowCompleted ? ' 已標記拉片完成，檢體流程已完成' : ' 已標記拉片完成，尚有其他待辦') +
        (inUsabilityStudy() ? '' : '；已在 LIS 檢驗註記「拉片完成」'));   // 規則 14
      if (isListed(followUp.specimenId)) selectRow(followUp.specimenId);
    }
    var verified = DemoStorage.consumeReportVerifiedToast();
    if (verified) {
      showToast(verified.specimenId + (verified.workflowCompleted ? ' 簽核完成，檢體流程已完成' : ' 簽核完成，尚有其他待辦'));
      if (isListed(verified.specimenId)) selectRow(verified.specimenId);
    }
    if (manual && isListed(manual.specimenId)) selectRow(manual.specimenId);
    else if (filteredList.length) selectRow(filteredList[0].barcode);
  }

  // ─── LIS 撤回通知（規則 15）──────────────────────────────

  /** 收到撤回：重繪清單，並跳出視窗（視窗開著時再收到，就加在同一個視窗） */
  function onLisWithdrawn(e) {
    var barcode = e && e.detail ? e.detail.barcode : '';
    renderTable();
    if (!barcode) return;
    var li = document.createElement('li');
    var b = document.createElement('b');
    b.textContent = barcode;
    li.appendChild(b);
    li.appendChild(document.createTextNode(' 的 DC 結果已從 LIS 撤回，檢體已回到進線狀態。'));
    $('modal-lis-withdraw-body').appendChild(li);
    $('modal-lis-withdraw').classList.remove('hidden');
  }
  function closeLisWithdrawModal() {
    $('modal-lis-withdraw').classList.add('hidden');
    $('modal-lis-withdraw-body').innerHTML = '';
  }

  // ─── 事件綁定與初始化 ─────────────────────────────────────

  function onFilterChanged() {
    renderTable();
    persistUiState();
  }

  function bindEvents() {
    var tbody = $('specimen-tbody');
    tbody.addEventListener('click', onTableClick);

    $('btn-filter').addEventListener('click', function () {
      var panel = $('filter-panel');
      var open = !panel.classList.contains('hidden');
      panel.classList.toggle('hidden', open);
      this.setAttribute('aria-expanded', !open);
    });

    document.querySelectorAll('.status-filter').forEach(function (cb) { cb.addEventListener('change', onFilterChanged); });

    document.querySelectorAll('.mode-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var mode = this.dataset.mode;
        if (currentMode === mode) {   // 再點一次同一模式＝取消模式
          setModeTabVisual(null);
          DemoStorage.setListMode(null);
          setStatusFilterCheckboxes(StatusConstants.ALL_FILTER_STATUSES);
        } else {
          setModeTabVisual(mode);
          DemoStorage.setListMode(mode);
          setStatusFilterCheckboxes(modeDefaultStatuses(mode === 'digital' ? 'digital' : 'entity'));
        }
        onFilterChanged();
        if (filteredList.length) selectRow(filteredList[0].barcode);
      });
    });

    document.querySelectorAll('th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = this.dataset.sort;
        if (sortKey === key) sortAsc = !sortAsc;
        else { sortKey = key; sortAsc = true; }
        updateSortUI();
        onFilterChanged();
        if (filteredList.length && currentSpecimenId) selectRow(currentSpecimenId);
      });
    });

    $('btn-search').addEventListener('click', onFilterChanged);
    $('specimen-search').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('btn-search').click(); });
    $('specimen-search').addEventListener('input', persistUiState);
    ['analysis-date-start', 'analysis-date-end', 'exact-match', 'filter-department', 'filter-machine'].forEach(function (id) {
      $(id).addEventListener('change', onFilterChanged);
    });

    $('font-smaller').addEventListener('click', function () { AppUi.adjustFontLevel(-1); });
    $('font-larger').addEventListener('click', function () { AppUi.adjustFontLevel(1); });

    $('btn-settings').addEventListener('click', openLeaveSettingsModal);
    ['modal-leave-settings-close', 'modal-leave-settings-backdrop', 'modal-leave-settings-cancel'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('click', closeLeaveSettingsModal);
    });
    $('modal-leave-settings-reset').addEventListener('click', function () {
      SpecimenStore.resetThresholds();
      buildLeaveSettingsForm();
    });
    $('modal-leave-settings-save').addEventListener('click', saveLeaveSettings);

    window.addEventListener('lis-withdrawn', onLisWithdrawn);
    $('modal-lis-withdraw-ok').addEventListener('click', closeLisWithdrawModal);

    // 其他分頁／視窗變更檢體狀態後，同步並重繪清單
    window.addEventListener('storage', function (e) {
      if (!DemoStorage.isStatusKey(e.key)) return;
      SpecimenStore.applyStoredStatus();
      updateSortUI();
      renderTable();
      if (filteredList.length && currentSpecimenId) selectRow(currentSpecimenId);
    });
  }

  function fillFilterOptions() {
    var depSel = $('filter-department');
    SpecimenStore.departments().forEach(function (d) { var o = document.createElement('option'); o.value = d; o.textContent = d; depSel.appendChild(o); });
    var macSel = $('filter-machine');
    SpecimenStore.machines().forEach(function (m) { var o = document.createElement('option'); o.value = m; o.textContent = m; macSel.appendChild(o); });
  }

  function init() {
    AppUi.initFontLevel();
    bindEvents();
    fillFilterOptions();
    restoreUiState();
    updateSortUI();
    renderTable();
    persistUiState();
    showReturnToasts();
    // 時效（收件後經過分鐘數）定時更新（暫定 120 秒）
    setInterval(renderTable, AppConfig.URGENCY_REFRESH_MS);

    // 展示用（demo/usability-study.js）：情境模擬測試面板
    if (typeof UsabilityStudy !== 'undefined') {
      UsabilityStudy.attachToSpecimenList({
        resetFilters: resetFiltersForScenario,
        refresh: function () {
          currentSpecimenId = null;
          $('sidebar-placeholder').classList.remove('hidden');
          $('sidebar-content').classList.add('hidden');
          renderTable();
          persistUiState();
        },
        setFooter: setFooter
      });
    }
  }

  init();
})();
