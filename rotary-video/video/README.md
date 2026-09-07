# rotary-video/video — Remotion プロジェクト（環境メモ）

ロータリー変遷動画（卓話用）の映像本体。設計の正本は1つ上の階層にある。

| 正本 | 役割 |
|---|---|
| `../03_動画構成案.md` | 章立てと尺 |
| `../04_ナレーション台本.md` | 語り（画面に出す文言もここが正本） |
| `../07_絵コンテと画面設計.md` | 画面の見え方・動きの規約 |
| `../scripts/data.json` | 図表の元データ（PNG は動画では使わない） |

## 使い方

```bash
npm install
npx remotion studio          # プレビュー（ブラウザで開く）
npm run render:ch05          # 第5章だけ書き出す
npx remotion render Chapter00 out/chapter00.mp4   # 章を指定して書き出す
```

書き出したファイルは `out/` に出る（git 管理外）。

## 構成

```
src/
  theme.ts              色・書体・文字サイズ・安全域・動きの定数（ここ以外に数値を直書きしない）
  Root.tsx              章ごとの Composition 登録
  components/           全章で使う部品
    NumberCard          金地の数字カード（対比は2段組み）
    BodyScene           紺地の本文画面（Heading / Body / Em を同梱）
    SourceLine          右下の出典表示
    ChapterTransition   金のカードが上へ抜ける転換（現在は未使用・黒コマはハードカット）
    BlackFrame          黒コマ（第5章のみ・0.5秒）
    CountUpNumber       数え上がる数字（第0章・第10章・第6章のみ）
    NameBlock           人名の枠（氏名・肩書き・年／写真なし）
    YearStack           日付の縦積み
  chapters/chXX/
    constants.ts        その章の尺（秒）。音声の実尺が出たらここだけ差し替える
    ChapterXX.tsx       画面
```

## この環境で分かったこと（落とし穴）

- **Remotion は 4.0.520 に固定**している。最新の 4.0.521 は一部パッケージ（`@remotion/player` など）がレジストリに未反映で `npm install` が失敗した。上げるときは全パッケージが同じ版で揃っているか確認する。
- **`create-video --no-tailwind` が効かなかった**ため、Tailwind の依存と設定は手で外した。`package.json` に `@remotion/tailwind-v4` を戻さないこと。
- **CSS の `transition` / `animation` は使わない。** レンダリング時は1フレームずつ描くため反映されない。動きは必ず `useCurrentFrame()` と `interpolate()` で作る。
- **Google Fonts は `loadFont()` が内部で `delayRender` を掛ける**ので、読み込み完了までフレームは確定しない。日本語サブセットは unicode-range 分割配信のためリクエスト数が多く警告が出るが正常なので `ignoreTooManyRequestsWarning: true` を渡している。
- **開発コンテナでは追加オプションが要る**（自宅の Mac では不要）。社内プロキシの証明書の都合で Chromium がフォントを取得できないため:
  ```bash
  npx remotion render Chapter05 out/chapter05.mp4 \
    --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
    --ignore-certificate-errors
  ```
- ときどき `NetworkError: A network error occurred.` で失敗するが、同じコマンドを再実行すれば通る（フォント取得の一過性の失敗）。

## 音声（区切り③以降）

ナレーションは ElevenLabs で生成し、`public/audio/chXX.mp3` に置く予定。
各章の `constants.ts` の秒数を音声の実尺に置き換えれば、映像がそれに追従する。
