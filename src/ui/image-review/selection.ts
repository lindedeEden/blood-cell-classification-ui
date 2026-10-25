/**
 * 影像檢視頁的細胞選取（文件 2 第 5 章「細胞選取與改分類操作」）
 *
 *  - 左鍵：只選這一顆，並當作 Shift 範圍選的起點
 *  - Ctrl＋左鍵：加選或取消這一顆（可跨類別）
 *  - Shift＋左鍵：從上一次點的那顆選到這顆（同一類別才有效；不同類別只加選這一顆）
 *  - 單手模式（按住右鍵不放，用左鍵點）：單數下只選這一顆（起點），雙數下選起點到這顆的整段
 *  - 右鍵選單：右鍵點在選取範圍外 → 改成只選這一顆；點在範圍內 → 改全部選取的細胞；
 *    這次按住右鍵期間有用左鍵點選（單手模式）時，一律保留剛選好的範圍
 *
 * 只管「選了哪些」，不碰畫面；細胞的類別與順序由 locate() 提供（畫面上的排列順序）。
 */

export interface CellLocation {
  category: string | null;
  index: number;
  /** 同一類別的細胞（畫面順序） */
  list: string[];
}

export class CellSelection {
  readonly selected = new Set<string>();
  private lastIndex = -1;
  private lastCategory: string | null = null;
  private rightHeld = false;
  /** 單手模式：這次按住右鍵期間的左鍵次數 */
  private oneHandClicks = 0;
  /** 這次按住右鍵期間是否點過左鍵 */
  private oneHandUsed = false;

  constructor(private readonly locate: (cellId: string) => CellLocation) {}

  private remember(cellId: string): void {
    const at = this.locate(cellId);
    this.lastIndex = at.index;
    this.lastCategory = at.category;
  }

  /** 只選這一顆 */
  single(cellId: string): void {
    this.selected.clear();
    this.selected.add(cellId);
    this.remember(cellId);
  }

  /** 加選或取消這一顆 */
  toggle(cellId: string): void {
    if (this.selected.has(cellId)) this.selected.delete(cellId);
    else this.selected.add(cellId);
    this.remember(cellId);
  }

  /** 從上一次點的那顆選到這顆（同一類別）；加進目前的選取 */
  range(cellId: string): void {
    const { category, index, list } = this.locate(cellId);
    if (index < 0 || !list.length) return;
    let from = index;
    let to = index;
    if (this.lastIndex >= 0 && this.lastCategory === category) {
      from = Math.min(this.lastIndex, index);
      to = Math.max(this.lastIndex, index);
    }
    for (let i = from; i <= to; i++) {
      const id = list[i];
      if (id) this.selected.add(id);
    }
    this.lastIndex = index;
    this.lastCategory = category;
  }

  /** 左鍵點細胞 */
  click(cellId: string, keys: { ctrl: boolean; shift: boolean }): void {
    if (this.rightHeld) {
      // 單手模式：單數下＝起點；雙數下＝同類別選一段，不同類別只選這一顆
      this.oneHandClicks++;
      this.oneHandUsed = true;
      if (this.oneHandClicks % 2 === 1) this.single(cellId);
      else if (this.lastCategory === this.locate(cellId).category) this.range(cellId);
      else this.single(cellId);
      return;
    }
    if (keys.ctrl) return this.toggle(cellId);
    if (keys.shift) return this.range(cellId);
    this.single(cellId);
  }

  rightButtonDown(): void {
    this.rightHeld = true;
    this.oneHandClicks = 0;
    this.oneHandUsed = false;
  }

  rightButtonUp(): void {
    this.rightHeld = false;
    this.oneHandClicks = 0;
  }

  /**
   * 右鍵選單開啟時決定要改哪些細胞；回傳選單上方「AI 建議」要顯示哪一顆
   * （右鍵點的這顆在選取中就顯示它的，否則顯示第一顆選取的）
   */
  forContextMenu(cellId: string): string | undefined {
    if (!this.oneHandUsed && !this.selected.has(cellId)) this.single(cellId);
    return this.selected.has(cellId) ? cellId : this.selected.values().next().value;
  }

  /** 拖曳：拖的是沒被選的細胞時，只移動這一顆 */
  forDrag(cellId: string): string[] {
    if (!this.selected.has(cellId)) this.selected.clear();
    this.selected.add(cellId);
    return Array.from(this.selected);
  }

  clear(): void {
    this.selected.clear();
  }
}
