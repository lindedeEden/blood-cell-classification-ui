"""
產生精簡版 Material Symbols 字型（只保留介面用到的圖示）

完整字型約 3.8 MB；建置後的網頁要能「雙擊開啟」（file://），字型必須內嵌在 CSS，
所以只保留用到的圖示，縮小到數十 KB。

用法：python3 tools/build-icon-font.py
新增圖示時：把名稱加進 ICONS，重新執行，並提交 src/styles/fonts/material-symbols-subset.woff2
需要：pip install fonttools brotli
"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'node_modules/material-symbols/material-symbols-outlined.woff2'
OUT = ROOT / 'src/styles/fonts/material-symbols-subset.woff2'

ICONS = sorted("""
account_circle add analytics arrow_back arrow_drop_down arrow_drop_up check check_circle chevron_left
chevron_right close draw error expand_more filter_list info lock lock_open magnification_small patient_list
power_settings_new priority_high psychology remove save science search settings timer_off undo
visibility visibility_off warning
""".split())


def ligature_glyphs(font, names):
    """從 GSUB 的連字表找出每個圖示名稱對應的字形"""
    cmap = font.getBestCmap()
    wanted = {name: [cmap[ord(ch)] for ch in name] for name in names}
    found = {}
    for lookup in font['GSUB'].table.LookupList.Lookup:
        for st in lookup.SubTable:
            st = getattr(st, 'ExtSubTable', st)
            if not hasattr(st, 'ligatures'):
                continue
            for first, ligs in st.ligatures.items():
                for lig in ligs:
                    seq = [first] + list(lig.Component)
                    for name, glyphs in wanted.items():
                        if seq == glyphs:
                            found[name] = lig.LigGlyph
    missing = sorted(set(names) - set(found))
    if missing:
        raise SystemExit('字型裡找不到圖示：' + ', '.join(missing))
    return found


def main():
    font = TTFont(SRC)
    found = ligature_glyphs(font, ICONS)
    letters = sorted({ch for name in ICONS for ch in name})
    cmap = font.getBestCmap()
    keep = set(found.values()) | {cmap[ord(ch)] for ch in letters}

    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['liga', 'rlig']
    opts.layout_closure = False      # 只保留指定的連字，不把其他圖示一起帶進來
    opts.notdef_outline = True
    opts.name_IDs = ['*']
    sub = subset.Subsetter(opts)
    sub.populate(glyphs=sorted(keep), unicodes=[ord(ch) for ch in letters])
    sub.subset(font)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font.save(OUT)
    print(f'{len(ICONS)} 個圖示 → {OUT.relative_to(ROOT)}（{OUT.stat().st_size // 1024} KB）')


if __name__ == '__main__':
    main()
