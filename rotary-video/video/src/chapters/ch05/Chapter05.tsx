/**
 * 第5章「48から7へ」（見本実装）
 * 文言は 04_ナレーション台本.md 第5章と 07_絵コンテと画面設計.md §6 に従う。勝手に足さない。
 * 流れ: カード「48 → 7」→ 本文0「1935年 来日と月桂樹」→ 黒コマ0.5秒 → 本文A「1940年 昭和15年」→ 本文B「水曜会／金曜会」→ 本文C 復帰の3条件
 * 転換はすべてハードカット（07 §4-2-1）。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BlackFrame, Body, BodyScene, Em, Heading, NumberCard } from "../../components";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { CH5, CH5_0, CH5_A, CH5_C } from "./constants";

const SOURCE = "出典: 東京ロータリークラブ「東京RCの歴史」（tokyo-rc.gr.jp）／『ロータリーの友』（rotary-no-tomo.jp）";

/** フレーム範囲でのフェード（0→1） */
const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Card: React.FC = () => (
  <NumberCard before="48" after="7" unit="クラブ" caption={"1940年 脱退 → 1949年 復帰"} />
);

/**
 * 本文0: 1935年2月9日 ポール・ハリス夫妻 来日。右に金の縦線が下から伸び、1968年の高さで途切れ、
 * その右隣から二世の線が伸び直して画面上部へ届く（07 §4-2-2）。木や葉は描かない。
 */
const Scene0: React.FC = () => {
  const frame = useCurrentFrame();
  const AREA_H = 700; // 線の描画領域の高さ
  const BASE_Y = 40; // 領域下端からの余白
  const FIRST_H = AREA_H * 0.42; // 1968年で途切れる高さ
  const grow = (start: number) =>
    interpolate(frame, [start, start + CH5_0.lineDur], [0, 1], {
      easing: EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const h1 = FIRST_H * grow(CH5_0.lineStart);
  const h2 = (AREA_H - FIRST_H * 0.55) * grow(CH5_0.secondLineStart);
  const years: { label: string; bottom: number }[] = [
    { label: "1935", bottom: BASE_Y },
    { label: "1968", bottom: BASE_Y + FIRST_H - 30 },
    { label: "現在", bottom: BASE_Y + AREA_H - 60 },
  ];
  return (
    <BodyScene source={SOURCE}>
      <div style={{ display: "flex", alignItems: "center", gap: 120 }}>
        <div style={{ flex: 1, opacity: fadeIn(frame, 0, CH5_0.textIn) }}>
          <Heading>1935年2月9日</Heading>
          <Body style={{ marginTop: 24 }}>ポール・ハリス夫妻 来日</Body>
          <Body style={{ marginTop: 8 }}>帝国ホテルの庭に月桂樹</Body>
        </div>
        <div style={{ position: "relative", width: 520, height: AREA_H }}>
          {years.map((y, i) => (
            <div
              key={y.label}
              style={{
                position: "absolute",
                right: 300,
                bottom: y.bottom,
                fontFamily: fonts.body,
                fontWeight: 400,
                fontSize: size.cardNote,
                color: colors.white,
                opacity: fadeIn(frame, CH5_0.lineStart + i * motion.stagger) * 0.85,
                whiteSpace: "nowrap",
              }}
            >
              {y.label === "現在" ? "現在（北の丸公園）" : y.label}
            </div>
          ))}
          <div style={{ position: "absolute", left: 260, bottom: BASE_Y, width: 6, height: h1, backgroundColor: colors.gold }} />
          <div
            style={{
              position: "absolute",
              left: 300,
              bottom: BASE_Y + FIRST_H * 0.55,
              width: 6,
              height: h2,
              backgroundColor: colors.gold,
            }}
          />
        </div>
      </div>
    </BodyScene>
  );
};

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
      <Sequence from={CH5.scene0.from} durationInFrames={CH5.scene0.dur} name="0 1935年 来日・月桂樹">
        <Scene0 />
      </Sequence>
      <Sequence from={CH5.black.from} durationInFrames={CH5.black.dur} name="黒コマ 0.5秒（ハードカット）">
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
