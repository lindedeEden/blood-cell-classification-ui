/**
 * 血球分類軟體 - 使用者教學（步驟式高亮導覽、跨頁）
 * 檢體管理 → 影像檢視與細胞編輯 → 報告核發
 */
(function () {
  var STORAGE_KEY_COMPLETED = 'bloodCellTutorialCompleted';
  var STORAGE_KEY_PHASE = 'bloodCellTutorialPhase';
  var STORAGE_KEY_STEP = 'bloodCellTutorialStep';

  function getState() {
    return {
      completed: localStorage.getItem(STORAGE_KEY_COMPLETED) === '1',
      phase: localStorage.getItem(STORAGE_KEY_PHASE) || '',
      step: parseInt(localStorage.getItem(STORAGE_KEY_STEP) || '0', 10)
    };
  }

  function setState(completed, phase, step) {
    if (completed !== undefined) localStorage.setItem(STORAGE_KEY_COMPLETED, completed ? '1' : '');
    if (phase !== undefined) localStorage.setItem(STORAGE_KEY_PHASE, phase);
    if (step !== undefined) localStorage.setItem(STORAGE_KEY_STEP, String(step));
  }

  var SPECIMEN_STEPS = [
    { selector: null, title: '歡迎使用', body: '本教學將帶您走過完整流程：<strong>檢體管理</strong> → <strong>影像檢視與細胞編輯</strong> → <strong>報告核發</strong>。請依序操作，或隨時可跳過。' },
    { selector: '#tutorial-specimen-full', title: '檢體管理 — 整體介面', body: '本頁分為<strong>左側</strong>與<strong>右側</strong>：左側為篩選區與檢體列表，右側為檢體總覽。系統預設篩選<strong>當日檢體</strong>避免資料混雜；您可切換數位閱片／實體作業模式，並自訂篩選條件。以下依<strong>左上 → 左下 → 右上 → 右下</strong>介紹各區塊。' },
    { selector: '#tutorial-area-tl', title: '左上：篩選與模式', body: '<strong>數位閱片／實體作業</strong>：切換工作模式。數位閱片預設顯示待閱片檢體；實體作業預設顯示需推片或實體採血管確認的檢體。<br/><strong>篩選</strong>：點擊可展開檢體狀態勾選（PLT Check、Digital Review 等），勾選自訂要顯示的狀態。<br/><strong>檢驗日期、送檢單位、機台、檢體搜尋</strong>：可依日期區間、單位、機台、檢體 ID／病歷號篩選，並用「僅顯示完全相符項」縮小範圍。' },
    { selector: '#tutorial-specimen-list', title: '左下：檢體列表與狀態膠囊', body: '檢體列表顯示每筆檢體的資訊，包含<strong>狀態膠囊</strong>：<br/><br/>' +
      '<strong>狀態膠囊說明：</strong><br/>' +
      '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 mr-1">PLT Check</span> 血小板與前次差異大，需人工鏡檢。<br/>' +
      '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800 mr-1">AI Alert</span> AI 辨識達留單標準，警示關注。<br/>' +
      '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 mr-1">Follow-up</span> LIS 標記需推片確認之檢體，表曾出現異常血球，需追蹤本次結果。<br/>' +
      '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">Digital Review</span> AI 分類無異常血球，待人工數位閱片確認。<br/>' +
      '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 mr-1">Verified</span> 已簽核完成。<br/>' +
      '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-800 mr-1">Locked</span> 已鎖定，有其他使用者正在編輯。' },
    { selector: '#tutorial-sidebar-header', title: '右上：檢體總覽標題', body: '右側上方顯示<strong>檢體總覽</strong>標題與目前選取檢體的 ID。點選左側列表任一列後，此區會對應顯示該筆檢體。' },
    { selector: '#tutorial-sidebar-body', title: '右下：檢體資訊與分析', body: '右側下方顯示選取檢體的<strong>檢體資訊</strong>（病歷號、姓名、科別等）與<strong>分析與歷史報告</strong>（流式計數、AI、前次報告）。未選取時會提示「請從左側列表點選一筆檢體，或雙擊進入閱片」。' },
    { selector: '#specimen-tbody', title: '進入下一階段', body: '請<strong>雙擊任一檢體列</strong>，或先點選一列後點該列右側的<strong>「進入閱片」</strong>按鈕，即可進入影像檢視與細胞編輯頁面，教學將在該頁繼續。' }
  ];

  var IMAGE_STEPS = [
    { selector: null, title: '影像檢視 — 整體介面', body: '本頁分為<strong>左側</strong>與<strong>右側</strong>：左側為檢體資訊、狀態、搜尋與分析表；右側為細胞圖卡與工具列。以下依<strong>左上 → 左下 → 右上 → 右下</strong>介紹各區塊。' },
    { selector: '#tutorial-image-tl', title: '左上：導航與狀態', body: '<strong>返回列表</strong>：回到檢體管理。<br/><strong>檢體 ID</strong>：目前檢體編號。<br/><strong>狀態膠囊</strong>：該檢體的狀態膠囊。<br/><strong>Add Flag</strong>：醫檢師可手動為整筆檢體新增狀態標記（當人工發現 AI 未辨識到異常時使用），勾選後寫入檢體。<br/><strong>搜尋、上一筆／下一筆</strong>：切換檢體。' },
    { selector: '#tutorial-image-bl', title: '左下：檢體資訊與分析', body: '<strong>檢體資訊</strong>：可展開／收合，顯示病歷號、科別、機台、歸位等。<br/><strong>分析與歷史報告</strong>：流式計數、AI、前次報告等數據表格，異常值會以紅色標示。異常標準參照林口長庚醫院留單標準。' },
    { selector: '#tutorial-image-tr', title: '右上：工具列', body: '<strong>檢視進度</strong>：進度條顯示目前閱片完成度。<br/><strong>縮放</strong>：50%～200% 調整細胞圖卡大小。<br/><strong>儲存並核發報告</strong>：編輯完成且達標後，點擊可開啟報告核發畫面。' },
    { selector: '#main-cell-groups', title: '右下：細胞區塊', body: '依分類群組顯示細胞圖卡（Segmented、Lymphocyte、Blast 等）。<br/><strong>選取</strong>：單選（左鍵）、多選（Ctrl + 左鍵）、範圍選（Shift + 左鍵，限同一群組）、單手模式（按住右鍵 + 左鍵點多顆 → 放開右鍵開選單）。<br/><strong>編輯</strong>：右鍵選單「移至某分類」或拖曳到另一群組，可批次改分類。' },
    { selector: '#btn-save-report', title: '進入報告核發', body: '編輯完成且無未分類細胞、檢視進度達標後，點擊<strong>「儲存並核發報告」</strong>會開啟報告核發畫面。請點擊此按鈕繼續教學。' }
  ];

  var REPORT_STEPS = [
    { selector: null, title: '報告核發 — 整體介面', body: '本頁用於確認數據後簽核。依<strong>左上 → 左下 → 右上 → 右下</strong>：左上為標題與風險、左下為 WBC 表、右上為病患資訊、右下為其他發現與 CBC。底部為簽核按鈕。' },
    { selector: '#tutorial-report-tl', title: '左上：標題與風險橫幅', body: '<strong>檢體編號與狀態膠囊</strong>：目前檢體與其狀態膠囊。<br/><strong>風險橫幅</strong>：依留單條件顯示紅（需留單）／黃（異常未達留單）／綠（正常）。' },
    { selector: '#tutorial-report-bl', title: '左下：血球分類計數 (WBC)', body: '表格依細胞類型列出<strong>流式計數、AI、人員編輯、前次報告</strong>等數據。人員編輯欄為藍底標示。' },
    { selector: '#tutorial-report-tr', title: '右上：病患資訊', body: '顯示檢體編號、病歷號、姓名（性別）、生日（年齡）、檢體來源、機台、檢體歸位等。' },
    { selector: '#tutorial-report-br', title: '右下：其他發現與 CBC', body: '<strong>其他發現</strong>：NRBC、Giant PLT、Megakaryocyte、Smudge cell、Artefact 等。<br/><strong>CBC 數值</strong>：WBC、RBC、Hb、HCT、MCV、MCH、MCHC、PLT。' },
    { selector: '#confirm-btn', title: '確認並簽核', body: '確認數據無誤後，點擊<strong>「確認並簽核」</strong>。該檢體會標記為已完成，Digital Review 會變為綠色打勾，並關閉報告視窗、導回檢體管理。' },
    { selector: null, title: '教學完成', body: '您已完成完整流程教學。之後可從檢體管理頁頂部<strong>「使用教學」</strong>隨時重新觀看。祝您使用順利。' }
  ];

  function getStepsForPage(page) {
    if (page === 'specimen') return SPECIMEN_STEPS;
    if (page === 'image') return IMAGE_STEPS;
    if (page === 'report') return REPORT_STEPS;
    return [];
  }

  var overlay = null;
  var spotlight = null;
  var card = null;

  function createOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.className = 'tutorial-overlay';
    spotlight = document.createElement('div');
    spotlight.id = 'tutorial-spotlight';
    spotlight.className = 'tutorial-spotlight';
    card = document.createElement('div');
    card.id = 'tutorial-card';
    card.className = 'tutorial-card';
    card.innerHTML = '<div class="tutorial-card-title"></div><div class="tutorial-card-body"></div><div class="tutorial-card-actions"><button type="button" class="tutorial-btn tutorial-btn-skip">跳過</button><span class="tutorial-card-dots"></span><div class="tutorial-card-nav"><button type="button" class="tutorial-btn tutorial-btn-prev">上一步</button><button type="button" class="tutorial-btn tutorial-btn-next">下一步</button></div></div>';
    overlay.appendChild(spotlight);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
    return overlay;
  }

  function getRect(el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, left: r.left + window.scrollX, width: r.width, height: r.height };
  }

  function positionSpotlight(selector, container) {
    var doc = container && container.ownerDocument ? container.ownerDocument : document;
    var root = doc.body;
    if (!spotlight) return;
    if (!selector) {
      spotlight.style.display = 'none';
      return;
    }
    var el = root.querySelector(selector);
    if (!el) {
      spotlight.style.display = 'none';
      return;
    }
    var r = el.getBoundingClientRect();
    spotlight.style.display = 'block';
    spotlight.style.top = r.top + 'px';
    spotlight.style.left = r.left + 'px';
    spotlight.style.width = r.width + 'px';
    spotlight.style.height = r.height + 'px';
  }

  function showStep(page, index, fromHelp) {
    var steps = getStepsForPage(page);
    if (index >= steps.length) {
      if (page === 'specimen') {
        setState(undefined, 'image', 0);
        closeTutorial();
        return;
      }
      if (page === 'image') {
        setState(undefined, 'report', 0);
        closeTutorial();
        return;
      }
      if (page === 'report') {
        setState(true, '', 0);
        closeTutorial();
        return;
      }
      closeTutorial();
      return;
    }
    var step = steps[index];
    setState(undefined, page, index);
    createOverlay();
    overlay.classList.add('tutorial-visible');
    var titleEl = card.querySelector('.tutorial-card-title');
    var bodyEl = card.querySelector('.tutorial-card-body');
    var nextBtn = card.querySelector('.tutorial-btn-next');
    var prevBtn = card.querySelector('.tutorial-btn-prev');
    var skipBtn = card.querySelector('.tutorial-btn-skip');
    var dotsEl = card.querySelector('.tutorial-card-dots');
    titleEl.textContent = step.title;
    bodyEl.innerHTML = step.body;
    var isLast = index === steps.length - 1;
    nextBtn.textContent = isLast ? '完成' : '下一步';
    prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    skipBtn.style.display = fromHelp ? 'none' : 'inline-flex';
    dotsEl.textContent = (index + 1) + ' / ' + steps.length;
    positionSpotlight(step.selector, document);
    prevBtn.onclick = function () { showStep(page, index - 1, fromHelp); };
    nextBtn.onclick = function () {
      if (isLast && page === 'specimen') {
        setState(undefined, 'image', 0);
        closeTutorial();
        return;
      }
      if (isLast && page === 'image') {
        setState(undefined, 'report', 0);
        closeTutorial();
        return;
      }
      if (isLast && page === 'report') {
        setState(true, '', 0);
        closeTutorial();
        return;
      }
      showStep(page, index + 1, fromHelp);
    };
    skipBtn.onclick = function () {
      setState(true, '', 0);
      closeTutorial();
    };
  }

  function closeTutorial() {
    if (overlay) {
      overlay.classList.remove('tutorial-visible');
    }
  }

  function startSpecimenTutorial(fromHelp) {
    fromHelp = !!fromHelp;
    showStep('specimen', 0, fromHelp);
  }

  function startImageTutorial(fromHelp) {
    fromHelp = !!fromHelp;
    showStep('image', 0, fromHelp);
  }

  function startReportTutorial(fromHelp) {
    fromHelp = !!fromHelp;
    showStep('report', 0, fromHelp);
  }

  function runOnSpecimenPage() {
    var state = getState();
    if (state.completed && !state.phase) return;
    var fromHelp = typeof window.startTutorialFromHelp !== 'undefined' && window.startTutorialFromHelp;
    if (state.phase === 'image' || state.phase === 'report') return;
    if (state.phase === 'specimen' || state.phase === '') {
      if (!fromHelp && state.completed) return;
      if (fromHelp) {
        startSpecimenTutorial(true);
        return;
      }
      startSpecimenTutorial(false);
    }
  }

  function runOnImagePage() {
    var state = getState();
    if (state.phase !== 'image') return;
    startImageTutorial(false);
  }

  function runOnReportPage() {
    var state = getState();
    if (state.phase !== 'report') return;
    startReportTutorial(false);
  }

  window.Tutorial = {
    getState: getState,
    setState: setState,
    startSpecimen: startSpecimenTutorial,
    startImage: startImageTutorial,
    startReport: startReportTutorial,
    close: closeTutorial,
    runOnSpecimenPage: runOnSpecimenPage,
    runOnImagePage: runOnImagePage,
    runOnReportPage: runOnReportPage
  };
})();
