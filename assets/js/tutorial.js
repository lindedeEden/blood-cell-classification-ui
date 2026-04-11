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
    {
      selector: null,
      title: '歡迎使用',
      body: '本介面為<strong>前端示範（Demo）</strong>，模組化呈現林口長庚檢驗醫學科血液組血球型態閱片流程；資料來自內建模擬資料庫，部分狀態會寫入瀏覽器本機儲存空間以便連續操作。<br/>本教學將依序導覽：<strong>檢體管理</strong> → <strong>影像檢視與細胞編輯</strong> → <strong>報告核發</strong>。'
    },
    {
      selector: '#tutorial-specimen-full',
      title: '檢體管理 — 整體介面',
      body: '本頁<strong>左側</strong>為模式選擇、條件篩選與檢體列表，<strong>右側</strong>為檢體資訊總覽。<br/>實際工作情況下有多位醫檢師同步使用軟體，因此<strong>數位閱片／實體作業</strong>用於分流醫檢師待辦工作；右側整合流式計數、AI 判讀結果與前次報告對照，減少跨系統查詢。'
    },
    {
      selector: '#tutorial-area-tl',
      title: '左上：篩選與模式',
      body: '<strong>數位閱片模式</strong>：優先列出仍需完成數位閱片之檢體（含 Digital Review 且未完成者），負責鏡檢醫檢師為主要使用者。<br/><br/>' +
        '<strong>實體作業模式</strong>：列出需拉片、血小板或 AI／人工警示等需實體處置者，負責核發 LIS 報告之醫檢師為主要使用者；同一模式再點一次可還原為較寬鬆篩選。<br/><br/>' +
        '<strong>篩選</strong>：可勾選 PLT Check、AI Alert、Follow-up、Digital Review、Manual Alert、Verified、Locked 等，與模式並用時仍可微調。<br/><br/>' +
        '<strong>檢驗日期／單位／機台／搜尋</strong>：支援多條件；表頭<strong>時效、檢體 ID、分析時間</strong>可排序。'
    },
    {
      selector: '#tutorial-specimen-list',
      title: '左下：列表、膠囊與編輯人員',
      body: '<strong>狀態膠囊</strong>標示待辦類型；完成後會轉為綠底打勾（依各流程而定）。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 mr-1">PLT Check</span> 血小板需鏡檢確認。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800 mr-1">AI Alert</span> AI 達留單標準之警示。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 mr-1">Follow-up</span> 病史追蹤或需追蹤之檢體。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">Digital Review</span> 需數位閱片。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-950 mr-1">Manual Alert</span> 當 Digital Review 出現 AI 遺漏之異常，閱片中改為需人工鏡檢時標記（與 Digital Review 互斥）。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-800 mr-1">Locked</span> 他人編輯中，請勿由此進入編輯閱片。<br/><br/>' +
        '在<strong>實體作業</strong>模式下，因不進入數位閱片，直接點擊 PLT／Follow-up／AI Alert／Manual Alert 膠囊即可切換完成狀態；<strong>操作機台／檢體歸位</strong>協助實體作業醫檢師回頭找玻片與採血管位置，減少跨系統查詢。'
    },
    {
      selector: '#tutorial-sidebar-header',
      title: '右上：檢體總覽',
      body: '顯示<strong>檢體總覽</strong>與目前選取之檢體 ID；點列表列即可切換，無需離開本頁。<br/>右上角<strong>系統設定</strong>可調整留單門檻（與影像頁、報告風險判讀共用）。'
    },
    {
      selector: '#tutorial-sidebar-body',
      title: '右下：檢體資訊與分析',
      body: '<strong>檢體資訊</strong>含病歷號、科別、機台、歸位等。<strong>分析與歷史報告</strong>並列流式、AI 判讀結果與前次報告；異常達留單門檻者以<strong>紅色</strong>強調（門檻可於右上角系統設定調整）。前次報告表頭會顯示週期（例如 7 天前），方便醫檢師判斷。'
    },
    {
      selector: '#specimen-tbody',
      title: '進入影像閱片',
      body: '<strong>雙擊</strong>列或點<strong>進入閱片</strong>可開啟影像檢視（<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-800 mr-1">Locked</span> 列無法進入編輯）。<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">Digital Review</span> 數位閱片<strong>已完成</strong>者可點<strong>唯讀檢視</strong>，僅能瀏覽與縮放，無法改分類或核發；若需重開編輯，可在該列<strong>右鍵選單</strong>（於符合條件時）選擇退回 Digital Review。'
    }
  ];

  var IMAGE_STEPS = [
    {
      selector: null,
      title: '影像檢視 — 整體介面',
      body: '於此頁<strong>同畫面</strong>完成細胞閱片與數據對照。<br/>版面為<strong>左側</strong>導航與分析、<strong>右側</strong>細胞群組與工具列。異常群組（如 Blast）會置頂並以紅色樣式凸顯。'
    },
    {
      selector: '#tutorial-image-tl',
      title: '左上：導航與狀態',
      body: '<strong>返回列表</strong>：回檢體管理。<br/><strong>檢體 ID</strong>：目前閱片檢體。<br/><strong>狀態膠囊</strong>：與列表一致；可用 <strong>Add Flag</strong> 補標（如 PLT、Follow-up）；其中 <strong>Manual Alert</strong> 與 <strong>Digital Review</strong> 互斥。<br/><strong>搜尋／上一筆／下一筆</strong>：在<strong>待數位閱片</strong>清單中切換，會<strong>略過 Locked</strong>。<br/>側欄搜尋可輸入檢體 ID 後 Enter 切換（鎖定檢體或已完成檢體進入後為唯讀）。'
    },
    {
      selector: '#tutorial-image-bl',
      title: '左下：檢體資訊與分析',
      body: '<strong>檢體資訊</strong>可展開／收合。<strong>分析與歷史報告</strong>並列流式、AI 判讀結果與前次報告；異常值紅色標示（門檻與檢體管理「系統設定」一致）。'
    },
    {
      selector: '#tutorial-image-tr',
      title: '右上：工具列',
      body: '<strong>檢視進度</strong>：已檢視細胞數與總細胞數。<br/><strong>縮放</strong>：50%～200%。<br/><strong>儲存並核發報告</strong>：唯讀模式下無法使用。若尚有 Unidentified 或進度未滿，會阻擋並提示；通過後開啟<strong>報告核發</strong>視窗（iframe），於其中確認資料並簽核。'
    },
    {
      selector: '#main-cell-groups',
      title: '右下：細胞區塊與編輯',
      body: '依類別分群；達留單門檻之群組會強調。<br/><strong>選取方式</strong>：<strong>左鍵</strong>單選、<strong>Ctrl+左鍵</strong>多選、同群組內 <strong>Shift+左鍵</strong>範圍選。<br/><strong>編輯方式</strong>：選取後拖曳編輯，或右鍵開啟分類選單。<br/><strong>單手模式</strong>：長按右鍵同時以左鍵依序定錨點與範圍進行框選；選取後在圖上放開右鍵開啟分類選單。選單含 AI 建議與分層捷徑。'
    },
    {
      selector: '#btn-save-report',
      title: '進入報告核發',
      body: '完成分類與檢視後點<strong>儲存並核發報告</strong>開啟核發畫面。以下步驟將在報告核發頁繼續說明風險橫幅、四欄比對與簽核。'
    }
  ];

  var REPORT_STEPS = [
    {
      selector: null,
      title: '報告核發 — 整體介面',
      body: '簽核前請在此<strong>最後一次</strong>比對流式、AI 判讀結果、閱片中調整後的<strong>人員編輯</strong>結果、前次報告與 CBC 數據。'
    },
    {
      selector: '#tutorial-report-tl',
      title: '左上：標題與風險橫幅',
      body: '<strong>檢體編號與狀態膠囊</strong>：確認簽核標的。<br/><strong>風險橫幅</strong>依留單門檻與前次報告比對，可能為三種：<br/>' +
        '<strong>紅色</strong>—本次出現<strong>新發</strong>留單條件；<br/>' +
        '<strong>黃色</strong>—<strong>延續性</strong>異常（前次已同條件留單，因此不需再留）；<br/>' +
        '<strong>綠色</strong>—未達留單標準。<br/>' +
        '若醫檢師曾更動與 AI 不同之數值，判讀以<strong>人員編輯</strong>為準。<br/>若出現紅色橫幅，需改送實體模式進行人工鏡檢，可點選畫面上「改為人工鏡檢」等按鈕（將標記 Manual Alert 並返回列表，此檢體自動分配到實體作業模式待辦清單）。'
    },
    {
      selector: '#tutorial-report-bl',
      title: '左下：血球分類計數 (WBC)',
      body: '橫向並列<strong>流式、AI 判讀結果、人員編輯、前次報告</strong>；列分「常見細胞」與「未成熟與異常細胞」兩段；達留單門檻之列以紅色強調並附警示圖示，便於簽核前最後確認。'
    },
    {
      selector: '#tutorial-report-tr',
      title: '右上：病患與檢體資訊',
      body: '顯示檢體編號、病歷號、姓名（性別）、生日（年齡）、來源、<strong>操作機台</strong>與<strong>檢體歸位</strong>等，供身分與實體位置複查。'
    },
    {
      selector: '#tutorial-report-br',
      title: '右下：其他發現與 CBC',
      body: '<strong>其他發現</strong>：NRBC、Giant PLT、Megakaryocyte、Smudge cell、Artefact 等，欄位結構與 WBC 表一致。<br/><strong>CBC</strong>：WBC、RBC、Hb、HCT、MCV、MCH、MCHC、PLT 等，與分類表一併檢視整體是否合理。'
    },
    {
      selector: '#confirm-btn',
      title: '確認並簽核',
      body: '確認無誤後點<strong>確認並簽核</strong>。簽核會完成該檢體之<strong>數位閱片</strong>流程（列表上 Digital Review 膠囊顯示完成）；底部「當前操作者」為示範用。完成後帶往下一筆待數位閱片。'
    },
    {
      selector: null,
      title: '教學完成',
      body: '您已瀏覽<strong>檢體管理 → 影像閱片 → 報告核發</strong>之導覽。可隨時由檢體管理頂部<strong>使用教學</strong>重播。本 Demo 模擬資料與本機覆寫僅供介面驗證，正式環境請依醫院資訊政策為準。'
    }
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
