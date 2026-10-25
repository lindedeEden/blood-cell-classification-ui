/**
 * 檢體資料與各種操作（應用層）：把 domain 的規則套到檢體上、保存結果、回傳 LIS
 *
 * 原型：檢體來自 data/database.ts 的模擬資料，處理狀態存在瀏覽器（infra/storage.ts）；
 * 每個頁面各自建立一份，靠瀏覽器儲存同步（其他分頁變更時呼叫 applyStoredReviews）。
 * 正式系統：資料改由後端 API 取得，各操作改為呼叫 API（例 PATCH /specimens/{barcode}/workflow），規則沿用 domain/。
 */
import { LIS_NOTES } from '../domain/lis';
import { intakeStatus, withRecomputedAiAlert } from '../domain/rules/intake';
import * as T from '../domain/rules/transitions';
import {
  hasStatus,
  isCompleted,
  isEntityStatusCompleted,
  needsPendingFollowUp,
  normalizeWorkflow,
} from '../domain/rules/workflow';
import type { DiffValues, EntityStatusKey, Specimen, StatusKey } from '../domain/types';
import { editedStorage, reviewStorage, sessionInfo, type StoredReview } from '../infra/storage';
import type { Database } from '../data/database';
import { lisSync, type LisGateway } from './lis-sync';
import type { ThresholdSettings } from './thresholds';

/** LIS 撤回通知的事件名稱（規則 15）：檢體管理頁收到後跳出視窗 */
export const LIS_WITHDRAWN_EVENT = 'lis-withdrawn';

/** 影像檢視頁的細胞工作副本（人員編輯結果與快照的格式） */
export interface ReviewCell {
  id: string;
  cellId: string;
  /** 目前分類（起始為 AI 預分類，醫檢師可重新歸類） */
  category: string;
  imageUrl: string;
  aiSuggestion: { label: string; pct: number } | null;
}

export interface StoreOptions {
  lis?: LisGateway;
  /** 展示用：情境模擬測試啟用時，清單只列出該情境的檢體 */
  listFilter?: (specimens: Specimen[]) => Specimen[];
  /** 撤回通知（預設發出 window 事件） */
  notify?: (event: string, detail: unknown) => void;
  /** 目前登入帳號（全部完成時寫入編輯人員） */
  account?: () => string;
}

function readStoredEntry(raw: unknown): StoredReview {
  if (raw && typeof raw === 'object' && Array.isArray((raw as StoredReview).status)) {
    const entry = raw as Partial<StoredReview>;
    return {
      status: (entry.status ?? []).slice(),
      statusDone: !!entry.statusDone,
      workflowDone: normalizeWorkflow(entry.workflowDone),
      editor: typeof entry.editor === 'string' ? entry.editor : '',
    };
  }
  return { status: [], statusDone: false, workflowDone: normalizeWorkflow(null), editor: '' };
}

const defaultNotify = (event: string, detail: unknown) => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(event, { detail }));
};

export class SpecimenStore {
  private readonly lis: LisGateway;
  private readonly listFilter: (specimens: Specimen[]) => Specimen[];
  private readonly notify: (event: string, detail: unknown) => void;
  private readonly account: () => string;

  constructor(
    private readonly db: Database,
    private readonly thresholds: ThresholdSettings,
    options: StoreOptions = {},
  ) {
    this.lis = options.lis ?? lisSync;
    this.listFilter = options.listFilter ?? ((list) => list);
    this.notify = options.notify ?? defaultNotify;
    this.account = options.account ?? sessionInfo.account;
    this.init();
  }

  // ─── 讀取 ─────────────────────────────────────────────────────────

  all(): Specimen[] {
    return this.db.specimens;
  }

  getById(barcode: string): Specimen | null {
    return this.db.specimens.find((s) => s.barcode === barcode) ?? null;
  }

  /** 清單顯示的檢體（情境模擬測試啟用時只列該情境的檢體） */
  listForDisplay(): Specimen[] {
    return this.listFilter(this.all());
  }

  departments(): string[] {
    return this.db.departments;
  }

  machines(): string[] {
    return this.db.machines;
  }

  // ─── 初始化與同步 ──────────────────────────────────────────────────

  /** 依進線資料加膠囊（規則 1～3），再套用已保存的處理狀態 */
  private init(): void {
    for (const spec of this.all()) {
      spec.review.status = intakeStatus(spec, this.thresholds.get());
      spec.review.workflowDone = normalizeWorkflow(spec.review.workflowDone);
      spec.review.statusDone = isCompleted(spec.review);
    }
    this.applyStoredReviews();
    this.recomputeAiAlerts();
    for (const spec of this.all()) {
      if (!isCompleted(spec.review)) spec.review.editor = '';
      const edited = editedStorage.loadDiff(spec.barcode);
      if (edited) spec.review.editedDiff = edited;
    }
  }

  /** 讀回已保存的處理狀態（其他頁面或分頁變更後呼叫） */
  applyStoredReviews(): void {
    for (const [barcode, raw] of Object.entries(reviewStorage.readAll())) {
      const spec = this.getById(barcode);
      if (spec) this.applyStoredEntry(spec, raw);
    }
  }

  private applyStoredEntry(spec: Specimen, raw: unknown): void {
    const entry = readStoredEntry(raw);
    spec.review.status = entry.status;
    spec.review.workflowDone = entry.workflowDone;
    spec.review.statusDone = isCompleted(spec.review);
    spec.review.editor = spec.review.statusDone ? entry.editor : '';
  }

  /**
   * 操作前取得檢體的最新狀態：若其他分頁已變更並保存（例：另一頁標記血小板確認完成），先讀回再重算 AI 分類警示，
   * 避免用這一頁較舊的狀態整筆覆蓋。
   */
  private current(barcode: string): Specimen | null {
    const spec = this.getById(barcode);
    const raw = spec && reviewStorage.readAll()[barcode];
    if (spec && raw) {
      this.applyStoredEntry(spec, raw);
      this.recomputeAiAlert(spec);
    }
    return spec;
  }

  /**
   * 規則 1、7：修改門檻後重算 AI 分類警示。只對還能確認 AI 的檢體重算；以下不回頭改：
   * 數位閱片已結束（已簽核或已改為人工鏡檢）、AI 已確認、全部完成、
   * 沒有數位閱片且需拉片確認已完成（AI 的確認跟著需拉片確認走，已過時機）。
   */
  recomputeAiAlerts(): void {
    for (const spec of this.all()) this.recomputeAiAlert(spec);
  }

  private recomputeAiAlert(spec: Specimen): void {
    const wf = spec.review.workflowDone;
    if (wf.digitalReview || wf.digitalReviewSignedOff || wf.aiAlertConfirmed || isCompleted(spec.review)) return;
    if (
      !hasStatus(spec.review, 'Digital Review') &&
      hasStatus(spec.review, 'Follow-up') &&
      wf.entityStatusDone['Follow-up']
    )
      return;
    spec.review.status = withRecomputedAiAlert(spec, this.thresholds.get());
    spec.review.statusDone = isCompleted(spec.review);
  }

  // ─── 保存 ─────────────────────────────────────────────────────────

  /** 套用新的膠囊與流程旗標：重算是否完成；完成時寫入編輯人員（目前登入帳號），未完成清空 */
  private apply(spec: Specimen, next: { status: StatusKey[]; workflowDone: Specimen['review']['workflowDone'] }): void {
    spec.review.status = next.status;
    spec.review.workflowDone = next.workflowDone;
    spec.review.statusDone = isCompleted(spec.review);
    if (!spec.review.statusDone) spec.review.editor = '';
    else if (this.account()) spec.review.editor = this.account();
    reviewStorage.save(spec.barcode, {
      status: spec.review.status.slice(),
      statusDone: spec.review.statusDone,
      workflowDone: spec.review.workflowDone,
      editor: spec.review.editor,
    });
  }

  // ─── 操作（規則 9～12、15）─────────────────────────────────────────

  /** 規則 9：確認並簽核；回寫結果（規則 14），開鎖完成待辦需拉片確認時另加註記 */
  signOff(barcode: string, options: T.SignOffOptions = {}): Specimen | null {
    const spec = this.current(barcode);
    if (!spec) return null;
    const followUpPending = needsPendingFollowUp(spec.review);
    this.apply(spec, T.signOff(spec.review, options));
    if (spec.review.workflowDone.digitalReviewSignedOff) void this.lis.sendResults(spec);
    if (followUpPending && isEntityStatusCompleted(spec.review, 'Follow-up')) {
      void this.lis.sendNote(spec, LIS_NOTES.DIGITAL_INSTEAD_OF_SMEAR);
    }
    return spec;
  }

  /** 規則 10：改為人工鏡檢；回寫 LIS 註記「需拉片確認」（lisSynced：回寫是否成功） */
  switchToManualReview(barcode: string): { addedFollowUp: boolean; lisSynced: Promise<boolean> } | null {
    const spec = this.current(barcode);
    if (!spec) return null;
    const next = T.switchToManualReview(spec.review);
    this.apply(spec, next);
    return { addedFollowUp: next.addedFollowUp, lisSynced: this.lis.sendNote(spec, LIS_NOTES.SMEAR_REQUIRED) };
  }

  /** 規則 11：已拉片完成（需拉片確認＋AI 分類警示時，AI 一併確認）；回寫 LIS 註記「拉片完成」 */
  markFollowUpDone(barcode: string): Specimen | null {
    const spec = this.current(barcode);
    if (!spec || !hasStatus(spec.review, 'Follow-up')) return null;
    if (isEntityStatusCompleted(spec.review, 'Follow-up')) return spec;
    const next = T.markFollowUpDone(spec.review);
    if (!next) return null;
    this.apply(spec, next);
    void this.lis.sendNote(spec, LIS_NOTES.SMEAR_DONE);
    return spec;
  }

  /** 規則 12：清單點實體作業膠囊切換完成／未完成；標記完成時回寫 LIS 註記，取消時不回寫。回傳是否有變更 */
  toggleEntityStatus(barcode: string, key: EntityStatusKey): boolean {
    const spec = this.current(barcode);
    const next = spec && T.toggleEntityStatus(spec.review, key);
    if (!spec || !next) return false;
    this.apply(spec, next);
    if (next.workflowDone.entityStatusDone[key]) {
      void this.lis.sendNote(spec, key === 'Follow-up' ? LIS_NOTES.SMEAR_DONE : LIS_NOTES.PLT_DONE);
    }
    return true;
  }

  /**
   * 規則 15：LIS 撤回（只限已簽核的數位閱片結果）。撤回由實體作業醫檢師在 LIS 執行，新介面沒有撤回按鈕；
   * 收到 LIS 撤回通知（POST /lis/withdrawal）後，檢體回到剛進線的狀態，清除編輯人員與人員編輯結果，並通知畫面跳出視窗。
   */
  withdrawFromLis(barcode: string): boolean {
    const spec = this.current(barcode);
    if (!spec || !T.canWithdraw(spec.review)) return false;
    delete spec.review.editedDiff;
    editedStorage.clear(barcode);
    spec.review.editor = '';
    this.apply(spec, T.withdrawToIntake(spec, this.thresholds.get()));
    this.notify(LIS_WITHDRAWN_EVENT, { barcode });
    return true;
  }

  // ─── 人員編輯結果（規則 8）─────────────────────────────────────────

  saveEditedResult(spec: Specimen, editedDiff: DiffValues, cells: readonly ReviewCell[]): void {
    spec.review.editedDiff = editedDiff;
    editedStorage.saveDiff(spec.barcode, editedDiff);
    editedStorage.saveCells(spec.barcode, cells);
  }

  loadEditedCells(barcode: string): ReviewCell[] | null {
    return editedStorage.loadCells<ReviewCell>(barcode);
  }

  saveEditedCells(barcode: string, cells: readonly ReviewCell[]): void {
    editedStorage.saveCells(barcode, cells);
  }
}
