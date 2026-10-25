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
import type { CellaVisionRecord } from '../../domain/source-records';
export const SOURCE_CELLAVISION: CellaVisionRecord[] = [
  {
    barcode: "H5080720847",
    analysisTime: "2025-08-07 20:14",
    cells: [
      {
        cellId: "H5080720847-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-064",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-065",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-066",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-067",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-068",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-069",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-070",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-071",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-072",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-073",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-074",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-075",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-076",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-077",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-078",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-079",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-080",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-081",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-082",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-083",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-084",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-085",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-086",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-087",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-088",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720847-089",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720847-090",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720847-091",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720847-092",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720847-093",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720847-094",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080720847-095",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080720847-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720847-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080720276",
    analysisTime: "2025-08-07 18:07",
    cells: [
      {
        cellId: "H5080720276-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720276-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720276-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720276-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720276-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720276-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720276-063",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080720276-064",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080720276-065",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080720276-066",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080720276-067",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080720276-068",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080720276-069",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080720276-070",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080720276-071",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080720276-072",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080720276-073",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-074",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-075",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-089",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-090",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-091",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-092",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-093",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-094",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-095",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-096",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-097",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720276-098",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720276-099",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720276-100",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      }
    ]
  },
  {
    barcode: "H5080720647",
    analysisTime: "2025-08-07 18:07",
    cells: [
      {
        cellId: "H5080720647-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080720647-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080720647-003",
        image: "assets/images/cells/band/BNE_4536251.jpg"
      },
      {
        cellId: "H5080720647-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720647-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720647-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720647-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720647-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720647-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720647-062",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080720647-063",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080720647-064",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080720647-065",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080720647-066",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080720647-067",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080720647-068",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080720647-069",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080720647-070",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080720647-071",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080720647-072",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080720647-073",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720647-074",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720647-075",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720647-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720647-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720647-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720647-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720647-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720647-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720647-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720647-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720647-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720647-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720647-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720647-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720647-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720647-089",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720647-090",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720647-091",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720647-092",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720647-093",
        image: "assets/images/cells/blast/BL_1007359.jpg"
      },
      {
        cellId: "H5080720647-094",
        image: "assets/images/cells/blast/BL_12091185.jpg"
      },
      {
        cellId: "H5080720647-095",
        image: "assets/images/cells/blast/BL_1319505.jpg"
      },
      {
        cellId: "H5080720647-096",
        image: "assets/images/cells/blast/BL_1007359.jpg"
      },
      {
        cellId: "H5080720647-097",
        image: "assets/images/cells/blast/BL_12091185.jpg"
      },
      {
        cellId: "H5080720647-098",
        image: "assets/images/cells/blast/BL_1319505.jpg"
      }
    ]
  },
  {
    barcode: "H5080720696",
    analysisTime: "2025-08-07 18:09",
    cells: [
      {
        cellId: "H5080720696-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080720696-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080720696-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080720696-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080720696-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080720696-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080720696-059",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080720696-060",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080720696-061",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080720696-062",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080720696-063",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080720696-064",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080720696-065",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080720696-066",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080720696-067",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080720696-068",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080720696-069",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-070",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-071",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080720696-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080720696-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080720696-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080706286",
    analysisTime: "2025-08-07 18:08",
    cells: [
      {
        cellId: "H5080706286-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080706286-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080706286-003",
        image: "assets/images/cells/band/BNE_4536251.jpg"
      },
      {
        cellId: "H5080706286-004",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080706286-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-064",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-065",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-066",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-067",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-068",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-069",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-070",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-071",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-072",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-073",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706286-074",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706286-075",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706286-076",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706286-077",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706286-078",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706286-079",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080706286-080",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080706286-081",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706286-082",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706286-083",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080706286-084",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706286-085",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706286-086",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080706286-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706286-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706286-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706286-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706286-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706286-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706286-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706286-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706286-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706286-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706286-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706286-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706286-099",
        image: "assets/images/cells/blast/BL_1007359.jpg"
      },
      {
        cellId: "H5080706286-100",
        image: "assets/images/cells/blast/BL_12091185.jpg"
      }
    ]
  },
  {
    barcode: "H5080706280",
    analysisTime: "2025-08-07 18:06",
    cells: [
      {
        cellId: "H5080706280-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080706280-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080706280-003",
        image: "assets/images/cells/band/BNE_4536251.jpg"
      },
      {
        cellId: "H5080706280-004",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080706280-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706280-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706280-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706280-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706280-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706280-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706280-063",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080706280-064",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080706280-065",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706280-066",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706280-067",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080706280-068",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706280-069",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706280-070",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080706280-071",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-072",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-073",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-074",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-075",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-076",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-077",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-078",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-079",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-080",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-081",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-082",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-083",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-084",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-085",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-086",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-087",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-088",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-089",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-090",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-091",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-092",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-093",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-094",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-095",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-096",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-097",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706280-098",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706280-099",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706280-100",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      }
    ]
  },
  {
    barcode: "H5080706275",
    analysisTime: "2025-08-07 18:05",
    cells: [
      {
        cellId: "H5080706275-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080706275-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080706275-003",
        image: "assets/images/cells/band/BNE_4536251.jpg"
      },
      {
        cellId: "H5080706275-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706275-064",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706275-065",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706275-066",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706275-067",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706275-068",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706275-069",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080706275-070",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080706275-071",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706275-072",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706275-073",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080706275-074",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706275-075",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706275-076",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080706275-077",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080706275-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706275-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706275-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706275-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706275-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706275-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706275-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706275-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706275-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706275-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706275-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706275-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706275-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706275-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706275-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706275-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706275-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706275-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706275-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706275-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706275-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706275-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      }
    ]
  },
  {
    barcode: "H5080706301",
    analysisTime: "2025-08-07 18:04",
    cells: [
      {
        cellId: "H5080706301-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080706301-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080706301-003",
        image: "assets/images/cells/band/BNE_4536251.jpg"
      },
      {
        cellId: "H5080706301-004",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080706301-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080706301-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080706301-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080706301-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080706301-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080706301-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080706301-056",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080706301-057",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080706301-058",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080706301-059",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706301-060",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706301-061",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080706301-062",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080706301-063",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080706301-064",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080706301-065",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080706301-066",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-067",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-068",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-069",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-070",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-071",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080706301-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080706301-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080706301-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080721101",
    analysisTime: "2025-08-07 21:05",
    cells: [
      {
        cellId: "H5080721101-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721101-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721101-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721101-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721101-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721101-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721101-059",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721101-060",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721101-061",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721101-062",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721101-063",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721101-064",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721101-065",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721101-066",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721101-067",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721101-068",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721101-069",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-070",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-071",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721101-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721101-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721101-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080721102",
    analysisTime: "2025-08-07 21:12",
    cells: [
      {
        cellId: "H5080721102-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721102-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721102-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721102-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721102-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721102-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721102-056",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721102-057",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721102-058",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721102-059",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721102-060",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721102-061",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721102-062",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721102-063",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721102-064",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721102-065",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721102-066",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-067",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-068",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-069",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-070",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-071",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721102-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721102-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721102-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080721103",
    analysisTime: "2025-08-07 21:18",
    cells: [
      {
        cellId: "H5080721103-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721103-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721103-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721103-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721103-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721103-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721103-063",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721103-064",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721103-065",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721103-066",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721103-067",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721103-068",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721103-069",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721103-070",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721103-071",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721103-072",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721103-073",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-074",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-075",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-089",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-090",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-091",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-092",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-093",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-094",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-095",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-096",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-097",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-098",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721103-099",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721103-100",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721103-101",
        image: "assets/images/cells/promyelocyte/PMY_1066802.jpg"
      },
      {
        cellId: "H5080721103-102",
        image: "assets/images/cells/promyelocyte/PMY_1070753.jpg"
      },
      {
        cellId: "H5080721103-103",
        image: "assets/images/cells/promyelocyte/PMY_1071363.jpg"
      }
    ]
  },
  {
    barcode: "H5080721104",
    analysisTime: "2025-08-07 21:25",
    cells: [
      {
        cellId: "H5080721104-001",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-002",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-003",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721104-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721104-064",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721104-065",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721104-066",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721104-067",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721104-068",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-069",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-070",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-071",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-072",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-073",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-074",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-075",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-076",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-077",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-078",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-079",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-080",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-081",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-082",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-083",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-084",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-085",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-086",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-087",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-088",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-089",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-090",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-091",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-092",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721104-093",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721104-094",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721104-095",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721104-096",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721104-097",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721104-098",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721104-099",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721104-100",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721104-101",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721104-102",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721104-103",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      }
    ]
  },
  {
    barcode: "H5080721105",
    analysisTime: "2025-08-07 21:32",
    cells: [
      {
        cellId: "H5080721105-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721105-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721105-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721105-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721105-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721105-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721105-053",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721105-054",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721105-055",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721105-056",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721105-057",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721105-058",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721105-059",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721105-060",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721105-061",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721105-062",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721105-063",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721105-064",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721105-065",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-066",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-067",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-068",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-069",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-070",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-071",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-072",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-073",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-074",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-075",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-076",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-077",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-078",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-079",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-080",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-081",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-082",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-083",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-084",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-085",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-086",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-087",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-088",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-089",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-090",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-091",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-092",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-093",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-094",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-095",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-096",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-097",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721105-098",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721105-099",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721105-100",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      }
    ]
  },
  {
    barcode: "H5080721106",
    analysisTime: "2025-08-07 21:40",
    cells: [
      {
        cellId: "H5080721106-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721106-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721106-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721106-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721106-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721106-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721106-061",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721106-062",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721106-063",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721106-064",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721106-065",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721106-066",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721106-067",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721106-068",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721106-069",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-070",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-071",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721106-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721106-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721106-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080721107",
    analysisTime: "2025-08-07 21:48",
    cells: [
      {
        cellId: "H5080721107-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721107-064",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721107-065",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721107-066",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721107-067",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721107-068",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721107-069",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721107-070",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721107-071",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721107-072",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721107-073",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721107-074",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721107-075",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721107-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-089",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-090",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-091",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-092",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-093",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-094",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-095",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-096",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-097",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721107-098",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721107-099",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721107-100",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      }
    ]
  },
  {
    barcode: "H5080721108",
    analysisTime: "2025-08-07 21:55",
    cells: [
      {
        cellId: "H5080721108-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721108-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721108-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721108-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721108-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721108-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721108-055",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721108-056",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721108-057",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721108-058",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721108-059",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721108-060",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721108-061",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721108-062",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721108-063",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721108-064",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721108-065",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721108-066",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-067",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-068",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-069",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-070",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-071",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721108-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721108-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721108-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080721109",
    analysisTime: "2025-08-07 22:02",
    cells: [
      {
        cellId: "H5080721109-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721109-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721109-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721109-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721109-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721109-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721109-060",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721109-061",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721109-062",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721109-063",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721109-064",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721109-065",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721109-066",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721109-067",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721109-068",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721109-069",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721109-070",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721109-071",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721109-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721109-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721109-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721109-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080721110",
    analysisTime: "2025-08-07 22:10",
    cells: [
      {
        cellId: "H5080721110-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721110-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721110-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721110-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721110-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721110-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721110-058",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721110-059",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721110-060",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721110-061",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721110-062",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721110-063",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721110-064",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721110-065",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721110-066",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721110-067",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721110-068",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-069",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-070",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-071",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-072",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-073",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-074",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-075",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-076",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-077",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-078",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-079",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-080",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-081",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-082",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-083",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-084",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-085",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-086",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-087",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-088",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-089",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-090",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-091",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-092",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-093",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-094",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-095",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-096",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-097",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721110-098",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721110-099",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721110-100",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      }
    ]
  },
  {
    barcode: "H5080721201",
    analysisTime: "2025-08-07 19:45",
    cells: [
      {
        cellId: "H5080721201-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080721201-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080721201-003",
        image: "assets/images/cells/band/BNE_4536251.jpg"
      },
      {
        cellId: "H5080721201-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721201-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721201-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721201-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721201-064",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721201-065",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721201-066",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721201-067",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721201-068",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721201-069",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721201-070",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721201-071",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721201-072",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721201-073",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721201-074",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721201-075",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721201-076",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721201-077",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721201-078",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721201-079",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721201-080",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721201-081",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721201-082",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721201-083",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721201-084",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721201-085",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721201-086",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721201-087",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721201-088",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721201-089",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721201-090",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721201-091",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721201-092",
        image: "assets/images/cells/blast/BL_1007359.jpg"
      },
      {
        cellId: "H5080721201-093",
        image: "assets/images/cells/blast/BL_12091185.jpg"
      },
      {
        cellId: "H5080721201-094",
        image: "assets/images/cells/blast/BL_1319505.jpg"
      },
      {
        cellId: "H5080721201-095",
        image: "assets/images/cells/blast/BL_1007359.jpg"
      },
      {
        cellId: "H5080721201-096",
        image: "assets/images/cells/blast/BL_12091185.jpg"
      },
      {
        cellId: "H5080721201-097",
        image: "assets/images/cells/blast/BL_1319505.jpg"
      },
      {
        cellId: "H5080721201-098",
        image: "assets/images/cells/blast/BL_1007359.jpg"
      }
    ]
  },
  {
    barcode: "H5080721202",
    analysisTime: "2025-08-07 19:52",
    cells: [
      {
        cellId: "H5080721202-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080721202-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080721202-003",
        image: "assets/images/cells/band/BNE_4536251.jpg"
      },
      {
        cellId: "H5080721202-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721202-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721202-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721202-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721202-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721202-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721202-064",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721202-065",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721202-066",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721202-067",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721202-068",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721202-069",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721202-070",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721202-071",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721202-072",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721202-073",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721202-074",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721202-075",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721202-076",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721202-077",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721202-078",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721202-079",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721202-080",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721202-081",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721202-082",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721202-083",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721202-084",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721202-085",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721202-086",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721202-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721202-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721202-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721202-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721202-091",
        image: "assets/images/cells/abnormal-lymphocyte/MO_9836341.jpg"
      },
      {
        cellId: "H5080721202-092",
        image: "assets/images/cells/abnormal-lymphocyte/MO_9844197.jpg"
      },
      {
        cellId: "H5080721202-093",
        image: "assets/images/cells/abnormal-lymphocyte/UI_9844180.jpg"
      },
      {
        cellId: "H5080721202-094",
        image: "assets/images/cells/abnormal-lymphocyte/MO_9836341.jpg"
      },
      {
        cellId: "H5080721202-095",
        image: "assets/images/cells/abnormal-lymphocyte/MO_9844197.jpg"
      },
      {
        cellId: "H5080721202-096",
        image: "assets/images/cells/abnormal-lymphocyte/UI_9844180.jpg"
      },
      {
        cellId: "H5080721202-097",
        image: "assets/images/cells/abnormal-lymphocyte/MO_9836341.jpg"
      },
      {
        cellId: "H5080721202-098",
        image: "assets/images/cells/abnormal-lymphocyte/MO_9844197.jpg"
      },
      {
        cellId: "H5080721202-099",
        image: "assets/images/cells/abnormal-lymphocyte/UI_9844180.jpg"
      },
      {
        cellId: "H5080721202-100",
        image: "assets/images/cells/abnormal-lymphocyte/MO_9836341.jpg"
      }
    ]
  },
  {
    barcode: "H5080721301",
    analysisTime: "2025-08-07 21:20",
    cells: [
      {
        cellId: "H5080721301-001",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-002",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721301-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721301-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721301-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721301-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721301-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721301-061",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-062",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-063",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-064",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-065",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-066",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-067",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-068",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-069",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-070",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-071",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-072",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-073",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-074",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-075",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721301-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721301-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721301-089",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721301-090",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721301-091",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721301-092",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721301-093",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721301-094",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721301-095",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721301-096",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721301-097",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721301-098",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721301-099",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      }
    ]
  },
  {
    barcode: "H5080721401",
    analysisTime: "2025-08-07 19:30",
    cells: [
      {
        cellId: "H5080721401-001",
        image: "assets/images/cells/band/BNE_4292629.jpg"
      },
      {
        cellId: "H5080721401-002",
        image: "assets/images/cells/band/BNE_4298534.jpg"
      },
      {
        cellId: "H5080721401-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-063",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-064",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-065",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-066",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-067",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-068",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-069",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-070",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-071",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-072",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-073",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-074",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-075",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721401-076",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721401-077",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721401-078",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721401-079",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721401-080",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721401-081",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721401-082",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721401-083",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721401-084",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721401-085",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721401-086",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721401-087",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721401-088",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721401-089",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721401-090",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721401-091",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721401-092",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721401-093",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721401-094",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721401-095",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721401-096",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721401-097",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721401-098",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721401-099",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721401-100",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      }
    ]
  },
  {
    barcode: "H5080721501",
    analysisTime: "2025-08-07 21:05",
    cells: [
      {
        cellId: "H5080721501-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721501-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721501-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721501-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721501-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721501-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721501-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721501-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721501-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721501-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721501-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721501-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721501-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721501-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721501-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721501-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721501-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721501-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721501-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721501-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721501-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721501-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721501-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721501-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721501-025",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721501-026",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721501-027",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721501-028",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721501-029",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721501-030",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721501-031",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-032",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-033",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-034",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-035",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-036",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-037",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-038",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-039",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-040",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-041",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-042",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-043",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-044",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-045",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-046",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-047",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-048",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-049",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-050",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-051",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-052",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-053",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-054",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-055",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-056",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-057",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-058",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-059",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-060",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-061",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-062",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-063",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-064",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-065",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-066",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-067",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-068",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-069",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-070",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-071",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-072",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-073",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-074",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-075",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-089",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-090",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-091",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-092",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-093",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-094",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-095",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-096",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-097",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721501-098",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721501-099",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721501-100",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      }
    ]
  },
  {
    barcode: "H5080721502",
    analysisTime: "2025-08-07 21:12",
    cells: [
      {
        cellId: "H5080721502-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721502-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721502-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721502-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721502-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721502-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721502-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721502-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721502-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721502-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721502-011",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721502-012",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721502-013",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721502-014",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721502-015",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721502-016",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-017",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-018",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-019",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-020",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-021",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-022",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-023",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-024",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-025",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-026",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-027",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-028",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-029",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-030",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-031",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-032",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-033",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-034",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-035",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-036",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-037",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-038",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-039",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-040",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-041",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-042",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-043",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-044",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-045",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-046",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-047",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-048",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-049",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-050",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-051",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-052",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-053",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-054",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-055",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-056",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-057",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-058",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-059",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-060",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-061",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-062",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-063",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-064",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-065",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-066",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-067",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-068",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-069",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-070",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-071",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-072",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-073",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-074",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-075",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-089",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-090",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-091",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-092",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-093",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-094",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-095",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-096",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-097",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721502-098",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721502-099",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721502-100",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      }
    ]
  },
  {
    barcode: "H5080721503",
    analysisTime: "2025-08-07 21:20",
    cells: [
      {
        cellId: "H5080721503-001",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-002",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-003",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-004",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-005",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-006",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-007",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-008",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-009",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-010",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-011",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-012",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-013",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-014",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-015",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-016",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-017",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-018",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-019",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-020",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-021",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-022",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-023",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-024",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-025",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-026",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-027",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-028",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-029",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-030",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-031",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-032",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-033",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-034",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-035",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-036",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-037",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-038",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-039",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-040",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-041",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-042",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-043",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-044",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-045",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-046",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-047",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-048",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-049",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-050",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-051",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-052",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-053",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-054",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-055",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-056",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-057",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288852.jpg"
      },
      {
        cellId: "H5080721503-058",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288859.jpg"
      },
      {
        cellId: "H5080721503-059",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288860.jpg"
      },
      {
        cellId: "H5080721503-060",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288867.jpg"
      },
      {
        cellId: "H5080721503-061",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288785.jpg"
      },
      {
        cellId: "H5080721503-062",
        image: "assets/images/cells/segmented-neutrophil/SNE_4288835.jpg"
      },
      {
        cellId: "H5080721503-063",
        image: "assets/images/cells/eosinophil/BNE_10037366.jpg"
      },
      {
        cellId: "H5080721503-064",
        image: "assets/images/cells/eosinophil/BNE_10037381.jpg"
      },
      {
        cellId: "H5080721503-065",
        image: "assets/images/cells/eosinophil/BNE_10037418.jpg"
      },
      {
        cellId: "H5080721503-066",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721503-067",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721503-068",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721503-069",
        image: "assets/images/cells/monocyte/MO_4289800.jpg"
      },
      {
        cellId: "H5080721503-070",
        image: "assets/images/cells/monocyte/MO_4289815.jpg"
      },
      {
        cellId: "H5080721503-071",
        image: "assets/images/cells/monocyte/MO_4289833.jpg"
      },
      {
        cellId: "H5080721503-072",
        image: "assets/images/cells/basophil/ART_10948614.jpg"
      },
      {
        cellId: "H5080721503-073",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-074",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-075",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-076",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-077",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-078",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-079",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-080",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-081",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-082",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-083",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-084",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-085",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-086",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-087",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-088",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-089",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-090",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-091",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-092",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-093",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-094",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-095",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-096",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-097",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-098",
        image: "assets/images/cells/lymphocyte/LY_4291540.jpg"
      },
      {
        cellId: "H5080721503-099",
        image: "assets/images/cells/lymphocyte/LY_4291558.jpg"
      },
      {
        cellId: "H5080721503-100",
        image: "assets/images/cells/lymphocyte/LY_4290769.jpg"
      },
      {
        cellId: "H5080721503-101",
        image: "assets/images/cells/megakaryocyte/BA_10689869.jpg"
      }
    ]
  }
];
