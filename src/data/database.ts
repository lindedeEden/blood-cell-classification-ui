/**
 * 原型的檢體資料：四份模擬資料依條碼合併（第 2 章），再套用展示用的處理狀態。
 * 正式系統改由後端 API 提供（GET /specimens）。
 */
import { mergeByBarcode, type IntakeIssue } from '../domain/rules/intake-merge';
import type { Specimen } from '../domain/types';
import { classifyAll } from './ai-model';
import { DEMO_STATE, DEPARTMENTS, MACHINES } from './demo-state';
import { AI_MODEL_MOCK } from './sources/ai-model-mock';
import { SOURCE_CELLAVISION } from './sources/cellavision-db';
import { SOURCE_LIS } from './sources/lis';
import { SOURCE_WAM } from './sources/wam';

export interface Database {
  /** 進線後的檢體（膠囊由 SpecimenStore 依進線資料產生） */
  specimens: Specimen[];
  /** 進線異常（缺來源、條碼格式不符、重複）；原型只輸出到開發者工具 */
  intakeIssues: IntakeIssue[];
  departments: string[];
  machines: string[];
}

/** 每次呼叫都產生一份新的資料（各頁面自己一份，狀態經由瀏覽器儲存同步） */
export function loadDatabase(): Database {
  const merged = mergeByBarcode({
    cellavision: SOURCE_CELLAVISION,
    ai: classifyAll(AI_MODEL_MOCK, SOURCE_CELLAVISION), // AI 模型讀取影像 → 每顆預分類、AI 分類結果
    wam: SOURCE_WAM,
    lis: SOURCE_LIS,
  });
  for (const issue of merged.issues) console.warn('[進線] ' + issue.message);
  for (const spec of merged.specimens) {
    const demo = DEMO_STATE[spec.barcode] ?? {};
    spec.review.editor = demo.editor || '';
    spec.review.locked = !!demo.locked;
    if (demo.completed) {
      spec.review.workflowDone = {
        digitalReview: true,
        digitalReviewSignedOff: true,
        aiAlertConfirmed: true,
        entityReview: true,
        entityStatusDone: { 'PLT Check': true, 'Follow-up': true },
      };
    }
  }
  return {
    specimens: merged.specimens,
    intakeIssues: merged.issues,
    departments: DEPARTMENTS.slice(),
    machines: MACHINES.slice(),
  };
}
