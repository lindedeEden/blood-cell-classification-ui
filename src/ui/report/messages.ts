/**
 * 報告簽核頁（內嵌在影像檢視頁）→ 影像檢視頁 的通知（window.postMessage）
 * 外層頁面只接受自己開啟的內嵌視窗送來的訊息（檢查 event.source）。
 */
export type ReportMessage =
  | { type: 'reportVerified'; specimenId: string; navigateNext: boolean; confirmAiAlert: boolean; unlocked: boolean }
  | { type: 'reportManualAlert'; specimenId: string; addedFollowUp: boolean; lisSynced: boolean }
  | { type: 'reportFollowUpDone'; specimenId: string }
  | { type: 'reportCancel'; specimenId?: string }
  /** 使用者正在報告頁操作（閒置自動登出由外層頁面計時，內嵌視窗裡的操作外層收不到） */
  | { type: 'reportActivity'; specimenId?: string };
