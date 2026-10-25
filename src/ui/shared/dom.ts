/**
 * 畫面小工具：取元素、安全地產生 HTML
 *
 * 所有動態產生的 HTML 一律用 html`` 樣板：插入的值會自動跳脫（&、<、>、"、'），
 * 避免病患姓名等外部資料被當成 HTML 執行（XSS）。已經是安全 HTML 的片段用 raw() 包起來。
 */

const SAFE = Symbol('safe-html');
export interface SafeHtml {
  readonly [SAFE]: true;
  readonly value: string;
  toString(): string;
}

function safe(value: string): SafeHtml {
  return { [SAFE]: true, value, toString: () => value };
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function escapeHtml(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

function render(value: unknown): string {
  if (value == null || value === false) return '';
  if (Array.isArray(value)) return value.map(render).join('');
  if (typeof value === 'object' && SAFE in value) return (value as SafeHtml).value;
  return escapeHtml(value);
}

/** HTML 樣板：插入值自動跳脫；陣列會串接；null／undefined／false 不輸出 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): SafeHtml {
  let out = strings[0] ?? '';
  values.forEach((v, i) => {
    out += render(v) + (strings[i + 1] ?? '');
  });
  return safe(out);
}

/** 已確認安全的固定 HTML（程式內寫死的片段，不可放外部資料） */
export function raw(markup: string): SafeHtml {
  return safe(markup);
}

export function setHtml(el: Element | null, content: SafeHtml): void {
  if (el) el.innerHTML = content.value;
}

export function byId<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/** 頁面一定有的元素（缺少代表 HTML 與程式不一致，直接報錯） */
export function mustGet<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`頁面缺少 #${id}`);
  return el as T;
}

export function onReady(fn: () => void): void {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
}
