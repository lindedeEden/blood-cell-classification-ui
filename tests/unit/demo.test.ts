/**
 * 【展示用】情境模擬測試（src/demo/usability-study.ts）
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { SpecimenStore } from '../../src/app/specimen-store';
import { ThresholdSettings } from '../../src/app/thresholds';
import { loadDatabase } from '../../src/data/database';
import { UsabilityStudy } from '../../src/demo/usability-study';
import { USABILITY_SCENARIOS } from '../../src/demo/usability-scenarios';
import { editedStorage } from '../../src/infra/storage';

beforeEach(() => localStorage.clear());

function setup() {
  const thresholds = new ThresholdSettings();
  const db = loadDatabase();
  const study = new UsabilityStudy(db, thresholds);
  const store = new SpecimenStore(db, thresholds, { listFilter: study.filter });
  study.attach(store);
  return { store, study };
}

describe('情境模擬測試', () => {
  it('重新套用情境：情境檢體的人員編輯結果全部清除（下一位受試者看不到上一位的結果）', () => {
    const scenario = USABILITY_SCENARIOS.scenarios[0]!;
    const id = scenario.specimenIds![0]!;
    const { store, study } = setup();
    study.apply(scenario.id);
    const spec = store.getById(id)!;
    store.saveEditedResult(spec, { blast: '9.0' }, []);
    study.apply(scenario.id);
    expect([store.getById(id)!.review.editedDiff, editedStorage.loadDiff(id), editedStorage.loadCells(id)]).toEqual([
      undefined,
      null,
      null,
    ]);
  });
  it('套用情境後清單只列該情境的檢體；還原後列出全部', () => {
    const scenario = USABILITY_SCENARIOS.scenarios[0]!;
    const { store, study } = setup();
    study.apply(scenario.id);
    expect(
      store
        .listForDisplay()
        .map((s) => s.barcode)
        .sort(),
    ).toEqual([...scenario.specimenIds!].sort());
    study.apply('');
    expect(store.listForDisplay()).toHaveLength(store.all().length);
  });
});
