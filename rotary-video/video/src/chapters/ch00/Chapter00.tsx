/**
 * 第0章「オープニング」（0:40）
 * 黒→紺へ明転し、中央に 4 が現れて 1,200,000 までカウントアップ（全体で3か所の例外の1つ目・07 §4）。
 * 到達後に「1905年 → 2026年」の注記。続いてタイトル画面。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, CountUpNumber, Heading } from "../../components";
import { EASE, colors, fonts, layout, motion, size } from "../../theme";
import { CH0, CH0_A } from "./constants";

const SOURCE = "出典: rotary.org「Rotary's timeline」";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 4 → 1,200,000 のカウントアップ。黒からの明転つき。 */
const CountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = interpolate(frame, [0, CH0_A.fadeUp], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <AbsoluteFill style={{ backgroundColor: colors.navy, opacity: lift }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", height: layout.contentBottom }}>
        <div style={{ opacity: fadeIn(frame, CH0_A.fourAt) }}>
          <CountUpNumber
            from={4}
            to={1200000}
            startAt={CH0_A.countStart}
            durationInFrames={CH0_A.countDur}
            fontSize={size.cardNumberMin}
          />
        </div>
        <div
          style={{
            marginTop: 48,
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: size.body,
            color: colors.white,
            opacity: fadeIn(frame, CH0_A.noteAt) * 0.9,
          }}
        >
          1905年 → 2026年
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** タイトル */
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source={SOURCE}>
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0) }}>
        <Heading>数字で読むロータリー120年</Heading>
        <Body style={{ marginTop: 40, opacity: fadeIn(frame, motion.stagger) }}>
          120万人の始まりは、4人でした
        </Body>
      </div>
    </BodyScene>
  );
};

export const Chapter00: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH0.countUp.from} durationInFrames={CH0.countUp.dur} name="4 → 1,200,000">
      <CountScene />
    </Sequence>
    <Sequence from={CH0.title.from} durationInFrames={CH0.title.dur} name="タイトル">
      <TitleScene />
    </Sequence>
  </AbsoluteFill>
);
