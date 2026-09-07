/**
 * 数え上がる数字。1.6秒・EASE・カンマ区切り。
 * 使用は第0章・第10章・第6章のカウントダウンのみ（全体で3か所の制約・07 §4 例外①）。
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, colors, fonts, motion } from "../theme";

type Props = {
  from: number;
  to: number;
  /** 開始フレーム（このコンポーネントを置く Sequence 内の相対フレーム） */
  startAt?: number;
  durationInFrames?: number;
  fontSize: number;
  color?: string;
};

export const CountUpNumber: React.FC<Props> = ({
  from,
  to,
  startAt = 0,
  durationInFrames = motion.countUp,
  fontSize,
  color = colors.white,
}) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startAt, startAt + durationInFrames], [from, to], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        fontFamily: fonts.number,
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
        color,
        letterSpacing: "-0.01em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {Math.round(value).toLocaleString("en-US")}
    </span>
  );
};
