/** 報告簽核頁（只內嵌在影像檢視頁；直接開啟時回到檢體管理） */
import { startTutorial } from '../demo/tutorial';
import { initReportPage } from '../ui/report/report-page';
import { bootstrap } from './bootstrap';

const ctx = bootstrap();
if (ctx) {
  if (initReportPage(ctx)) startTutorial('report-issue'); // 展示用
}
