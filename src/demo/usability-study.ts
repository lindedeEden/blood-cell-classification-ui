/**
 * 【展示用】情境模擬測試（可用性研究）：情境切換、清單篩選、檢體狀態重置
 *
 * 不屬於正式功能：移除 src/demo 與各頁面的展示用呼叫後，系統照常運作。
 * 情境內容在 usability-scenarios.ts。
 */
import type { SpecimenStore } from '../app/specimen-store';
import type { ThresholdSettings } from '../app/thresholds';
import { DEMO_STATE } from '../data/demo-state';
import type { Database } from '../data/database';
import { ENTITY_STATUSES } from '../domain/constants/status';
import { intakeStatus } from '../domain/rules/intake';
import { emptyWorkflow, isCompleted, normalizeWorkflow } from '../domain/rules/workflow';
import type { Specimen } from '../domain/types';
import { demoStorage, editedStorage, reviewStorage } from '../infra/storage';
import { html, type SafeHtml } from '../ui/shared/dom';
import type { UsabilityScenario } from './types';
import { USABILITY_SCENARIOS } from './usability-scenarios';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** 情境檢體的原始資料（還原用）：進線資料整組，處理狀態只有編輯人員、鎖定中（展示用已完成的檢體另含流程旗標） */
interface Baseline {
  imaging: Specimen['imaging'];
  wam: Specimen['wam'];
  lis: Specimen['lis'];
  review: Partial<Specimen['review']>;
}

export class UsabilityStudy {
  private readonly baselines = new Map<string, Baseline>();
  private store: SpecimenStore | null = null;

  /** 必須在建立 SpecimenStore 之前呼叫：記下原始資料，並在情境啟用中時套用研究當時的進線資料 */
  constructor(
    db: Database,
    private readonly thresholds: ThresholdSettings,
  ) {
    const ids = new Set(USABILITY_SCENARIOS.scenarios.flatMap((s) => s.specimenIds ?? []));
    for (const spec of db.specimens) {
      if (!ids.has(spec.barcode)) continue;
      const review: Partial<Specimen['review']> = { editor: spec.review.editor, locked: spec.review.locked };
      if (DEMO_STATE[spec.barcode]?.completed) review.workflowDone = spec.review.workflowDone;
      this.baselines.set(spec.barcode, clone({ imaging: spec.imaging, wam: spec.wam, lis: spec.lis, review }));
    }
    if (this.isActive()) db.specimens.forEach((s) => this.applyStudyIntake(s));
  }

  attach(store: SpecimenStore): void {
    this.store = store;
  }

  scenarios(): UsabilityScenario[] {
    return USABILITY_SCENARIOS.scenarios;
  }

  scenarioById(id: string): UsabilityScenario | null {
    if (!id) return USABILITY_SCENARIOS.normal;
    return this.scenarios().find((s) => s.id === id) ?? null;
  }

  activeId(): string {
    return demoStorage.scenarioId();
  }

  active(): UsabilityScenario | null {
    return this.scenarioById(this.activeId());
  }

  isActive(): boolean {
    return !!this.activeId();
  }

  /** 情境啟用時：只列出該情境的檢體，並依情境排序 */
  filter = (specimens: Specimen[]): Specimen[] => {
    const ids = this.active()?.specimenIds;
    if (!Array.isArray(ids)) return specimens;
    const order = new Map(ids.map((id, i) => [id, i]));
    return specimens
      .filter((s) => order.has(s.barcode))
      .sort((a, b) => (order.get(a.barcode) ?? 0) - (order.get(b.barcode) ?? 0));
  };

  /** 研究當時的進線資料（studyIntakeOverrides，依資料來源分組） */
  private applyStudyIntake(spec: Specimen): void {
    const override = USABILITY_SCENARIOS.studyIntakeOverrides[spec.barcode];
    if (!override) return;
    for (const group of ['lis', 'wam', 'imaging'] as const) {
      if (override[group]) Object.assign(spec[group], override[group]);
    }
  }

  /** 還原一筆情境檢體：進線資料整組還原、膠囊重新判斷；已完成的檢體（需拉片確認已完成者除外）強制回到待辦 */
  private restore(barcode: string): void {
    const spec = this.store?.getById(barcode);
    const baseline = this.baselines.get(barcode);
    if (!spec || !baseline) return;
    const restored = clone(baseline);
    spec.imaging = restored.imaging;
    spec.wam = restored.wam;
    spec.lis = restored.lis;
    Object.assign(spec.review, restored.review); // 流程旗標沿用目前狀態（與研究當時的行為相同）
    delete spec.review.editedDiff;
    if (this.isActive()) this.applyStudyIntake(spec);
    spec.review.status = intakeStatus(spec, this.thresholds.get());
    spec.review.workflowDone = normalizeWorkflow(spec.review.workflowDone);
    spec.review.statusDone = isCompleted(spec.review);
    const followUpDoneTrap = spec.review.statusDone && spec.review.status.includes('Follow-up');
    if (!followUpDoneTrap && spec.review.statusDone) {
      spec.review.editor = '';
      spec.review.workflowDone = emptyWorkflow();
      for (const k of spec.review.status) {
        if ((ENTITY_STATUSES as readonly string[]).includes(k))
          spec.review.workflowDone.entityStatusDone[k as 'PLT Check'] = false;
      }
      spec.review.statusDone = isCompleted(spec.review);
    } else if (!isCompleted(spec.review)) {
      spec.review.editor = '';
    }
  }

  private reset(ids: readonly string[]): void {
    reviewStorage.remove(ids);
    ids.forEach((id) => editedStorage.clear(id)); // 細胞分類與人員編輯值都清掉，下一位受試者不會看到上一位的結果
    ids.forEach((id) => this.restore(id));
  }

  /** 切換情境：前一個與新的情境檢體都重置 */
  apply(scenarioId: string): void {
    const prevIds = this.active()?.specimenIds ?? [];
    demoStorage.setScenarioId(scenarioId); // 先記下新情境，還原時才知道要不要套用研究當時的進線資料
    if (prevIds.length) this.reset(prevIds);
    const nextIds = this.scenarioById(scenarioId)?.specimenIds ?? [];
    if (nextIds.length) this.reset(nextIds);
  }

  /** 設定視窗的內容 */
  panelHtml(selectedId: string): SafeHtml {
    const normal = USABILITY_SCENARIOS.normal;
    const option = (value: string, title: string, sub: string, checked: boolean) =>
      html`<label class="flex items-start gap-2 p-2.5 rounded-md border border-border-light cursor-pointer hover:bg-gray-50"><input type="radio" name="usability-scenario" class="mt-0.5 text-primary focus:ring-primary" value="${value}"${checked ? html` checked` : ''}/><span><span class="font-medium text-sm text-text-light">${title}</span><span class="block text-xs text-text-muted-light mt-0.5">${sub}</span></span></label>`;
    const selected = selectedId ? this.scenarioById(selectedId) : null;
    return html`<p class="text-xs text-text-muted-light leading-relaxed mb-3">選擇測試情境後，檢體清單僅顯示該情境專屬檢體，並重置狀態篩選為<strong>全勾</strong>；套用後<strong>不預設</strong>數位／實體模式（兩側按鈕皆不反白），由受試者自行切換。</p><div class="space-y-2">${option('', normal ? normal.title : '正式清單', '顯示完整模擬資料庫清單', !selectedId)}${this.scenarios().map(
      (sc) => option(sc.id, sc.title, sc.specimenIds ? `${sc.specimenIds.length} 筆檢體` : '', selectedId === sc.id),
    )}</div>${
      selected?.taskCard
        ? html`<div class="mt-3 p-2.5 rounded-md bg-indigo-50 border border-indigo-200"><p class="text-xs font-medium text-indigo-800 mb-1">任務說明</p><p class="text-sm text-indigo-950 leading-relaxed whitespace-pre-line">${selected.taskCard}</p></div>`
        : ''
    }`;
  }
}
