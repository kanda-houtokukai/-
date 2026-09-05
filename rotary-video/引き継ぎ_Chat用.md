# 引き継ぎ（Chat用）— ロータリー変遷動画（卓話）プロジェクト

作成: 2026-09-05　　書き手: Code　　読み手: Chat（設計・判断担当）

## 貼り付け用プロンプト（このブロックをChatに貼る）

```
新しい案件「ロータリー変遷動画（卓話用）」の引き継ぎです。役割分担は Chat＝設計・判断・指示書、Code＝実装。
まず次の台帳を raw で読み、「現在地・直近の決定事項・次の一手」を3〜5行で復唱してから作業に入ってください。

台帳（正本）:
https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/README.md

ファイルの地図（必要なものだけ読む。01は約20万字あるので冒頭と目次だけ）:
- 数値データ集: https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/02_数値データ集.md
- 動画構成案: https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/03_動画構成案.md
- ナレーション台本: https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/04_ナレーション台本.md
- クイズ・深掘り・俗説: https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/05_クイズと深掘りネタ.md
- 直近の方針まとめ: https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/06_直近の方針まとめ.md
- 調査ノート（元帳・645項目）: https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/01_調査ノート.md
- 図表の元データ: https://raw.githubusercontent.com/kanda-houtokukai/-/claude/rotary-history-video-materials-xspwsd/rotary-video/scripts/data.json
- 図表画像一覧: https://github.com/kanda-houtokukai/-/tree/claude/rotary-history-video-materials-xspwsd/rotary-video/charts

背景:
- 私はロータリークラブ会員で、卓話（約30分枠）で「ロータリーの変遷」動画（約15分）を上映したい。
- 聞き手は在籍数十年のベテランから新人まで。既知の話を数字の意外性で新鮮に見せ、深掘りネタと2023〜2026年の世界・日本の方針も入れる。虚偽は絶対に避ける。
- Codeが調査（Web検索のみ・公式サイト本文は未閲覧）と素材づくりを終え、上記ブランチにpush済み。

Chatに頼みたいこと（この順で）:
1. 台帳と構成案・台本を読み、卓話としての構成の良し悪しを判断する（削る章・足す章・順番）。
2. 02_数値データ集の ⚠️要検証 と ❓記憶 の項目について、原本（rotary.org、RI日本事務局 rotary.or.jp、米山記念奨学会、ロータリーの友、GPEI）で確認し、確定値／不採用を決める。特に: 日本の会員数ピーク「約13万人」、女性会員比率（8.3%と12.94%の2説）、四つのテスト訳者の氏名（本田親男／本田英雄の2説）、野生株ポリオの最新症例数、2026-28年度の日本出身RI理事。
3. 確定した数字と構成の修正を「決定事項リスト」にまとめ、Code向けの指示書（触るファイル・やらないこと・検証手順つき）を作る。Codeは data.json を直して図表を再生成し、台本を修正する。

注意:
- 数字は必ず「時点（何年何月現在）」と出典を添える。出典どうしで食い違う数字は、どちらか一方を断定して動画に載せない。
- Chatはリポジトリに書き込まない（読むだけ）。書き手はCode。
```

## 補足（Chatに貼らなくてよい・自分用メモ）
- ブランチ: `claude/rotary-history-video-materials-xspwsd`（GitHub: https://github.com/kanda-houtokukai/-/tree/claude/rotary-history-video-materials-xspwsd/rotary-video ）
- raw が読めない場合は、Codeから受け取った `rotary-video.zip` を Chat にアップロードして同じ指示を出す。
- 図表画像（PNG）は raw では読めても Chat が画像として扱えないことがある。必要なら zip の `charts/` をアップロードする。
