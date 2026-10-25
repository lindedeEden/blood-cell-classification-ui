/**
 * 頁面啟動（組裝各模組）：登入檢查 → 載入門檻與檢體 →（展示用）情境模擬測試 → 檢體資料
 */
import { AppConfig } from '../config';
import { SpecimenStore } from '../app/specimen-store';
import { ThresholdSettings } from '../app/thresholds';
import { loadDatabase } from '../data/database';
import { UsabilityStudy } from '../demo/usability-study';
import { requireAuth, startIdleWatcher } from '../infra/auth';
import { lisLog } from '../infra/storage';
import type { AppContext } from '../ui/context';

/** 需要登入的頁面：未登入時導回登入頁並回傳 null */
export function bootstrap(): AppContext | null {
  if (!requireAuth()) return null;
  if (window.top === window) startIdleWatcher(); // 嵌在影像檢視頁裡的報告頁由外層負責
  const thresholds = new ThresholdSettings();
  const db = loadDatabase();
  const study = new UsabilityStudy(db, thresholds); // 必須在建立 SpecimenStore 之前
  const store = new SpecimenStore(db, thresholds, { listFilter: study.filter });
  study.attach(store);
  return { store, thresholds, study };
}

/**
 * 原型的開發者工具指令（瀏覽器 Console 輸入 __demo.xxx）：
 *  __demo.withdrawFromLis('條碼')  模擬收到 LIS 撤回通知（規則 15；正式系統由 POST /lis/withdrawal 觸發）
 *  __demo.lisLog()                 查看回寫 LIS 的紀錄（規則 14）
 */
export function exposeDemoConsole(ctx: AppContext): void {
  if (AppConfig.ENV === 'production') return;
  Object.assign(window, {
    __demo: {
      withdrawFromLis: (barcode: string) => ctx.store.withdrawFromLis(barcode),
      lisLog: () => lisLog.read(),
    },
  });
}
