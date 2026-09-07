/**
 * 線形の折れ線（第9章の日本の会員数）。左から線が引かれ、始点と終点の値だけを添える。
 * 数値は src/data.ts（= scripts/data.json）から読む。
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
};

export const LineChart: React.FC<Props> = ({ labels, values, width, height, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const PAD_L = 60;
  const PAD_B = 76;
  const PAD_T = 90;
  const plotW = width - PAD_L;
  const plotH = height - PAD_B - PAD_T;
  const max = Math.max(...values) * 1.02;
  const min = Math.min(...values) * 0.96;
  const x = (i: number) => PAD_L + (plotW / (values.length - 1)) * i;
  const y = (v: number) => PAD_T + plotH - ((v - min) / (max - min)) * plotH;

  const draw = interpolate(frame, [startAt, startAt + GROW.dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drawn = draw * (values.length - 1);
  const pts = values.map((v, i) => [x(i), y(v)] as const);
  let path = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    if (drawn >= i) path += ` L ${pts[i][0]} ${pts[i][1]}`;
    else if (drawn > i - 1) {
      const t = drawn - (i - 1);
      path += ` L ${pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t} ${pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t}`;
      break;
    } else break;
  }
  const endLabel = interpolate(frame, [startAt + GROW.dur, startAt + GROW.dur + motion.fadeIn], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={width} height={height}>
      <line x1={PAD_L} y1={PAD_T + plotH} x2={width} y2={PAD_T + plotH} stroke={AXIS.color} strokeOpacity={AXIS.opacity} strokeWidth={AXIS.width} />
      <path d={path} fill="none" stroke={colors.gold} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => {
        const on = drawn >= i ? 1 : 0;
        const isEdge = i === 0 || i === values.length - 1;
        return (
          <g key={labels[i]} opacity={on}>
            <circle cx={x(i)} cy={y(v)} r={9} fill={colors.gold} />
            {isEdge ? (
              <text
                x={x(i)}
                y={y(v) - 28}
                textAnchor={i === 0 ? "start" : "end"}
                fill={colors.gold}
                opacity={i === 0 ? 1 : endLabel}
                style={{ fontFamily: fonts.number, fontSize: size.body, fontWeight: 700 }}
              >
                {v.toLocaleString("en-US")}
              </text>
            ) : null}
            {isEdge ? (
              <text
                x={x(i)}
                y={PAD_T + plotH + 50}
                textAnchor={i === 0 ? "start" : "end"}
                fill={colors.white}
                opacity={AXIS.tickOpacity}
                style={{ fontFamily: fonts.body, fontSize: AXIS.tickSize }}
              >
                {labels[i]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};
