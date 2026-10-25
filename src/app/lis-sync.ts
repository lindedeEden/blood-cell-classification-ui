/**
 * 結果回傳 LIS（規則 14；改為人工鏡檢的註記見規則 10）
 *  - 簽核 → WBC Diff%、非白血球數據（POST /lis/results）
 *  - 改為人工鏡檢 → 「需拉片確認」；需拉片確認完成 → 「拉片完成」；血小板確認完成 → 「血小板確認完成」
 *  - 開鎖後簽核、待辦的需拉片確認隨簽核完成 → 「數位閱片替代拉片鏡檢」
 * 取消完成（再點一次膠囊）時不回傳（血液組已確認）。LIS 實際的欄位與格式待確認（附錄 A #1）。
 *
 * 原型：模擬 API 回應，每次回寫另記在瀏覽器（開發者工具執行 __demo.lisLog() 查看）；正式系統由後端寫入 LIS。
 */
import { notePayload, resultsPayload, type LisNote } from '../domain/lis';
import type { Specimen } from '../domain/types';
import { api } from '../infra/api';
import { lisLog } from '../infra/storage';

export interface LisGateway {
  sendResults(spec: Specimen): Promise<boolean>;
  sendNote(spec: Specimen, note: LisNote): Promise<boolean>;
}

async function post(path: string, body: object): Promise<boolean> {
  lisLog.append({ path, body, at: new Date().toISOString() });
  try {
    await api.post(path, body);
    return true;
  } catch {
    return false;
  }
}

export const lisSync: LisGateway = {
  sendResults: (spec) => post('/lis/results', resultsPayload(spec)),
  sendNote: (spec, note) => post('/lis/notes', notePayload(spec, note)),
};
