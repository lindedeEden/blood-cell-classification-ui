/**
 * 成效調查情境 — 自訂細胞配置（覆寫 metrics 自動產生）
 * H5080721301：AI 將 Lymphocyte 誤判為 Blast，Blast 群組置頂但影像為淋巴球。
 * H5080721104：AI 將 3 顆 Lymphocyte 誤判為 Blast 3%。
 */
(function () {
  var samples = window.CELL_SAMPLE_IMAGES || {};
  var lymph = samples['Lymphocyte'] || ['assets/images/cells/lymphocyte/LY_4290769.jpg'];
  var seg = samples['Segmented Neutrophil'] || ['assets/images/cells/segmented-neutrophil/SNE_4288785.jpg'];
  var mono = samples['Monocyte'] || ['assets/images/cells/monocyte/MO_4289800.jpg'];
  var eo = samples['Eosinophil'] || ['assets/images/cells/eosinophil/BNE_10037366.jpg'];

  function buildFalsePositiveBlastCells(blastCount, segCount, lymphCount, monoCount, eoCount) {
    var cells = [];
    var id = 0;
    var i;
    for (i = 0; i < blastCount; i++) {
      cells.push({
        id: 'cell-' + (++id),
        category: 'Blast',
        imageUrl: lymph[i % lymph.length],
        aiSuggestion: { label: 'Blast', pct: 86 + i },
        actualCategory: 'Lymphocyte'
      });
    }
    for (i = 0; i < segCount; i++) {
      cells.push({
        id: 'cell-' + (++id),
        category: 'Segmented Neutrophil',
        imageUrl: seg[i % seg.length]
      });
    }
    for (i = 0; i < lymphCount; i++) {
      cells.push({
        id: 'cell-' + (++id),
        category: 'Lymphocyte',
        imageUrl: lymph[i % lymph.length]
      });
    }
    for (i = 0; i < monoCount; i++) {
      cells.push({
        id: 'cell-' + (++id),
        category: 'Monocyte',
        imageUrl: mono[i % mono.length]
      });
    }
    for (i = 0; i < eoCount; i++) {
      cells.push({
        id: 'cell-' + (++id),
        category: 'Eosinophil',
        imageUrl: eo[i % eo.length]
      });
    }
    cells.push({
      id: 'cell-' + (++id),
      category: 'Basophil',
      imageUrl: (samples['Basophil'] || ['assets/images/cells/basophil/ART_10948614.jpg'])[0]
    });
    return cells;
  }

  window.CELLS_BY_SPECIMEN = window.CELLS_BY_SPECIMEN || {};

  /** H5080721301：2 顆淋巴球誤判為 Blast */
  var cells1301 = buildFalsePositiveBlastCells(2, 58, 28, 6, 3);
  cells1301.push({
    id: 'cell-' + (cells1301.length + 1),
    category: 'Band',
    imageUrl: (samples['Band'] || ['assets/images/cells/band/BNE_4292629.jpg'])[0]
  });
  window.CELLS_BY_SPECIMEN['H5080721301'] = cells1301;

  /** H5080721104：3 顆淋巴球誤判為 Blast */
  window.CELLS_BY_SPECIMEN['H5080721104'] = buildFalsePositiveBlastCells(3, 64, 27, 6, 2);
})();
