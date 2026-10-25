/**
 * 【展示用】「情境模擬測試」視窗：選擇情境、預覽、套用或還原正式清單（情境內容見 src/demo）
 */
import type { ScenarioPanel } from '../context';
import { byId, mustGet, setHtml } from '../shared/dom';

/** onApplied：套用（nextId 為情境 id；空字串＝還原正式清單）後重設條件並重繪清單 */
export function bindScenarioModal(
  study: ScenarioPanel,
  onApplied: (nextId: string) => void,
  setFooter: (text: string) => void,
): void {
  const modal = mustGet('modal-scenario-simulation');
  const body = mustGet('modal-scenario-simulation-body');
  const checkedId = () => body.querySelector<HTMLInputElement>('input[name="usability-scenario"]:checked')?.value ?? '';
  const build = (previewId?: string) => {
    setHtml(body, study.panelHtml(previewId ?? study.activeId()));
    body
      .querySelectorAll('input[name="usability-scenario"]')
      .forEach((radio) => radio.addEventListener('change', () => build(checkedId())));
  };
  const close = () => modal.classList.add('hidden');
  const showActiveInFooter = () => {
    const sc = study.active();
    if (sc?.id) setFooter('情境模擬測試：' + sc.title);
  };
  mustGet('btn-scenario-simulation').addEventListener('click', () => {
    build();
    modal.classList.remove('hidden');
  });
  for (const id of [
    'modal-scenario-simulation-close',
    'modal-scenario-simulation-backdrop',
    'modal-scenario-simulation-cancel',
  ]) {
    byId(id)?.addEventListener('click', close);
  }
  mustGet('modal-scenario-simulation-apply').addEventListener('click', () => {
    const nextId = checkedId();
    study.apply(nextId);
    onApplied(nextId);
    showActiveInFooter();
    const sc = study.active();
    setFooter(sc?.id ? '已套用：' + sc.title : '已還原正式清單');
    close();
  });
  showActiveInFooter();
}
