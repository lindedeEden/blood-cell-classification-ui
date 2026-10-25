/**
 * 檢體資料結構（文件 2 第 2.1 節「合併後的欄位」）
 *
 * 外部系統提供的資料依來源分組（imaging、wam、lis），
 * 新介面自己產生的處理狀態放在 review，兩者不混在一起。
 */

/** 狀態膠囊（畫面顯示中文，見 constants/status.ts） */
export type StatusKey = 'Digital Review' | 'AI Alert' | 'Follow-up' | 'PLT Check' | 'Locked';

/** 實體作業的膠囊（實體作業醫檢師在清單點選完成，規則 12） */
export type EntityStatusKey = 'Follow-up' | 'PLT Check';

/** 檢體管理的狀態篩選選項：膠囊＋「已完成」 */
export type FilterKey = StatusKey | 'Verified';

/** 檢體管理的兩種模式（規則 5） */
export type ListMode = 'digital' | 'entity';

/** 外部系統給的數值：多半是字串（例 '93.0'），沒有值為 '-' 或空白 */
export type RawValue = string | number | null | undefined;

/** 細胞分類欄位（imaging.aiDiff、lis.prevReport.diff、review.editedDiff 共用） */
export type DiffKey =
  | 'band'
  | 'segmentedNeutrophil'
  | 'eosinophil'
  | 'monocyte'
  | 'basophil'
  | 'lymphocyte'
  | 'atypicalLymphocyte'
  | 'abnormalLymphocyte'
  | 'blast'
  | 'promyelocyte'
  | 'myelocyte'
  | 'metamyelocyte'
  | 'hypersegmented'
  | 'promonocyte'
  | 'plasmaCell'
  | 'megakaryocyte'
  | 'nrbc'
  | 'giantPlt'
  | 'smudgeCell'
  | 'artefact';

/** 判斷用的數值：WBC、PLT ＋ 各細胞分類 */
export type MetricKey = DiffKey | 'wbc' | 'plt';

export type DiffValues = Partial<Record<DiffKey, string>>;
export type MetricValues = Partial<Record<MetricKey, RawValue>>;

/** 影像檢視頁的細胞類別名稱（例 'Segmented Neutrophil'），含待分類 'Unidentified' */
export type CellCategory = string;

/** 一顆細胞：CellaVision 影像＋AI 模型預分類 */
export interface ImagingCell {
  cellId: string;
  imagePath: string;
  aiCategory: CellCategory;
  aiConfidence: number | null;
}

export interface Imaging {
  /** DI-60 取像時間 */
  analysisTime: string;
  cells: ImagingCell[];
  /** AI 分類結果（Diff%）＝各畫面的「AI 值」 */
  aiDiff: DiffValues;
}

export interface Cbc {
  wbc?: string;
  plt?: string;
  rbc?: string;
  hb?: string;
  hct?: string;
  mcv?: string;
  mch?: string;
  mchc?: string;
}

export interface Wam {
  /** 玻片機台（DI1／DI2） */
  machine: string;
  /** 檢體歸位（TS-10 架號-位置） */
  location: string;
  cbc: Cbc;
  flowDc: Partial<Record<DiffKey, string>>;
  cbcFlags: Record<string, string>;
  flowDcFlags: string[];
  /** PLT 的 LIS-flag：P／A 觸發血小板確認（規則 3） */
  pltFlag: string;
  sisRules: string[];
}

/** 前次報告的 CBC 項目（WBC、PLT 另列；報告簽核頁 CBC 數值區顯示前次） */
export type PrevCbcKey = 'rbc' | 'hb' | 'hct' | 'mcv' | 'mch' | 'mchc';

export interface PrevReport {
  date: string;
  wbc?: string;
  plt?: string;
  /** RBC、Hb、HCT、MCV、MCH、MCHC */
  cbc: Partial<Record<PrevCbcKey, string>>;
  diff: DiffValues;
}

export interface Lis {
  patientId: string;
  name: string;
  gender: string;
  birthDate: string;
  /** LIS 提供的年齡；沒有時視為成人（規則 1） */
  age: number | null;
  department: string;
  /** 收件時間：清單時效＝收件到現在經過的分鐘數 */
  receivedTime: string;
  /** 「需推片確認」註記（規則 2；實際作業為拉片） */
  smearRequiredNote: boolean;
  prevReport: PrevReport;
}

/** 流程旗標（規則 13）：哪些膠囊已完成 */
export interface WorkflowFlags {
  /** 數位閱片已結束（簽核或改為人工鏡檢） */
  digitalReview: boolean;
  /** 數位閱片已簽核 */
  digitalReviewSignedOff: boolean;
  aiAlertConfirmed: boolean;
  /** 實體作業膠囊全部完成 */
  entityReview: boolean;
  entityStatusDone: Partial<Record<EntityStatusKey, boolean>>;
}

/** 新介面自己的處理狀態（正式系統存新介面後端） */
export interface Review {
  status: StatusKey[];
  workflowDone: WorkflowFlags;
  /** 全部完成（由膠囊與流程旗標計算） */
  statusDone: boolean;
  /** 編輯人員：全部完成時寫入登入帳號 */
  editor: string;
  /** 他人編輯中（規則 6） */
  locked: boolean;
  /** 人員編輯值（影像檢視儲存後產生，規則 8） */
  editedDiff?: DiffValues;
}

export interface Specimen {
  /** 檢體條碼：四份資料的對應鍵，也是網址 ?specimen= 的值 */
  barcode: string;
  imaging: Imaging;
  wam: Wam;
  lis: Lis;
  review: Review;
}

/** 留單門檻：數字（數值 ≥ 門檻即達標）或 'present'（出現即算） */
export type ThresholdValue = number | 'present';
export type ThresholdKey =
  | 'wbc'
  | 'lymphocyte'
  | 'monocyte'
  | 'eosinophil'
  | 'basophil'
  | 'atypicalLymphocyte'
  | 'blast'
  | 'promyelocyte'
  | 'myelocyte'
  | 'metamyelocyte'
  | 'hypersegmented'
  | 'promonocyte'
  | 'plasmaCell'
  | 'abnormalLymphocyte'
  | 'lymphocytePediatric'
  | 'megakaryocyte';
export type Thresholds = Record<ThresholdKey, ThresholdValue>;

/** 報告簽核頁橫幅（規則 4） */
export interface RiskState {
  /** 新發：紅色 */
  hasNewLeave: boolean;
  /** 本次有任一項達標 */
  hasLeaveNow: boolean;
  /** 延續性異常：黃色 */
  isPersistentLeave: boolean;
}

/** 報告簽核頁的鎖頭鎖住哪個按鈕（規則 9、10） */
export type LockTarget = 'signOff' | 'manualReview' | null;
