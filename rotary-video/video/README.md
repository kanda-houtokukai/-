# ロータリー変遷動画（卓話用）— Remotion プロジェクト

正本: `../07_絵コンテと画面設計.md`（画面）／`../04_ナレーション台本.md`（語り）／`../03_動画構成案.md`（章立て・尺）

## 使い方

```bash
npm install
npm run dev            # Remotion Studio でプレビュー
npm run render:ch5     # 第5章を out/chapter05.mp4 に書き出し
```

1920×1080 / 30fps。Chrome が別の場所にある環境では `--browser-executable=<path>` を付ける。

## 構成

| 場所 | 役割 |
|---|---|
| `src/theme.ts` | デザイントークン（色・書体・文字サイズ・安全域・イージング・動きの定数）。数値はここ以外に直書きしない |
| `src/components/` | 共通部品: `NumberCard`（金地カード）／`BodyScene`（紺地本文）＋`Heading`/`Body`/`Em`／`SourceLine`（出典）／`ChapterTransition`（転換0.9秒）／`BlackFrame`（黒コマ） |
| `src/chapters/ch05/constants.ts` | 第5章の尺（秒）。音声の実尺が出たらここだけ差し替える |
| `src/chapters/ch05/Chapter05.tsx` | 第5章「48から7へ」の見本実装 |
| `src/Root.tsx` | コンポジション登録（`Chapter05`） |

## 動きの規約

- アニメーションは `useCurrentFrame()` + `interpolate()` で駆動。CSS の transition / animation は使わない（レンダリングされない）。
- イージングは `theme.EASE`（`Easing.bezier(0.16, 1, 0.3, 1)`）。
- 図（棒・線）は下から1.0〜1.2秒で伸び、値ラベルは伸び終わってから点く。
- 禁止: スライドイン連打、ワイプ、回転、パーティクル、文字の1文字ずつ登場。
- 画面下20%には出典（`SourceLine`）以外を置かない。金地は1章あたり4〜5秒以内。
