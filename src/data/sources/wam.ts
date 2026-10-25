/**
 * 模擬來源：WAM（XN-9000 CBC／DC 結果與 SIS rule 判讀）
 *   machine      玻片機台（玻片所在的 DI-60：DI1／DI2）
 *   location     檢體歸位（TS-10 架號-位置，例 125-2）
 *   cbc          CBC data；flowDc  Flow DC data（未成熟與異常細胞流式儀無法提供，為 '-'）
 *   cbcFlags     CBC flag（L、LL、H、HH、DC）；flowDcFlags  Flow DC flag
 *   pltFlag      PLT 的 LIS-flag：P（PLT**）／A（全部**）觸發血小板確認（規則 3）
 *   sisRules     觸發的 SIS rule 編號
 * cbcFlags、flowDcFlags 為模擬值，新介面目前不顯示、不參與判斷，保留供日後使用。
 */
import type { WamRecord } from '../../domain/source-records';
export const SOURCE_WAM: WamRecord[] = [
  {
    barcode: "H5080720847",
    machine: "DI1",
    location: "125-2",
    cbc: {
      wbc: "5.94",
      plt: "112",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
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
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      plt: "L DC"
    },
    flowDcFlags: [
      "Lymphopenia"
    ],
    pltFlag: "P",
    sisRules: [
      "760"
    ]
  },
  {
    barcode: "H5080720276",
    machine: "DI2",
    location: "112-1",
    cbc: {
      wbc: "8.20",
      plt: "245",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "62.0",
      eosinophil: "3.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "28.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080720647",
    machine: "DI2",
    location: "134-5",
    cbc: {
      wbc: "14.50",
      plt: "98",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "3.0",
      segmentedNeutrophil: "58.0",
      eosinophil: "4.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "20.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      wbc: "H",
      plt: "L DC"
    },
    flowDcFlags: [],
    pltFlag: "P",
    sisRules: [
      "760"
    ]
  },
  {
    barcode: "H5080720696",
    machine: "DI2",
    location: "125-12",
    cbc: {
      wbc: "6.80",
      plt: "312",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "58.0",
      eosinophil: "3.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "32.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080706286",
    machine: "DI1",
    location: "045-23",
    cbc: {
      wbc: "12.30",
      plt: "156",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "4.0",
      segmentedNeutrophil: "74.0",
      eosinophil: "2.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "12.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      wbc: "H"
    },
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080706280",
    machine: "DI1",
    location: "090-2",
    cbc: {
      wbc: "5.94",
      plt: "215",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "4.0",
      segmentedNeutrophil: "58.0",
      eosinophil: "2.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "30.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080706275",
    machine: "DI1",
    location: "101-5",
    cbc: {
      wbc: "5.20",
      plt: "88",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
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
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      plt: "L"
    },
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080706301",
    machine: "DI1",
    location: "102-1",
    cbc: {
      wbc: "7.40",
      plt: "268",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "4.0",
      segmentedNeutrophil: "51.0",
      eosinophil: "3.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "35.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721101",
    machine: "DI1",
    location: "088-3",
    cbc: {
      wbc: "6.80",
      plt: "218",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "58.0",
      eosinophil: "2.0",
      monocyte: "7.0",
      basophil: "1.0",
      lymphocyte: "32.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721102",
    machine: "DI2",
    location: "201-1",
    cbc: {
      wbc: "7.20",
      plt: "256",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "55.0",
      eosinophil: "4.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "35.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721103",
    machine: "DI1",
    location: "115-4",
    cbc: {
      wbc: "5.50",
      plt: "242",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "62.0",
      eosinophil: "5.0",
      monocyte: "4.0",
      basophil: "1.0",
      lymphocyte: "28.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721104",
    machine: "DI2",
    location: "098-2",
    cbc: {
      wbc: "8.90",
      plt: "198",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "64.0",
      eosinophil: "2.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "27.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721105",
    machine: "DI1",
    location: "132-6",
    cbc: {
      wbc: "6.30",
      plt: "275",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "52.0",
      eosinophil: "3.0",
      monocyte: "8.0",
      basophil: "1.0",
      lymphocyte: "36.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721106",
    machine: "DI2",
    location: "126-1",
    cbc: {
      wbc: "7.60",
      plt: "228",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "60.0",
      eosinophil: "2.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "32.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721107",
    machine: "DI1",
    location: "113-3",
    cbc: {
      wbc: "9.10",
      plt: "262",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "68.0",
      eosinophil: "2.0",
      monocyte: "4.0",
      basophil: "1.0",
      lymphocyte: "25.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721108",
    machine: "DI2",
    location: "202-5",
    cbc: {
      wbc: "5.90",
      plt: "288",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "54.0",
      eosinophil: "4.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "35.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721109",
    machine: "DI1",
    location: "119-7",
    cbc: {
      wbc: "6.40",
      plt: "235",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "59.0",
      eosinophil: "6.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "29.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721110",
    machine: "DI2",
    location: "091-4",
    cbc: {
      wbc: "7.80",
      plt: "248",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "57.0",
      eosinophil: "3.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "33.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721201",
    machine: "DI2",
    location: "208-6",
    cbc: {
      wbc: "11.20",
      plt: "142",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "3.0",
      segmentedNeutrophil: "62.0",
      eosinophil: "2.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "18.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      wbc: "H",
      plt: "L"
    },
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721202",
    machine: "DI1",
    location: "156-3",
    cbc: {
      wbc: "10.80",
      plt: "128",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "3.0",
      segmentedNeutrophil: "60.0",
      eosinophil: "2.0",
      monocyte: "5.0",
      basophil: "1.0",
      lymphocyte: "19.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      plt: "L"
    },
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721301",
    machine: "DI1",
    location: "118-4",
    cbc: {
      wbc: "7.20",
      plt: "198",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "2.0",
      segmentedNeutrophil: "58.0",
      eosinophil: "3.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "28.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721401",
    machine: "DI2",
    location: "142-8",
    cbc: {
      wbc: "32.50",
      plt: "245",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
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
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      wbc: "HH"
    },
    flowDcFlags: [
      "Leukocytosis",
      "Neutrophilia",
      "Lymphocytosis",
      "Monocytosis"
    ],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721501",
    machine: "DI1",
    location: "141-1",
    cbc: {
      wbc: "7.60",
      plt: "265",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "24.0",
      eosinophil: "2.0",
      monocyte: "4.0",
      basophil: "-",
      lymphocyte: "70.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [
      "Lymphocytosis"
    ],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721502",
    machine: "DI2",
    location: "141-2",
    cbc: {
      wbc: "12.40",
      plt: "240",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "10.0",
      eosinophil: "1.0",
      monocyte: "4.0",
      basophil: "-",
      lymphocyte: "85.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {
      wbc: "H"
    },
    flowDcFlags: [
      "Lymphocytosis"
    ],
    pltFlag: "",
    sisRules: []
  },
  {
    barcode: "H5080721503",
    machine: "DI1",
    location: "141-3",
    cbc: {
      wbc: "6.80",
      plt: "182",
      rbc: "4.20",
      hb: "13.5",
      hct: "40.0",
      mcv: "90.0",
      mch: "30.0",
      mchc: "33.0"
    },
    flowDc: {
      band: "-",
      segmentedNeutrophil: "62.0",
      eosinophil: "3.0",
      monocyte: "6.0",
      basophil: "1.0",
      lymphocyte: "28.0",
      atypicalLymphocyte: "-",
      blast: "-",
      promyelocyte: "-",
      myelocyte: "-",
      metamyelocyte: "-",
      hypersegmented: "-",
      promonocyte: "-",
      plasmaCell: "-",
      abnormalLymphocyte: "-"
    },
    cbcFlags: {},
    flowDcFlags: [],
    pltFlag: "",
    sisRules: []
  }
];
