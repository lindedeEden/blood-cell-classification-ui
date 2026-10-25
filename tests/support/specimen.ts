/**
 * 測試用檢體：結構與合併後相同（imaging／wam／lis／review）
 * 選項：age、values（AI 值，含 wbc、plt）、prev（前次報告，含 wbc、plt）、edited（人員編輯值）、
 *       note（LIS 需推片確認註記）、pltFlag，以及處理狀態 status、workflowDone、locked
 */
import { normalizeWorkflow } from '../../src/domain/rules/workflow';
import type { DiffValues, Specimen, StatusKey, WorkflowFlags } from '../../src/domain/types';

export interface SpecOptions {
  barcode?: string;
  age?: number | null;
  values?: Record<string, string>;
  prev?: Record<string, string>;
  edited?: DiffValues;
  note?: boolean;
  pltFlag?: string;
  status?: StatusKey[];
  workflowDone?: Partial<WorkflowFlags>;
  locked?: boolean;
}

function split(values: Record<string, string> = {}) {
  const { wbc, plt, ...diff } = values;
  return { wbc, plt, diff };
}

export function mkSpec(o: SpecOptions = {}): Specimen {
  const cur = split(o.values);
  const prev = split(o.prev);
  const spec: Specimen = {
    barcode: o.barcode ?? 'S',
    imaging: { analysisTime: '2025-08-07 10:00', cells: [], aiDiff: cur.diff },
    wam: {
      machine: '',
      location: '',
      cbc: { wbc: cur.wbc, plt: cur.plt },
      flowDc: {},
      cbcFlags: {},
      flowDcFlags: [],
      pltFlag: o.pltFlag ?? '',
      sisRules: [],
    },
    lis: {
      patientId: '',
      name: '',
      gender: '',
      birthDate: '',
      age: o.age === undefined ? null : o.age,
      department: '',
      receivedTime: '',
      smearRequiredNote: !!o.note,
      prevReport: { date: '', wbc: prev.wbc, plt: prev.plt, cbc: {}, diff: prev.diff },
    },
    review: {
      status: o.status ?? ['Digital Review'],
      workflowDone: normalizeWorkflow(o.workflowDone),
      statusDone: false,
      editor: '',
      locked: !!o.locked,
    },
  };
  if (o.edited) spec.review.editedDiff = o.edited;
  return spec;
}

export const adult = (o: SpecOptions = {}) => mkSpec({ age: 40, ...o });
export const child = (o: SpecOptions = {}) => mkSpec({ age: 10, ...o });
