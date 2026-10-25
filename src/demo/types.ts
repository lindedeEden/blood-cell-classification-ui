/** 情境模擬測試的資料格式（answerKey 等主持人對照用欄位，程式不使用） */
import type { Specimen } from '../domain/types';

export interface UsabilityScenario {
  id: string;
  title: string;
  specimenIds: string[] | null;
  taskCard: string | null;
  [extra: string]: unknown;
}

export interface UsabilityScenarios {
  /** 研究當時的進線資料：只在情境模擬測試啟用時套用（依資料來源分組） */
  studyIntakeOverrides: Record<string, { [G in 'lis' | 'wam' | 'imaging']?: Partial<Specimen[G]> }>;
  normal: UsabilityScenario;
  scenarios: UsabilityScenario[];
}
