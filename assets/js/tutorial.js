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
      body: '本介面源自<strong>血液組</strong>與<strong>長庚醫院人工智慧中心</strong>合作開發血球辨識 AI 的實際需求，透過使用者研究與問卷調查，以<strong>醫檢師的日常工作流程</strong>為核心進行介面設計，目標是讓 AI 能與臨床需求真正接軌並減輕工作負擔。<br/>本教學將帶您依序走過：<strong>檢體管理</strong> → <strong>影像檢視與細胞編輯</strong> → <strong>報告核發</strong> 的完整流程，協助您快速上手並理解每一個設計背後的用意。'
    },
    {
      selector: '#tutorial-specimen-full',
      title: '檢體管理 — 整體介面',
      body: '本頁分為<strong>左側</strong>與<strong>右側</strong>：左側為篩選區與檢體列表，右側為檢體總覽。系統預設篩選<strong>當日檢體</strong>避免資料混雜。<br/>右側檢體總覽整合了流式計數（Flow Cyt.）、AI 預分類與前次報告，目的是<strong>減少在 LIS / 其他系統之間來回切換</strong>。上方的<strong>數位閱片 / 實體作業</strong>模式，則把「需要數位閱片」與「需要實體拉片或血小板確認」的檢體分開，方便不同醫檢師各自專注在自己的任務。'
    },
    {
      selector: '#tutorial-area-tl',
      title: '左上：篩選與模式',
      body: '<strong>數位閱片 / 實體作業</strong>：用來切換工作模式。<strong>數位閱片</strong>集中顯示需在電腦螢幕上判讀的檢體；<strong>實體作業</strong>則顯示需要推片、查看實體玻片或採血管的檢體，讓發報告醫檢師與鏡檢醫檢師可以分流，各自只看到自己需要處理的清單。<br/><strong>篩選</strong>：展開後可勾選要顯示的檢體狀態（如 PLT Check、Digital Review 等），依科別或工作重點調整目前的清單內容。<br/><strong>檢驗日期、送檢單位、機台、檢體搜尋</strong>：可依日期區間、送檢單位、機台與檢體 ID／病歷號多條件組合篩選，在<strong>高檢體量</strong>情境下，先利用這些條件縮小範圍，有助於更快找到需要處理的檢體。'
    },
    {
      selector: '#tutorial-specimen-list',
      title: '左下：檢體列表與狀態膠囊',
      body: '檢體列表列出每筆檢體的基本資訊，並透過<strong>狀態膠囊</strong>，讓您一眼看出這筆檢體是要做數位閱片、血小板確認，還是實體鏡檢，避免做錯或重複處理。<br/><br/>' +
        '<strong>狀態膠囊說明：</strong><br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 mr-1">PLT Check</span> 血小板與前次差異大，需人工鏡檢確認血小板。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800 mr-1">AI Alert</span> AI 預分類判定達留單標準，系統主動提出警示。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 mr-1">Follow-up</span> LIS 標記為需追蹤之檢體，代表曾出現異常血球，本次結果需特別留意。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 mr-1">Digital Review</span> AI 分類未見異常血球，但仍需人工數位閱片確認。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 mr-1">Verified</span> 報告已簽核完成，此檢體不需再進一步處理。<br/>' +
        '<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-800 mr-1">Locked</span> 檢體已被其他使用者開啟編輯，為避免衝突請勿再次點選。<br/><br/>' +
        '列表中的<strong>操作機台</strong>與<strong>檢體歸位</strong>欄位，則方便您在發現異常時，快速回頭找到對應的 DI-60 玻片或實體採血管位置。'
    },
    {
      selector: '#tutorial-sidebar-header',
      title: '右上：檢體總覽標題',
      body: '右側上方會顯示<strong>檢體總覽</strong>與目前選取的檢體 ID。當您點選左側列表任一列時，右側即時切換到該筆檢體的總覽，讓您<strong>在同一畫面</strong>就能看到病患與檢體的關鍵資訊，而不必再切換到其他系統。'
    },
    {
      selector: '#tutorial-sidebar-body',
      title: '右下：檢體資訊與分析',
      body: '右側下方顯示選取檢體的<strong>檢體資訊</strong>（病歷號、姓名、科別、機台、檢體歸位等）以及<strong>分析與歷史報告</strong>。表格並列呈現流式計數（Flow Cyt.）、AI 預分類與前次報告，<strong>異常數值會以紅色粗體標示</strong>，達留單標準的項目會特別突出，協助您快速判斷是否需要進一步處置。這些數據對應 LIS / XN-9000 與 AI 結果，目的是把原本分散在多個系統的資訊收斂在同一個側邊欄中。未選取任何檢體時，會提示您先從左側選擇或雙擊進入閱片。'
    },
    {
      selector: '#specimen-tbody',
      title: '進入下一階段',
      body: '請<strong>雙擊任一檢體列</strong>，或先點選一列後點該列右側的<strong>「進入閱片」</strong>按鈕，即可進入影像檢視與細胞編輯頁面。<br/>若某列顯示 <span class="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-800 mr-1">Locked</span>，代表該檢體正由他人編輯，建議改選其他檢體；已標記 <span class="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 mr-1">Verified</span> 的檢體則表示已簽核完成。進入閱片後，左側仍會延續顯示本檢體的資訊與數據，您無需另開視窗即可完成後續步驟。'
    }
  ];

  var IMAGE_STEPS = [
    {
      selector: null,
      title: '影像檢視 — 整體介面',
      body: '在這個頁面，您可以在<strong>同一個畫面</strong>同時完成細胞影像閱片與數據對照，不需要在 LIS、顯微鏡與本系統之間來回切換。<br/>本頁同樣分為<strong>左側</strong>與<strong>右側</strong>：左側為檢體資訊、狀態與分析表；右側為細胞圖卡與工具列。細胞會依分類群組顯示，達留單標準的異常細胞（如 Blast）會被置頂並以紅色樣式強調，避免在大量正常細胞中被忽略。'
    },
    {
      selector: '#tutorial-image-tl',
      title: '左上：導航與狀態',
      body: '<strong>返回列表</strong>：回到檢體管理頁。<br/><strong>檢體 ID</strong>：顯示目前正在閱片的檢體編號。<br/><strong>狀態膠囊</strong>：延續檢體管理頁的狀態標記，讓您隨時掌握這筆檢體的處置類型。<br/><strong>Add Flag</strong>：當您在閱片過程中發現 AI 未標記到的異常時，可在此手動新增狀態標記，方便後續追蹤與溝通。<br/><strong>搜尋、上一筆 / 下一筆</strong>：用來在待數位閱片的檢體之間切換；完成並儲存報告後，系統會自動跳到下一筆待數位閱片的檢體，並略過已鎖定或需要人工鏡檢的案件，以提升團隊協作效率。'
    },
    {
      selector: '#tutorial-image-bl',
      title: '左下：檢體資訊與分析',
      body: '<strong>檢體資訊</strong>：可展開 / 收合，顯示病歷號、科別、機台、檢體歸位等，方便您隨時確認病患身份與檢體來源。<br/><strong>分析與歷史報告</strong>：列出流式計數（Flow Cyt.）、AI 預分類與前次報告等數據，異常值會以紅色標示，異常標準參照林口長庚醫院留單標準。這個區塊的設計目的，是讓重要的背景數據固定停留在視野左側，減少您在不同系統或報表間切換的次數。'
    },
    {
      selector: '#tutorial-image-tr',
      title: '右上：工具列',
      body: '<strong>檢視進度</strong>：進度條顯示目前細胞檢視的完成度，幫助您確認是否已看完所有細胞，降低漏判風險。<br/><strong>縮放</strong>：50%～200% 調整細胞圖卡大小，可依個人視覺習慣與螢幕大小微調，減輕長時間閱片造成的視覺疲勞。<br/><strong>儲存並核發報告</strong>：當您完成細胞分類檢視後，點擊此按鈕會進行防呆檢查：若尚有未分類細胞或檢視進度未達 100%，系統會提示您先完成；通過檢查後才會開啟報告核發畫面。'
    },
    {
      selector: '#main-cell-groups',
      title: '右下：細胞區塊與編輯方式',
      body: '細胞會依分類群組顯示（例如 Segmented、Lymphocyte、Blast 等），達留單標準的異常細胞群組會置頂並以紅色強調，確保高風險細胞不會被忽略。<br/><strong>選取方式</strong>：<br/>單顆選取：左鍵點擊。<br/>多選：按住 Ctrl + 左鍵點擊多顆。<br/>範圍選：在同一群組內按住 Shift + 左鍵選取區間。<br/>單手模式：按住滑鼠右鍵不放，同時以左鍵點擊或拖曳框選多顆，放開右鍵後會在游標旁彈出分類選單；此模式設計用意是<strong>減少左手頻繁前伸操作鍵盤或調整姿勢</strong>，降低長時間操作造成的肢體疲勞。<br/><strong>編輯方式</strong>：您可以將選取的細胞拖曳到其他類別區塊，或是按右鍵開啟分類選單。右鍵選單會優先顯示 AI 建議的分類與信心度，並將常用、異常與其他類別分層排列且放大按鈕，讓您在不需非常精準控制滑鼠的情況下，也能快速、準確地完成重分類。群組標題同時顯示該類別的細胞數與百分比，當數值達到實驗室設定的留單閾值時，標題會變色提醒您注意。'
    },
    {
      selector: '#btn-save-report',
      title: '進入報告核發',
      body: '當細胞分類與檢視進度皆已完成，且沒有未分類細胞時，請點擊<strong>「儲存並核發報告」</strong>。系統會再次檢查未分類數量與檢視進度，通過後才會開啟報告核發畫面，作為送出報告前的最後一道防線。接下來的教學會在報告核發頁繼續說明。'
    }
  ];

  var REPORT_STEPS = [
    {
      selector: null,
      title: '報告核發 — 整體介面',
      body: '本頁用於在簽核前，<strong>最後一次完整檢視與比對所有相關數據</strong>。您可以在同一畫面同時看到流式細胞儀數據、AI 分類結果、人工編輯後的結果、前次報告與 CBC 等資訊，減少在不同系統或紙本之間來回查詢。畫面依<strong>左上 → 左下 → 右上 → 右下</strong>分為：風險橫幅與標題、血球分類計數表、病患與檢體資訊，以及其他發現與 CBC 數值，底部則是簽核按鈕列。'
    },
    {
      selector: '#tutorial-report-tl',
      title: '左上：標題與風險橫幅',
      body: '<strong>檢體編號與狀態膠囊</strong>：顯示目前檢體編號與其狀態標記，方便您確認正在簽核的是哪一筆檢體。<br/><strong>風險橫幅</strong>：依留單條件顯示不同顏色——紅色代表已達留單標準，簽核前請再次確認是否需人工鏡檢或留單；黃色代表有異常但未達留單標準；綠色代表目前未檢出異常。此橫幅的設計目的，是在<strong>簽核前最後一刻主動提醒風險</strong>，降低誤發高風險報告的機率。'
    },
    {
      selector: '#tutorial-report-bl',
      title: '左下：血球分類計數 (WBC)',
      body: '此表格依細胞類型，橫向並列<strong>流式計數、AI、人工編輯後的結果、前次報告</strong>四種數據來源，人員編輯欄以藍底或藍色高亮，協助您一眼辨識「最終要上報的數值」。<br/>將四種數據放在同一列，目的是讓您能快速判斷：AI 是否與流式與歷史趨勢一致、您修正後的結果是否合理，以及是否有需要特別關注的變化；異常項目會整列以紅色強調，方便在簽核前做最後確認。'
    },
    {
      selector: '#tutorial-report-tr',
      title: '右上：病患與檢體資訊',
      body: '此區塊顯示檢體編號、病歷號、姓名（性別）、生日（年齡）、檢體來源、操作機台與檢體歸位等資訊。除了再次確認簽核對象是否正確之外，「操作機台」與「檢體歸位」也提供了實體位置線索，若簽核後需要回頭做實體鏡檢或補充檢查，可依此找到對應的玻片或採血管。'
    },
    {
      selector: '#tutorial-report-br',
      title: '右下：其他發現與 CBC',
      body: '<strong>其他發現</strong>：列出 NRBC、Giant PLT、Megakaryocyte、Smudge cell、Artefact 等項目，與 WBC 表格使用相同的欄位結構，方便一次檢視。<br/><strong>CBC 數值</strong>：顯示 WBC、RBC、Hb、HCT、MCV、MCH、MCHC、PLT 等關鍵 CBC 指標。將其他發現與 CBC 與上方的白血球分類表一起呈現，可以在簽核前從整體血球檢查的角度，快速判斷結果是否合理、是否與過往病史與臨床情況相符。'
    },
    {
      selector: '#confirm-btn',
      title: '確認並簽核',
      body: '當您確認各項數據與病患資訊皆無誤後，請點擊<strong>「確認並簽核」</strong>按鈕。簽核後，該檢體會在系統中標記為已完成，<span class="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 mr-1">Digital Review</span> 狀態會變為綠色打勾，並關閉報告視窗、導回檢體管理頁。請務必在簽核前完成必要的比對與檢查，確定內容正確後再送出。'
    },
    {
      selector: null,
      title: '教學完成',
      body: '您已完成本系統從<strong>檢體管理 → 影像檢視與細胞編輯 → 報告核發</strong>的一整套流程教學。之後若需要複習，隨時可以從檢體管理頁頂部的<strong>「使用教學」</strong>重新開啟導覽。祝您使用順利，也期待這套介面與 AI 工具能實際減輕您的工作負擔。'
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
