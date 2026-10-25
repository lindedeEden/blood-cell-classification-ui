/**
 * 進線與合併（文件 2 第 2 章，不編規則號）
 *
 * DI-60 取像完成、AI 模型辨識完成後，以檢體條碼合併四份資料，產生新介面的檢體：
 *   CellaVision 資料庫：細胞影像、取像時間
 *   AI 模型：每顆細胞的預分類與信心值、AI 分類結果（Diff%）
 *   WAM：CBC、Flow DC、各種 flag、SIS rule、檢體歸位、玻片機台
 *   LIS：病患資料（含年齡）、收件時間、前次報告、需推片確認註記
 *
 * 進線異常的處理（附錄 A #3，待血液組、資訊室確認；目前做法）：
 *  - 條碼格式不符（不是 11 碼英數字）→ 該筆略過
 *  - 同一來源同一條碼多筆 → 以最後一筆為準
 *  - CellaVision 有影像、缺 AI 結果／WAM／LIS → 暫不進線，等資料到齊
 *  - 有 WAM／LIS、CellaVision 沒有影像 → 尚未取像，不進線、不算異常
 *  - 影像沒有對應的 AI 結果 → 該顆列為 Unidentified（待人員分類）
 */
import type { AiModelRecord, CellaVisionRecord, LisRecord, WamRecord } from '../source-records';
import { CATEGORY_TO_KEY, KEYED_CATEGORIES, UNIDENTIFIED } from '../constants/cell-types';
import type { DiffKey, ImagingCell, PrevCbcKey, PrevReport, Specimen } from '../types';
import { emptyWorkflow } from './workflow';
import { aiDiffFromCells } from './cell-counts';

/** 檢體條碼：11 碼英數字；比對前去除空白、轉大寫 */
export const BARCODE_PATTERN = /^[A-Z0-9]{11}$/;

type Source = 'cellavision' | 'ai' | 'wam' | 'lis';
const SOURCE_LABELS: Record<Source, string> = {
  cellavision: 'CellaVision 資料庫',
  ai: 'AI 辨識結果',
  wam: 'WAM',
  lis: 'LIS',
};

export interface IntakeIssue {
  type: 'invalid-barcode' | 'duplicate' | 'missing-source';
  source: string;
  barcode: string;
  message: string;
}

export interface IntakeSources {
  cellavision: CellaVisionRecord[];
  ai: AiModelRecord[];
  wam: WamRecord[];
  lis: LisRecord[];
}

export function normalizeBarcode(value: unknown): string {
  return String(value == null ? '' : value)
    .replace(/\s+/g, '')
    .toUpperCase();
}

const clone = <T>(v: T): T => (v == null ? v : (JSON.parse(JSON.stringify(v)) as T));

/** 依條碼建索引：格式不符略過、重複以最後一筆為準（都記入 issues） */
function indexByBarcode<T extends { barcode: string | null }>(
  records: readonly T[],
  source: Source,
  issues: IntakeIssue[],
): Map<string, T> {
  const map = new Map<string, T>();
  for (const record of records) {
    const barcode = normalizeBarcode(record?.barcode);
    const label = SOURCE_LABELS[source];
    if (!BARCODE_PATTERN.test(barcode)) {
      issues.push({
        type: 'invalid-barcode',
        source,
        barcode,
        message: `${label} 條碼格式不符（${barcode || '空白'}），略過`,
      });
      continue;
    }
    if (map.has(barcode)) {
      issues.push({ type: 'duplicate', source, barcode, message: `${label} 條碼 ${barcode} 有多筆，以最後一筆為準` });
    }
    map.set(barcode, record);
  }
  return map;
}

/** 每顆細胞＝CellaVision 的影像＋AI 模型的預分類（依 cellId 對應）；沒有 AI 結果 → Unidentified */
export function joinCells(imageCells: CellaVisionRecord['cells'], aiCells: AiModelRecord['cells']): ImagingCell[] {
  const predictions = new Map(aiCells.map((p) => [p.cellId, p]));
  return imageCells.map((c) => {
    const p = predictions.get(c.cellId);
    return {
      cellId: c.cellId,
      imagePath: c.image,
      aiCategory: p ? p.category : UNIDENTIFIED,
      aiConfidence: p && p.confidence != null ? p.confidence : null,
    };
  });
}

/** 前次報告收的 CBC 項目 */
const PREV_CBC_KEYS: readonly PrevCbcKey[] = ['rbc', 'hb', 'hct', 'mcv', 'mch', 'mchc'];

/** LIS 前次報告 → { date, wbc, plt, cbc, diff }；cbc 收 RBC～MCHC，diff 只收細胞分類欄位 */
export function toPrevReport(date: string | undefined, prev: LisRecord['prevReport']): PrevReport {
  const p = prev ?? {};
  const diff: PrevReport['diff'] = {};
  for (const category of KEYED_CATEGORIES) {
    const key = CATEGORY_TO_KEY[category] as DiffKey;
    if (p[key] !== undefined) diff[key] = p[key];
  }
  const cbc: PrevReport['cbc'] = {};
  for (const key of PREV_CBC_KEYS) if (p[key] !== undefined) cbc[key] = p[key];
  return { date: date || '', wbc: p.wbc, plt: p.plt, cbc, diff };
}

/** 四份資料各一筆 → 新介面的檢體（處理狀態 review 先給空白，進線時再加膠囊） */
function toSpecimen(barcode: string, cv: CellaVisionRecord, ai: AiModelRecord, w: WamRecord, l: LisRecord): Specimen {
  const cells = joinCells(cv.cells ?? [], ai.cells ?? []);
  return {
    barcode,
    imaging: {
      analysisTime: cv.analysisTime || '',
      cells,
      // AI 分類結果：模型有回傳就用回傳值，否則由逐顆結果計算（第 2.2 節）
      aiDiff: ai.values ? clone(ai.values) : aiDiffFromCells(cells.map((c) => c.aiCategory)),
    },
    wam: {
      machine: w.machine || '',
      location: w.location || '',
      cbc: clone(w.cbc) || {},
      flowDc: clone(w.flowDc) || {},
      cbcFlags: clone(w.cbcFlags) || {},
      flowDcFlags: clone(w.flowDcFlags) || [],
      pltFlag: w.pltFlag || '',
      sisRules: clone(w.sisRules) || [],
    },
    lis: {
      patientId: l.patientId || '',
      name: l.name || '',
      gender: l.gender || '',
      birthDate: l.birthDate || '',
      age: l.age != null && l.age !== '' ? Number(l.age) : null,
      department: l.department || '',
      receivedTime: l.receivedTime || '',
      smearRequiredNote: l.smearRequiredNote === true, // 只有明確為 true 才算（規則 2）
      prevReport: toPrevReport(l.prevReportDate, l.prevReport),
    },
    review: { status: [], workflowDone: emptyWorkflow(), statusDone: false, editor: '', locked: false },
  };
}

/** 依條碼合併四份資料；檢體依 CellaVision 資料庫的順序（取像完成才出現在新介面） */
export function mergeByBarcode(sources: IntakeSources): { specimens: Specimen[]; issues: IntakeIssue[] } {
  const issues: IntakeIssue[] = [];
  const cv = indexByBarcode(sources.cellavision, 'cellavision', issues);
  const ai = indexByBarcode(sources.ai, 'ai', issues);
  const wam = indexByBarcode(sources.wam, 'wam', issues);
  const lis = indexByBarcode(sources.lis, 'lis', issues);
  const specimens: Specimen[] = [];
  for (const [barcode, image] of cv) {
    const a = ai.get(barcode);
    const w = wam.get(barcode);
    const l = lis.get(barcode);
    if (!a || !w || !l) {
      const missing = (['ai', 'wam', 'lis'] as const).filter((s) => !{ ai: a, wam: w, lis: l }[s]);
      issues.push({
        type: 'missing-source',
        source: missing.join('+'),
        barcode,
        message: `條碼 ${barcode} 缺 ${missing.map((m) => SOURCE_LABELS[m]).join('、')}，暫不進線`,
      });
      continue;
    }
    specimens.push(toSpecimen(barcode, image, a, w, l));
  }
  return { specimens, issues };
}
