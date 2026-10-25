/**
 * 目前使用中的留單門檻（規則 7）：預設值＋使用者在「留單標準設定」的修改
 * 原型存在瀏覽器；正式系統改存後端（GET／PUT /settings/thresholds），全科共用。
 */
import { DEFAULT_THRESHOLDS } from '../domain/constants/thresholds';
import { mergeThresholds } from '../domain/rules/leave';
import type { Thresholds } from '../domain/types';
import { thresholdStorage } from '../infra/storage';

export class ThresholdSettings {
  private current: Thresholds;

  constructor(private readonly storage = thresholdStorage) {
    this.current = mergeThresholds(DEFAULT_THRESHOLDS, storage.load());
  }

  get(): Thresholds {
    return this.current;
  }

  /** 套用並保存（無效的輸入保留原值） */
  save(input: unknown): Thresholds {
    this.current = mergeThresholds(this.current, input);
    this.storage.save(this.current);
    return this.current;
  }

  /** 還原預設值 */
  reset(): Thresholds {
    this.current = { ...DEFAULT_THRESHOLDS };
    this.storage.clear();
    return this.current;
  }
}
