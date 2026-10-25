/**
 * 報告簽核頁（第 6 章；規則 4、9～11）
 *  - 顯示 AI 值、人員編輯值與前次報告，依留單規則顯示紅／黃／綠橫幅
 *  - 按鈕：確認並簽核、需拉片確認：改為人工鏡檢、已拉片完成；鎖頭鎖住與系統判斷相反的操作
 *
 * 只內嵌在影像檢視頁：按鈕結果以 postMessage 通知外層處理；直接用網址開啟時回到檢體管理。
 */
import type { AppContext } from '../context';
import { effectiveValues, leaveJudge, patientAge, riskState } from '../../domain/rules/leave';
import { signOffPlan } from '../../domain/rules/transitions';
import { canSwitchToManualReview, needsPendingFollowUp, reportLockTarget } from '../../domain/rules/workflow';
import type { LockTarget, RawValue, RiskState, Specimen } from '../../domain/types';
import { ACTIVITY_EVENTS, currentUser } from '../../infra/auth';
import { byId, html, setHtml } from '../shared/dom';
import { CHECK_ICON } from '../shared/icons';
import { goToSpecimenList, specimenIdFromUrl } from '../shared/navigation';
import { fontLevel } from '../shared/preferences';
import { capsuleView, prevReportHeader } from '../view-models';
import type { ReportMessage } from './messages';
import { otherTableHtml, wbcTableHtml } from './tables-view';

const isEmbedded = () => window.self !== window.top && !!window.parent;
/** 只送給同源的外層頁；file:// 開啟時來源是 opaque（無法指定），改用 '*'，由外層檢查 e.source */
const parentOrigin = () => (location.origin.startsWith('http') ? location.origin : '*');
const notifyParent = (message: ReportMessage) => window.parent.postMessage(message, parentOrigin());

/**
 * 報告簽核頁只能從影像檢視頁「儲存結果」開啟（內嵌視窗）；直接用網址開啟時回到檢體管理（回傳 false）。
 * 按鈕的結果以 postMessage 通知外層頁面，由外層完成簽核、已拉片完成等操作（改為人工鏡檢除外，見 onManualReview）。
 */
export function initReportPage(ctx: AppContext): boolean {
  if (!isEmbedded()) {
    goToSpecimenList();
    return false;
  }
  const { store, thresholds } = ctx;
  const id = specimenIdFromUrl() || store.all()[0]?.barcode || '';
  const getSpecimen = (): Specimen | null => store.getById(id);
  /** 鎖頭：換檢體時重新上鎖（本頁一次只看一筆，開頁即上鎖） */
  let unlocked = false;

  const risk = (spec: Specimen): RiskState => riskState(spec, thresholds.get());
  const text = (elId: string, value: RawValue) => {
    const el = byId(elId);
    if (el) el.textContent = value != null && value !== '' ? String(value) : '-';
  };

  // ─── 表格 ───────────────────────────────────────────────────────

  function fillCbc(spec: Specimen): void {
    const cbc = spec.wam.cbc ?? {};
    const effective = effectiveValues(spec);
    const wbc = effective.wbc != null ? effective.wbc : cbc.wbc != null ? cbc.wbc : '-';
    const wbcAbnormal = leaveJudge(thresholds.get(), spec).isLeave('wbc', wbc);
    const values: Record<string, RawValue> = {
      'cbc-wbc': wbc,
      'cbc-rbc': cbc.rbc,
      'cbc-hb': cbc.hb,
      'cbc-hct': cbc.hct,
      'cbc-mcv': cbc.mcv,
      'cbc-mch': cbc.mch,
      'cbc-mchc': cbc.mchc,
      'cbc-plt': cbc.plt,
    };
    // 前次報告（LIS 最近一次）：WBC、PLT 與其他 CBC 項目
    const prev = spec.lis.prevReport;
    const prevValues: Record<string, RawValue> = { wbc: prev.wbc, plt: prev.plt, ...prev.cbc };
    for (const key of ['wbc', 'rbc', 'hb', 'hct', 'mcv', 'mch', 'mchc', 'plt']) {
      const el = byId('cbc-prev-' + key);
      const v = prevValues[key];
      if (el) el.textContent = '前次 ' + (v != null && v !== '' ? String(v) : '-');
    }
    for (const [elId, value] of Object.entries(values)) {
      const el = byId(elId);
      if (!el) continue;
      el.textContent = value != null ? String(value) : '-';
      if (elId === 'cbc-wbc') {
        el.className = wbcAbnormal
          ? 'text-medical-red text-sm font-black tabular'
          : 'text-zinc-900 dark:text-zinc-100 text-sm font-bold tabular';
        const label = el.previousElementSibling;
        if (label)
          label.className =
            (wbcAbnormal ? 'text-medical-red' : 'text-zinc-600') + ' text-[9px] font-bold uppercase tracking-tight';
      } else {
        el.className = 'text-zinc-900 dark:text-zinc-100 text-sm font-bold tabular';
      }
    }
  }

  function fillPatient(spec: Specimen): void {
    const age = patientAge(spec);
    text('report-info-id', spec.barcode);
    text('report-info-patient-id', spec.lis.patientId);
    text('report-info-name', (spec.lis.name || '-') + (spec.lis.gender ? ` (${spec.lis.gender})` : ''));
    text('report-info-birth', (spec.lis.birthDate || '-') + (age != null ? ` (${age} 歲)` : ''));
    text('report-info-department', spec.lis.department);
    text('report-info-machine', spec.wam.machine); // 進入新介面的檢體皆已自動推片，機台＝玻片所在 DI-60
    text('report-info-location', spec.wam.location);
    // 當前操作者：登入的使用者
    const user = currentUser();
    const name = byId('report-operator');
    const userId = byId('report-operator-id');
    if (user && name && userId) {
      name.firstChild!.textContent = (user.name || '-') + ' ';
      userId.textContent = `(${user.id || '-'})`;
    }
  }

  // ─── 橫幅與按鈕（規則 4、9、10）──────────────────────────────────────

  function applyBanner(spec: Specimen): void {
    const r = risk(spec);
    const banner = byId('risk-banner');
    const icon = byId('risk-icon');
    const label = byId('risk-text');
    if (!banner || !icon || !label) return;
    label.className = 'text-md font-bold leading-tight tracking-tight text-white';
    const base = 'px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 border-b';
    if (r.hasNewLeave) {
      banner.className = base + ' bg-medical-red border-medical-red/20';
      icon.textContent = 'warning';
      icon.className = 'material-symbols-outlined text-white fill-1 scale-100';
      label.textContent = '留單警示：本次出現新發留單條件，請確認是否需人工鏡檢';
    } else if (r.hasLeaveNow) {
      banner.className = base + ' bg-amber-500 border-amber-500/20';
      icon.textContent = 'info';
      icon.className = 'material-symbols-outlined text-white';
      label.textContent = '延續性異常：前次同留單條件已存在，不重複留單';
    } else {
      banner.className = base + ' bg-emerald-600 border-emerald-600/20';
      icon.textContent = 'check_circle';
      icon.className = 'material-symbols-outlined text-white';
      label.textContent = '狀態良好：未達留單標準';
    }
  }

  /** 按鈕停用（鎖住）時的樣式與提示 */
  function setBlocked(btn: HTMLElement | null, blocked: boolean, title: string): void {
    if (!btn) return;
    (btn as HTMLButtonElement).disabled = blocked;
    btn.setAttribute('aria-disabled', String(blocked));
    for (const cls of ['opacity-50', 'cursor-not-allowed', 'pointer-events-none']) btn.classList.toggle(cls, blocked);
    btn.title = blocked ? title : '';
  }

  function lockTitle(target: LockTarget, r: RiskState): string {
    if (target === 'manualReview') return unlocked ? '已開鎖，可改為人工鏡檢' : '綠色：點擊開鎖後可改為人工鏡檢';
    if (unlocked) return '已開鎖，可強制簽核（略過拉片／不補需拉片）';
    if (r.hasNewLeave) return '紅色留單：點擊開鎖後可強制數位簽核';
    return r.hasLeaveNow ? '延續性異常：點擊開鎖後可強制數位簽核' : '點擊開鎖後可強制簽核（略過需拉片）';
  }

  function applyButtons(spec: Specimen): void {
    const target = reportLockTarget(spec, thresholds.get());
    setBlocked(
      byId('confirm-btn'),
      target === 'signOff' && !unlocked,
      '尚有需拉片或未解除留單鎖定，請開鎖、改為人工鏡檢或先完成拉片',
    );
    const manual = byId('manual-alert-btn');
    manual?.classList.toggle('hidden', !canSwitchToManualReview(spec.review));
    setBlocked(
      manual,
      target === 'manualReview' && !unlocked,
      '數值未達留單門檻；如仍覺得異常，請先開鎖再改為人工鏡檢',
    );
    const lock = byId('verify-lock-btn');
    if (lock) {
      lock.classList.toggle('hidden', !target);
      lock.setAttribute('aria-hidden', target ? 'false' : 'true');
      if (target) {
        for (const cls of ['bg-zinc-200', 'border-zinc-300', 'text-zinc-600']) lock.classList.toggle(cls, !unlocked);
        for (const cls of ['bg-amber-50', 'border-amber-400', 'text-amber-800']) lock.classList.toggle(cls, unlocked);
        lock.title = lockTitle(target, risk(spec));
        lock.setAttribute('aria-label', unlocked ? '已開鎖，點擊重新上鎖' : '點擊開鎖');
        const icon = byId('verify-lock-icon');
        if (icon) icon.textContent = unlocked ? 'lock_open' : 'lock';
      }
    }
    byId('follow-up-done-btn')?.classList.toggle('hidden', !needsPendingFollowUp(spec.review));
  }

  function render(spec: Specimen): void {
    const title = byId('report-specimen-id');
    if (title) title.textContent = spec.barcode || '';
    fillPatient(spec);
    const wbcHeader = byId('wbc-prev-report-header');
    if (wbcHeader) wbcHeader.textContent = prevReportHeader(spec, '前次報告(%)');
    const otherHeader = byId('other-prev-report-header');
    if (otherHeader) otherHeader.textContent = prevReportHeader(spec, '前次報告');
    setHtml(
      byId('report-status-tags'),
      html`${spec.review.status.map((key) => {
        const cap = capsuleView(spec, key);
        return html`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold ${cap.style}">${cap.done ? CHECK_ICON : ''}${cap.label}</span>`;
      })}`,
    );
    applyButtons(spec);
    applyBanner(spec);
    setHtml(byId('wbc-table-body'), wbcTableHtml(spec, thresholds.get()));
    setHtml(byId('other-table-body'), otherTableHtml(spec, thresholds.get()));
    fillCbc(spec);
  }

  const refresh = () => {
    store.applyStoredReviews();
    const spec = getSpecimen();
    if (spec) render(spec);
  };

  // ─── 按鈕 ───────────────────────────────────────────────────────

  /** 規則 9：確認並簽核 */
  function onConfirm(): void {
    const spec = getSpecimen();
    if (!spec) return;
    const plan = signOffPlan(spec, thresholds.get(), unlocked);
    if (!plan) return;
    notifyParent({ type: 'reportVerified', specimenId: spec.barcode, ...plan });
  }

  /** 開鎖／重新上鎖 */
  function onToggleLock(): void {
    const spec = getSpecimen();
    if (!spec || !reportLockTarget(spec, thresholds.get())) return;
    unlocked = !unlocked;
    applyButtons(spec);
  }

  /** 規則 11：已拉片完成 */
  function onFollowUpDone(): void {
    const spec = getSpecimen();
    if (!spec || !needsPendingFollowUp(spec.review)) return;
    notifyParent({ type: 'reportFollowUpDone', specimenId: spec.barcode });
  }

  /** 規則 10：需拉片確認：改為人工鏡檢（回寫 LIS 註記「需拉片確認」） */
  async function onManualReview(btn: HTMLButtonElement): Promise<void> {
    const spec = getSpecimen();
    if (!spec || !canSwitchToManualReview(spec.review)) return;
    if (reportLockTarget(spec, thresholds.get()) === 'manualReview' && !unlocked) return; // 綠色要先開鎖
    const result = store.switchToManualReview(spec.barcode);
    if (!result) return;
    refresh();
    btn.disabled = true;
    const lisSynced = await result.lisSynced;
    btn.disabled = false;
    notifyParent({
      type: 'reportManualAlert',
      specimenId: spec.barcode,
      addedFollowUp: result.addedFollowUp,
      lisSynced,
    });
  }

  function onClose(): void {
    notifyParent({ type: 'reportCancel' });
  }

  fontLevel.init();
  const spec = getSpecimen();
  if (!spec) return true;
  render(spec);
  const bind = (elId: string, handler: (el: HTMLButtonElement) => void) => {
    const el = byId<HTMLButtonElement>(elId);
    el?.addEventListener('click', () => handler(el));
  };
  bind('btn-close', onClose);
  bind('confirm-btn', onConfirm);
  bind('verify-lock-btn', onToggleLock);
  bind('follow-up-done-btn', onFollowUpDone);
  bind('manual-alert-btn', (el) => void onManualReview(el));
  forwardActivityToParent();
  return true;
}

/** 內嵌時：把使用者的操作轉告外層頁面（最多每 30 秒一次），避免在報告頁操作時被判定閒置而登出 */
function forwardActivityToParent(): void {
  let last = 0;
  const onActivity = () => {
    const now = Date.now();
    if (now - last < 30_000) return;
    last = now;
    notifyParent({ type: 'reportActivity' });
  };
  for (const evt of ACTIVITY_EVENTS) document.addEventListener(evt, onActivity, { passive: true });
}
