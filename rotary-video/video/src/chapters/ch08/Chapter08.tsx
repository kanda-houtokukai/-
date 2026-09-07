/**
 * 第8章「世界のいま（2023〜26）」（2:00）
 * 分担金は StepChart（数値は src/data.ts＝scripts/data.json から読む。中間年度も出典のある確定値で推定ではない）。
 * 会長交代は NameBlock（写真は使わない）。文言は 04 第8章に従う。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, Em, Heading, NameBlock, NumberCard, StepChart } from "../../components";
import { data } from "../../data";
import { EASE, colors, fonts, layout, motion, size } from "../../theme";
import { CH8, CH8_A, CH8_B, CH8_C } from "./constants";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 導入 */
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary.org">
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0) }}>
        <Heading>ここ2〜3年で、ロータリーは制度そのものを変え始めています</Heading>
        <Body style={{ marginTop: 44, opacity: fadeIn(frame, motion.stagger * 2) }}>3つ挙げます</Body>
      </div>
    </BodyScene>
  );
};

/** 本文A: 「テーマ → メッセージ」。左の語が消え、同じ位置に右の語が置かれる。 */
const ThemeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [CH8_A.swapAt, CH8_A.swapAt + CH8_A.swapDur], [1, 0], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inn = interpolate(frame, [CH8_A.swapAt + CH8_A.swapDur, CH8_A.swapAt + CH8_A.swapDur * 2], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word = (text: string, opacity: number) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize: size.headingMax,
        color: colors.gold,
        opacity,
      }}
    >
      {text}
    </div>
  );
  return (
    <BodyScene source="出典: my.rotary.org「Presidential theme」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>ひとつ目「会長テーマ」がなくなりました</Heading>
      </div>
      <div style={{ position: "relative", height: 160, marginTop: 64 }}>
        {word("会長テーマ", out)}
        {word("会長メッセージ", inn)}
      </div>
      <Body style={{ marginTop: 24, opacity: fadeIn(frame, CH8_A.noteAt) }}>
        <Em>2023年10月</Em>の理事会決定で、2025-26年度から変わりました
      </Body>
      <Body style={{ marginTop: 20, opacity: fadeIn(frame, CH8_A.lastThemeAt) }}>
        2024-25年の「ロータリーのマジック」が<Em>最後のテーマ</Em>です
      </Body>
    </BodyScene>
  );
};

/** 本文B: 2年連続の会長交代 */
const PresidentScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary.org／my.rotary.org（会長選出の発表）" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>ふたつ目 2年続けての会長交代</Heading>
      </div>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 40 }}>
        <NameBlock
          year="2025-26年度"
          name="フランチェスコ・アレッツォ（イタリア）"
          role="会長エレクトが就任3週間前の6月に辞任し、急きょ会長に ／ メッセージ「Unite for Good」"
          opacity={fadeIn(frame, CH8_B.firstAt)}
        />
        <NameBlock
          year="2026-27年度"
          name="オラインカ・ババロラ（ナイジェリア）"
          role="韓国の会長エレクトが病気療養のため8月に辞任 ／ メッセージ「Create Lasting Impact」"
          opacity={fadeIn(frame, CH8_B.secondAt)}
        />
      </div>
      <Body style={{ marginTop: 48, opacity: fadeIn(frame, CH8_B.secondAt + motion.stagger * 2) }}>
        2年続けて理事会が会長を選び直す、ロータリー史でも異例の年でした
      </Body>
    </BodyScene>
  );
};

/** 本文C: 分担金の階段グラフ */
const DuesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = data.dues_per_capita;
  return (
    <BodyScene source={s.source_note.replace(/。02_数値データ集.*$/, "")} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>みっつ目 お金</Heading>
        <Body style={{ marginTop: 16 }}>RIへの人頭分担金（年額・米ドル）</Body>
      </div>
      <StepChart
        labels={s.labels as string[]}
        values={s.values}
        width={layout.width - layout.paddingX * 2}
        height={330}
        startAt={CH8_C.chartAt}
      />
      <Body style={{ marginTop: 8, opacity: fadeIn(frame, CH8_C.deficitAt) }}>
        値上げしなければ2029-30年度までに<Em>4,200万ドルの赤字</Em>という試算が示されました
      </Body>
    </BodyScene>
  );
};

/** 本文D: 小規模クラブと台北大会 */
const OtherScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary.org「2025 Council」／「Rotary International Convention 2026」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>ほかにも</Heading>
      </div>
      <div style={{ marginTop: 48 }}>
        <Body style={{ opacity: fadeIn(frame, motion.stagger) }}>小さなクラブの新設が認められました</Body>
        <Body style={{ marginTop: 24, opacity: fadeIn(frame, motion.stagger * 3) }}>
          2026年の国際大会は台北で<Em>3万人以上</Em>が集まりました
        </Body>
      </div>
    </BodyScene>
  );
};

export const Chapter08: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH8.intro.from} durationInFrames={CH8.intro.dur} name="導入">
      <IntroScene />
    </Sequence>
    <Sequence from={CH8.card.from} durationInFrames={CH8.card.dur} name="カード $82 → $93">
      <NumberCard before="$82" after="$93" caption={"RI人頭分担金（年額）\n2025-26年度 → 2028-29年度"} />
    </Sequence>
    <Sequence from={CH8.theme.from} durationInFrames={CH8.theme.dur} name="テーマ → メッセージ">
      <ThemeScene />
    </Sequence>
    <Sequence from={CH8.presidents.from} durationInFrames={CH8.presidents.dur} name="2年連続の会長交代">
      <PresidentScene />
    </Sequence>
    <Sequence from={CH8.dues.from} durationInFrames={CH8.dues.dur} name="分担金の階段">
      <DuesScene />
    </Sequence>
    <Sequence from={CH8.other.from} durationInFrames={CH8.other.dur} name="小規模クラブ・台北">
      <OtherScene />
    </Sequence>
  </AbsoluteFill>
);
