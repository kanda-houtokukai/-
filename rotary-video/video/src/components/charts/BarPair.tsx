/**
 * 2本の棒（第9章の女性会員比率）。棒は下から伸び、値は伸び終わってから点く。
 * 金は1系統だけ。2系統目は白（07・区切り③の指示）。
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { AXIS, GROW } from "./axis";

type Props = {
  names: string[];
  values: number[];
  width: number;
  height: number;
  startAt?: number;
  suffix?: string;
};

export const BarPair: React.FC<Props> = ({ names, values, width, height, startAt = 0, suffix = "%" }) => {
  const frame = useCurrentFrame();
  const PAD_B = 86;
  const PAD_T = 70;
  const plotH = height - PAD_B - PAD_T;
  const max = Math.max(...values) * 1.15;
  const barW = 200;
  const gap = width / values.length;

  return (
    <svg width={width} height={height}>
      <line x1={0} y1={PAD_T + plotH} x2={width} y2={PAD_T + plotH} stroke={AXIS.color} strokeOpacity={AXIS.opacity} strokeWidth={AXIS.width} />
      {values.map((v, i) => {
        const at = startAt + i * 12;
        const grow = interpolate(frame, [at, at + GROW.dur], [0, 1], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const labelOn = interpolate(frame, [at + GROW.dur, at + GROW.dur + motion.fadeIn], [0, 1], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const h = (v / max) * plotH * grow;
        const cx = gap * i + gap / 2;
        const fill = i === 0 ? colors.gold : colors.white;
        return (
          <g key={names[i]}>
            <rect x={cx - barW / 2} y={PAD_T + plotH - h} width={barW} height={h} fill={fill} />
            <text
              x={cx}
              y={PAD_T + plotH - h - 24}
              textAnchor="middle"
              fill={fill}
              opacity={labelOn}
              style={{ fontFamily: fonts.number, fontSize: size.body * 1.2, fontWeight: 700 }}
            >
              {v}
              {suffix}
            </text>
            <text
              x={cx}
              y={PAD_T + plotH + 54}
              textAnchor="middle"
              fill={colors.white}
              opacity={AXIS.tickOpacity}
              style={{ fontFamily: fonts.body, fontSize: AXIS.tickSize }}
            >
              {names[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
