/**
 * 情境模擬測試 — 情境切換、清單篩選、檢體狀態重置
 */
(function () {
  var STORAGE_KEY = (typeof AppConfig !== 'undefined' && AppConfig.STORAGE_KEYS && AppConfig.STORAGE_KEYS.USABILITY_SCENARIO)
    ? AppConfig.STORAGE_KEYS.USABILITY_SCENARIO
    : 'blood-morphology-usability-scenario';
  var baselineById = {};

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getAllScenarioSpecimenIdSet() {
    var ids = {};
    if (typeof APP_USABILITY_SCENARIOS === 'undefined') return ids;
    (APP_USABILITY_SCENARIOS.scenarios || []).forEach(function (sc) {
      (sc.specimenIds || []).forEach(function (id) { ids[id] = true; });
    });
    return ids;
  }

  function captureBaselines() {
    var idSet = getAllScenarioSpecimenIdSet();
    if (!idSet || typeof APP_DATABASE === 'undefined' || !APP_DATABASE.specimens) return;
    APP_DATABASE.specimens.forEach(function (s) {
      if (idSet[s.id]) baselineById[s.id] = deepClone(s);
    });
  }

  captureBaselines();

  function getScenarioList() {
    if (typeof APP_USABILITY_SCENARIOS === 'undefined') return [];
    return APP_USABILITY_SCENARIOS.scenarios || [];
  }

  function getScenarioById(id) {
    if (!id) return APP_USABILITY_SCENARIOS && APP_USABILITY_SCENARIOS.normal ? APP_USABILITY_SCENARIOS.normal : null;
    var list = getScenarioList();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function getActiveScenarioId() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function getActiveScenario() {
    return getScenarioById(getActiveScenarioId());
  }

  function isActive() {
    return !!getActiveScenarioId();
  }

  function getStatusStorageKey() {
    return typeof APP_SPECIMEN_STATUS_STORAGE_KEY !== 'undefined'
      ? APP_SPECIMEN_STATUS_STORAGE_KEY
      : 'blood-morphology-specimen-status';
  }

  function restoreSpecimenFromBaseline(specimenId) {
    if (typeof APP_DATABASE === 'undefined' || !APP_DATABASE.specimens) return;
    var baseline = baselineById[specimenId];
    if (!baseline) return;
    var spec = APP_DATABASE.specimens.find(function (s) { return s.id === specimenId; });
    if (!spec) return;
    var restored = deepClone(baseline);
    Object.keys(restored).forEach(function (key) {
      spec[key] = restored[key];
    });
    if (typeof normalizeWorkflowDone === 'function') {
      spec.workflowDone = normalizeWorkflowDone(spec.workflowDone, spec.statusDone);
    }
    if (typeof computeSpecimenStatusDoneFromWorkflow === 'function') {
      spec.statusDone = computeSpecimenStatusDoneFromWorkflow(spec.status, spec.workflowDone);
    }
    /** 成效調查還原：非 Follow-up 已完成陷阱者，強制回到待辦（避免 statusDone 導致數位清單缺筆） */
    var isFollowUpDoneTrap = spec.statusDone === true
      && Array.isArray(spec.status)
      && spec.status.indexOf('Follow-up') !== -1;
    if (!isFollowUpDoneTrap && spec.statusDone === true) {
      spec.statusDone = false;
      spec.editor = '';
      spec.workflowDone = {
        digitalReview: false,
        digitalReviewSignedOff: false,
        aiAlertConfirmed: false,
        entityReview: false,
        entityStatusDone: {}
      };
      var entitySet = typeof ENTITY_REVIEW_STATUS_SET !== 'undefined'
        ? ENTITY_REVIEW_STATUS_SET
        : ['PLT Check', 'Follow-up'];
      (spec.status || []).forEach(function (k) {
        if (entitySet.indexOf(k) !== -1) spec.workflowDone.entityStatusDone[k] = false;
      });
      if (typeof computeSpecimenStatusDoneFromWorkflow === 'function') {
        spec.statusDone = computeSpecimenStatusDoneFromWorkflow(spec.status, spec.workflowDone);
      }
    } else if (typeof isSpecimenWorkflowCompleted === 'function' && !isSpecimenWorkflowCompleted(spec)) {
      spec.editor = '';
    }
  }

  function clearStorageOverridesForIds(specimenIds) {
    try {
      var raw = localStorage.getItem(getStatusStorageKey());
      if (!raw) return;
      var map = JSON.parse(raw);
      if (!map || typeof map !== 'object') return;
      (specimenIds || []).forEach(function (id) { delete map[id]; });
      localStorage.setItem(getStatusStorageKey(), JSON.stringify(map));
    } catch (e) {}
  }

  function clearEditedCellsForIds(specimenIds) {
    var prefix = typeof APP_EDITED_CELLS_STORAGE_PREFIX !== 'undefined'
      ? APP_EDITED_CELLS_STORAGE_PREFIX
      : 'editedCells:';
    (specimenIds || []).forEach(function (id) {
      try { localStorage.removeItem(prefix + id); } catch (e) {}
    });
  }

  function resetScenarioSpecimenStates(specimenIds) {
    clearStorageOverridesForIds(specimenIds);
    clearEditedCellsForIds(specimenIds);
    (specimenIds || []).forEach(restoreSpecimenFromBaseline);
  }

  function filterSpecimensForList(allSpecimens) {
    var scenario = getActiveScenario();
    if (!scenario || !scenario.specimenIds || !Array.isArray(scenario.specimenIds)) {
      return allSpecimens;
    }
    var order = {};
    scenario.specimenIds.forEach(function (id, idx) { order[id] = idx; });
    return (allSpecimens || [])
      .filter(function (s) { return order[s.id] !== undefined; })
      .sort(function (a, b) { return order[a.id] - order[b.id]; });
  }

  function applyScenario(scenarioId) {
    var prev = getActiveScenario();
    var prevIds = prev && prev.specimenIds ? prev.specimenIds.slice() : [];
    var nextId = scenarioId || '';
    var next = getScenarioById(nextId);

    if (prevIds.length) resetScenarioSpecimenStates(prevIds);
    if (next && next.specimenIds && next.specimenIds.length) {
      resetScenarioSpecimenStates(next.specimenIds);
    }

    try {
      if (nextId) localStorage.setItem(STORAGE_KEY, nextId);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    return { ok: true, scenario: next || getScenarioById('') };
  }

  function buildParticipantTaskHtml(scenario) {
    if (!scenario || !scenario.taskCard) return '';
    return [
      '<div class="mt-3 p-2.5 rounded-md bg-indigo-50 border border-indigo-200">',
      '<p class="text-xs font-medium text-indigo-800 mb-1">任務說明</p>',
      '<p class="text-sm text-indigo-950 leading-relaxed whitespace-pre-line">',
      scenario.taskCard,
      '</p>',
      '</div>'
    ].join('');
  }

  function buildSettingsPanelHtml(selectedId) {
    var html = [
      '<p class="text-xs text-text-muted-light leading-relaxed mb-3">',
      '選擇測試情境後，檢體清單僅顯示該情境專屬檢體，並重置狀態篩選為<strong>全勾</strong>；',
      '套用後<strong>不預設</strong>數位／實體模式（兩側按鈕皆不反白），由受試者自行切換。',
      '</p>',
      '<div class="space-y-2">'
    ];
    var normal = APP_USABILITY_SCENARIOS && APP_USABILITY_SCENARIOS.normal;
    var normalId = normal ? normal.id : '';
    var normalTitle = normal ? normal.title : '正式清單';
    html.push(
      '<label class="flex items-start gap-2 p-2.5 rounded-md border border-border-light cursor-pointer hover:bg-gray-50">',
      '<input type="radio" name="usability-scenario" class="mt-0.5 text-primary focus:ring-primary" value=""',
      (!selectedId ? ' checked' : ''), '/>',
      '<span><span class="font-medium text-sm text-text-light">', normalTitle, '</span>',
      '<span class="block text-xs text-text-muted-light mt-0.5">顯示完整模擬資料庫清單</span></span></label>'
    );
    getScenarioList().forEach(function (sc) {
      html.push(
        '<label class="flex items-start gap-2 p-2.5 rounded-md border border-border-light cursor-pointer hover:bg-gray-50">',
        '<input type="radio" name="usability-scenario" class="mt-0.5 text-primary focus:ring-primary" value="', sc.id, '"',
        (selectedId === sc.id ? ' checked' : ''), '/>',
        '<span><span class="font-medium text-sm text-text-light">', sc.title, '</span>',
        '<span class="block text-xs text-text-muted-light mt-0.5">',
        (sc.specimenIds ? sc.specimenIds.length + ' 筆檢體' : ''),
        '</span></span></label>'
      );
    });
    html.push('</div>');
    if (selectedId) {
      html.push(buildParticipantTaskHtml(getScenarioById(selectedId)));
    }
    return html.join('');
  }

  function getSelectedScenarioIdFromPanel() {
    var root = document.getElementById('modal-scenario-simulation-body');
    if (!root) return '';
    var checked = root.querySelector('input[name="usability-scenario"]:checked');
    return checked ? checked.value : '';
  }

  window.UsabilityStudy = {
    getActiveScenarioId: getActiveScenarioId,
    getActiveScenario: getActiveScenario,
    isActive: isActive,
    filterSpecimensForList: filterSpecimensForList,
    applyScenario: applyScenario,
    buildSettingsPanelHtml: buildSettingsPanelHtml,
    getSelectedScenarioIdFromPanel: getSelectedScenarioIdFromPanel,
    getScenarioList: getScenarioList
  };
})();
