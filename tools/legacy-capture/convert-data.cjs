/**
 * 舊版模擬資料 → 新版 TypeScript 資料檔（搬遷時執行一次；內容不變，只換格式）
 * 用法：node tools/legacy-capture/convert-data.cjs <舊版專案資料夾>
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LEGACY = path.resolve(process.argv[2] || '');
const ROOT = path.join(__dirname, '../..');
const load = (file, name) => {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(LEGACY, file), 'utf8').replace(/^const (\w+) =/m, 'var $1 ='), ctx);
  return vm.runInContext(name, ctx);
};
const json = (v) => JSON.stringify(v, null, 2).replace(/"([A-Za-z_$][\w$]*)":/g, '$1:');

function write(rel, header, body) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, header.trim() + '\n' + body.trim() + '\n');
  console.log(rel, Math.round(fs.statSync(file).size / 1024) + ' KB');
}

write(
  'src/data/sources/cellavision-db.ts',
  `
/**
 * 模擬來源：CellaVision 資料庫（DI-60 取像結果）
 *
 * 現況 DI-60 拍的細胞影像只存在 CellaVision 資料庫，由林口人工智慧中心的 AI 模型讀取（文件 2 附錄 A #4）；
 * 新介面只取影像與取像時間，不使用 CellaVision 的 AI 預分類。
 *   barcode       檢體條碼（11 碼）
 *   analysisTime  取像／分析時間
 *   cells         每顆細胞：cellId（檢體條碼-流水號）、image（影像路徑）
 * 原型的影像是範例圖（public/assets/images/cells/，依類別資料夾存放），同一類細胞在不同檢體會重複使用。
 */
import type { CellaVisionRecord } from './types';
`,
  'export const SOURCE_CELLAVISION: CellaVisionRecord[] = ' +
    json(load('assets/data/sources/cellavision-db.js', 'SOURCE_CELLAVISION')) +
    ';',
);

write(
  'src/data/sources/wam.ts',
  `
/**
 * 模擬來源：WAM（XN-9000 CBC／DC 結果與 SIS rule 判讀）
 *   machine      玻片機台（玻片所在的 DI-60：DI1／DI2）
 *   location     檢體歸位（TS-10 架號-位置，例 125-2）
 *   cbc          CBC data；flowDc  Flow DC data（未成熟與異常細胞流式儀無法提供，為 '-'）
 *   cbcFlags     CBC flag（L、LL、H、HH、DC）；flowDcFlags  Flow DC flag
 *   pltFlag      PLT 的 LIS-flag：P（PLT**）／A（全部**）觸發血小板確認（規則 3）
 *   sisRules     觸發的 SIS rule 編號
 * cbcFlags、flowDcFlags 為模擬值，新介面目前不顯示、不參與判斷，保留供日後使用。
 */
import type { WamRecord } from './types';
`,
  'export const SOURCE_WAM: WamRecord[] = ' + json(load('assets/data/sources/wam.js', 'SOURCE_WAM')) + ';',
);

write(
  'src/data/sources/lis.ts',
  `
/**
 * 模擬來源：LIS（病患資料、收件時間、前次報告、需推片確認註記）；新介面直接向 LIS 取
 *   age                LIS 提供的年齡（規則 1）
 *   receivedTime       收件時間（時效＝收件到現在的分鐘數；模擬資料＝取像時間前 30 分鐘）
 *   smearRequiredNote  「需推片確認」註記（規則 2；實際作業為拉片）
 *   prevReportDate／prevReport  前次報告（LIS 最近一次）：wbc、plt 與各分類（%）
 */
import type { LisRecord } from './types';
`,
  'export const SOURCE_LIS: LisRecord[] = ' + json(load('assets/data/sources/lis.js', 'SOURCE_LIS')) + ';',
);

write(
  'src/data/sources/ai-model-mock.ts',
  `
/**
 * 模擬設定：AI 模型（林口人工智慧中心開發）
 * 原型無法執行真正的模型，由 infra/ai-model.ts 依以下設定模擬「讀取 CellaVision 影像 → 預分類」：
 *  - FOLDER_TO_CATEGORY      範例圖所在資料夾 → 預分類（範例圖依真實類別存放，等於模型判對）
 *  - CONFIDENCE_BY_CATEGORY  模擬的信心值；未列的類別不提供（右鍵選單不顯示 AI 建議）
 *  - CELL_OVERRIDES          指定細胞的模擬誤判（淋巴球影像被判為 Blast）
 *  - NO_CONFIDENCE_BARCODES  這些檢體除 CELL_OVERRIDES 外不提供信心值（維持研究情境畫面）
 *  - FIXED_DIFF              這些檢體的 AI 分類結果沿用研究用的既有數值，不由逐顆結果計算
 */
import type { AiModelMockSettings } from './types';
`,
  'export const AI_MODEL_MOCK: AiModelMockSettings = ' +
    json(load('assets/data/sources/ai-model-mock.js', 'AI_MODEL_MOCK_SETTINGS')) +
    ';',
);

const dbSrc = fs.readFileSync(path.join(LEGACY, 'assets/data/database.js'), 'utf8');
const demoState = vm.runInContext(
  dbSrc.slice(dbSrc.indexOf('var DEMO_STATE'), dbSrc.indexOf('var APP_DATABASE')) + ';DEMO_STATE',
  vm.createContext({}),
);
const lists = vm.runInContext(
  '({' + dbSrc.match(/departments: \[[^\]]*\]/)[0] + ',' + dbSrc.match(/machines: \[[^\]]*\]/)[0] + '})',
  vm.createContext({}),
);
write(
  'src/data/demo-state.ts',
  `
/**
 * 【展示用】新介面本身的處理狀態（不是外部系統的資料）：
 *   editor 編輯人員、locked 鎖定中（他人編輯中）、completed 展示用的已完成檢體（所有流程旗標設為完成）
 *   notes 只是模擬情境說明，程式不使用
 * 正式系統由新介面自己的資料庫提供。
 */
export interface DemoState {
  editor?: string;
  locked?: boolean;
  completed?: boolean;
  notes?: string[];
}
`,
  'export const DEMO_STATE: Record<string, DemoState> = ' +
    json(demoState) +
    ';\n\n/** 篩選選單的選項 */\nexport const DEPARTMENTS: string[] = ' +
    json(lists.departments) +
    ';\nexport const MACHINES: string[] = ' +
    json(lists.machines) +
    ';',
);

write(
  'src/demo/usability-scenarios.ts',
  `
/**
 * 【展示用】情境模擬測試（改善後成效調查）：各情境專屬的檢體清單與任務說明
 * 切換情境時檢體管理只顯示該情境的檢體；「正式清單」顯示全部模擬資料。
 */
import type { UsabilityScenarios } from './types';
`,
  'export const USABILITY_SCENARIOS: UsabilityScenarios = ' +
    json(load('demo/usability-scenarios.js', 'APP_USABILITY_SCENARIOS')) +
    ';',
);
