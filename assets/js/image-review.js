/**
 * 影像檢視與細胞編輯 - 資料綁定、導航、選取與儲存防呆
 * 依 5.3.2 規格實作
 */
(function () {
  'use strict';

  var LEAVE_THRESHOLDS = {
    wbc: 30,
    lymphocyte: 60,
    monocyte: 20,
    eosinophil: 20,
    basophil: 5,
    atypicalLymphocyte: 10,
    blast: 'present',
    promyelocyte: 'present',
    myelocyte: 5,
    metamyelocyte: 10,
    promonocyte: 'present',
    plasmaCell: 'present',
    abnormalLymphocyte: 'present'
  };

  var ABNORMAL_ORDER = ['Blast', 'Promyelocyte', 'Myelocyte', 'Metamyelocyte', 'Hypersegmented', 'Promonocyte', 'Plasma Cell', 'Abnormal Lymphocyte'];
  var COMMON_TYPES = ['Segmented Neutrophil', 'Band', 'Lymphocyte', 'Monocyte', 'Eosinophil', 'Basophil', 'Giant PLT', 'NRBC', 'Smudge Cell'];
  var ABNORMAL_TYPES = ['Blast', 'Promyelocyte', 'Myelocyte', 'Metamyelocyte', 'Hypersegmented', 'Promonocyte', 'Plasma Cell', 'Abnormal Lymphocyte', 'Megakaryocyte'];
  var OTHER_TYPES = ['Unidentified', 'Artefact'];

  /** 單一通用模擬圖：內嵌 SVG（免外連），可改為 assets/images/cell-placeholder.png 使用本地檔 */
  var CELL_PLACEHOLDER_SVG = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="g" cx="40%" cy="40%" r="50%"><stop offset="0%" stop-color="#e8e4f0"/><stop offset="70%" stop-color="#c4bed4"/><stop offset="100%" stop-color="#9a92a8"/></radialGradient></defs><ellipse cx="60" cy="60" rx="48" ry="52" fill="url(#g)" stroke="#8a8299" stroke-width="1.5"/><ellipse cx="52" cy="55" rx="18" ry="20" fill="rgba(255,255,255,0.4)"/></svg>'
  );
  var DEFAULT_IMAGE = CELL_PLACEHOLDER_SVG;

  var currentSpecimenId = '';
  var currentSpecimen = null;
  var digitalReviewList = [];
  var cellData = [];
  var selectedCellIds = new Set();
  var lastClickedIndex = -1;
  var lastClickedCategory = null;
  var zoomLevel = 100;
  var rightMouseHeld = false;

  function getDigitalReviewList() {
    if (typeof APP_DATABASE === 'undefined' || !APP_DATABASE.specimens) return [];
    return APP_DATABASE.specimens.filter(function (s) {
      if (s.locked) return false;
      var st = s.status || [];
      return st.indexOf('Digital Review') >= 0 && st.indexOf('Verified') < 0;
    });
  }

  function getSpecimenById(id) {
    if (typeof window.getSpecimenById === 'function') return window.getSpecimenById(id);
    var list = typeof APP_DATABASE !== 'undefined' && APP_DATABASE.specimens ? APP_DATABASE.specimens : [];
    return list.find(function (s) { return s.id === id; }) || null;
  }

  /** 依檢體 metrics 的百分比決定每類細胞張數（例如 promyelocyte 5% → 5 張單一通用圖）。key → 類別名。 */
  var METRIC_TO_CATEGORY = [
    { key: 'blast', name: 'Blast' },
    { key: 'promyelocyte', name: 'Promyelocyte' },
    { key: 'myelocyte', name: 'Myelocyte' },
    { key: 'metamyelocyte', name: 'Metamyelocyte' },
    { key: 'hypersegmented', name: 'Hypersegmented' },
    { key: 'promonocyte', name: 'Promonocyte' },
    { key: 'plasmaCell', name: 'Plasma Cell' },
    { key: 'abnormalLymphocyte', name: 'Abnormal Lymphocyte' },
    { key: 'atypicalLymphocyte', name: 'Abnormal Lymphocyte' },
    { key: 'band', name: 'Band' },
    { key: 'segmentedNeutrophil', name: 'Segmented Neutrophil' },
    { key: 'lymphocyte', name: 'Lymphocyte' },
    { key: 'monocyte', name: 'Monocyte' },
    { key: 'eosinophil', name: 'Eosinophil' },
    { key: 'basophil', name: 'Basophil' }
  ];

  function metricValueToCount(val) {
    if (val === undefined || val === null || String(val).trim() === '' || val === '-') return 0;
    var n = parseFloat(String(val).replace(',', '.'), 10);
    return isNaN(n) || n <= 0 ? 0 : Math.round(n);
  }

  function getOrCreateCellData(specimenId) {
    var existing = window.CELLS_BY_SPECIMEN && window.CELLS_BY_SPECIMEN[specimenId];
    if (existing && Array.isArray(existing) && existing.length > 0) return existing.slice();
    var specimen = currentSpecimen;
    if (specimen && specimen.metrics) {
      var m = specimen.metrics;
      var byCategory = {};
      METRIC_TO_CATEGORY.forEach(function (item) {
        var name = item.name;
        if (!byCategory[name]) byCategory[name] = 0;
        byCategory[name] += metricValueToCount(m[item.key]);
      });
      var list = [];
      var id = 0;
      var order = ABNORMAL_ORDER.slice();
      COMMON_TYPES.forEach(function (t) { if (order.indexOf(t) < 0) order.push(t); });
      Object.keys(byCategory).forEach(function (t) { if (order.indexOf(t) < 0) order.push(t); });
      order.forEach(function (catName) {
        var count = byCategory[catName];
        if (!count) return;
        for (var i = 0; i < count; i++) {
          list.push({
            id: 'cell-' + (++id),
            category: catName,
            imageUrl: DEFAULT_IMAGE,
            aiSuggestion: catName === 'Segmented Neutrophil' ? { label: 'Segmented', pct: 92 } : (catName === 'Blast' ? { label: 'Blast', pct: 88 } : null)
          });
        }
      });
      if (list.length > 0) return list;
    }
    var categories = [
      { name: 'Blast', count: 2, abnormal: true },
      { name: 'Promyelocyte', count: 6, abnormal: true },
      { name: 'Myelocyte', count: 5, abnormal: true },
      { name: 'Band', count: 8, abnormal: false },
      { name: 'Segmented Neutrophil', count: 60, abnormal: false },
      { name: 'Lymphocyte', count: 15, abnormal: false },
      { name: 'Monocyte', count: 6, abnormal: false },
      { name: 'Eosinophil', count: 4, abnormal: false },
      { name: 'Unidentified', count: 4, abnormal: false }
    ];
    var id = 0;
    var list = [];
    categories.forEach(function (cat) {
      var imageUrl = DEFAULT_IMAGE;
      for (var i = 0; i < cat.count; i++) {
        list.push({
          id: 'cell-' + (++id),
          category: cat.name,
          imageUrl: imageUrl,
          aiSuggestion: cat.name === 'Segmented Neutrophil' ? { label: 'Segmented', pct: 92 } : (cat.name === 'Blast' ? { label: 'Blast', pct: 88 } : null)
        });
      }
    });
    return list;
  }

  function parseNum(v) {
    if (v === '-' || v === '' || v == null) return null;
    var n = parseFloat(String(v).replace(',', '.'), 10);
    return isNaN(n) ? null : n;
  }

  function isAbnormalValue(key, value, prevValue) {
    var th = LEAVE_THRESHOLDS[key];
    if (th == null) return false;
    var num = parseNum(value);
    if (th === 'present') return num != null && num > 0;
    if (typeof th === 'number') return num != null && num >= th;
    return false;
  }

  /** 與檢體管理介面相同：分析與歷史的列順序與標籤 */
  function getAnalysisTableRows(spec) {
    var m = spec.metrics || {};
    var prev = spec.prevReport || {};
    return [
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
  }

  function shouldHighlightAnalysisRow(label, aiValueStr) {
    var v = parseNum(aiValueStr);
    if (v == null) v = 0;
    switch (label) {
      case 'WBC (10e9/L)': return v >= 30;
      case 'Lymphocyte (%)': return v >= 60;
      case 'Monocyte (%)': return v >= 20;
      case 'Eosinophil (%)': return v >= 20;
      case 'Basophil (%)': return v >= 5;
      case 'Atypical lymphocyte (%)': return v >= 10;
      case 'Blast (%)': return aiValueStr && aiValueStr !== '-' && parseNum(aiValueStr) > 0;
      case 'Promyelocyte (%)': return aiValueStr && aiValueStr !== '-' && parseNum(aiValueStr) > 0;
      case 'Myelocyte (%)': return v >= 5;
      case 'Metamyelocyte (%)': return v >= 10;
      case 'Promonocyte (%)': return aiValueStr && aiValueStr !== '-' && parseNum(aiValueStr) > 0;
      case 'Plasma cell (%)': return aiValueStr && aiValueStr !== '-' && parseNum(aiValueStr) > 0;
      case 'Abnormal lymphocyte (%)': return aiValueStr && aiValueStr !== '-' && parseNum(aiValueStr) > 0;
      default: return false;
    }
  }

  function getMetricKeys() {
    return ['wbc', 'blast', 'promyelocyte', 'myelocyte', 'metamyelocyte', 'band', 'segmentedNeutrophil', 'lymphocyte', 'monocyte', 'eosinophil', 'basophil', 'atypicalLymphocyte', 'hypersegmented', 'promonocyte', 'plasmaCell', 'abnormalLymphocyte'];
  }

  function getMetricLabel(key) {
    var labels = { wbc: 'WBC', blast: 'Blast', promyelocyte: 'Promyelocyte', myelocyte: 'Myelocyte', metamyelocyte: 'Metamyelocyte', band: 'Band', segmentedNeutrophil: 'Seg. Neutro', lymphocyte: 'Lymphocyte', monocyte: 'Monocyte', eosinophil: 'Eosinophil', basophil: 'Basophil', atypicalLymphocyte: 'A-Lym', hypersegmented: 'Hyperseg.', promonocyte: 'Promonocyte', plasmaCell: 'Plasma Cell', abnormalLymphocyte: 'Abn Lym' };
    return labels[key] || key;
  }

  function renderSidebar() {
    var specimen = currentSpecimen;
    if (!specimen) return;

    var titleEl = document.getElementById('specimen-id-title');
    if (titleEl) titleEl.textContent = specimen.id;

    var tagsContainer = document.getElementById('sidebar-status-tags');
    if (tagsContainer) {
      var statuses = specimen.status || [];
      var hasVerified = statuses.indexOf('Verified') >= 0;
      var displayStatuses = statuses.filter(function (s) { return s !== 'Verified'; });
      tagsContainer.innerHTML = displayStatuses.map(function (s) {
        var style;
        var label = s;
        var prefixIcon = '';
        if (s === 'AI Alert') style = 'bg-orange-100 text-orange-800';
        else if (s === 'PLT Check') style = 'bg-blue-100 text-blue-800';
        else if (s === 'Follow-up') style = 'bg-red-100 text-red-800';
        else if (s === 'Digital Review' && hasVerified) {
          style = 'bg-green-100 text-green-800';
          prefixIcon = '<span class="material-symbols-outlined text-[14px] mr-0.5 align-middle">check</span>';
        } else if (s === 'Digital Review') style = 'bg-purple-100 text-purple-800';
        else style = 'bg-gray-100 text-gray-800';
        return '<div class="group relative inline-flex items-center gap-1 px-3 py-1 rounded-full ' + style + ' text-[10px] font-bold uppercase tracking-wider" data-status="' + s + '">' + prefixIcon + label + ' <span class="material-symbols-outlined text-[14px] hidden group-hover:inline cursor-pointer">close</span></div>';
      }).join('');
      var addFlag = document.getElementById('sidebar-add-flag');
      if (addFlag && !document.querySelector('#sidebar-status-tags + .relative')) {
        var wrap = document.createElement('div');
        wrap.className = 'relative dropdown-container';
        wrap.innerHTML = '<button type="button" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 text-[10px] font-medium hover:bg-gray-50" id="add-flag-btn"><span class="material-symbols-outlined text-sm">add</span> Add Flag</button><div class="dropdown-menu absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 hidden"><div class="p-2 border-b border-gray-100"><span class="text-[10px] font-bold text-gray-400 uppercase">新增標記</span></div><div class="p-1"><button type="button" class="w-full text-left px-2 py-2 hover:bg-gray-50 rounded text-xs" data-flag="AI Alert">AI Alert</button><button type="button" class="w-full text-left px-2 py-2 hover:bg-gray-50 rounded text-xs" data-flag="PLT Check">PLT Check</button><button type="button" class="w-full text-left px-2 py-2 hover:bg-gray-50 rounded text-xs" data-flag="Follow-up">Follow-up</button><button type="button" class="w-full text-left px-2 py-2 hover:bg-gray-50 rounded text-xs" data-flag="Digital Review">Digital Review</button></div></div></div>';
        tagsContainer.parentNode.insertBefore(wrap, tagsContainer.nextSibling);
      }
      tagsContainer.querySelectorAll('[data-status]').forEach(function (el) {
        var close = el.querySelector('.material-symbols-outlined');
        if (close) close.addEventListener('click', function (e) { e.stopPropagation(); removeStatus(el.getAttribute('data-status')); });
      });

      var dropdown = document.querySelector('#sidebar-add-flag .dropdown-menu');
      if (dropdown) {
        var inputs = dropdown.querySelectorAll('input[type="checkbox"]');
        inputs.forEach(function (input) {
          var labelEl = input.closest('label');
          if (!labelEl) return;
          var textEl = labelEl.querySelector('span.text-xs');
          var flag = textEl ? textEl.textContent.trim() : '';
          if (!flag) return;
          input.checked = false;
          input.onchange = function () {
            if (input.checked) {
              addStatus(flag);
              input.checked = false;
            }
          };
        });
      }
    }

    var searchEl = document.getElementById('sidebar-search');
    if (searchEl) {
      searchEl.placeholder = '檢體 ID 搜尋…';
      searchEl.value = '';
      searchEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var id = (searchEl.value || '').trim();
          if (id && getSpecimenById(id)) goToSpecimen(id);
        }
      });
    }

    var prevBtn = document.getElementById('sidebar-prev');
    var nextBtn = document.getElementById('sidebar-next');
    if (prevBtn) prevBtn.onclick = function () { navigatePrevNext(-1); };
    if (nextBtn) nextBtn.onclick = function () { navigatePrevNext(1); };

    var detailsEl = document.getElementById('sidebar-patient-details');
    if (detailsEl) {
      var summary = detailsEl.querySelector('summary');
      var nameEl = summary && summary.querySelector('.patient-name-summary');
      if (nameEl) {
        var summaryText = ' - ' + (specimen.name || '') + ' (' + (specimen.gender || '') + ')';
        if (specimen.birthDate) {
          summaryText += ' / ' + specimen.birthDate;
          if (specimen.age != null && specimen.age !== '') {
            summaryText += ' (' + specimen.age + ' 歲)';
          }
        }
        nameEl.textContent = summaryText;
      }
      var idEl = document.getElementById('sidebar-patient-id');
      var deptEl = document.getElementById('sidebar-patient-dept');
      var machineEl = document.getElementById('sidebar-patient-machine');
      var locEl = document.getElementById('sidebar-patient-location');
      if (idEl) idEl.textContent = specimen.patientId || '';
      if (deptEl) deptEl.textContent = specimen.department || '';
      if (machineEl) machineEl.textContent = specimen.machine || '';
      if (locEl) locEl.textContent = specimen.location || '';
    }

    var tableContainer = document.getElementById('sidebar-analysis-table');
    if (tableContainer) {
      var rows = getAnalysisTableRows(specimen);
      var header = '<div class="grid grid-cols-4 gap-2 font-medium text-gray-500 py-1.5 border-b border-gray-200/80 sticky top-0 bg-card z-[1] text-[10px] uppercase tracking-wider">' +
        '<div class="col-span-1">Cell Type</div><div class="col-span-1 text-right">Flow Cyt.</div><div class="col-span-1 text-right">AI</div><div class="col-span-1 text-right">Prev.</div></div>';
      var body = rows.map(function (r) {
        var label = r[0];
        var aiVal = r[2];
        var highlight = shouldHighlightAnalysisRow(label, aiVal);
        var rowClass = highlight ? 'bg-red-50 border-b border-red-100' : 'border-b border-gray-100';
        var labelClass = highlight ? 'text-red-700 font-semibold px-0.5' : 'text-gray-600 font-medium leading-tight';
        var valClass = highlight ? 'font-bold text-red-600' : 'text-gray-800';
        var flowClass = highlight ? 'text-gray-400' : 'text-gray-800';
        var labelHtml = label.indexOf('WBC') >= 0 ? 'WBC<br/><span class="text-[9px]">(10e9/L)</span>' : label;
        return '<div class="grid grid-cols-4 gap-2 items-center py-1.5 ' + rowClass + '">' +
          '<div class="col-span-1 ' + labelClass + '">' + labelHtml + '</div>' +
          '<div class="col-span-1 text-right ' + flowClass + '">' + (r[1] || '-') + '</div>' +
          '<div class="col-span-1 text-right ' + valClass + '">' + (aiVal || '-') + '</div>' +
          '<div class="col-span-1 text-right ' + valClass + '">' + (r[3] || '-') + '</div></div>';
      }).join('');
      tableContainer.innerHTML = header + '<div class="space-y-0 text-xs">' + body + '</div>';
    }
  }

  function removeStatus(status) {
    if (!currentSpecimen || !currentSpecimen.status) return;
    currentSpecimen.status = currentSpecimen.status.filter(function (s) { return s !== status; });
    digitalReviewList = getDigitalReviewList();
    renderSidebar();
  }

  function addStatus(status) {
    if (!currentSpecimen) return;
    if (!Array.isArray(currentSpecimen.status)) currentSpecimen.status = [];
    if (currentSpecimen.status.indexOf(status) === -1) {
      currentSpecimen.status.push(status);
      digitalReviewList = getDigitalReviewList();
      renderSidebar();
    }
  }

  function navigatePrevNext(delta) {
    var idx = digitalReviewList.findIndex(function (s) { return s.id === currentSpecimenId; });
    idx += delta;
    if (idx < 0) idx = digitalReviewList.length - 1;
    if (idx >= digitalReviewList.length) idx = 0;
    var next = digitalReviewList[idx];
    if (next) goToSpecimen(next.id);
  }

  function goToSpecimen(id) {
    var base = (typeof window.getBasePath === 'function') ? window.getBasePath() : '';
    window.location.href = base + '影像檢視與細胞編輯.html?specimen=' + encodeURIComponent(id);
  }

  function getTotalCells() { return cellData.length; }
  function getUnidentifiedCount() { return cellData.filter(function (c) { return c.category === 'Unidentified'; }).length; }
  function getViewedProgress() {
    var total = getTotalCells();
    if (total === 0) return 100;
    var unidentified = getUnidentifiedCount();
    return Math.round(((total - unidentified) / total) * 100);
  }

  function updateProgressBar() {
    var total = getTotalCells();
    var unidentified = getUnidentifiedCount();
    var viewed = total - unidentified;
    var textEl = document.getElementById('toolbar-progress-text');
    var barEl = document.getElementById('toolbar-progress-bar');
    if (textEl) textEl.textContent = (viewed + ' / ' + total + ' Cells');
    if (barEl) barEl.style.width = (total ? ((viewed / total) * 100) : 100) + '%';
  }

  function renderCellGroups() {
    var container = document.getElementById('main-cell-groups');
    if (!container) return;

    var total = cellData.length;
    var byCat = {};
    cellData.forEach(function (c) {
      if (!byCat[c.category]) byCat[c.category] = [];
      byCat[c.category].push(c);
    });

    var catOrder = ABNORMAL_ORDER.slice();
    COMMON_TYPES.forEach(function (t) { if (byCat[t] && catOrder.indexOf(t) < 0) catOrder.push(t); });
    OTHER_TYPES.forEach(function (t) { if (byCat[t] && catOrder.indexOf(t) < 0) catOrder.push(t); });
    Object.keys(byCat).forEach(function (t) { if (catOrder.indexOf(t) < 0) catOrder.push(t); });

    var thresholdPct = { Blast: 0, Promyelocyte: 0, Myelocyte: 5, Metamyelocyte: 10 };
    var html = '';
    catOrder.forEach(function (catName) {
      var cells = byCat[catName];
      if (!cells || cells.length === 0) return;
      var count = cells.length;
      var pct = total ? Math.round((count / total) * 100) : 0;
      var isAbnormal = ABNORMAL_ORDER.indexOf(catName) >= 0;
      var overThreshold = false;
      if (isAbnormal && thresholdPct[catName] !== undefined) overThreshold = thresholdPct[catName] === 0 ? count > 0 : pct >= thresholdPct[catName];
      var sectionClass = isAbnormal ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-200';
      var titleClass = overThreshold ? 'text-red-800' : (isAbnormal ? 'text-red-800' : 'text-gray-800');
      var subClass = overThreshold ? 'text-red-600' : (isAbnormal ? 'text-red-600/70' : 'text-gray-500');
      html += '<div class="group section-card ' + sectionClass + ' rounded-xl overflow-hidden" data-category="' + catName + '">';
      html += '<div class="flex items-center justify-between p-4 cursor-pointer hover:opacity-90 transition-colors section-header" onclick="window.imageReviewToggleGrid(this)">';
      html += '<div class="flex items-center gap-3">';
      if (isAbnormal) html += '<span class="material-symbols-outlined text-red-500 font-bold">warning</span>';
      html += '<div class="flex items-baseline gap-2"><h2 class="text-lg font-bold ' + titleClass + '">' + catName + '</h2><span class="text-sm font-medium ' + subClass + ' section-count">(' + count + ' Cells, ' + pct + '%)</span></div></div>';
      html += '<span class="toggle-icon material-symbols-outlined text-gray-400 transition-transform duration-200 icon-rotate-180">expand_more</span></div>';
      html += '<div class="grid-content px-4 pb-4 grid-expanded transition-all duration-300 section-content">';
      html += '<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-16 gap-2 mt-2 cell-grid" data-category="' + catName + '">';
      cells.forEach(function (cell) {
        var sel = selectedCellIds.has(cell.id) ? ' ring-2 ring-primary' : '';
        html += '<div class="cell-image-container relative aspect-square cursor-pointer transition-all rounded-lg border-2 border-gray-300' + sel + '" data-cell-id="' + cell.id + '" data-category="' + catName + '" draggable="true"><img alt="Cell" class="w-full h-full object-cover rounded-lg" src="' + (cell.imageUrl || '') + '"/></div>';
      });
      html += '</div></div></div>';
    });
    container.innerHTML = html;
    updateProgressBar();
    bindCellEvents();
    applyZoom();
  }

  function bindCellEvents() {
    var containers = document.querySelectorAll('.cell-image-container');
    containers.forEach(function (el) {
      var cellId = el.getAttribute('data-cell-id');
      el.addEventListener('click', function (e) {
        if (rightMouseHeld) { toggleSelect(cellId); return; }
        if (e.ctrlKey) { toggleSelect(cellId); return; }
        if (e.shiftKey) { rangeSelect(cellId); return; }
        singleSelect(cellId);
      });
      el.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        // 若已有多選 (單手模式或 Ctrl/Shift)，維持目前選取集合
        if (selectedCellIds.size === 0) {
          singleSelect(cellId);
        } else if (!selectedCellIds.has(cellId)) {
          // 沒有選到目前這顆，還是以目前選取集合為主
        }
        var firstId = selectedCellIds.size > 0 ? selectedCellIds.values().next().value : cellId;
        showContextMenu(e, firstId);
      });
      el.addEventListener('dragstart', function (e) {
        if (!selectedCellIds.has(cellId)) selectedCellIds.clear(); selectedCellIds.add(cellId);
        e.dataTransfer.setData('text/plain', JSON.stringify(Array.from(selectedCellIds)));
        e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragover', function (e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
      el.addEventListener('drop', function (e) {
        e.preventDefault();
        var cat = el.getAttribute('data-category');
        if (cat) moveSelectedToCategory(cat);
      });
    });

    var sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(function (card) {
      var cat = card.getAttribute('data-category');
      var content = card.querySelector('.section-content');
      if (content) {
        content.addEventListener('dragover', function (e) { e.preventDefault(); e.currentTarget.classList.add('bg-primary/5'); });
        content.addEventListener('dragleave', function (e) { e.currentTarget.classList.remove('bg-primary/5'); });
        content.addEventListener('drop', function (e) {
          e.preventDefault();
          e.currentTarget.classList.remove('bg-primary/5');
          if (cat) moveSelectedToCategory(cat);
        });
      }
    });
  }

  function getCategoryListAndIndex(cellId) {
    var el = document.querySelector('.cell-image-container[data-cell-id="' + cellId + '"]');
    if (!el) return { category: null, index: -1, list: [] };
    var cat = el.getAttribute('data-category') || '';
    var list = Array.prototype.slice.call(document.querySelectorAll('.cell-image-container[data-category="' + cat + '"]'));
    var idx = list.findIndex(function (e) { return e.getAttribute('data-cell-id') === cellId; });
    return { category: cat, index: idx, list: list };
  }

  function singleSelect(cellId) {
    selectedCellIds.clear();
    selectedCellIds.add(cellId);
    var info = getCategoryListAndIndex(cellId);
    lastClickedIndex = info.index;
    lastClickedCategory = info.category;
    updateSelectionUI();
  }
  function toggleSelect(cellId) {
    if (selectedCellIds.has(cellId)) selectedCellIds.delete(cellId); else selectedCellIds.add(cellId);
    var info = getCategoryListAndIndex(cellId);
    lastClickedIndex = info.index;
    lastClickedCategory = info.category;
    updateSelectionUI();
  }
  function rangeSelect(cellId) {
    var info = getCategoryListAndIndex(cellId);
    var idx = info.index;
    var cat = info.category;
    var list = info.list;
    if (idx < 0 || !list.length) return;
    var from = idx;
    var to = idx;
    if (lastClickedIndex >= 0 && lastClickedCategory === cat) {
      from = Math.min(lastClickedIndex, idx);
      to = Math.max(lastClickedIndex, idx);
    }
    for (var i = from; i <= to; i++) {
      var id = list[i] && list[i].getAttribute('data-cell-id');
      if (id) selectedCellIds.add(id);
    }
    lastClickedIndex = idx;
    lastClickedCategory = cat;
    updateSelectionUI();
  }
  function updateSelectionUI() {
    document.querySelectorAll('.cell-image-container').forEach(function (el) {
      var id = el.getAttribute('data-cell-id');
      if (selectedCellIds.has(id)) el.classList.add('ring-2', 'ring-primary'); else el.classList.remove('ring-2', 'ring-primary');
    });
  }

  function applyZoom() {
    var baseSize = 72; // 100% 時每顆細胞約寬 72px
    var size = baseSize * (zoomLevel / 100);
    var grids = document.querySelectorAll('.cell-grid');
    grids.forEach(function (g) {
      g.style.gridTemplateColumns = 'repeat(auto-fill, minmax(' + size + 'px, 1fr))';
    });
  }

  // 依目前細胞區塊的分類結果，計算「人員編輯」用的百分比數據，
  // 供報告核發介面的人員編輯欄位與其他發現欄位使用。
  function computeEditedMetricsFromCells() {
    if (!currentSpecimen || !cellData || !cellData.length) return;
    var total = cellData.length;
    if (total === 0) return;

    // 細胞群組標題 → metrics / otherFindings 對應欄位 key
    var categoryToKey = {
      'Blast': 'blast',
      'Promyelocyte': 'promyelocyte',
      'Myelocyte': 'myelocyte',
      'Metamyelocyte': 'metamyelocyte',
      'Hypersegmented': 'hypersegmented',
      'Promonocyte': 'promonocyte',
      'Plasma Cell': 'plasmaCell',
      'Abnormal Lymphocyte': 'abnormalLymphocyte',
      'Band': 'band',
      'Segmented Neutrophil': 'segmentedNeutrophil',
      'Lymphocyte': 'lymphocyte',
      'Monocyte': 'monocyte',
      'Eosinophil': 'eosinophil',
      'Basophil': 'basophil',
      // 其他發現
      'NRBC': 'nrbc',
      'Giant PLT': 'giantPlt',
      'Megakaryocyte': 'megakaryocyte',
      'Smudge Cell': 'smudgeCell',
      'Artefact': 'artefact'
    };

    var countsByCategory = {};
    cellData.forEach(function (c) {
      if (!countsByCategory[c.category]) countsByCategory[c.category] = 0;
      countsByCategory[c.category]++;
    });

    var edited = {};
    Object.keys(categoryToKey).forEach(function (cat) {
      edited[categoryToKey[cat]] = '-';
    });

    Object.keys(countsByCategory).forEach(function (cat) {
      var key = categoryToKey[cat];
      if (!key) return;
      var count = countsByCategory[cat];
      var pct = total ? (count / total * 100) : 0;
      edited[key] = pct > 0 ? (pct.toFixed(1).replace(/\.0$/, '')) : '-';
    });

    // 將人工編輯結果暫存到目前檢體
    currentSpecimen.editedMetrics = edited;
    // 並存到 localStorage，讓報告核發 iframe 也能讀取到同一筆結果
    try {
      var key = 'editedMetrics:' + currentSpecimen.id;
      window.localStorage.setItem(key, JSON.stringify(edited));
    } catch (e) {
      // 若瀏覽器禁止 localStorage，略過不影響其他功能
    }
  }

  function moveSelectedToCategory(category) {
    var ids = Array.from(selectedCellIds);
    ids.forEach(function (id) {
      var cell = cellData.find(function (c) { return c.id === id; });
      if (cell) cell.category = category;
    });
    selectedCellIds.clear();
    renderCellGroups();
  }

  var aiLabelToCategory = { 'Segmented': 'Segmented Neutrophil', 'Lym': 'Lymphocyte', 'Mono': 'Monocyte', 'Eo': 'Eosinophil', 'Baso': 'Basophil', 'Band': 'Band', 'Blast': 'Blast', 'Promyelocyte': 'Promyelocyte', 'Myelocyte': 'Myelocyte' };

  function showContextMenu(e, cellId) {
    var menu = document.getElementById('context-menu');
    if (!menu) return;
    var cell = cellData.find(function (c) { return c.id === cellId; });
    var ai = cell && cell.aiSuggestion ? cell.aiSuggestion : null;

    var aiBlock = menu.querySelector('.context-ai-block');
    if (aiBlock) {
      if (ai) {
        aiBlock.style.display = 'block';
        var labelText = (ai.label || '') + (ai.pct != null ? ' ' + ai.pct + '%' : '');
        var labelEl = aiBlock.querySelector('.ai-suggestion-label');
        if (labelEl) labelEl.textContent = labelText;
        var moveBtn = aiBlock.querySelector('.ai-move-btn');
        var targetCat = aiLabelToCategory[ai.label] || ai.label || (cell && cell.category);
        if (moveBtn) {
          moveBtn.textContent = 'Move to ' + (targetCat || ai.label || '');
          moveBtn.onclick = function () { moveSelectedToCategory(targetCat); };
        }
      } else aiBlock.style.display = 'none';
    }

    var rect = menu.getBoundingClientRect();
    var x = e.clientX;
    var y = e.clientY;
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (x + rect.width > w) x = w - rect.width - 10;
    if (y + rect.height > h) y = h - rect.height - 10;
    if (x < 0) x = 10;
    if (y < 0) y = 10;
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'flex';
  }

  function hideContextMenu() {
    var menu = document.getElementById('context-menu');
    if (menu) menu.style.display = 'none';
  }

  function onSaveReport() {
    var total = getTotalCells();
    var unidentified = getUnidentifiedCount();
    var progress = total ? Math.round(((total - unidentified) / total) * 100) : 100;
    if (unidentified > 0 || progress < 100) {
      var modal = document.getElementById('modal-save-block');
      if (modal) {
        modal.querySelector('.modal-message').textContent = unidentified > 0 ? '尚有未分類細胞 (Unidentified: ' + unidentified + ')，請完成分類後再儲存。' : '尚未檢視完成 (進度 ' + progress + '%)，請完成後再儲存。';
        modal.classList.remove('hidden');
      }
      return;
    }
    // 儲存並開啟報告核發前，先依目前細胞分類結果更新「人員編輯」數據
    computeEditedMetricsFromCells();

    var modalEl = document.getElementById('report-issue-modal');
    var iframeEl = document.getElementById('report-issue-iframe');
    if (modalEl && iframeEl) {
      var base = (typeof window.getBasePath === 'function') ? window.getBasePath() : '';
      var url = base + '報告核發.html';
      if (currentSpecimenId) url += '?specimen=' + encodeURIComponent(currentSpecimenId);
      iframeEl.src = url;
      modalEl.classList.remove('hidden');
    }
  }

  window.imageReviewToggleGrid = function (headerEl) {
    var card = headerEl.closest('.section-card');
    if (!card) return;
    var content = card.querySelector('.grid-content');
    var icon = card.querySelector('.toggle-icon');
    if (content.classList.contains('grid-expanded')) {
      content.classList.remove('grid-expanded');
      content.classList.add('grid-collapsed');
      if (icon) icon.classList.remove('icon-rotate-180');
    } else {
      content.classList.remove('grid-collapsed');
      content.classList.add('grid-expanded');
      if (icon) icon.classList.add('icon-rotate-180');
    }
  };

  function init() {
    try {
      currentSpecimenId = (typeof window.getSpecimenIdFromUrl === 'function') ? window.getSpecimenIdFromUrl() : '';
    } catch (e) { currentSpecimenId = ''; }
    if (!currentSpecimenId && typeof APP_DATABASE !== 'undefined' && APP_DATABASE.specimens && APP_DATABASE.specimens.length > 0) {
      currentSpecimenId = APP_DATABASE.specimens[0].id;
    }
    if (!currentSpecimenId) currentSpecimenId = 'H5080720647';

    currentSpecimen = getSpecimenById(currentSpecimenId);
    if (!currentSpecimen && typeof window.getSpecimenById === 'function') currentSpecimen = window.getSpecimenById(currentSpecimenId);
    if (!currentSpecimen && typeof APP_DATABASE !== 'undefined' && APP_DATABASE.specimens && APP_DATABASE.specimens.length > 0) {
      currentSpecimen = APP_DATABASE.specimens.find(function (s) { return s.id === currentSpecimenId; }) || APP_DATABASE.specimens[0];
    }

    digitalReviewList = getDigitalReviewList();
    cellData = getOrCreateCellData(currentSpecimenId);

    renderSidebar();
    renderCellGroups();

    var ctxMenu = document.getElementById('context-menu');
    document.addEventListener('click', function (e) {
      if (ctxMenu && !ctxMenu.contains(e.target)) hideContextMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideContextMenu(); });

    document.addEventListener('mousedown', function (e) {
      if (e.button === 2) {
        // 進入單手模式，不清除既有選取，讓 Shift / Ctrl 多選後仍可直接用右鍵開單一選單
        rightMouseHeld = true;
      }
    });
    document.addEventListener('mouseup', function (e) {
      if (e.button === 2) {
        rightMouseHeld = false;
      }
    });

    var saveBtn = document.getElementById('btn-save-report');
    if (saveBtn) saveBtn.addEventListener('click', onSaveReport);

    var zoomEl = document.getElementById('zoom-value');
    var zoomIn = document.getElementById('zoom-in');
    var zoomOut = document.getElementById('zoom-out');
    function updateZoom(delta) {
      zoomLevel = Math.min(200, Math.max(50, zoomLevel + delta));
      if (zoomEl) zoomEl.textContent = zoomLevel + '%';
      applyZoom();
    }
    if (zoomIn) zoomIn.addEventListener('click', function () { updateZoom(10); });
    if (zoomOut) zoomOut.addEventListener('click', function () { updateZoom(-10); });

    var reportClose = document.getElementById('report-issue-close');
    var reportModal = document.getElementById('report-issue-modal');
    if (reportClose && reportModal) {
      reportClose.addEventListener('click', function () {
        reportModal.classList.add('hidden');
      });
      reportModal.addEventListener('click', function (e) {
        if (e.target === reportModal) reportModal.classList.add('hidden');
      });
    }

    var contextMenu = document.getElementById('context-menu');
    if (contextMenu) {
      contextMenu.querySelectorAll('.menu-item, .menu-item-danger').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cat = btn.getAttribute('data-category') || btn.textContent.trim();
          moveSelectedToCategory(cat);
          hideContextMenu();
        });
      });
    }

    var modalClose = document.getElementById('modal-save-block-close');
    if (modalClose) modalClose.addEventListener('click', function () { document.getElementById('modal-save-block').classList.add('hidden'); });

    // 從報告核發 iframe 接收簽核完成事件
    window.addEventListener('message', function (e) {
      var data = e.data || {};
      if (!data || data.type !== 'reportVerified') return;
      var id = data.specimenId || currentSpecimenId;
      if (!id || typeof APP_DATABASE === 'undefined' || !APP_DATABASE.specimens) return;
      var spec = APP_DATABASE.specimens.find(function (s) { return s.id === id; });
      if (!spec) return;
      if (!Array.isArray(spec.status)) spec.status = [];
      // 標記此檢體已完成數位閱片簽核（供檢體管理頁 renderStatus 使用）
      spec.statusDone = true;
      if (spec.status.indexOf('Verified') === -1) spec.status.push('Verified');
      if (currentSpecimen && currentSpecimen.id === id) {
        currentSpecimen.status = spec.status.slice();
        currentSpecimen.statusDone = true;
        digitalReviewList = getDigitalReviewList();
        renderSidebar();
      }
      var reportModal = document.getElementById('report-issue-modal');
      if (reportModal) reportModal.classList.add('hidden');
      if (typeof window.goToSpecimenList === 'function') window.goToSpecimenList();
    });
  }

  var initTries = 0;
  function runInit() {
    if (!document.getElementById('main-cell-groups')) {
      if (initTries < 20) { initTries++; setTimeout(runInit, 30); }
      return;
    }
    init();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInit);
  } else {
    runInit();
  }
})();
