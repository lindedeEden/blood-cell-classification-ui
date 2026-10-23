/**
 * StatusConstants — 檢體狀態標籤（膠囊）定義（唯一來源）
 *
 * 狀態 key 一律用英文（資料與規則使用）；畫面顯示用中文 LABELS。
 * 對應《邏輯規則說明文件》3.1 節「四種膠囊」。
 */

const StatusConstants = Object.freeze({

  /** 狀態 key → 中文顯示名稱 */
  LABELS: Object.freeze({
    'PLT Check': '血小板確認',
    'Digital Review': '數位閱片',
    'AI Alert': 'AI分類警示',
    'Follow-up': '需拉片確認',
    'Locked': '鎖定中',
  }),

  /** 狀態 key → 膠囊顏色（Tailwind class） */
  STYLES: Object.freeze({
    'PLT Check': 'bg-blue-100 text-blue-800',
    'Digital Review': 'bg-purple-100 text-purple-800',
    'AI Alert': 'bg-orange-100 text-orange-800',
    'Follow-up': 'bg-red-100 text-red-800',
    'Locked': 'bg-gray-200 text-gray-800 border border-gray-300',
  }),

  /** 已完成的膠囊（顯示綠勾） */
  DONE_STYLE: 'bg-green-100 text-green-800',

  /** 未定義狀態的預設顏色 */
  DEFAULT_STYLE: 'bg-gray-100 text-gray-800',

  /** 實體作業標籤（規則 5）；AI Alert 不在此列，其完成記於 workflowDone.aiAlertConfirmed */
  ENTITY_STATUSES: Object.freeze(['PLT Check', 'Follow-up']),

  /** 檢體管理「模式」預設勾選的狀態（第 4 節） */
  MODE_DEFAULT_STATUS: Object.freeze({
    digital: Object.freeze(['Digital Review', 'AI Alert']),
    entity: Object.freeze(['Follow-up', 'PLT Check']),
  }),

  /** 未選模式時，狀態篩選全部勾選（'Verified' 是篩選「已完成」檢體的選項，不是膠囊） */
  ALL_FILTER_STATUSES: Object.freeze(['PLT Check', 'AI Alert', 'Follow-up', 'Digital Review', 'Verified', 'Locked']),

});
