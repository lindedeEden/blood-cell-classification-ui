/** 影像檢視與細胞編輯頁 */
import { startTutorial } from '../demo/tutorial';
import { initImageReviewPage } from '../ui/image-review/image-review-page';
import { bootstrap } from './bootstrap';

const ctx = bootstrap();
if (ctx) initImageReviewPage(ctx, () => startTutorial('image-review'));
