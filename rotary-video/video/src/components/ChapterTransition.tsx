/**
 * 場面転換（全章共通）: 金のカードが上へ抜け、下から次の画面が現れる（0.9秒）。
 * `from` はカードの最終状態（fromFrame で固定）、`to` は次画面の最初の状態（toFrame で固定）を描く。
 * この Sequence の長さは motion.crossover（27f）にすること。
 */
import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { EASE, layout, motion } from "../theme";

type Props = {
  from: React.ReactNode;
  to: React.ReactNode;
  /** from を固定するフレーム（カードの静止状態＝十分大きな値） */
  fromFrame?: number;
  /** to を固定するフレーム（通常 0） */
  toFrame?: number;
};

export const ChapterTransition: React.FC<Props> = ({ from, to, fromFrame = 9999, toFrame = 0 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, motion.crossover], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fromY = -layout.height * t;
  const toY = layout.height * (1 - t);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${toY}px)` }}>
        <Freeze frame={toFrame}>{to}</Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateY(${fromY}px)` }}>
        <Freeze frame={fromFrame}>{from}</Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
