# -*- coding: utf-8 -*-
"""ロータリー変遷動画用の図表画像を生成する。
データは scripts/data.json。数値を直したら `python3 scripts/make_charts.py` を再実行するだけで charts/ が更新される。
status が verified 以外の点は白抜きマーカー＋「要検証」の注記で描く（鉄則5: 未検証の数字を確定値のように見せない）。
"""
import json, os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "charts")
os.makedirs(OUT, exist_ok=True)

for fp in ["/usr/share/fonts/opentype/ipafont-gothic/ipagp.ttf",
           "/System/Library/Fonts/ヒラギノ角ゴシック W4.ttc",
           "/Library/Fonts/Arial Unicode.ttf"]:
    if os.path.exists(fp):
        font_manager.fontManager.addfont(fp)
        plt.rcParams["font.family"] = font_manager.FontProperties(fname=fp).get_name()
        break

NAVY = "#17458F"   # Rotary royal blue (PMS 286C) 相当
GOLD = "#F7A81B"   # Rotary gold (PMS 130C) 相当
GREY = "#6B6B6B"
LIGHT = "#E9EEF6"
plt.rcParams.update({"figure.dpi": 150, "axes.spines.top": False, "axes.spines.right": False,
                     "axes.titlesize": 20, "axes.labelsize": 13, "font.size": 13,
                     "axes.titleweight": "bold", "axes.edgecolor": GREY, "xtick.color": GREY, "ytick.color": GREY})

with open(os.path.join(HERE, "data.json"), encoding="utf-8") as f:
    D = json.load(f)

def save(fig, name):
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, name), facecolor="white")
    plt.close(fig)
    print("wrote", name)

def legend_suffix(status, word):
    """未検証（verified 以外）の点・棒がその図に実在するときだけ凡例文字を返す。"""
    return ("　" + word + "＝要検証") if any(st != "verified" for st in status) else ""

def footnote(ax, text):
    ax.text(0.0, -0.13, text, transform=ax.transAxes, ha="left", va="top", fontsize=10, color=GREY, wrap=True)

def plot_series(ax, xs, ys, status, color, lw=3):
    ax.plot(xs, ys, color=color, lw=lw, zorder=2)
    for x, y, s in zip(xs, ys, status):
        if s == "verified":
            ax.plot(x, y, "o", color=color, ms=10, zorder=3)
        else:
            ax.plot(x, y, "o", mfc="white", mec=color, mew=2.5, ms=10, zorder=3)

# 1a. 日本の会員数（出典ありの期間のみ）
s = D["japan_members_recent"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
plot_series(ax, s["years"], s["values"], s["status"], NAVY)
ax.fill_between(s["years"], s["values"], color=NAVY, alpha=0.06)
for x, y, lab in zip(s["years"], s["values"], s["labels"]):
    ax.annotate(f"{y:,}人", (x, y), textcoords="offset points", xytext=(0, 12), ha="center", fontsize=12, color=NAVY)
ax.set_xticks(s["years"]); ax.set_xticklabels(s["labels"], fontsize=11)
ax.set_ylim(78000, 92000)
ax.set_title("日本のロータリー会員数（2014年→2026年）")
ax.grid(axis="y", alpha=0.3)
ax.text(0.99, 0.95, f"クラブ数 {s['clubs'][0]:,} → {s['clubs'][-1]:,}", transform=ax.transAxes, ha="right", fontsize=13, color=GREY)
footnote(ax, s["source_note"] + legend_suffix(s["status"], "白抜き"))
save(fig, "01a_japan_members_recent.png")

# 1b. 日本の会員数（確認済みの点のみ。未確認のピーク値は不採用 2026-09-05）
s = D["japan_members_long"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
plot_series(ax, s["years"], s["values"], s["status"], NAVY)
ax.fill_between(s["years"], s["values"], color=NAVY, alpha=0.06)
ax.annotate(f"{s['values'][0]:,}人\n(2014年12月)", (s["years"][0], s["values"][0]), textcoords="offset points", xytext=(10, 8), fontsize=12, color=NAVY)
ax.annotate(f"{s['values'][-1]:,}人\n(2026年5月)", (s["years"][-1], s["values"][-1]), textcoords="offset points", xytext=(-10, 12), ha="right", fontsize=12, color=NAVY)
ax.set_ylim(0, 150000)
ax.set_title("日本のロータリー会員数（確認済みの点のみ・2014年→2026年）")
ax.grid(axis="y", alpha=0.3)
footnote(ax, s["source_note"] + legend_suffix(s["status"], "白抜き"))
save(fig, "01b_japan_members_long.png")

# 2. 野生株ポリオ症例数
s = D["polio_wpv"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
cols = [GOLD if i == 0 else NAVY for i in range(len(s["values"]))]
bars = ax.bar([str(y) for y in s["years"]], s["values"], color=cols, zorder=2)
for b, st in zip(bars, s["status"]):
    if st != "verified":
        b.set_alpha(0.75); b.set_hatch("//"); b.set_edgecolor("white")
ax.set_yscale("log")
ax.set_ylim(1, 2_000_000)
ax.set_title("野生株ポリオ 年間症例数：35万 → 数十（対数目盛）")
for i, v in enumerate(s["values"]):
    ax.text(i, v * 1.3, f"{v:,}", ha="center", fontsize=13, color=NAVY if i else "#8a5a00")
ax.grid(axis="y", alpha=0.3, which="major")
footnote(ax, s["source_note"] + legend_suffix(s["status"], "斜線"))
save(fig, "02_polio_cases_log.png")

# 3. 国別会員数
s = D["members_by_country"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
names, vals, st = s["names"][::-1], s["values"][::-1], s["status"][::-1]
bars = ax.barh(names, vals, color=[GOLD if n == "日本" else NAVY for n in names], zorder=2)
for b, sflag in zip(bars, st):
    if sflag != "verified":
        b.set_hatch("//"); b.set_edgecolor("white")
for i, (v, sflag) in enumerate(zip(vals, st)):
    ax.text(v + max(vals) * 0.01, i, f"{v:,}" + ("（要検証）" if sflag == "memory" else ""), va="center", fontsize=12)
ax.set_title("国別ロータリアン数（上位・時点は要確認）")
ax.set_xlim(0, max(vals) * 1.25)
ax.tick_params(axis="y", labelsize=13)
footnote(ax, s["source_note"] + legend_suffix(s["status"], "斜線"))
save(fig, "03_members_by_country.png")

# 4. 世界のクラブ数の成長
s = D["world_clubs"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
plot_series(ax, s["years"], s["values"], s["status"], NAVY)
ax.set_yscale("log")
ax.set_ylim(0.7, 200000)
for x, y in zip(s["years"], s["values"]):
    ax.annotate(f"{y:,}", (x, y), textcoords="offset points", xytext=(0, 12), ha="center", fontsize=12, color=NAVY)
ax.set_title("世界のロータリークラブ数：1 → 45,000超（対数目盛）")
ax.grid(axis="y", alpha=0.3, which="major")
footnote(ax, s["source_note"] + legend_suffix(s["status"], "白抜き"))
save(fig, "04_world_clubs_log.png")

# 5. 年表
s = D["timeline"]
fig, ax = plt.subplots(figsize=(19.2, 7.2))
ys = [e["year"] for e in s]
ax.hlines(0, min(ys) - 4, max(ys) + 4, color=GREY, lw=2)
ax.set_xlim(min(ys) - 8, max(ys) + 8)
levels = [1.0, -1.0, 1.9, -1.9]
for i, e in enumerate(s):
    lv = levels[i % 4]
    c = GOLD if e.get("jp") else NAVY
    ax.plot([e["year"], e["year"]], [0, lv], color=c, lw=1.5)
    ax.plot(e["year"], 0, "o", color=c, ms=9, zorder=3)
    ax.text(e["year"], lv + (0.08 if lv > 0 else -0.08), f'{e["year"]}\n{e["label"]}', ha="center",
            va="bottom" if lv > 0 else "top", fontsize=11, color="#222")
ax.set_ylim(-3.2, 3.2)
ax.axis("off")
ax.set_title("ロータリー120年の年表　　●青＝世界　●金＝日本", fontsize=20)
save(fig, "05_timeline.png")

# 6. 数字カード（章の冒頭に出す「1つの数字」）
cards = [
    ("4", "人から始まった\n1905年2月23日・シカゴ"),
    ("711", "号室\n最初の例会が開かれた部屋"),
    ("24 / 6", "歯車の歯とスポークの数\n意味は「実際に動く歯車」"),
    ("$26.50", "ロータリー財団\n最初の寄付（1917年）"),
    ("855", "番目\n東京RCの世界登録番号（1921年）"),
    ("48 → 7", "クラブ\n1940年脱退時 → 1949年復帰時"),
    ("99.9%", "減少\nポリオ症例（1988年比）"),
    ("8.3%", "日本の女性会員比率（2025年9月）\n世界は27.1%"),
    ("$82 → $93", "RI人頭分担金（年額）\n2025-26 → 2028-29"),
    ("24,830", "人\n米山奨学生の累計（134か国・地域）"),
]
cards += [(c["big"], c["small"], c.get("size", 110)) for c in D.get("cards_extra", [])]
for i, card in enumerate(cards, 1):
    big, small = card[0], card[1]
    big_size = card[2] if len(card) > 2 else 110
    fig, ax = plt.subplots(figsize=(12.8, 7.2))
    ax.axis("off")
    fig.patch.set_facecolor(NAVY)
    ax.text(0.5, 0.58, big, ha="center", va="center", fontsize=big_size, color=GOLD, fontweight="bold", transform=ax.transAxes)
    ax.text(0.5, 0.22, small, ha="center", va="center", fontsize=26, color="white", transform=ax.transAxes, linespacing=1.6)
    fig.savefig(os.path.join(OUT, f"card_{i:02d}.png"), facecolor=NAVY)
    plt.close(fig)
    print("wrote", f"card_{i:02d}.png")
