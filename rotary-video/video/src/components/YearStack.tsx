/** 日付を縦に積み、上から順に置く。第4章の3日付で使う（07 §6-4）。 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, colors, fonts, motion, size } from "../theme";

export type YearRow = { date: string; label: string };

export const YearStack: React.FC<{ rows: YearRow[]; startAt?: number; gap?: number }> = ({
  rows,
  startAt = 0,
  gap = motion.stagger,
}) => {
  const frame = useCurrentFrame();
  return (
    <div>
      {rows.map((row, i) => {
        const o = interpolate(frame, [startAt + i * gap, startAt + i * gap + motion.fadeIn], [0, 1], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={row.date} style={{ display: "flex", alignItems: "baseline", marginTop: i === 0 ? 0 : 28, opacity: o }}>
            <div
              style={{
                fontFamily: fonts.number,
                fontWeight: 700,
                fontSize: size.body * 1.25,
                color: colors.gold,
                minWidth: 460,
                letterSpacing: "0.01em",
              }}
            >
              {row.date}
            </div>
            <div style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: size.body, color: colors.white }}>
              {row.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
