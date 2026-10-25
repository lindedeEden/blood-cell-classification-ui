/**
 * 影像檢視與細胞編輯頁
 *  - 左側：檢體資訊、狀態標籤（僅顯示，第 5 節）、分析與歷史報告
 *  - 右側：依類別分組的細胞影像（影像來自 CellaVision 資料庫、預分類來自 AI 模型，進線時合併，第 2 節）；
 *    拖曳或右鍵選單重新歸類；達留單門檻的類別置頂並標紅（規則 8）
 *  - 儲存結果（規則 8）→ 以 iframe 開啟報告核發頁，接收其 postMessage 完成簽核等動作
 */
(function () {
  'use strict';

  var WR = WorkflowRules;
  var CC = CellConstants;
  var CHECK_ICON = '<span class="material-symbols-outlined text-[14px] mr-0.5 align-middle">check</span>';

  /** 白血球分類分母：排除非白血球類別（規則 8；Unidentified 視為待分類白血球，計入）。cells＝cellData 工作副本，看 category */
  function getWbcDenominator(cells) {
    return (cells || []).filter(function (c) { return !CC.isNonWbcCategory(c.category); }).length;
  }

  /** 影像缺漏時的占位圖：內嵌 SVG（免外連） */
  var CELL_PLACEHOLDER_SVG = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="g" cx="40%" cy="40%" r="50%"><stop offset="0%" stop-color="#e8e4f0"/><stop offset="70%" stop-color="#c4bed4"/><stop offset="100%" stop-color="#9a92a8"/></radialGradient></defs><ellipse cx="60" cy="60" rx="48" ry="52" fill="url(#g)" stroke="#8a8299" stroke-width="1.5"/><ellipse cx="52" cy="55" rx="18" ry="20" fill="rgba(255,255,255,0.4)"/></svg>'
  );

  var currentSpecimenId = '';     // 目前檢體條碼（barcode）
  var currentSpecimen = null;
  var digitalReviewList = [];
  /** 閱片中的細胞工作副本：{ id:'cell-n', cellId, category（目前分類，可重新歸類）, imageUrl, aiSuggestion }；
   *  由 spec.imaging.cells（AI 預分類）或已儲存的人員編輯快照產生 */
  var cellData = [];
  var selectedCellIds = new Set();
  var lastClickedIndex = -1;
  var lastClickedCategory = null;
  var zoomLevel = 100;
  var rightMouseHeld = false;
  /** 單手模式（右鍵長按）：oneHandLmbCount＝左鍵次數（奇數＝錨點單選，偶數＝同區塊範圍選）；oneHandUsed＝這次按住右鍵期間是否點過左鍵 */
  var oneHandLmbCount = 0, oneHandUsed = false;
  /** 唯讀：數位閱片已完成或 URL ?readonly=1（仍可縮放／瀏覽，不可改分類／核發） */
  var readOnlyMode = false;
  /** 主內容區捲動時，細胞縮圖曾進入視野者（data-cell-id）；換檢體時清空 */
  var viewedCellIds = new Set();
  var cellViewObserver = null;
  var gridResizeObserver = null;

  /** 唯讀：網址 ?readonly=1、他人編輯中、已簽核結案或已交接人工鏡檢（規則 13） */
  function computeReadOnlyMode(spec) {
    if (AppNav.isReadonlyFromUrl()) return true;
    return WR.isDigitalReviewReadOnly(spec);
  }

  function applyReadOnlyChrome() {
    var banner = document.getElementById('image-review-readonly-banner');
    if (readOnlyMode) {
      if (banner) {
        banner.classList.remove('hidden');
        if (currentSpecimen && currentSpecimen.review.locked) {
          banner.textContent = '此檢體已鎖定（他人編輯中），僅能檢視影像與縮放，無法變更細胞分類或核發報告。';
        } else if (WR.isHandoffToFollowUp(currentSpecimen)) {
          banner.textContent = '唯讀模式：已交接至需拉片確認，以下為數位閱片人員編輯快照，僅供檢視。';
        } else if (!WR.hasStatus(currentSpecimen, 'Digital Review')) {
          banner.textContent = '唯讀模式：需拉片確認已處理完成，僅能檢視影像與縮放。';
        } else {
          banner.textContent = '唯讀模式：數位閱片已簽核結案，僅能檢視影像與縮放，無法變更細胞分類或核發報告。';
        }
      }
    } else {
      if (banner) banner.classList.add('hidden');
    }
    updateSaveReportButtonState();
  }

  /** 未檢視完所有細胞或唯讀時，「儲存結果」反灰不可點 */
  function updateSaveReportButtonState() {
    var saveBtn = document.getElementById('btn-save-report');
    if (!saveBtn) return;
    var total = getTotalCells();
    var viewed = viewedCellIds.size;
    var allViewed = total > 0 && viewed >= total;

    if (readOnlyMode) {
      saveBtn.disabled = true;
      saveBtn.setAttribute('aria-disabled', 'true');
      saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
      saveBtn.title = currentSpecimen && currentSpecimen.review.locked ? '檢體已鎖定' : '數位閱片已完成';
      return;
    }

    if (!allViewed) {
      saveBtn.disabled = true;
      saveBtn.setAttribute('aria-disabled', 'true');
      saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
      saveBtn.title = total === 0
        ? '尚無細胞資料'
        : '請先檢視所有細胞（' + viewed + ' / ' + total + '）';
      return;
    }

    saveBtn.disabled = false;
    saveBtn.setAttribute('aria-disabled', 'false');
    saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    saveBtn.removeAttribute('title');
  }

  /** 待數位閱片的檢體（上一筆／下一筆、簽核後自動開下一筆用；規則 9） */
  function getDigitalReviewList() {
    return SpecimenStore.listForDisplay().filter(function (s) {
      return !s.review.locked && WR.inDigitalList(s);
    });
  }

  /** 規則 9：依清單順序，取得簽核完成後下一筆待數位閱片檢體（往後找，找不到再從頭找） */
  function getNextPendingDigitalSpecimenAfter(completedId) {
    var pending = getDigitalReviewList();
    if (!pending.length) return null;
    var pendingById = {};
    pending.forEach(function (s) { pendingById[s.barcode] = s; });
    var ordered = SpecimenStore.listForDisplay();
    var startIdx = 0;
    if (completedId) {
      for (var k = 0; k < ordered.length; k++) {
        if (ordered[k].barcode === completedId) {
          startIdx = k + 1;
          break;
        }
      }
    }
    var i;
    for (i = startIdx; i < ordered.length; i++) {
      if (pendingById[ordered[i].barcode]) return pendingById[ordered[i].barcode];
    }
    for (i = 0; i < startIdx; i++) {
      if (pendingById[ordered[i].barcode]) return pendingById[ordered[i].barcode];
    }
    return pending[0];
  }

  /** 右鍵選單「AI 建議」顯示用：AI 模型的預分類與信心值（信心值未提供時不顯示） */
  function toAiSuggestion(cell) {
    if (cell.aiConfidence == null) return null;
    var label = cell.aiCategory === 'Segmented Neutrophil' ? 'Segmented' : cell.aiCategory;
    return { label: label, pct: Math.round(cell.aiConfidence * 100) };
  }

  /**
   * 取得檢體的細胞資料：
   * 1. 已儲存的人員編輯結果
   * 2. 進線時合併好的細胞（spec.imaging.cells）：影像來自 CellaVision 資料庫、分類來自 AI 模型（第 2 節）
   */
  function getOrCreateCellData(specimenId) {
    var snapshot = DemoStorage.loadEditedCells(specimenId);   // 已儲存的人員編輯結果優先
    if (snapshot) return snapshot.slice();
    var cells = (currentSpecimen && currentSpecimen.imaging.cells) || [];
    return cells.map(function (c, i) {
      return {
        id: 'cell-' + (i + 1),
        cellId: c.cellId,
        category: c.aiCategory,                 // 閱片中的分類，起始為 AI 預分類，醫檢師可重新歸類
        imageUrl: c.imagePath ? AppNav.getBasePath() + c.imagePath : CELL_PLACEHOLDER_SVG,
        aiSuggestion: toAiSuggestion(c)
      };
    });
  }

  /** 目前細胞分類是否達留單門檻（規則 1：門檻依病人年齡） */
  function isLeaveConditionReachedByCurrentCells(category, count, pct) {
    var metricKey = CC.CATEGORY_TO_METRIC_KEY[category];
    if (!metricKey) return false;
    var threshold = LeaveRules.thresholdFor(metricKey, currentSpecimen);
    if (threshold == null) return false;
    return LeaveRules.isLeave(metricKey, threshold === 'present' ? count : pct, currentSpecimen);
  }

  /** 細胞區塊排序：達留單門檻的類別置頂，其餘依預設順序（規則 8） */
  function getSortedCategoryOrder(byCat, totalCount) {
    var defaultOrder = CC.REVIEW_CATEGORY_ORDER.slice();
    Object.keys(byCat).forEach(function (t) {
      if (defaultOrder.indexOf(t) < 0) defaultOrder.push(t);
    });

    var leaveHitCategories = defaultOrder.filter(function (cat) {
      if (!byCat[cat]) return false;
      var count = byCat[cat].length;
      var pct = totalCount > 0 ? (count / totalCount * 100) : 0;
      return isLeaveConditionReachedByCurrentCells(cat, count, pct);
    });

    // 所有命中留單門檻的類別都置頂；其餘項目保留 defaultOrder 的相對順序。
    if (leaveHitCategories.length === 0) return defaultOrder;
    var prioritized = leaveHitCategories;
    var rest = defaultOrder.filter(function (cat) { return prioritized.indexOf(cat) < 0; });
    return prioritized.concat(rest);
  }

  function renderSidebar() {
    var specimen = currentSpecimen;
    if (!specimen) return;

    var titleEl = document.getElementById('specimen-id-title');
    if (titleEl) titleEl.textContent = specimen.barcode;

    var tagsContainer = document.getElementById('sidebar-status-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = AppUi.displayStatuses(specimen).map(function (s) {
        var cap = AppUi.capsuleInfo(specimen, s);
        return '<div class="inline-flex items-center gap-1 px-3 py-1 rounded-full ' + cap.style + ' text-[10px] font-bold uppercase tracking-wider" data-status="' + s + '" title="狀態標籤僅供顯示">' + (cap.done ? CHECK_ICON : '') + cap.label + '</div>';
      }).join('');
      // 狀態標籤僅供顯示：影像檢視頁不提供新增／刪除膠囊（第 5 節）
    }

    var searchEl = document.getElementById('sidebar-search');
    if (searchEl) {
      searchEl.placeholder = '檢體 ID 搜尋…';
      searchEl.value = '';
      searchEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var id = (searchEl.value || '').trim();
          if (id && SpecimenStore.getById(id)) AppNav.switchImageReviewSpecimen(id);
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
        var summaryText = ' - ' + (specimen.lis.name || '') + ' (' + (specimen.lis.gender || '') + ')';
        if (specimen.lis.birthDate) {
          summaryText += ' / ' + specimen.lis.birthDate;
          var age = LeaveRules.getAgeYears(specimen);
          if (age != null) {
            summaryText += ' (' + age + ' 歲)';
          }
        }
        nameEl.textContent = summaryText;
      }
      var idEl = document.getElementById('sidebar-patient-id');
      var deptEl = document.getElementById('sidebar-patient-dept');
      var machineEl = document.getElementById('sidebar-patient-machine');
      var locEl = document.getElementById('sidebar-patient-location');
      if (idEl) idEl.textContent = specimen.lis.patientId || '';
      if (deptEl) deptEl.textContent = specimen.lis.department || '';
      if (machineEl) machineEl.textContent = specimen.wam.machine || '';
      if (locEl) locEl.textContent = specimen.wam.location || '';
    }

    var tableContainer = document.getElementById('sidebar-analysis-table');
    if (tableContainer) {
      var prevHeader = AppUi.prevReportHeaderLabel(specimen, '前次報告');
      var header = '<div class="grid grid-cols-4 gap-2 font-semibold text-gray-600 py-1.5 border-b border-gray-300/80 sticky top-0 bg-card z-[1] text-[10px] uppercase tracking-wider">' +
        '<div class="col-span-1"></div><div class="col-span-1 text-right">流式計數</div><div class="col-span-1 text-right">AI</div><div class="col-span-1 text-right">' + prevHeader + '</div></div>';
      var body = AppUi.analysisRows(specimen).map(function (r) {
        var label = r.label;
        var aiVal = r.ai;
        var highlight = LeaveRules.isLeave(r.key, aiVal, currentSpecimen);   // 規則 8：AI 值達門檻標紅
        var rowClass = highlight ? 'bg-red-50 border-b border-red-100' : 'border-b border-gray-200';
        var labelClass = highlight ? 'text-red-700 font-semibold px-0.5' : 'text-gray-600 font-medium leading-tight';
        var valClass = highlight ? 'font-bold text-red-600' : 'text-gray-800';
        var flowClass = highlight ? 'text-gray-400' : 'text-gray-800';
        var labelHtml = label.indexOf('WBC') >= 0 ? 'WBC<br/><span class="text-[9px]">(10e9/L)</span>' : label;
        return '<div class="grid grid-cols-4 gap-2 items-center py-1.5 ' + rowClass + '">' +
          '<div class="col-span-1 ' + labelClass + '">' + labelHtml + '</div>' +
          '<div class="col-span-1 text-right ' + flowClass + '">' + (r.flow || '-') + '</div>' +
          '<div class="col-span-1 text-right ' + valClass + '">' + (aiVal || '-') + '</div>' +
          '<div class="col-span-1 text-right ' + valClass + '">' + (r.prev || '-') + '</div></div>';
      }).join('');
      tableContainer.innerHTML = header + '<div class="space-y-0 text-xs">' + body + '</div>';
    }
  }

  function notifyReportIframeToRefresh() {
    var modal = document.getElementById('report-issue-modal');
    var iframe = document.getElementById('report-issue-iframe');
    if (!modal || modal.classList.contains('hidden') || !iframe || !iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage({ type: 'specimenDataUpdated', specimenId: currentSpecimenId }, '*');
    } catch (e) {}
  }

  function navigatePrevNext(delta) {
    var idx = digitalReviewList.findIndex(function (s) { return s.barcode === currentSpecimenId; });
    idx += delta;
    if (idx < 0) idx = digitalReviewList.length - 1;
    if (idx >= digitalReviewList.length) idx = 0;
    var next = digitalReviewList[idx];
    if (next) AppNav.switchImageReviewSpecimen(next.barcode);
  }

  function getTotalCells() { return cellData.length; }
  function getUnidentifiedCount() { return cellData.filter(function (c) { return c.category === 'Unidentified'; }).length; }

  function disconnectCellViewObserver() {
    if (cellViewObserver) {
      cellViewObserver.disconnect();
      cellViewObserver = null;
    }
  }

  /** root 為 #main-cell-groups 之父層（main 內 overflow-y-auto 捲動容器） */
  function setupCellViewObserver() {
    disconnectCellViewObserver();
    var groupsEl = document.getElementById('main-cell-groups');
    if (!groupsEl) return;
    var scrollRoot = groupsEl.parentElement;
    if (!scrollRoot) return;
    var cells = groupsEl.querySelectorAll('.cell-image-container');
    if (!cells.length) {
      updateProgressBar();
      return;
    }
    cellViewObserver = new IntersectionObserver(function (entries) {
      var changed = false;
      entries.forEach(function (ent) {
        if (!ent.isIntersecting || ent.intersectionRatio < 0.35) return;
        var id = ent.target.getAttribute('data-cell-id');
        if (id && !viewedCellIds.has(id)) {
          viewedCellIds.add(id);
          changed = true;
        }
      });
      if (changed) updateProgressBar();
    }, { root: scrollRoot, rootMargin: '0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    for (var i = 0; i < cells.length; i++) {
      cellViewObserver.observe(cells[i]);
    }
    updateProgressBar();
  }

  function updateProgressBar() {
    var total = getTotalCells();
    var viewed = viewedCellIds.size;
    var unidentified = getUnidentifiedCount();
    var textEl = document.getElementById('toolbar-progress-text');
    var barEl = document.getElementById('toolbar-progress-bar');
    if (textEl) {
      textEl.textContent = '已檢視 ' + viewed + ' / ' + total + ' · Unidentified ' + unidentified;
    }
    var pct = total ? (viewed / total * 100) : 100;
    if (barEl) barEl.style.width = pct + '%';
    updateSaveReportButtonState();
  }

  function renderCellGroups() {
    var container = document.getElementById('main-cell-groups');
    if (!container) return;

    // 規則 8：白血球分類百分比只以白血球為分母（排除非白血球類別）
    var total = getWbcDenominator(cellData);
    var byCat = {};
    cellData.forEach(function (c) {
      if (!byCat[c.category]) byCat[c.category] = [];
      byCat[c.category].push(c);
    });

    var catOrder = getSortedCategoryOrder(byCat, total);

    var html = '';
    catOrder.forEach(function (catName) {
      var cells = byCat[catName];
      if (!cells || cells.length === 0) return;
      var count = cells.length;
      var nonWbc = CC.isNonWbcCategory(catName);
      var pctRaw = (!nonWbc && total) ? (count / total * 100) : 0;
      var pct = total ? Math.round(pctRaw) : 0;
      // 非白血球不計 %；但 Megakaryocyte 對 ≥18 歲為「出現即留單」（規則 1），仍需判定
      var leaveHit = isLeaveConditionReachedByCurrentCells(catName, count, pctRaw);
      var countLabel = nonWbc ? '(' + count + ' Cells，非白血球)' : '(' + count + ' Cells, ' + pct + '%)';
      var sectionClass = leaveHit ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-300';
      var titleClass = leaveHit ? 'text-red-800' : 'text-gray-800';
      var subClass = leaveHit ? 'text-red-600' : 'text-gray-600';
      html += '<div class="group section-card ' + sectionClass + ' rounded-xl overflow-hidden" data-category="' + catName + '">';
      html += '<div class="flex items-center justify-between p-4 cursor-pointer hover:opacity-90 transition-colors section-header" onclick="window.imageReviewToggleGrid(this)">';
      html += '<div class="flex items-center gap-3">';
      if (leaveHit) html += '<span class="material-symbols-outlined text-red-500 font-bold">warning</span>';
      html += '<div class="flex items-baseline gap-2"><h2 class="text-lg font-bold ' + titleClass + '">' + catName + '</h2><span class="text-sm font-medium ' + subClass + ' section-count">' + countLabel + '</span></div></div>';
      html += '<span class="toggle-icon material-symbols-outlined text-gray-400 transition-transform duration-200 icon-rotate-180">expand_more</span></div>';
      html += '<div class="grid-content px-4 pb-4 grid-expanded transition-all duration-300 section-content">';
      html += '<div class="grid gap-2 mt-2 cell-grid" data-category="' + catName + '">';
      cells.forEach(function (cell) {
        var sel = selectedCellIds.has(cell.id) ? ' ring-2 ring-primary' : '';
        html += '<div class="cell-image-container relative aspect-square cursor-pointer transition-all rounded-lg border-2 border-gray-300' + sel + '" data-cell-id="' + cell.id + '" data-category="' + catName + '" draggable="' + (readOnlyMode ? 'false' : 'true') + '"><img alt="Cell" class="w-full h-full object-cover rounded-lg" src="' + (cell.imageUrl || '') + '"/></div>';
      });
      html += '</div></div></div>';
    });
    container.innerHTML = html;
    bindCellEvents();
    setupCellViewObserver();
    scheduleApplyZoom();
  }

  function bindCellEvents() {
    var containers = document.querySelectorAll('.cell-image-container');
    containers.forEach(function (el) {
      var cellId = el.getAttribute('data-cell-id');
      el.addEventListener('click', function (e) {
        if (rightMouseHeld) {
          oneHandLmbCount++; oneHandUsed = true;
          if (oneHandLmbCount % 2 === 1) {
            singleSelect(cellId);
          } else {
            var ohInfo = getCategoryListAndIndex(cellId);
            if (lastClickedCategory === ohInfo.category) {
              rangeSelect(cellId);
            } else {
              singleSelect(cellId);
            }
          }
          return;
        }
        if (e.ctrlKey) { toggleSelect(cellId); return; }
        if (e.shiftKey) { rangeSelect(cellId); return; }
        singleSelect(cellId);
      });
      el.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        if (readOnlyMode) return;
        // 右鍵點在選取範圍外 → 改成只選這一顆，選單只改它；右鍵點在選取範圍內 → 改全部選取的細胞
        // 例外：這次按住右鍵期間有用左鍵點選（單手模式），一律保留剛選好的範圍
        if (!oneHandUsed && !selectedCellIds.has(cellId)) {
          singleSelect(cellId);
        }
        // 選單上方的 AI 建議：右鍵點的這顆在選取中就顯示它的，否則顯示第一顆選取細胞的
        var firstId = selectedCellIds.has(cellId) ? cellId : selectedCellIds.values().next().value;
        showContextMenu(e, firstId);
      });
      el.addEventListener('dragstart', function (e) {
        if (readOnlyMode) {
          e.preventDefault();
          return;
        }
        if (!selectedCellIds.has(cellId)) selectedCellIds.clear(); selectedCellIds.add(cellId);
        e.dataTransfer.setData('text/plain', JSON.stringify(Array.from(selectedCellIds)));
        e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragover', function (e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
      el.addEventListener('drop', function (e) {
        e.preventDefault();
        if (readOnlyMode) return;
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
          if (readOnlyMode) return;
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

  var CELL_IMAGE_BASE_REM = 4.5; // 100% 時每格約 4.5rem，隨 html 字級一併縮放

  function getRootFontSizePx() {
    var px = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    return isNaN(px) || px <= 0 ? 16 : px;
  }

  function getCellSizePx() {
    return CELL_IMAGE_BASE_REM * (zoomLevel / 100) * getRootFontSizePx();
  }

  function getGridGapPx(gridEl) {
    if (!gridEl) return 8;
    var gap = window.getComputedStyle(gridEl).columnGap || window.getComputedStyle(gridEl).gap;
    var n = parseFloat(gap);
    return isNaN(n) || n < 0 ? 8 : n;
  }

  function applyZoom() {
    AppUi.syncZoomCssVar(zoomLevel);
    var cellPx = getCellSizePx();
    var cellPxStr = cellPx.toFixed(2) + 'px';
    try {
      document.documentElement.style.setProperty('--cell-image-size', cellPxStr);
    } catch (e) {}
    document.querySelectorAll('.cell-grid').forEach(function (g) {
      var width = g.clientWidth;
      if (width <= 0) {
        g.style.gridTemplateColumns = 'repeat(auto-fill, ' + cellPxStr + ')';
        return;
      }
      var gapPx = getGridGapPx(g);
      var cols = Math.max(1, Math.floor((width + gapPx) / (cellPx + gapPx)));
      g.style.gridTemplateColumns = 'repeat(' + cols + ', ' + cellPxStr + ')';
    });
  }

  /** Edge 等瀏覽器在捲軸／字型載入後才穩定版面，需延後重算 */
  function scheduleApplyZoom() {
    applyZoom();
    requestAnimationFrame(function () {
      applyZoom();
      requestAnimationFrame(applyZoom);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(applyZoom).catch(function () {});
    }
  }

  function disconnectGridResizeObserver() {
    if (gridResizeObserver) {
      gridResizeObserver.disconnect();
      gridResizeObserver = null;
    }
  }

  function setupGridResizeObserver() {
    disconnectGridResizeObserver();
    if (typeof window.ResizeObserver === 'undefined') return;
    var groupsEl = document.getElementById('main-cell-groups');
    if (!groupsEl) return;
    var scrollRoot = groupsEl.parentElement;
    gridResizeObserver = new ResizeObserver(function () {
      applyZoom();
    });
    gridResizeObserver.observe(groupsEl);
    if (scrollRoot) gridResizeObserver.observe(scrollRoot);
  }

  /**
   * 依目前細胞分類計算「人員編輯」數值（規則 8）：
   * 一律為百分比，分母＝白血球總數（不含非白血球）；非白血球另外算、不併入白血球加總，
   * 於報告核發「其他發現」呈現（例：白血球 100 顆、NRBC 2 顆 → NRBC 2）。
   * 結果與細胞分類快照一併保存，供報告核發頁（iframe）讀取。
   */
  function computeEditedDiffFromCells() {
    if (!currentSpecimen || !cellData || !cellData.length) return;
    var total = getWbcDenominator(cellData);
    var countsByCategory = {};
    cellData.forEach(function (c) {
      countsByCategory[c.category] = (countsByCategory[c.category] || 0) + 1;
    });
    var edited = {};
    Object.keys(CC.CATEGORY_TO_METRIC_KEY).forEach(function (cat) {
      edited[CC.CATEGORY_TO_METRIC_KEY[cat]] = '-';
    });
    Object.keys(countsByCategory).forEach(function (cat) {
      var key = CC.CATEGORY_TO_METRIC_KEY[cat];
      if (!key) return;
      var count = countsByCategory[cat];
      var pct = total ? (count / total * 100) : 0;           // 白血球與非白血球同一分母
      edited[key] = pct > 0 ? (pct.toFixed(1).replace(/\.0$/, '')) : '-';
    });
    SpecimenStore.saveEditedResult(currentSpecimen, edited, cellData);
  }

  function moveSelectedToCategory(category) {
    if (readOnlyMode) return;
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
    if (readOnlyMode) {
      e.preventDefault();
      return;
    }
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

    // 先顯示再量測；先套用視窗高度上限，避免量到未收合的完整內容高度而導致底部超出畫面。
    var w = window.innerWidth;
    var h = window.innerHeight;
    var pad = 8;
    var maxAvailH = Math.max(120, h - 2 * pad);
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.visibility = 'hidden';
    menu.style.maxHeight = maxAvailH + 'px';
    menu.style.overflowY = 'auto';
    menu.style.boxSizing = 'border-box';
    void menu.offsetHeight;

    var rect = menu.getBoundingClientRect();
    var mw = rect.width;
    var mh = rect.height;
    var x = e.clientX;
    var y = e.clientY;
    if (x + mw > w - pad) x = w - pad - mw;
    if (y + mh > h - pad) y = h - pad - mh;
    if (x < pad) x = pad;
    if (y < pad) y = pad;

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.visibility = 'visible';
  }

  function hideContextMenu() {
    var menu = document.getElementById('context-menu');
    if (!menu) return;
    menu.style.display = 'none';
    menu.style.maxHeight = '';
    menu.style.overflowY = '';
    menu.style.boxSizing = '';
  }

  function onSaveReport() {
    if (readOnlyMode) return;
    var saveBtn = document.getElementById('btn-save-report');
    if (saveBtn && saveBtn.disabled) return;
    var total = getTotalCells();
    var unidentified = getUnidentifiedCount();
    var viewed = viewedCellIds.size;
    if (total === 0) {
      var modalEmpty = document.getElementById('modal-save-block');
      if (modalEmpty) {
        modalEmpty.querySelector('.modal-message').textContent = '尚無細胞資料，無法儲存。';
        modalEmpty.classList.remove('hidden');
      }
      return;
    }
    if (unidentified > 0 || viewed < total) {
      var modal = document.getElementById('modal-save-block');
      if (modal) {
        var parts = [];
        if (viewed < total) parts.push('尚有 ' + (total - viewed) + ' 張細胞未檢視（請於主內容區捲動，使所有細胞曾進入視野）。');
        if (unidentified > 0) parts.push('尚有 Unidentified 未分類細胞（' + unidentified + '）。');
        modal.querySelector('.modal-message').textContent = parts.join(' ');
        modal.classList.remove('hidden');
      }
      return;
    }
    // 儲存並開啟報告核發前，先依目前細胞分類結果更新「人員編輯」數據
    computeEditedDiffFromCells();

    var modalEl = document.getElementById('report-issue-modal');
    var iframeEl = document.getElementById('report-issue-iframe');
    if (modalEl && iframeEl) {
      iframeEl.src = AppNav.reportIssueUrl(currentSpecimenId);
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

  function hideReportModal() {
    var modal = document.getElementById('report-issue-modal');
    if (modal) modal.classList.add('hidden');
  }

  /** 接收報告核發頁（iframe）的按鈕結果 */
  function onReportMessage(e) {
    var data = e.data || {};
    if (data.type === 'reportCancel') {
      hideReportModal();
      return;
    }
    if (data.type === 'reportManualAlert') {   // 規則 10：改為人工鏡檢
      var manualId = data.specimenId || currentSpecimenId;
      if (manualId && cellData && cellData.length) DemoStorage.saveEditedCells(manualId, cellData);
      SpecimenStore.applyStoredStatus();
      if (manualId && currentSpecimen && currentSpecimen.barcode === manualId) {
        currentSpecimen = SpecimenStore.getById(manualId) || currentSpecimen;
        digitalReviewList = getDigitalReviewList();
        renderSidebar();
      }
      hideReportModal();
      DemoStorage.queueManualReviewToast(manualId, data.addedFollowUp !== false, !!data.lisSynced);
      AppNav.goToSpecimenList({ preferMode: 'digital' });
      return;
    }
    if (data.type === 'reportFollowUpDone') {   // 規則 11：已拉片完成
      var followId = data.specimenId || currentSpecimenId;
      if (!followId) return;
      SpecimenStore.markFollowUpDone(followId);
      DemoStorage.queueFollowUpDoneToast(followId, WR.isCompleted(SpecimenStore.getById(followId)));
      hideReportModal();
      AppNav.goToSpecimenList();
      return;
    }
    if (data.type !== 'reportVerified') return;   // 規則 9：簽核
    var id = data.specimenId || currentSpecimenId;
    var spec = id ? SpecimenStore.signOffReport(id, {
      confirmAiOnVerify: !!data.confirmAiOnVerify,
      forceUnlockSignOff: !!data.forceUnlockSignOff
    }) : null;
    if (!spec) return;
    notifyReportIframeToRefresh();
    if (currentSpecimen && currentSpecimen.barcode === id) {
      digitalReviewList = getDigitalReviewList();
      renderSidebar();
    }
    hideReportModal();
    if (data.navigateNextDigitalReview) {   // 規則 9：自動開啟下一筆
      var nextPending = getNextPendingDigitalSpecimenAfter(id);
      if (nextPending && nextPending.barcode) {
        AppNav.switchImageReviewSpecimen(nextPending.barcode);
        return;
      }
    }
    if (spec.review.statusDone) DemoStorage.queueReportVerifiedToast(id, WR.isCompleted(spec));   // 只在回到清單時排入（直接開下一筆時不排，避免之後回到清單才跳出前一筆的提示）
    AppNav.goToSpecimenList({ preferMode: 'digital' });
  }

  function init() {
    AppUi.initFontLevel();
    zoomLevel = AppUi.initCellZoom();

    currentSpecimenId = AppNav.getSpecimenIdFromUrl();
    var allSpecimens = SpecimenStore.all();
    if (!currentSpecimenId && allSpecimens.length > 0) currentSpecimenId = allSpecimens[0].barcode;
    currentSpecimen = SpecimenStore.getById(currentSpecimenId) || allSpecimens[0] || null;
    currentSpecimenId = currentSpecimen ? currentSpecimen.barcode : '';   // 網址條碼不存在時，與實際顯示的檢體一致
    // 規則 6：鎖定中（他人編輯中）的檢體完全不能開啟（含以網址直接開啟）
    if (currentSpecimen && currentSpecimen.review.locked) { AppNav.goToSpecimenList(); return; }

    readOnlyMode = computeReadOnlyMode(currentSpecimen);
    digitalReviewList = getDigitalReviewList();
    viewedCellIds.clear();
    disconnectCellViewObserver();
    disconnectGridResizeObserver();
    cellData = getOrCreateCellData(currentSpecimenId);

    renderSidebar();
    renderCellGroups();
    setupGridResizeObserver();
    applyReadOnlyChrome();

    var backEl = document.getElementById('back-to-list');
    if (backEl) backEl.addEventListener('click', function (e) { e.preventDefault(); AppNav.goToSpecimenList(); });

    // 右鍵選單：點選其他地方或 Esc 關閉；選單本身不顯示瀏覽器右鍵選單
    var ctxMenu = document.getElementById('context-menu');
    document.addEventListener('click', function (e) {
      if (ctxMenu && !ctxMenu.contains(e.target)) hideContextMenu();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideContextMenu(); });
    if (ctxMenu) {
      ctxMenu.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      ctxMenu.querySelectorAll('.menu-item, .menu-item-danger').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cat = btn.getAttribute('data-category') || btn.textContent.trim();
          moveSelectedToCategory(cat);
          hideContextMenu();
        });
      });
    }

    // 單手模式：右鍵按住時左鍵點選
    document.addEventListener('mousedown', function (e) {
      if (e.button === 2) { rightMouseHeld = true; oneHandLmbCount = 0; oneHandUsed = false; }
    });
    document.addEventListener('mouseup', function (e) {
      if (e.button === 2) { rightMouseHeld = false; oneHandLmbCount = 0; }
    });

    var saveBtn = document.getElementById('btn-save-report');
    if (saveBtn) saveBtn.addEventListener('click', onSaveReport);

    // 細胞影像縮放
    var zoomEl = document.getElementById('zoom-value');
    function updateZoom(delta) {
      zoomLevel = AppUi.adjustCellZoom(delta);
      if (zoomEl) zoomEl.textContent = zoomLevel + '%';
      scheduleApplyZoom();
    }
    if (zoomEl) zoomEl.textContent = zoomLevel + '%';
    var zoomIn = document.getElementById('zoom-in');
    var zoomOut = document.getElementById('zoom-out');
    if (zoomIn) zoomIn.addEventListener('click', function () { updateZoom(10); });
    if (zoomOut) zoomOut.addEventListener('click', function () { updateZoom(-10); });
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(scheduleApplyZoom, 100);
    });

    // 字級
    var fontSmaller = document.getElementById('font-smaller');
    var fontLarger = document.getElementById('font-larger');
    if (fontSmaller) fontSmaller.addEventListener('click', function () { AppUi.adjustFontLevel(-1); scheduleApplyZoom(); });
    if (fontLarger) fontLarger.addEventListener('click', function () { AppUi.adjustFontLevel(1); scheduleApplyZoom(); });

    // 報告核發視窗
    var reportClose = document.getElementById('report-issue-close');
    var reportModal = document.getElementById('report-issue-modal');
    if (reportClose && reportModal) {
      reportClose.addEventListener('click', hideReportModal);
      reportModal.addEventListener('click', function (e) { if (e.target === reportModal) hideReportModal(); });
    }
    var modalClose = document.getElementById('modal-save-block-close');
    if (modalClose) modalClose.addEventListener('click', function () { document.getElementById('modal-save-block').classList.add('hidden'); });

    window.addEventListener('message', onReportMessage);
  }

  var initTries = 0;
  function runInit() {
    if (!document.getElementById('main-cell-groups')) {
      if (initTries < 20) { initTries++; setTimeout(runInit, 30); }
      return;
    }
    init();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runInit);
  else runInit();
})();
