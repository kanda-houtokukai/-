# -*- coding: utf-8 -*-
"""ロータリー変遷動画用のグラフ画像を生成するスクリプト。
データは同フォルダの data.json に置き、数値の出典は 02_数値データ集.md に対応させる。
実行: python3 scripts/make_charts.py
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

NAVY = "#17458F"   # Rotary royal blue 相当
GOLD = "#F7A81B"   # Rotary gold 相当
GREY = "#6B6B6B"
plt.rcParams.update({"figure.dpi": 150, "axes.spines.top": False, "axes.spines.right": False,
                     "axes.titlesize": 16, "axes.labelsize": 12, "font.size": 12})

with open(os.path.join(HERE, "data.json"), encoding="utf-8") as f:
    D = json.load(f)

def save(fig, name):
    fig.tight_layout()
    fig.savefig(os.path.join(OUT, name), facecolor="white")
    plt.close(fig)
    print("wrote", name)

# 1. 日本の会員数推移
s = D["japan_members"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
ax.plot(s["years"], s["values"], color=NAVY, lw=3, marker="o")
ax.fill_between(s["years"], s["values"], color=NAVY, alpha=0.08)
ax.set_title("日本のロータリー会員数の推移（人）")
ax.set_ylim(0, max(s["values"]) * 1.15)
ax.grid(axis="y", alpha=0.3)
for x, y in zip(s["years"], s["values"]):
    if x in s.get("label_years", []):
        ax.annotate(f"{y:,}", (x, y), textcoords="offset points", xytext=(0, 10), ha="center", fontsize=11, color=NAVY)
ax.text(0.99, 0.02, s["source_note"], transform=ax.transAxes, ha="right", fontsize=9, color=GREY)
save(fig, "01_japan_members.png")

# 2. 野生株ポリオ症例数
s = D["polio_wpv"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
ax.bar([str(y) for y in s["years"]], s["values"], color=[GOLD if v == max(s["values"]) else NAVY for v in s["values"]])
ax.set_yscale("log")
ax.set_title("野生株ポリオ症例数（対数目盛・年）")
for i, v in enumerate(s["values"]):
    ax.text(i, v * 1.15, f"{v:,}", ha="center", fontsize=10)
ax.grid(axis="y", alpha=0.3, which="both")
ax.text(0.99, 0.02, s["source_note"], transform=ax.transAxes, ha="right", fontsize=9, color=GREY)
save(fig, "02_polio_cases_log.png")

# 3. 世界の会員数（国別上位）
s = D["members_by_country"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
names, vals = s["names"][::-1], s["values"][::-1]
ax.barh(names, vals, color=[GOLD if n == "日本" else NAVY for n in names])
for i, v in enumerate(vals):
    ax.text(v + max(vals) * 0.01, i, f"{v:,}", va="center", fontsize=11)
ax.set_title("国別ロータリアン数（上位）")
ax.set_xlim(0, max(vals) * 1.18)
ax.text(0.99, 0.02, s["source_note"], transform=ax.transAxes, ha="right", fontsize=9, color=GREY)
save(fig, "03_members_by_country.png")

# 4. 世界のクラブ数の成長（節目）
s = D["world_growth"]
fig, ax = plt.subplots(figsize=(12.8, 7.2))
ax.plot(s["years"], s["members"], color=NAVY, lw=3, marker="o")
ax.set_title("世界のロータリー会員数（節目の年）")
for x, y in zip(s["years"], s["members"]):
    ax.annotate(f"{y:,}", (x, y), textcoords="offset points", xytext=(0, 10), ha="center", fontsize=10, color=NAVY)
ax.set_ylim(0, max(s["members"]) * 1.2)
ax.grid(axis="y", alpha=0.3)
ax.text(0.99, 0.02, s["source_note"], transform=ax.transAxes, ha="right", fontsize=9, color=GREY)
save(fig, "04_world_members.png")

# 5. 年表（横長タイムライン）
s = D["timeline"]
fig, ax = plt.subplots(figsize=(19.2, 6))
ys = [e["year"] for e in s]
ax.hlines(0, min(ys) - 3, max(ys) + 3, color=GREY, lw=2)
for i, e in enumerate(s):
    up = i % 2 == 0
    ax.plot([e["year"], e["year"]], [0, 1 if up else -1], color=NAVY if e.get("jp") is None else GOLD, lw=1.5)
    ax.plot(e["year"], 0, "o", color=NAVY if e.get("jp") is None else GOLD, ms=8)
    ax.text(e["year"], 1.08 if up else -1.08, f'{e["year"]}\n{e["label"]}', ha="center",
            va="bottom" if up else "top", fontsize=10)
ax.set_ylim(-2.4, 2.4)
ax.axis("off")
ax.set_title("ロータリー年表（青＝世界／金＝日本）", fontsize=18)
save(fig, "05_timeline.png")
