/**
 * 対数目盛の折れ線（第6章のポリオ症例数）。
 * 左から線が引かれ、値のラベルは引き終わってから点く。等間隔に見えるため「対数目盛」を必ず画面に出す。
 * 数値は src/data.ts（= scripts/data.json）から読む。
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { AXIS, GROW } from "./axis";

type Props = {
  years: number[];
  values: number[];
  width: number;
  height: number;
  startAt?: number;
  /** 明示する目盛（10 / 100 / 1,000 / 10,000 / 100,000） */
  ticks?: number[];
  /** 最後の点のラベルを外から描く場合は false */
  showLastLabel?: boolean;
};

export const LogLineChart: React.FC<Props> = ({
  years,
  values,
  width,
  height,
  startAt = 0,
  ticks = [10, 100, 1000, 10000, 100000],
  showLastLabel = true,
}) => {
  const frame = useCurrentFrame();
  const PAD_L = 190;
  const PAD_R = 60; // 右端のラベルが切れないための余白
  const PAD_B = 74;
  const PAD_T = 60;
  const plotW = width - PAD_L - PAD_R;
  const plotH = height - PAD_B - PAD_T;
  const minLog = Math.log10(Math.min(...ticks));
  const maxLog = Math.log10(Math.max(...ticks, ...values));
  const x = (i: number) => PAD_L + (plotW / (years.length - 1)) * i;
  const y = (v: number) => PAD_T + plotH - ((Math.log10(Math.max(v, 1)) - minLog) / (maxLog - minLog)) * plotH;

  const draw = interpolate(frame, [startAt, startAt + GROW.dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drawn = draw * (years.length - 1); // 何点目まで引けたか

  const pts = years.map((_, i) => [x(i), y(values[i])] as const);
  let path = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    if (drawn >= i) {
      path += ` L ${pts[i][0]} ${pts[i][1]}`;
    } else if (drawn > i - 1) {
      const t = drawn - (i - 1);
      path += ` L ${pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t} ${pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t}`;
      break;
    } else {
      break;
    }
  }

  return (
    <svg width={width} height={height}>
      {/* 目盛（グリッド線は引かない・ラベルのみ） */}
      {ticks.map((t) => (
        <text
          key={t}
          x={PAD_L - 24}
          y={y(t) + 12}
          textAnchor="end"
          fill={colors.white}
          opacity={AXIS.tickOpacity}
          style={{ fontFamily: fonts.number, fontSize: AXIS.tickSize }}
        >
          {t.toLocaleString("en-US")}
        </text>
      ))}
      {/* 軸 */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke={AXIS.color} strokeOpacity={AXIS.opacity} strokeWidth={AXIS.width} />
      <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke={AXIS.color} strokeOpacity={AXIS.opacity} strokeWidth={AXIS.width} />
      {/* 折れ線 */}
      <path d={path} fill="none" stroke={colors.gold} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      {/* 点・年・値 */}
      {years.map((yr, i) => {
        const on = drawn >= i ? 1 : 0;
        const labelOn = interpolate(
          frame,
          [startAt + (GROW.dur * i) / (years.length - 1) + GROW.labelDelay, startAt + (GROW.dur * i) / (years.length - 1) + GROW.labelDelay + motion.fadeIn],
          [0, 1],
          { easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const isLast = i === years.length - 1;
        return (
          <g key={yr} opacity={on}>
            <circle cx={x(i)} cy={y(values[i])} r={10} fill={colors.gold} />
            <text
              x={x(i)}
              y={PAD_T + plotH + 48}
              textAnchor="middle"
              fill={colors.white}
              opacity={AXIS.tickOpacity * labelOn}
              style={{ fontFamily: fonts.number, fontSize: AXIS.tickSize }}
            >
              {yr}
            </text>
            {isLast && !showLastLabel ? null : (
              <text
                x={x(i)}
                y={y(values[i]) - 26}
                textAnchor={i === 0 ? "start" : "middle"}
                fill={colors.gold}
                opacity={labelOn}
                style={{ fontFamily: fonts.number, fontSize: size.body * 0.85, fontWeight: 700 }}
              >
                {values[i].toLocaleString("en-US")}
              </text>
            )}
          </g>
        );
      })}
      {/* 対数目盛の明示（等間隔に見えるため必須） */}
      <text
        x={PAD_L - 24}
        y={PAD_T - 22}
        textAnchor="end"
        fill={colors.white}
        opacity={AXIS.tickOpacity}
        style={{ fontFamily: fonts.body, fontSize: AXIS.tickSize }}
      >
        対数目盛
      </text>
    </svg>
  );
};
