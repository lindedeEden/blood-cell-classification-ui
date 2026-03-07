/**
 * 檢體管理主畫面邏輯：
 * - 從 APP_DATABASE 載入檢體列表 (MOCK_SPECIMENS)
 * - 依日期 / 單位 / 機台 / 狀態 / 關鍵字過濾
 * - 列表排序、選取列、同步右側檢體資訊與歷史分析
 * - 進入影像檢視頁、控制字體大小
 *
 * 注意：日期預設固定為 2025-08-07 方便測試，若接入實際系統可以改回 today。
 */
(function () {
  var currentSpecimenId = null;
  var filteredList = [];
  var currentMode = 'digital';
  var sortKey = 'time';
  var sortAsc = false;
  var fontLevel = 1;

  function setDefaultDateToday() {
    // 測試環境固定日期，方便不用每次手動調整
    var today = '2025-08-07';
    var start = document.getElementById('analysis-date-start');
    var end = document.getElementById('analysis-date-end');
    if (start && !start.dataset.initialized) { start.value = today; start.dataset.initialized = '1'; }
    if (end && !end.dataset.initialized) { end.value = today; end.dataset.initialized = '1'; }
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
      dateStart: document.getElementById('analysis-date-start').value,
      dateEnd: document.getElementById('analysis-date-end').value,
      department: document.getElementById('filter-department').value,
      machine: document.getElementById('filter-machine').value,
      search: (document.getElementById('specimen-search').value || '').trim(),
      exactMatch: document.getElementById('exact-match').checked,
      statuses: getSelectedStatuses()
    };
  }

  function applyFilters() {
    var f = getFilters();
    filteredList = MOCK_SPECIMENS.filter(function (s) {
      if (f.dateStart && s.analysisTime) {
        var docDate = s.analysisTime.slice(0, 10).replace(/\//g, '-');
        if (docDate < f.dateStart) return false;
      }
      if (f.dateEnd && s.analysisTime) {
        var docDate = s.analysisTime.slice(0, 10).replace(/\//g, '-');
        if (docDate > f.dateEnd) return false;
      }
      if (f.department && s.department !== f.department) return false;
      if (f.machine && s.machine !== f.machine) return false;
      if (f.search) {
        var id = (s.id || '').toUpperCase();
        var pid = (s.patientId || '').toUpperCase();
        var search = f.search.toUpperCase();
        if (f.exactMatch) {
          if (id !== search && pid !== search) return false;
        } else {
          if (id.indexOf(search) === -1 && pid.indexOf(search) === -1) return false;
        }
      }
      var selected = f.statuses || [];
      if (selected.length === 0) return true;
      var hasStatus = (s.status || []).some(function (st) { return selected.indexOf(st) !== -1; });
      var isVerified = s.statusDone && selected.indexOf('Verified') !== -1;
      if (!hasStatus && !isVerified) return false;
      return true;
    });
    if (sortKey === 'id') {
      filteredList.sort(function (a, b) {
        var a5 = (a.id || '').slice(-5);
        var b5 = (b.id || '').slice(-5);
        var cmp = a5.localeCompare(b5, undefined, { numeric: true });
        return sortAsc ? cmp : -cmp;
      });
    } else if (sortKey === 'time') {
      filteredList.sort(function (a, b) {
        var ta = (a.analysisTime || '').replace(/-/g, '').replace(/[:\s]/g, '');
        var tb = (b.analysisTime || '').replace(/-/g, '').replace(/[:\s]/g, '');
        var cmp = ta.localeCompare(tb);
        return sortAsc ? cmp : -cmp;
      });
    }
    return filteredList;
  }

  function renderStatus(specimen) {
    var html = '';
    var statuses = specimen.status || [];
    statuses.forEach(function (st) {
      var style = STATUS_STYLES[st] || 'bg-gray-100 text-gray-800';
      var done = specimen.statusDone && st !== 'Locked';
      if (done) style = 'bg-green-100 text-green-800';
      html += '<span class="status-capsule ' + style + '">';
      if (done) html += '<span class="material-symbols-outlined text-xs mr-1">check</span>';
      if (st === 'Locked') html += '<span class="material-symbols-outlined text-xs mr-1">lock</span>';
      html += st + '</span>';
    });
    return html;
  }

  function rowClass(s, index) {
    if (s.locked) return 'bg-striped';
    if (s.statusDone) return 'bg-gray-50';
    return index % 2 ? 'bg-gray-50' : 'bg-white';
  }

  function renderTable() {
    applyFilters();
    var tbody = document.getElementById('specimen-tbody');
    tbody.innerHTML = '';
    filteredList.forEach(function (s, i) {
      var tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-50 ' + rowClass(s, i);
      tr.dataset.specimenId = s.id;
      var enterDisabled = s.locked ? ' disabled' : '';
      var enterText = s.locked ? '已鎖定' : '進入閱片';
      tr.innerHTML =
        '<td class="p-2"><input type="checkbox" class="row-check rounded border-gray-300 text-primary focus:ring-primary" data-id="' + s.id + '"/></td>' +
        '<td class="p-2"><div class="flex flex-wrap gap-1">' + renderStatus(s) + '</div></td>' +
        '<td class="p-2">' + (s.urgency != null ? s.urgency : '') + '</td>' +
        '<td class="p-2">' + s.id + '</td>' +
        '<td class="p-2">' + s.patientId + '</td>' +
        '<td class="p-2">' + s.name + '</td>' +
        '<td class="p-2">' + s.department + '</td>' +
        '<td class="p-2">' + s.machine + '</td>' +
        '<td class="p-2">' + s.location + '</td>' +
        '<td class="p-2">' + s.analysisTime + '</td>' +
        '<td class="p-2">' + (s.editor || '') + '</td>' +
        '<td class="p-2"><button type="button" class="text-primary text-xs hover:underline enter-review-btn" data-id="' + s.id + '"' + enterDisabled + '>' + enterText + '</button></td>';
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('tr').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.type === 'checkbox' || e.target.classList.contains('enter-review-btn')) return;
        selectRow(tr.dataset.specimenId);
      });
      tr.addEventListener('dblclick', function (e) {
        if (e.target.type === 'checkbox') return;
        var id = tr.dataset.specimenId;
        var spec = getSpecimenById(id);
        if (id && spec && !spec.locked) goToImageReview(id);
      });
    });
    tbody.querySelectorAll('.enter-review-btn:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = btn.dataset.id;
        if (id) goToImageReview(id);
      });
    });
    document.getElementById('footer-status').textContent = '已篩選 ' + filteredList.length + ' 筆';
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

  function selectRow(id) {
    currentSpecimenId = id;
    document.querySelectorAll('#specimen-tbody tr').forEach(function (tr) {
      tr.classList.remove('tr-selected');
      if (tr.dataset.specimenId === id) tr.classList.add('tr-selected');
    });
    updateSidebar(id);
  }

  function updateSidebar(id) {
    var spec = getSpecimenById(id);
    document.getElementById('sidebar-specimen-id').textContent = id || '-';
    if (!spec) {
      document.getElementById('sidebar-placeholder').classList.remove('hidden');
      document.getElementById('sidebar-content').classList.add('hidden');
      return;
    }
    document.getElementById('sidebar-placeholder').classList.add('hidden');
    document.getElementById('sidebar-content').classList.remove('hidden');

    var info = [
      ['病歷號', spec.patientId],
      ['姓名', spec.name + ' (' + (spec.gender || '') + ')'],
      ['生日', (spec.birthDate || '') + ' (' + (spec.age != null ? spec.age + '歲' : '') + ')'],
      ['檢體來源', spec.department]
    ];
    document.getElementById('sidebar-info').innerHTML = info.map(function (p) {
      return '<div><span class="text-text-muted-light">' + p[0] + ':</span><span class="text-text-light font-medium ml-1">' + (p[1] || '-') + '</span></div>';
    }).join('');

    var m = spec.metrics || {};
    var prev = spec.prevReport || {};
    var rows = [
      ['WBC (10e9/L)', m.wbc, '-', prev.wbc],
      ['PLT (10e9/L)', m.plt, '-', prev.plt],
      ['Band (%)', m.band, m.band, prev.band],
      ['Segmented neutrophil (%)', m.segmentedNeutrophil, m.segmentedNeutrophil, prev.segmentedNeutrophil],
      ['Eosinophil (%)', m.eosinophil, m.eosinophil, prev.eosinophil],
      ['Monocyte (%)', m.monocyte, m.monocyte, prev.monocyte],
      ['Basophil (%)', m.basophil, m.basophil, prev.basophil],
      ['Lymphocyte (%)', m.lymphocyte, m.lymphocyte, prev.lymphocyte],
      ['Atypical lymphocyte (%)', m.atypicalLymphocyte, m.atypicalLymphocyte, prev.atypicalLymphocyte],
      ['Blast (%)', m.blast, m.blast, prev.blast],
      ['Promyelocyte (%)', m.promyelocyte, m.promyelocyte, prev.promyelocyte],
      ['Myelocyte (%)', m.myelocyte, m.myelocyte, prev.myelocyte],
      ['Metamyelocyte (%)', m.metamyelocyte, m.metamyelocyte, prev.metamyelocyte],
      ['Hypersegmented (%)', m.hypersegmented, m.hypersegmented, prev.hypersegmented],
      ['Promonocyte (%)', m.promonocyte, m.promonocyte, prev.promonocyte],
      ['Plasma cell (%)', m.plasmaCell, m.plasmaCell, prev.plasmaCell],
      ['Abnormal lymphocyte (%)', m.abnormalLymphocyte, m.abnormalLymphocyte, prev.abnormalLymphocyte]
    ];
    function shouldHighlightMetric(label, valueStr) {
      var v = parseFloat(valueStr);
      if (isNaN(v)) v = 0;
      switch (label) {
        case 'WBC (10e9/L)': return v >= 30;
        case 'Lymphocyte (%)': return v >= 60;
        case 'Monocyte (%)': return v >= 20;
        case 'Eosinophil (%)': return v >= 20;
        case 'Basophil (%)': return v >= 5;
        case 'Atypical lymphocyte (%)': return v >= 10;
        case 'Blast (%)': return valueStr && valueStr !== '-' && parseFloat(valueStr) > 0;
        case 'Promyelocyte (%)': return valueStr && valueStr !== '-' && parseFloat(valueStr) > 0;
        case 'Myelocyte (%)': return v >= 5;
        case 'Metamyelocyte (%)': return v >= 10;
        case 'Promonocyte (%)': return valueStr && valueStr !== '-' && parseFloat(valueStr) > 0;
        case 'Plasma cell (%)': return valueStr && valueStr !== '-' && parseFloat(valueStr) > 0;
        case 'Abnormal lymphocyte (%)': return valueStr && valueStr !== '-' && parseFloat(valueStr) > 0;
        default: return false;
      }
    }
    document.getElementById('sidebar-metrics').innerHTML = rows.map(function (r) {
      var label = r[0];
      var aiVal = r[2];
      var highlight = shouldHighlightMetric(label, aiVal);
      var rowClass = highlight ? 'bg-red-50' : '';
      var valClass = highlight ? 'text-red-600 font-bold' : '';
      return '<tr class="' + rowClass + '"><td class="p-1.5">' + label + '</td>' +
        '<td class="p-1.5 text-right">' + (r[1] || '-') + '</td>' +
        '<td class="p-1.5 text-right ' + valClass + '">' + (aiVal || '-') + '</td>' +
        '<td class="p-1.5 text-right">' + (r[3] || '-') + '</td></tr>';
    }).join('');
  }

  function applyMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-toggle-btn').forEach(function (btn) {
      btn.classList.toggle('bg-primary text-white', btn.dataset.mode === mode);
      btn.classList.toggle('bg-surface-light text-text-light', btn.dataset.mode !== mode);
    });
    if (mode === 'digital') {
      setStatusFilterCheckboxes(['Digital Review', 'PLT Check', 'AI Alert', 'Follow-up']);
    } else {
      setStatusFilterCheckboxes(['Follow-up', 'PLT Check', 'AI Alert']);
    }
    renderTable();
  }

  function initEvents() {
    document.getElementById('btn-search').addEventListener('click', renderTable);
    document.getElementById('specimen-search').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') renderTable();
    });
    document.querySelectorAll('.status-filter').forEach(function (cb) {
      cb.addEventListener('change', renderTable);
    });
    document.getElementById('filter-department').addEventListener('change', renderTable);
    document.getElementById('filter-machine').addEventListener('change', renderTable);
    document.getElementById('exact-match').addEventListener('change', renderTable);

    document.querySelectorAll('.mode-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyMode(btn.dataset.mode);
      });
    });

    document.querySelectorAll('th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.dataset.sort;
        if (sortKey === key) sortAsc = !sortAsc;
        else { sortKey = key; sortAsc = key === 'id'; }
        updateSortUI();
        renderTable();
      });
    });

    document.getElementById('font-dec').addEventListener('click', function () {
      if (fontLevel > 0) fontLevel--;
      document.documentElement.style.setProperty('--font-scale', 1 + fontLevel * 0.1);
    });
    document.getElementById('font-inc').addEventListener('click', function () {
      if (fontLevel < 3) fontLevel++;
      document.documentElement.style.setProperty('--font-scale', 1 + fontLevel * 0.1);
    });
  }

  function populateFilters() {
    var deptSelect = document.getElementById('filter-department');
    var machineSelect = document.getElementById('filter-machine');
    if (!deptSelect || !machineSelect) return;
    APP_DATABASE.departments.forEach(function (d) {
      var opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      deptSelect.appendChild(opt);
    });
    APP_DATABASE.machines.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      machineSelect.appendChild(opt);
    });
  }

  function init() {
    if (typeof APP_DATABASE === 'undefined' || !Array.isArray(MOCK_SPECIMENS)) return;
    setDefaultDateToday();
    populateFilters();
    initEvents();
    updateSortUI();
    applyMode(currentMode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

