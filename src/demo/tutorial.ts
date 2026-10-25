/**
 * 【展示用】使用教學（步驟式高亮導覽、跨頁：檢體管理 → 影像檢視 → 報告簽核）
 *
 * 不屬於正式功能：頁面只要呼叫 startTutorial(page)；移除本檔與 tutorial.css 後系統照常運作。
 * 第一次進入檢體管理時自動開始；之後可由「使用教學」按鈕重播。
 */
import { demoStorage } from '../infra/storage';
import { raw, setHtml, type SafeHtml } from '../ui/shared/dom';

type Phase = 'specimen' | 'image' | 'report';
interface Step {
  selector: string | null;
  title: string;
  body: SafeHtml;
}

const STEPS: Record<Phase, Step[]> = {
  specimen: [
    {
      selector: null,
      title: '歡迎使用',
      body: raw(
        '本系統為<strong>血球型態閱片 Demo</strong>，示範流程：<strong>檢體管理 → 影像檢視 → 報告核發</strong>。資料存於本機，供連續操作測試。',
      ),
    },
    {
      selector: '#tutorial-area-tl',
      title: '模式與篩選',
      body: raw(
        '<strong>數位閱片</strong>：待辦 DR／AI 警示檢體。<strong>實體作業</strong>：需拉片、血小板等實體待辦。<br/>可再勾選狀態、日期、單位、機台與搜尋條件；表頭可排序。',
      ),
    },
    {
      selector: '#tutorial-specimen-list',
      title: '檢體列表',
      body: raw(
        '列上<strong>膠囊</strong>標示待辦類型，完成後轉綠勾。雙擊或點<strong>進入閱片</strong>開啟影像頁；<strong>Locked</strong> 不可編輯。實體模式下可直接點膠囊標記完成。',
      ),
    },
    {
      selector: '#tutorial-sidebar-body',
      title: '檢體總覽',
      body: raw(
        '右側顯示選取檢體之基本資料，以及流式、AI、前次報告對照；異常達留單門檻以紅色標示（門檻可於系統設定調整）。',
      ),
    },
    {
      selector: '#specimen-tbody',
      title: '開始閱片',
      body: raw(
        '選定檢體後<strong>雙擊列</strong>或點<strong>進入閱片</strong>。數位閱片已完成者可<strong>唯讀檢視</strong>。',
      ),
    },
  ],
  image: [
    {
      selector: null,
      title: '影像檢視',
      body: raw('左側為檢體資訊與分析表，右側為細胞影像。命中留單門檻的類別會置頂並以紅色強調。'),
    },
    {
      selector: '#tutorial-image-tl',
      title: '導航與狀態',
      body: raw('可返回列表、切換檢體（上一筆／下一筆或搜尋 ID），狀態膠囊與列表一致。'),
    },
    {
      selector: '#tutorial-image-tr',
      title: '進度與工具',
      body: raw(
        '<strong>檢視進度</strong>：捲動過的細胞才計入已檢視。<strong>縮放／字型</strong>全站共用。須檢視完且無 Unidentified 才可核發報告。',
      ),
    },
    {
      selector: '#main-cell-groups',
      title: '細胞編輯',
      body: raw('左鍵選取、Ctrl 多選、Shift 範圍選；拖曳或右鍵選單可改分類。長按右鍵為單手操作模式。'),
    },
    {
      selector: '#btn-save-report',
      title: '儲存結果',
      body: raw('完成閱片後點<strong>儲存結果</strong>，於彈出視窗確認資料並簽核。'),
    },
  ],
  report: [
    {
      selector: null,
      title: '報告核發',
      body: raw('簽核前最後比對<strong>流式、AI、人員編輯、前次報告</strong>與 CBC；以人員編輯為準。'),
    },
    {
      selector: '#tutorial-report-tl',
      title: '風險橫幅',
      body: raw(
        '<strong>紅</strong>：新發留單；<strong>黃</strong>：延續性異常；<strong>綠</strong>：未達留單。需改人工鏡檢時點<strong>改為人工鏡檢</strong>，檢體轉至實體作業待辦。',
      ),
    },
    {
      selector: '#tutorial-report-bl',
      title: '分類與 CBC',
      body: raw('WBC 分類與其他發現並列四欄比對；達門檻之列紅色標示。右側為病患與檢體資訊。'),
    },
    {
      selector: '#confirm-btn',
      title: '確認簽核',
      body: raw('確認無誤後點<strong>確認並簽核</strong>，完成數位閱片流程，並可繼續下一筆待辦。'),
    },
    { selector: null, title: '教學完成', body: raw('導覽結束。可隨時由檢體管理頂部<strong>使用教學</strong>重播。') },
  ],
};

/** 一頁看完後接續的頁面（最後一頁看完＝教學完成） */
const NEXT_PHASE: Record<Phase, Phase | null> = { specimen: 'image', image: 'report', report: null };

let overlay: HTMLDivElement | null = null;
let spotlight: HTMLDivElement | null = null;
let card: HTMLDivElement | null = null;

function ensureOverlay(): void {
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.id = 'tutorial-overlay';
  overlay.className = 'tutorial-overlay';
  spotlight = document.createElement('div');
  spotlight.id = 'tutorial-spotlight';
  spotlight.className = 'tutorial-spotlight';
  card = document.createElement('div');
  card.id = 'tutorial-card';
  card.className = 'tutorial-card';
  setHtml(
    card,
    raw(
      '<div class="tutorial-card-title"></div><div class="tutorial-card-body"></div><div class="tutorial-card-actions"><button type="button" class="tutorial-btn tutorial-btn-skip">跳過</button><span class="tutorial-card-dots"></span><div class="tutorial-card-nav"><button type="button" class="tutorial-btn tutorial-btn-prev">上一步</button><button type="button" class="tutorial-btn tutorial-btn-next">下一步</button></div></div>',
    ),
  );
  overlay.appendChild(spotlight);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

function positionSpotlight(selector: string | null): void {
  if (!spotlight) return;
  const el = selector ? document.body.querySelector(selector) : null;
  if (!el) {
    spotlight.style.display = 'none';
    return;
  }
  const r = el.getBoundingClientRect();
  Object.assign(spotlight.style, {
    display: 'block',
    top: r.top + 'px',
    left: r.left + 'px',
    width: r.width + 'px',
    height: r.height + 'px',
  });
}

function close(): void {
  overlay?.classList.remove('tutorial-visible');
}

/** 看完這一頁：記下下一頁要接續（最後一頁則記為已完成） */
function finishPhase(page: Phase): void {
  const next = NEXT_PHASE[page];
  if (next) demoStorage.setTutorial(undefined, next, 0);
  else demoStorage.setTutorial(true, '', 0);
  close();
}

function showStep(page: Phase, index: number, fromHelp: boolean): void {
  const steps = STEPS[page];
  const step = steps[index];
  if (!step) return finishPhase(page);
  demoStorage.setTutorial(undefined, page, index);
  ensureOverlay();
  if (!overlay || !card) return;
  overlay.classList.add('tutorial-visible');
  const q = <T extends HTMLElement>(sel: string) => card?.querySelector(sel) as T;
  const isLast = index === steps.length - 1;
  q('.tutorial-card-title').textContent = step.title;
  setHtml(q('.tutorial-card-body'), step.body);
  q('.tutorial-card-dots').textContent = `${index + 1} / ${steps.length}`;
  const next = q<HTMLButtonElement>('.tutorial-btn-next');
  const prev = q<HTMLButtonElement>('.tutorial-btn-prev');
  const skip = q<HTMLButtonElement>('.tutorial-btn-skip');
  next.textContent = isLast ? '完成' : '下一步';
  prev.style.display = index === 0 ? 'none' : 'inline-flex';
  skip.style.display = fromHelp ? 'none' : 'inline-flex';
  positionSpotlight(step.selector);
  prev.onclick = () => showStep(page, index - 1, fromHelp);
  next.onclick = () => (isLast ? finishPhase(page) : showStep(page, index + 1, fromHelp));
  skip.onclick = () => {
    demoStorage.setTutorial(true, '', 0);
    close();
  };
}

/**
 * 各頁載入完成後呼叫：
 *  - 檢體管理：第一次使用自動開始；「使用教學」按鈕重播
 *  - 影像檢視、報告簽核：前一頁教學看完才接續
 */
export function startTutorial(page: 'specimen-list' | 'image-review' | 'report-issue'): void {
  const state = demoStorage.tutorial();
  if (page === 'specimen-list') {
    document.getElementById('btn-tutorial')?.addEventListener('click', () => showStep('specimen', 0, true));
    if (state.completed && !state.phase) return;
    if (state.phase !== 'specimen' && state.phase !== '') return; // 已接續到影像檢視／報告簽核
    if (state.completed) return;
    showStep('specimen', 0, false);
  } else if (page === 'image-review') {
    setTimeout(() => demoStorage.tutorial().phase === 'image' && showStep('image', 0, false), 300);
  } else {
    setTimeout(() => demoStorage.tutorial().phase === 'report' && showStep('report', 0, false), 200);
  }
}
