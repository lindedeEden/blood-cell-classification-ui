/**
 * 返回檢體管理頁時的一次性提示文字（改為人工鏡檢、拉片完成、簽核完成；提示內容由前一頁排入 infra/storage 的 toasts）
 */

export function manualReviewToastText(manual: {
  specimenId: string;
  addedFollowUp: boolean;
  lisSynced: boolean;
}): string {
  return manual.addedFollowUp
    ? `${manual.specimenId} 已歸入需拉片確認，等待人工鏡檢${manual.lisSynced ? '；已同步 LIS 需拉片確認註記' : '；LIS 註記同步失敗，請手動註記'}`
    : `${manual.specimenId} 已確認 AI分類警示`;
}

/** inStudy：情境模擬測試中不提 LIS 註記（維持研究當時的畫面） */
export function followUpDoneToastText(
  followUp: { specimenId: string; workflowCompleted: boolean },
  inStudy: boolean,
): string {
  return (
    followUp.specimenId +
    (followUp.workflowCompleted ? ' 已標記拉片完成，檢體流程已完成' : ' 已標記拉片完成，尚有其他待辦') +
    (inStudy ? '' : '；已在 LIS 檢驗註記「拉片完成」')
  );
}

export function reportVerifiedToastText(verified: { specimenId: string; workflowCompleted: boolean }): string {
  return verified.specimenId + (verified.workflowCompleted ? ' 簽核完成，檢體流程已完成' : ' 簽核完成，尚有其他待辦');
}
