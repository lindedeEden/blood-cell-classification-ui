/**
 * 【展示用】情境模擬測試（可用性研究）— 情境切換、清單篩選、檢體狀態重置
 *
 * 不屬於正式功能：移除 demo/ 資料夾與各頁載入的 demo 腳本後，系統照常運作。
 * 情境內容定義在 demo/usability-scenarios.js（APP_USABILITY_SCENARIOS）。
 *
 * 必須在 assets/js/core/specimen-store.js 之前載入：
 * 載入時先記下各情境檢體的原始資料，套用情境時用來還原狀態。
 */
(function () {
  'use strict';

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
      if (idSet[s.barcode]) baselineById[s.barcode] = deepClone(s);
    });
  }

  captureBaselines();

  /** 情境模擬測試啟用時，套用研究當時的進線資料（APP_USABILITY_SCENARIOS.studyIntakeOverrides） */
  function applyStudyIntakeOverride(spec) {
    var map = (typeof APP_USABILITY_SCENARIOS !== 'undefined' && APP_USABILITY_SCENARIOS.studyIntakeOverrides) || {};
    var ov = spec && map[spec.barcode];
    if (!ov) return;
    // 覆寫內容依資料來源分組（例：{ lis: { smearRequiredNote: false } }）
    Object.keys(ov).forEach(function (group) { Object.assign(spec[group], ov[group]); });
  }

  // 頁面載入時若已在情境模擬中，於 SpecimenStore 初始化（依進線資料加膠囊）之前套用
  // （本檔在 storage.js 之前載入，直接讀 localStorage 的情境 key）
  var activeAtLoad = '';
  try { activeAtLoad = localStorage.getItem(AppConfig.STORAGE_KEYS.USABILITY_SCENARIO) || ''; } catch (e) { activeAtLoad = ''; }
  if (activeAtLoad && typeof APP_DATABASE !== 'undefined' && APP_DATABASE.specimens) {
    APP_DATABASE.specimens.forEach(applyStudyIntakeOverride);
  }

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
    return DemoStorage.getUsabilityScenarioId();
  }

  function getActiveScenario() {
    return getScenarioById(getActiveScenarioId());
  }

  function isActive() {
    return !!getActiveScenarioId();
  }

  function restoreSpecimenFromBaseline(specimenId) {
    if (typeof APP_DATABASE === 'undefined' || !APP_DATABASE.specimens) return;
    var baseline = baselineById[specimenId];
    if (!baseline) return;
    var spec = APP_DATABASE.specimens.find(function (s) { return s.barcode === specimenId; });
    if (!spec) return;
    var restored = deepClone(baseline);
    Object.keys(restored).forEach(function (key) {
      // 進線資料整組還原；處理狀態只還原基準裡有的欄位（editor、locked，展示用已完成檢體另含 workflowDone），
      // 流程旗標沿用目前狀態，與研究當時的行為相同
      if (key === 'review') Object.assign(spec.review, restored.review);
      else spec[key] = restored[key];
    });
    if (isActive()) applyStudyIntakeOverride(spec);   // 情境模擬：研究當時的進線資料
    spec.review.status = WorkflowRules.intakeStatus(spec);   // 依進線資料重新產生膠囊（規則 1～3）
    spec.review.workflowDone = WorkflowRules.normalizeWorkflowDone(spec.review.workflowDone);
    spec.review.statusDone = WorkflowRules.computeStatusDone(spec.review.status, spec.review.workflowDone);
    /** 成效調查還原：非 Follow-up 已完成陷阱者，強制回到待辦（避免 statusDone 導致數位清單缺筆） */
    var isFollowUpDoneTrap = spec.review.statusDone === true
      && Array.isArray(spec.review.status)
      && spec.review.status.indexOf('Follow-up') !== -1;
    if (!isFollowUpDoneTrap && spec.review.statusDone === true) {
      spec.review.statusDone = false;
      spec.review.editor = '';
      spec.review.workflowDone = WorkflowRules.emptyWorkflow();
      (spec.review.status || []).forEach(function (k) {
        if (WorkflowRules.ENTITY_STATUSES.indexOf(k) !== -1) spec.review.workflowDone.entityStatusDone[k] = false;
      });
      spec.review.statusDone = WorkflowRules.computeStatusDone(spec.review.status, spec.review.workflowDone);
    } else if (!WorkflowRules.isCompleted(spec)) {
      spec.review.editor = '';
    }
  }

  function resetScenarioSpecimenStates(specimenIds) {
    DemoStorage.removeStatusEntries(specimenIds);
    (specimenIds || []).forEach(DemoStorage.removeEditedCells);
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
      .filter(function (s) { return order[s.barcode] !== undefined; })
      .sort(function (a, b) { return order[a.barcode] - order[b.barcode]; });
  }

  function applyScenario(scenarioId) {
    var prev = getActiveScenario();
    var prevIds = prev && prev.specimenIds ? prev.specimenIds.slice() : [];
    var nextId = scenarioId || '';
    var next = getScenarioById(nextId);

    // 先記下要切換到的情境，還原檢體時才知道是否套用研究當時的進線資料
    DemoStorage.setUsabilityScenarioId(nextId);
    if (prevIds.length) resetScenarioSpecimenStates(prevIds);
    if (next && next.specimenIds && next.specimenIds.length) {
      resetScenarioSpecimenStates(next.specimenIds);
    }

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

  // ─── 檢體管理頁的「情境模擬測試」面板 ─────────────────────
  /**
   * 由 assets/js/pages/specimen-list.js 呼叫，傳入清單頁提供的操作：
   *  listApi.resetFilters()  重設模式與篩選條件
   *  listApi.refresh()       清除選取並重繪清單
   *  listApi.setFooter(text) 更新頁尾狀態列
   */
  function attachToSpecimenList(listApi) {
    var modal = document.getElementById('modal-scenario-simulation');
    var body = document.getElementById('modal-scenario-simulation-body');
    if (!modal || !body) return;

    function buildForm(previewId) {
      var selectedId = (previewId !== undefined && previewId !== null) ? previewId : getActiveScenarioId();
      body.innerHTML = buildSettingsPanelHtml(selectedId);
      body.querySelectorAll('input[name="usability-scenario"]').forEach(function (radio) {
        radio.addEventListener('change', function () { buildForm(getSelectedScenarioIdFromPanel()); });
      });
    }
    function open() { buildForm(); modal.classList.remove('hidden'); }
    function close() { modal.classList.add('hidden'); }
    function showActiveScenarioInFooter() {
      var scenario = getActiveScenario();
      if (scenario && scenario.id) listApi.setFooter('情境模擬測試：' + scenario.title);
    }
    function apply() {
      var nextId = getSelectedScenarioIdFromPanel();
      applyScenario(nextId);
      if (nextId) listApi.resetFilters();
      listApi.refresh();
      showActiveScenarioInFooter();
      var sc = getActiveScenario();
      listApi.setFooter(sc && sc.id ? ('已套用：' + sc.title) : '已還原正式清單');
      close();
    }

    var openBtn = document.getElementById('btn-scenario-simulation');
    if (openBtn) openBtn.addEventListener('click', open);
    ['modal-scenario-simulation-close', 'modal-scenario-simulation-backdrop', 'modal-scenario-simulation-cancel'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', close);
    });
    var applyBtn = document.getElementById('modal-scenario-simulation-apply');
    if (applyBtn) applyBtn.addEventListener('click', apply);
    showActiveScenarioInFooter();
  }

  window.UsabilityStudy = {
    getActiveScenarioId: getActiveScenarioId,
    getActiveScenario: getActiveScenario,
    isActive: isActive,
    filterSpecimensForList: filterSpecimensForList,
    applyScenario: applyScenario,
    getScenarioList: getScenarioList,
    attachToSpecimenList: attachToSpecimenList
  };
})();
