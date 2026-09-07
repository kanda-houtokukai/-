/**
 * 第2章「24と6、そしてキー溝」（1:00）
 * カード「24 / 6」→ 荷馬車の車輪（13本）が24歯6本へ0.8秒で入れ替わる → キー溝を金の丸で拡大。
 * 歯数に象徴的な意味はない旨を本文に必ず出す（04 第2章・07 §6-2）。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, Em, Heading, NumberCard } from "../../components";
import { EASE, colors, motion, size } from "../../theme";
import { CH2, CH2_A, CH2_B } from "./constants";
import { Wheel } from "./Wheel";

const SOURCE = "出典: RGHF「The Rotary wheel pin」";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 車輪が入れ替わる画面 */
const WheelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [CH2_A.morphStart, CH2_A.morphStart + CH2_A.morphDur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const era = t < 0.5 ? "1905年 荷馬車の車輪（スポーク13本）" : "1919〜21年 24歯・6本スポーク";
  return (
    <BodyScene source={SOURCE}>
      <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
        <div style={{ opacity: fadeIn(frame, 0) }}>
          <Wheel t={t} size={620} showKeyway={false} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ opacity: fadeIn(frame, 0) }}>
            <Heading>
              歯車の歯は<Em>24枚</Em>
            </Heading>
            <Heading style={{ marginTop: 8 }}>
              スポークは<Em>6本</Em>
            </Heading>
          </div>
          <Body style={{ marginTop: 40, opacity: fadeIn(frame, motion.stagger) }}>{era}</Body>
          <Body style={{ marginTop: 40, opacity: fadeIn(frame, CH2_A.mythAt) }}>
            <Em>歯やスポークの数に象徴的な意味はありません</Em>
          </Body>
          <Body style={{ marginTop: 8, opacity: fadeIn(frame, CH2_A.mythAt) }}>
            「実際に動く歯車らしく見えるように」というだけ
          </Body>
        </div>
      </div>
    </BodyScene>
  );
};

/** キー溝の拡大 */
const KeywayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [CH2_B.zoomStart, CH2_B.zoomStart + CH2_B.zoomDur], [1, 2.2], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const WHEEL = 620;
  // キー溝は viewBox 600 の中心やや上（ハブの軸穴）。印の丸はハブを囲む大きさにして、拡大時に歯車と識別できるようにする。
  const MARK_R = 46;
  const markLeft = WHEEL / 2 - MARK_R;
  const markTop = WHEEL * (268 / 600) - MARK_R;
  return (
    <BodyScene source={SOURCE}>
      <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
        <div style={{ position: "relative", width: WHEEL, height: WHEEL, opacity: fadeIn(frame, 0) }}>
          <Wheel t={1} size={WHEEL} />
          <div
            style={{
              position: "absolute",
              left: markLeft,
              top: markTop,
              width: MARK_R * 2,
              height: MARK_R * 2,
              borderRadius: MARK_R,
              border: `5px solid ${colors.gold}`,
              transform: `scale(${zoom})`,
              opacity: fadeIn(frame, CH2_B.zoomStart - motion.fadeIn),
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ opacity: fadeIn(frame, 0) }}>
            <Heading>キー溝</Heading>
          </div>
          <Body style={{ marginTop: 36, opacity: fadeIn(frame, motion.stagger) }}>
            「軸に固定するキー溝がない。この歯車は空回りする」
          </Body>
          <Body style={{ marginTop: 36, opacity: fadeIn(frame, CH2_B.quoteAt), fontSize: size.body * 1.15 }}>
            <Em>働き者であって、怠け者ではない</Em>
          </Body>
          <Body style={{ marginTop: 24, opacity: fadeIn(frame, CH2_B.quoteAt) }}>1923〜24年 中央にキー溝が加わる</Body>
        </div>
      </div>
    </BodyScene>
  );
};

export const Chapter02: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH2.card.from} durationInFrames={CH2.card.dur} name="カード 24 / 6">
      <NumberCard number="24 / 6" caption="歯の数とスポークの本数" />
    </Sequence>
    <Sequence from={CH2.wheel.from} durationInFrames={CH2.wheel.dur} name="車輪の入れ替わり">
      <WheelScene />
    </Sequence>
    <Sequence from={CH2.keyway.from} durationInFrames={CH2.keyway.dur} name="キー溝">
      <KeywayScene />
    </Sequence>
  </AbsoluteFill>
);
