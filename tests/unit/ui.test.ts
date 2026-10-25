/**
 * 畫面邏輯：細胞選取（含單手模式）、HTML 跳脫、登入後導回、報告頁訊息來源
 */
import { describe, expect, it } from 'vitest';
import { CellSelection, type CellLocation } from '../../src/ui/image-review/selection';
import { escapeHtml, html, raw } from '../../src/ui/shared/dom';
import { safeRedirect, validateLogin } from '../../src/ui/login/login-page';
import { clampFont, clampZoom, preferencePreloadScript } from '../../src/ui/shared/preference-rules';

/** 畫面上的細胞：A 類別 a1～a5、B 類別 b1～b3 */
const GRID: Record<string, string[]> = { A: ['a1', 'a2', 'a3', 'a4', 'a5'], B: ['b1', 'b2', 'b3'] };
const locate = (id: string): CellLocation => {
  const category = Object.keys(GRID).find((c) => GRID[c]?.includes(id)) ?? null;
  const list = category ? (GRID[category] as string[]) : [];
  return { category, index: list.indexOf(id), list };
};
const picked = (s: CellSelection) => Array.from(s.selected).sort();
const plain = { ctrl: false, shift: false };

describe('細胞選取（第 5 章）', () => {
  it('左鍵單選；Ctrl 加選或取消；Shift 選同類別一整段', () => {
    const s = new CellSelection(locate);
    s.click('a2', plain);
    s.click('b1', { ctrl: true, shift: false });
    expect(picked(s)).toEqual(['a2', 'b1']);
    s.click('b1', { ctrl: true, shift: false });
    expect(picked(s)).toEqual(['a2']);
    s.click('a2', plain);
    s.click('a4', { ctrl: false, shift: true });
    expect(picked(s)).toEqual(['a2', 'a3', 'a4']);
  });
  it('Shift 點到不同類別：只加選那一顆', () => {
    const s = new CellSelection(locate);
    s.click('a1', plain);
    s.click('b2', { ctrl: false, shift: true });
    expect(picked(s)).toEqual(['a1', 'b2']);
  });
  it('單手模式：按住右鍵，第 1 下起點、第 2 下選一段、第 3 下重新開始', () => {
    const s = new CellSelection(locate);
    s.rightButtonDown();
    s.click('a1', plain);
    s.click('a4', plain);
    expect(picked(s)).toEqual(['a1', 'a2', 'a3', 'a4']);
    s.click('a5', plain);
    expect(picked(s)).toEqual(['a5']);
  });
  it('單手模式第 2 下點到不同類別：只選那一顆', () => {
    const s = new CellSelection(locate);
    s.rightButtonDown();
    s.click('a1', plain);
    s.click('b2', plain);
    expect(picked(s)).toEqual(['b2']);
  });
  it('右鍵選單：點在選取範圍外 → 只選這一顆；點在範圍內 → 保留整批', () => {
    const s = new CellSelection(locate);
    s.click('a1', plain);
    s.click('a3', { ctrl: false, shift: true });
    expect(s.forContextMenu('a2')).toBe('a2');
    expect(picked(s)).toEqual(['a1', 'a2', 'a3']);
    expect(s.forContextMenu('b3')).toBe('b3');
    expect(picked(s)).toEqual(['b3']);
  });
  it('單手模式放開右鍵時滑鼠停在別顆細胞上：保留剛選好的範圍', () => {
    const s = new CellSelection(locate);
    s.rightButtonDown();
    s.click('a1', plain);
    s.click('a4', plain);
    s.rightButtonUp();
    expect(s.forContextMenu('a5')).toBe('a1');
    expect(picked(s)).toEqual(['a1', 'a2', 'a3', 'a4']);
    s.rightButtonDown(); // 下一次一般右鍵點在範圍外：只選那一顆
    expect(s.forContextMenu('b1')).toBe('b1');
    expect(picked(s)).toEqual(['b1']);
  });
  it('拖曳沒被選的細胞：只移動那一顆', () => {
    const s = new CellSelection(locate);
    s.click('a1', plain);
    s.click('a2', { ctrl: true, shift: false });
    expect(s.forDrag('a2').sort()).toEqual(['a1', 'a2']);
    expect(s.forDrag('b1')).toEqual(['b1']);
  });
});

describe('安全', () => {
  it('HTML 樣板會跳脫外部資料，raw() 片段保留', () => {
    const name = '<img src=x onerror=alert(1)>"\'&';
    expect(html`<td>${name}</td>${raw('<b>ok</b>')}`.value).toBe(
      '<td>&lt;img src=x onerror=alert(1)&gt;&quot;&#39;&amp;</td><b>ok</b>',
    );
    expect(escapeHtml(5)).toBe('5');
    expect(html`${[1, 2]}${null}${false}${undefined}`.value).toBe('12');
  });
  it('登入後只導回本系統的頁面，其他網址一律回到檢體管理', () => {
    const base = 'http://h/app/index.html';
    expect(
      safeRedirect('?redirect=' + encodeURIComponent('http://h/app/影像檢視與細胞編輯.html?specimen=X'), base),
    ).toBe(
      'http://h/app/%E5%BD%B1%E5%83%8F%E6%AA%A2%E8%A6%96%E8%88%87%E7%B4%B0%E8%83%9E%E7%B7%A8%E8%BC%AF.html?specimen=X',
    );
    expect(safeRedirect('?redirect=' + encodeURIComponent('https://evil.example/檢體管理.html'), base)).toBe(
      '檢體管理.html',
    );
    expect(safeRedirect('?redirect=javascript:alert(1)', base)).toBe('檢體管理.html');
    expect(safeRedirect('', base)).toBe('檢體管理.html');
  });
  it('雙擊開啟（file://）時一樣擋掉 javascript:／data: 與其他資料夾以外的網址', () => {
    const fileBase = 'file:///Users/eden/app/index.html';
    const page = encodeURIComponent('檢體管理.html');
    expect(safeRedirect('?redirect=' + encodeURIComponent('file:///Users/eden/app/檢體管理.html'), fileBase)).toBe(
      'file:///Users/eden/app/' + page,
    );
    for (const evil of [`javascript:alert(1)//${page}`, `data:text/html,x//${page}`, `https://evil.example/${page}`]) {
      expect(safeRedirect('?redirect=' + encodeURIComponent(evil), fileBase), evil).toBe('檢體管理.html');
    }
  });
  it('登入表單檢查', () => {
    expect([
      validateLogin('', 'x'),
      validateLogin('a'.repeat(51), 'x'),
      validateLogin('a', ''),
      validateLogin('a', 'x'.repeat(129)),
      validateLogin('admin', 'admin'),
    ]).toEqual(['請輸入帳號', '帳號長度不得超過 50 字元', '請輸入密碼', '密碼長度異常', null]);
  });
});

describe('字級與縮放的預先套用（頁面 <head>）', () => {
  it('與畫面程式同一套範圍與預設值：超出範圍夾住、非數字用預設值', () => {
    for (const [font, zoom] of [
      ['2', '150'],
      ['9', '10'],
      ['x', ''],
    ] as const) {
      localStorage.setItem('blood-morphology-font-level', font);
      localStorage.setItem('blood-morphology-cell-image-zoom', zoom);
      new Function(preferencePreloadScript())();
      const root = document.documentElement;
      const l = clampFont(font);
      const z = clampZoom(zoom);
      expect([root.className, root.style.getPropertyValue('--cell-zoom-factor')]).toEqual([
        ['font-size-small', 'font-size-normal', 'font-size-large', 'font-size-xlarge'][l],
        String(z / 100),
      ]);
    }
  });
});
