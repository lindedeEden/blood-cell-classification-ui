/**
 * 模擬設定：AI 模型（林口人工智慧中心開發）
 * 原型無法執行真正的模型，由 infra/ai-model.ts 依以下設定模擬「讀取 CellaVision 影像 → 預分類」：
 *  - FOLDER_TO_CATEGORY      範例圖所在資料夾 → 預分類（範例圖依真實類別存放，等於模型判對）
 *  - CONFIDENCE_BY_CATEGORY  模擬的信心值；未列的類別不提供（右鍵選單不顯示 AI 建議）
 *  - CELL_OVERRIDES          指定細胞的模擬誤判（淋巴球影像被判為 Blast）
 *  - NO_CONFIDENCE_BARCODES  這些檢體除 CELL_OVERRIDES 外不提供信心值（維持研究情境畫面）
 *  - FIXED_DIFF              這些檢體的 AI 分類結果沿用研究用的既有數值，不由逐顆結果計算
 */
import type { AiModelMockSettings } from '../../domain/source-records';
export const AI_MODEL_MOCK: AiModelMockSettings = {
  FOLDER_TO_CATEGORY: {
    "segmented-neutrophil": "Segmented Neutrophil",
    band: "Band",
    lymphocyte: "Lymphocyte",
    monocyte: "Monocyte",
    eosinophil: "Eosinophil",
    basophil: "Basophil",
    blast: "Blast",
    promyelocyte: "Promyelocyte",
    myelocyte: "Myelocyte",
    metamyelocyte: "Metamyelocyte",
    hypersegmented: "Hypersegmented",
    promonocyte: "Promonocyte",
    "plasma-cell": "Plasma Cell",
    "atypical-lymphocyte": "Atypical Lymphocyte",
    "abnormal-lymphocyte": "Abnormal Lymphocyte",
    megakaryocyte: "Megakaryocyte",
    nrbc: "NRBC",
    "giant-plt": "Giant PLT"
  },
  CONFIDENCE_BY_CATEGORY: {
    "Segmented Neutrophil": 0.92,
    Blast: 0.88
  },
  CELL_OVERRIDES: {
    "H5080721104-001": {
      category: "Blast",
      confidence: 0.86
    },
    "H5080721104-002": {
      category: "Blast",
      confidence: 0.87
    },
    "H5080721104-003": {
      category: "Blast",
      confidence: 0.88
    },
    "H5080721301-001": {
      category: "Blast",
      confidence: 0.86
    },
    "H5080721301-002": {
      category: "Blast",
      confidence: 0.87
    }
  },
  NO_CONFIDENCE_BARCODES: [
    "H5080721104",
    "H5080721301"
  ],
  FIXED_DIFF: {
    H5080720847: {
      band: "-",
      segmentedNeutrophil: "93.0",
      eosinophil: "-",
      monocyte: "2.0",
      basophil: "-",
      lymphocyte: "2.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    },
    H5080720647: {
      band: "3.0",
      segmentedNeutrophil: "58.0",
      eosinophil: "4.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "20.0",
      atypicalLymphocyte: "-",
      blast: "6.0",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    },
    H5080706275: {
      band: "3.0",
      segmentedNeutrophil: "65.0",
      eosinophil: "2.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "22.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    },
    H5080721103: {
      band: "-",
      segmentedNeutrophil: "62.0",
      eosinophil: "5.0",
      monocyte: "4.0",
      basophil: "1.0",
      lymphocyte: "28.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "3.0",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    },
    H5080721104: {
      band: "-",
      segmentedNeutrophil: "64.0",
      eosinophil: "2.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "27.0",
      atypicalLymphocyte: "-",
      blast: "3.0",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    },
    H5080721201: {
      band: "3.0",
      segmentedNeutrophil: "62.0",
      eosinophil: "2.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "18.0",
      atypicalLymphocyte: "-",
      blast: "7.0",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    },
    H5080721301: {
      band: "2.0",
      segmentedNeutrophil: "58.0",
      eosinophil: "3.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "28.0",
      atypicalLymphocyte: "-",
      blast: "2.0",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    },
    H5080721401: {
      band: "2.0",
      segmentedNeutrophil: "78.0",
      eosinophil: "1.0",
      monocyte: "4.0",
      basophil: "0.5",
      lymphocyte: "14.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-",
      nrbc: "-",
      giantPlt: "-",
      megakaryocyte: "-",
      smudgeCell: "-",
      artefact: "-"
    }
  }
};
