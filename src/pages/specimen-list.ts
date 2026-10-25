/** 檢體管理頁 */
import { startTutorial } from '../demo/tutorial';
import { initSpecimenListPage } from '../ui/specimen-list/specimen-list-page';
import { bootstrap, exposeDemoConsole } from './bootstrap';

const ctx = bootstrap();
if (ctx) {
  initSpecimenListPage(ctx);
  exposeDemoConsole(ctx);
  startTutorial('specimen-list'); // 展示用
}
