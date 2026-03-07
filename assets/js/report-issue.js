// 報告核發介面 - 動態資料與風險判讀
(function () {
  'use strict';

  var LEAVE_THRESHOLDS = {
    wbc: 30,
    lymphocyte: 60,
    monocyte: 20,
    eosinophil: 20,
    basophil: 5,
    atypicalLymphocyte: 10,
    blast: 'present',
    promyelocyte: 'present',
    myelocyte: 5,
    metamyelocyte: 10
  };

  var COMMON_ROWS = [
    ['Band', 'band'],
    ['Segmented neutrophil', 'segmentedNeutrophil'],
    ['Eosinophil', 'eosinophil'],
    ['Monocyte', 'monocyte'],
    ['Basophil', 'basophil'],
    ['Lymphocyte', 'lymphocyte'],
    ['Atypical lymphocyte', 'atypicalLymphocyte']
  ];

  var ABNORMAL_ROWS = [
    ['Blast', 'blast'],
    ['Promyelocyte', 'promyelocyte'],
    ['Myelocyte', 'myelocyte'],
    ['Metamyelocyte', 'metamyelocyte'],
    ['Hypersegmented', 'hypersegmented'],
    ['Promonocyte', 'promonocyte'],
    ['Plasma cell', 'plasmaCell'],
    ['Abnormal lymphocyte', 'abnormalLymphocyte']
  ];

  var OTHER_ROWS = [
    ['NRBC', 'nrbc'],
    ['Giant PLT', 'giantPlt'],
    ['Megakaryocyte', 'megakaryocyte'],
    ['Smudge cell', 'smudgeCell'],
    ['Artefact', 'artefact']
  ];

  function parseNum(v) {
    if (v === '-' || v === '' || v == null) return null;
    var n = parseFloat(String(v).replace(',', '.'), 10);
    return isNaN(n) ? null : n;
  }

  function isAbnormalValue(key, value) {
    var th = LEAVE_THRESHOLDS[key];
    if (th == null) return false;
    var num = parseNum(value);
    if (th === 'present') return num != null && num > 0;
    if (typeof th === 'number') return num != null && num >= th;
    return false;
  }

  function getSpecimen() {
    var id = (typeof getSpecimenIdFromUrl === 'function') ? getSpecimenIdFromUrl() : '';
    if (!id && typeof APP_DATABASE !== 'undefined' && APP_DATABASE.specimens && APP_DATABASE.specimens.length > 0) {
      id = APP_DATABASE.specimens[0].id;
    }
    if (!id) return null;
    if (typeof getSpecimenById === 'function') return getSpecimenById(id);
    var list = (typeof APP_DATABASE !== 'undefined' && APP_DATABASE.specimens) ? APP_DATABASE.specimens : [];
    return list.find(function (s) { return s.id === id; }) || null;
  }

  function buildWbcTable(spec) {
    var metrics = spec.metrics || {};
    var prev = spec.prevReport || {};
    var tbody = document.getElementById('wbc-table-body');
    if (!tbody) return;
    var html = '';

    function addSection(label) {
      html += '<tr class="bg-zinc-50/30 dark:bg-zinc-800/10"><td class="px-4 py-1.5 text-xs font-bold text-zinc-400 uppercase tracking-widest" colspan="5">' + label + '</td></tr>';
    }

    function addRow(rowLabel, key) {
      var flow = metrics[key] || '-';
      var ai = metrics[key] || '-';
      var edited = metrics[key] || '-';
      var prevVal = prev[key] || '-';
      var abnormal = isAbnormalValue(key, edited);
      var rowClass = abnormal ? 'bg-medical-red/5 hover:bg-medical-red/10' : 'hover:bg-zinc-50/50';
      var nameClass = abnormal ? 'text-medical-red font-bold' : 'text-zinc-800 dark:text-zinc-200 font-semibold';
      var valueClass = abnormal ? 'text-medical-red font-bold' : 'text-zinc-500';
      var editedClass = abnormal ? 'text-medical-red font-black bg-medical-red/10' : 'text-zinc-900 dark:text-zinc-100 font-bold bg-blue-50/30';
      html += '<tr class="' + rowClass + '">';
      html += '<td class="px-4 py-2 text-base ' + nameClass + '">';
      if (abnormal) {
        html += rowLabel + ' <span class="material-symbols-outlined text-[18px] align-middle">error</span>';
      } else {
        html += rowLabel;
      }
      html += '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular ' + valueClass + '">' + (flow || '-') + '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular ' + valueClass + '">' + (ai || '-') + '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular ' + editedClass + '">' + (edited || '-') + '</td>';
      html += '<td class="px-2 py-2 text-base text-right tabular text-zinc-400">' + (prevVal || '-') + '</td>';
      html += '</tr>';
    }

    addSection('常見細胞');
    COMMON_ROWS.forEach(function (r) { addRow(r[0], r[1]); });
    addSection('未成熟與異常細胞');
    ABNORMAL_ROWS.forEach(function (r) { addRow(r[0], r[1]); });

    tbody.innerHTML = html;
  }

  function applyRiskBanner(spec) {
    var metrics = spec.metrics || {};
    var keys = Object.keys(LEAVE_THRESHOLDS);
    var hasHigh = false;
    var hasAny = false;
    keys.forEach(function (k) {
      if (isAbnormalValue(k, metrics[k])) {
        hasAny = true;
        if (k === 'blast' || k === 'promyelocyte') hasHigh = true;
      }
    });
    var banner = document.getElementById('risk-banner');
    var icon = document.getElementById('risk-icon');
    var text = document.getElementById('risk-text');
    if (!banner || !icon || !text) return;
    banner.className = 'px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 border-b';
    if (hasHigh) {
      banner.className += ' bg-medical-red border-medical-red/20';
      icon.textContent = 'warning';
      icon.className = 'material-symbols-outlined text-white fill-1 scale-100';
      text.className = 'text-md font-bold leading-tight tracking-tight text-white';
      text.textContent = '高風險警示：檢出留單條件細胞，請謹慎核發';
    } else if (hasAny) {
      banner.className += ' bg-yellow-500 border-yellow-500/20';
      icon.textContent = 'warning';
      icon.className = 'material-symbols-outlined text-white';
      text.className = 'text-md font-bold leading-tight tracking-tight text-white';
      text.textContent = '異常提醒：檢出異常血球，請確認分類與數值';
    } else {
      banner.className += ' bg-emerald-600 border-emerald-600/20';
      icon.textContent = 'check_circle';
      icon.className = 'material-symbols-outlined text-white';
      text.className = 'text-md font-bold leading-tight tracking-tight text-white';
      text.textContent = '狀態良好：未見異常血球';
    }
  }

  function buildOtherTable(spec) {
    var metrics = spec.metrics || {};
    var prev = spec.prevReport || {};
    var tbody = document.getElementById('other-table-body');
    if (!tbody) return;
    var html = '';
    OTHER_ROWS.forEach(function (r) {
      var label = r[0];
      var key = r[1];
      var flow = metrics[key] || '-';
      var ai = metrics[key] || '-';
      var edited = metrics[key] || '-';
      var prevVal = prev[key] || '-';
      html += '<tr class="hover:bg-zinc-50/30">';
      html += '<td class="px-3 py-1.5 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">' + label + '</td>';
      html += '<td class="px-2 py-1.5 text-zinc-400 text-xs text-right tabular">' + (flow || '-') + '</td>';
      html += '<td class="px-2 py-1.5 text-zinc-400 text-xs text-right tabular">' + (ai || '-') + '</td>';
      html += '<td class="px-2 py-1.5 text-zinc-900 dark:text-zinc-100 text-xs font-bold text-right tabular bg-blue-50/30">' + (edited || '-') + '</td>';
      html += '<td class="px-2 py-1.5 text-zinc-400 text-xs text-right tabular">' + (prevVal || '-') + '</td>';
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  function fillCbcPanel(spec) {
    var c = spec.cbc || {};
    var byId = {
      'cbc-wbc': c.wbc,
      'cbc-rbc': c.rbc,
      'cbc-hb': c.hb,
      'cbc-hct': c.hct,
      'cbc-mcv': c.mcv,
      'cbc-mch': c.mch,
      'cbc-mchc': c.mchc,
      'cbc-plt': c.plt
    };
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = byId[id] != null ? byId[id] : '-';
    });
  }

  function init() {
    var spec = getSpecimen();
    if (!spec) return;
    var title = document.getElementById('report-specimen-id');
    if (title) title.textContent = spec.id || '';
    var statusWrap = document.getElementById('report-status-tags');
    if (statusWrap) {
      var statuses = spec.status || [];
      var hasVerified = statuses.indexOf('Verified') >= 0;
      var displayStatuses = statuses.filter(function (s) { return s !== 'Verified'; });
      var html = displayStatuses.map(function (s) {
        var style = 'bg-gray-100 text-gray-800';
        var label = s;
        var prefixIcon = '';
        if (s === 'AI Alert' && typeof STATUS_STYLES !== 'undefined') style = STATUS_STYLES['AI Alert'] || style;
        else if (s === 'PLT Check' && typeof STATUS_STYLES !== 'undefined') style = STATUS_STYLES['PLT Check'] || style;
        else if (s === 'Follow-up' && typeof STATUS_STYLES !== 'undefined') style = STATUS_STYLES['Follow-up'] || style;
        else if (s === 'Digital Review' && hasVerified) {
          style = 'bg-green-100 text-green-800';
          prefixIcon = '<span class="material-symbols-outlined text-[14px] mr-0.5 align-middle">check</span>';
        } else if (s === 'Digital Review' && typeof STATUS_STYLES !== 'undefined') {
          style = STATUS_STYLES['Digital Review'] || style;
        }
        return '<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold ' + style + '">' + prefixIcon + label + '</span>';
      }).join('');
      statusWrap.innerHTML = html;
    }
    // 若此畫面是被嵌在 iframe（影像檢視頁的彈出視窗），就隱藏內部自己的關閉按鈕，避免雙重叉叉
    if (window.self !== window.top) {
      var internalClose = document.getElementById('btn-close');
      if (internalClose) internalClose.style.display = 'none';
    }
    applyRiskBanner(spec);
    buildWbcTable(spec);
    buildOtherTable(spec);
    fillCbcPanel(spec);

    var cancelBtn = document.getElementById('btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        if (window.self !== window.top && window.parent) {
          window.parent.postMessage({ type: 'reportCancel' }, '*');
        } else if (typeof goToSpecimenList === 'function') {
          goToSpecimenList();
        }
      });
    }

    var confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (!confirm('確認要簽核並核發此報告嗎？')) return;
        if (window.self !== window.top && window.parent) {
          window.parent.postMessage({ type: 'reportVerified', specimenId: spec.id }, '*');
        } else if (typeof goToSpecimenList === 'function') {
          goToSpecimenList();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

