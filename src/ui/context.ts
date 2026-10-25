/**
 * 各頁面需要的模組（由 src/pages/bootstrap.ts 組裝後傳入）
 *
 * 畫面層只認得這裡定義的介面，不直接依賴 pages 或 demo：
 * 展示用的「情境模擬測試」以 ScenarioPanel 介面接入，移除 src/demo 時傳 null 即可。
 */
import type { SpecimenStore } from '../app/specimen-store';
import type { ThresholdSettings } from '../app/thresholds';
import type { SafeHtml } from './shared/dom';

/** 展示用：情境模擬測試視窗需要的操作 */
export interface ScenarioPanel {
  activeId(): string;
  isActive(): boolean;
  active(): { id: string; title: string } | null;
  apply(scenarioId: string): void;
  panelHtml(selectedId: string): SafeHtml;
}

export interface AppContext {
  store: SpecimenStore;
  thresholds: ThresholdSettings;
  /** 展示用：情境模擬測試（移除 src/demo 時為 null） */
  study: ScenarioPanel | null;
}
