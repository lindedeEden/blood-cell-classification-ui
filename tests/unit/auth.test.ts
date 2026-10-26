/**
 * 登入／登出（infra/auth.ts）
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bootstrap } from '../../src/pages/bootstrap';
import { login, logout } from '../../src/infra/auth';
import { reviewStorage, sessionInfo, toasts } from '../../src/infra/storage';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.useFakeTimers();
});

describe('登入', () => {
  it('密碼錯誤：顯示「帳號或密碼錯誤」，即使瀏覽器還留著上一次的登入資訊也不會被當成登入逾期', async () => {
    sessionInfo.setToken('old-token');
    const href = window.location.href;
    const pending = login('admin', 'wrong');
    await vi.runAllTimersAsync();
    expect(await pending).toEqual({ ok: false, error: '帳號或密碼錯誤' });
    expect(window.location.href).toBe(href);
  });
  it('登入成功：保存 Token 與帳號', async () => {
    const pending = login('admin', 'admin');
    await vi.runAllTimersAsync();
    expect((await pending).ok).toBe(true);
    expect([!!sessionInfo.token(), sessionInfo.account()]).toEqual([true, 'admin']);
  });
});

describe('登出', () => {
  it('清除登入資訊，並清掉瀏覽器裡的病人資料（共用電腦）', () => {
    sessionInfo.setToken('t');
    reviewStorage.save('S', { status: ['Digital Review'], statusDone: false, workflowDone: {} as never, editor: '' });
    localStorage.setItem('editedDiff:S', '{}');
    localStorage.setItem('blood-morphology-lis-writeback-log', '[]');
    logout();
    expect([
      sessionInfo.token(),
      Object.keys(reviewStorage.readAll()),
      localStorage.getItem('editedDiff:S'),
      localStorage.getItem('blood-morphology-lis-writeback-log'),
    ]).toEqual([null, [], null, null]);
  });
});

describe('不做閒置自動登出（文件 2 第 1.1 節；2026-10-26 Eden 決定）', () => {
  it('登入後頁面放著不動 2 小時，仍然保持登入', () => {
    sessionInfo.setToken('t');
    expect(bootstrap()).not.toBeNull();
    vi.advanceTimersByTime(2 * 60 * 60_000);
    expect(sessionInfo.token()).toBe('t');
  });
});

describe('返回清單的提示', () => {
  it('登入、登出時清掉還沒顯示的提示，不會帶到下一次登入', async () => {
    toasts.reportVerified.queue('H5080721103', true);
    logout();
    expect(toasts.reportVerified.consume()).toBeNull();
    toasts.manualReview.queue({ specimenId: 'H5080721103', addedFollowUp: true, lisSynced: true });
    const pending = login('admin', 'admin');
    await vi.runAllTimersAsync();
    await pending;
    expect(toasts.manualReview.consume()).toBeNull();
  });
});
