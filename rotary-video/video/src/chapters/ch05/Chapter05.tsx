/**
 * 第5章「48から7へ」（見本実装）
 * 文言は 04_ナレーション台本.md 第5章と 07_絵コンテと画面設計.md §6 に従う。勝手に足さない。
 * 流れ: カード「48 → 7」→（転換：カードが上へ抜け黒へ）→ 黒コマ0.3秒 → 本文A「1940年 昭和15年」→ 本文B「水曜会／金曜会」→ 本文C 復帰の3条件
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BlackFrame, Body, BodyScene, ChapterTransition, Em, Heading, NumberCard } from "../../components";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { CH5, CH5_A, CH5_C } from "./constants";

const SOURCE = "出典: 東京ロータリークラブ「東京RCの歴史」（tokyo-rc.gr.jp）／『ロータリーの友』（rotary-no-tomo.jp）";

/** フレーム範囲でのフェード（0→1） */
const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Card: React.FC = () => (
  <NumberCard number="48 → 7" caption={"クラブ数\n1940年 脱退 → 1949年 復帰"} />
);

/** 本文A: 1940年。48個の金の四角が7個を残して消える（0.8秒・伸びるのではなく消える） */
const SceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const COLS = 12;
  const ROWS = 4;
  const TOTAL = 48;
  const KEEP = 7;
  const SQ = 78;
  const GAP = 30;
  const removed = TOTAL - KEEP; // 41
  return (
    <BodyScene source={SOURCE} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>
          1940年<span style={{ marginLeft: 48 }}>昭和15年</span>
        </Heading>
        <Body style={{ marginTop: 8 }}>
          <Em>48クラブ・約2,000名</Em>で脱退
        </Body>
      </div>
      <div
        style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${SQ}px)`,
          gridAutoRows: `${SQ}px`,
          gap: GAP,
          width: COLS * SQ + (COLS - 1) * GAP,
        }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const appear = fadeIn(frame, CH5_A.squaresAppear);
          // 後ろの四角から順に消える。残る7個は先頭（左上）の7個。
          const order = TOTAL - 1 - i; // i=47 が最初に消える
          const stagger = (order / removed) * (CH5_A.vanishDur - motion.fadeIn);
          const gone =
            i < KEEP
              ? 0
              : interpolate(frame, [CH5_A.vanishStart + stagger, CH5_A.vanishStart + stagger + motion.fadeIn], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
          return (
            <div
              key={i}
              style={{
                width: SQ,
                height: SQ,
                backgroundColor: colors.gold,
                opacity: appear * (1 - gone),
              }}
            />
          );
        })}
      </div>
    </BodyScene>
  );
};

/** 本文B: 「水曜会」「金曜会」を左右に。看板を下ろす含意は文字のみで。 */
const SceneB: React.FC = () => {
  const frame = useCurrentFrame();
  const word = (label: string, name: string, delay: number) => (
    <div style={{ flex: 1, textAlign: "center", opacity: fadeIn(frame, delay) }}>
      <Body>{label}</Body>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: size.headingMax,
          lineHeight: 1.3,
          color: colors.gold,
          marginTop: 12,
        }}
      >
        {name}
      </div>
    </div>
  );
  return (
    <BodyScene source={SOURCE}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {word("東京", "水曜会", 0)}
        {word("大阪", "金曜会", motion.stagger)}
      </div>
    </BodyScene>
  );
};

/** 本文C: 1949年3月 復帰の3条件を3行。旧番号855で再登録を金で強調。 */
const SceneC: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = ["水曜会を解散すること", "国際ロータリーの定款細則を厳守すること", "義務を完全に履行すること"];
  return (
    <BodyScene source={SOURCE} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>
          1949年3月<span style={{ marginLeft: 48 }}>復帰の3条件</span>
        </Heading>
      </div>
      <div style={{ marginTop: 40 }}>
        {lines.map((text, i) => (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: i === 0 ? 0 : 18,
              opacity: fadeIn(frame, CH5_C.firstLine + i * CH5_C.lineGap),
            }}
          >
            <div style={{ width: 6, height: size.body * 1.3, backgroundColor: colors.gold, marginRight: 36 }} />
            <Body>{text}</Body>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 56, opacity: fadeIn(frame, CH5_C.reregister) }}>
        <Body>
          <Em>旧番号855</Em>で再登録
        </Body>
      </div>
    </BodyScene>
  );
};

export const Chapter05: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy }}>
      <Sequence from={CH5.card.from} durationInFrames={CH5.card.dur} name="カード 48→7">
        <Card />
      </Sequence>
      <Sequence from={CH5.crossover.from} durationInFrames={CH5.crossover.dur} name="転換（カード→黒）">
        <ChapterTransition from={<Card />} to={<BlackFrame />} />
      </Sequence>
      <Sequence from={CH5.black.from} durationInFrames={CH5.black.dur} name="黒コマ 0.3秒">
        <BlackFrame />
      </Sequence>
      <Sequence from={CH5.sceneA.from} durationInFrames={CH5.sceneA.dur} name="A 1940年 脱退">
        <SceneA />
      </Sequence>
      <Sequence from={CH5.sceneB.from} durationInFrames={CH5.sceneB.dur} name="B 水曜会／金曜会">
        <SceneB />
      </Sequence>
      <Sequence from={CH5.sceneC.from} durationInFrames={CH5.sceneC.dur} name="C 復帰の3条件">
        <SceneC />
      </Sequence>
    </AbsoluteFill>
  );
};
