/**
 * 第1章「4人と711号室」（1:00）
 * カード4 → 4人の名前（職業つき・NameBlock）→ カード711 → 711と窓のグリッド → ハリー・ラグルス → 1907年の公衆トイレ。
 * 顔は出さない（07 §2-6）。文言は 04 第1章に従う。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, Em, Heading, NameBlock, NumberCard } from "../../components";
import { EASE, colors, fonts, layout, motion, size } from "../../theme";
import { CH1, CH1_A } from "./constants";

const SOURCE = "出典: rotary.org「The first four Rotarians」／RGHF";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const MEMBERS = [
  { name: "ポール・ハリス", role: "弁護士" },
  { name: "グスタバス・ローア", role: "鉱山技師" },
  { name: "シルベスター・シーリ", role: "石炭商" },
  { name: "ハイラム・ショーレイ", role: "仕立て屋" },
];

/** 4人の名前を職業つきで縦に4行。1行ずつ0.4秒差で置く。 */
const MembersScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source={SOURCE} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>1905年2月23日 木曜日の夜</Heading>
      </div>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 30 }}>
        {MEMBERS.map((m, i) => (
          <NameBlock
            key={m.name}
            name={m.name}
            role={m.role}
            opacity={fadeIn(frame, CH1_A.firstName + i * CH1_A.nameGap)}
          />
        ))}
      </div>
    </BodyScene>
  );
};

/** 711 を大きく置き、周りに窓を模した矩形グリッドを薄く。凝らない。 */
const RoomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const COLS = 9;
  const ROWS = 6;
  const W = 120;
  const H = 84;
  const GAP = 26;
  return (
    <BodyScene source={SOURCE}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, ${W}px)`,
            gridAutoRows: `${H}px`,
            gap: GAP,
            opacity: fadeIn(frame, 0) * 0.16,
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => (
            <div key={i} style={{ backgroundColor: colors.white }} />
          ))}
        </div>
        <div
          style={{
            position: "relative",
            fontFamily: fonts.number,
            fontWeight: 700,
            fontSize: size.cardNumberMin,
            lineHeight: 1,
            color: colors.gold,
            opacity: fadeIn(frame, motion.stagger),
          }}
        >
          711
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 36,
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: size.body,
            color: colors.white,
            opacity: fadeIn(frame, motion.stagger * 2),
            textAlign: "center",
          }}
        >
          シカゴ・ユニティビル 711号室
        </div>
      </AbsoluteFill>
    </BodyScene>
  );
};

/** 5人目 ハリー・ラグルス */
const RugglesScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: RGHF「Harry Ruggles, the fifth Rotarian」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>5人目の会員</Heading>
      </div>
      <div style={{ marginTop: 48, width: layout.width * 0.6 }}>
        <NameBlock name="ハリー・ラグルス" role="印刷業" opacity={fadeIn(frame, CH1_A.firstName)} />
      </div>
      <div style={{ marginTop: 48, opacity: fadeIn(frame, CH1_A.firstName + motion.stagger) }}>
        <Body>
          「<Em>みんな、歌おう</Em>」
        </Body>
        <Body style={{ marginTop: 12 }}>例会で歌う文化は、この人から始まった</Body>
      </div>
    </BodyScene>
  );
};

/** 1907年 最初の奉仕は公衆トイレ */
const ToiletScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary.org「Providing public toilets, early Rotary service」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>1907年 最初の奉仕</Heading>
      </div>
      <div style={{ marginTop: 40, opacity: fadeIn(frame, CH1_A.firstName) }}>
        <Body>
          シカゴ市庁舎の<Em>公衆トイレ</Em>
        </Body>
      </div>
      <div style={{ marginTop: 40, opacity: fadeIn(frame, CH1_A.firstName + motion.stagger) }}>
        <Body>ロータリーが「世界初の奉仕クラブ」と呼ばれる理由</Body>
      </div>
    </BodyScene>
  );
};

export const Chapter01: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH1.card4.from} durationInFrames={CH1.card4.dur} name="カード 4">
      <NumberCard number="4" unit="人" caption={"1905年2月23日\nシカゴ・ユニティビル711号室"} />
    </Sequence>
    <Sequence from={CH1.members.from} durationInFrames={CH1.members.dur} name="4人の名前">
      <MembersScene />
    </Sequence>
    <Sequence from={CH1.card711.from} durationInFrames={CH1.card711.dur} name="カード 711">
      <NumberCard number="711" caption="最初の例会が開かれた部屋" />
    </Sequence>
    <Sequence from={CH1.room.from} durationInFrames={CH1.room.dur} name="711号室">
      <RoomScene />
    </Sequence>
    <Sequence from={CH1.ruggles.from} durationInFrames={CH1.ruggles.dur} name="ハリー・ラグルス">
      <RugglesScene />
    </Sequence>
    <Sequence from={CH1.toilet.from} durationInFrames={CH1.toilet.dur} name="1907年 公衆トイレ">
      <ToiletScene />
    </Sequence>
  </AbsoluteFill>
);
