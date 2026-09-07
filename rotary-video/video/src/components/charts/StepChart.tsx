/**
 * 階段グラフ（第8章の人頭分担金）。段は左から順に現れ、値は現れてから点く。
 * 数値は src/data.ts（= scripts/data.json）から読む。中間値が無ければ点の数だけ段ができる（推定しない）。
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { AXIS, GROW } from "./axis";

type Props = {
  labels: string[];
  values: number[];
  width: number;
  height: number;
  startAt?: number;
  unit?: string;
};

export const StepChart: React.FC<Props> = ({ labels, values, width, height, startAt = 0, unit = "$" }) => {
  const frame = useCurrentFrame();
  const PAD_L = 40;
  const PAD_B = 96;
  const PAD_T = 70;
  const plotW = width - PAD_L;
  const plotH = height - PAD_B - PAD_T;
  const max = Math.max(...values) * 1.06;
  const min = Math.min(...values) * 0.92;
  const stepW = plotW / values.length;
  const y = (v: number) => PAD_T + plotH - ((v - min) / (max - min)) * plotH;

  return (
    <svg width={width} height={height}>
      <line x1={PAD_L} y1={PAD_T + plotH} x2={width} y2={PAD_T + plotH} stroke={AXIS.color} strokeOpacity={AXIS.opacity} strokeWidth={AXIS.width} />
      {values.map((v, i) => {
        const at = startAt + (GROW.dur / values.length) * i;
        const grow = interpolate(frame, [at, at + GROW.dur / values.length], [0, 1], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const labelOn = interpolate(frame, [at + GROW.dur / values.length, at + GROW.dur / values.length + motion.fadeIn], [0, 1], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x0 = PAD_L + stepW * i;
        const top = y(v);
        return (
          <g key={labels[i]}>
            {/* 段の水平線 */}
            <line x1={x0} y1={top} x2={x0 + stepW * grow} y2={top} stroke={colors.gold} strokeWidth={7} />
            {/* 段の立ち上がり（1つ前の段から） */}
            {i > 0 ? (
              <line x1={x0} y1={y(values[i - 1])} x2={x0} y2={top + (y(values[i - 1]) - top) * (1 - grow)} stroke={colors.gold} strokeWidth={7} />
            ) : null}
            <text
              x={x0 + stepW / 2}
              y={top - 26}
              textAnchor="middle"
              fill={colors.gold}
              opacity={labelOn}
              style={{ fontFamily: fonts.number, fontSize: size.body * 0.95, fontWeight: 700 }}
            >
              {unit}
              {v.toFixed(2).replace(/\.00$/, "")}
            </text>
            <text
              x={x0 + stepW / 2}
              y={PAD_T + plotH + 52}
              textAnchor="middle"
              fill={colors.white}
              opacity={AXIS.tickOpacity * labelOn}
              style={{ fontFamily: fonts.number, fontSize: AXIS.tickSize }}
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
