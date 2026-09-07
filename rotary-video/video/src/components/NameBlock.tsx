/**
 * 人名の枠（写真なし・文字組のみ）。氏名・肩書き・年の3行。
 * 第1章の4人、第4章の2人、第7章の3人で共通で使う（07 §2-6）。
 */
import React from "react";
import { colors, fonts, size } from "../theme";

export type NameItem = {
  name: string;
  role?: string;
  year?: string;
};

export const NameBlock: React.FC<NameItem & { opacity?: number; width?: number | string }> = ({
  name,
  role,
  year,
  opacity = 1,
  width,
}) => (
  <div
    style={{
      opacity,
      width,
      borderLeft: `6px solid ${colors.gold}`,
      paddingLeft: 36,
      paddingTop: 6,
      paddingBottom: 6,
    }}
  >
    {year ? (
      <div style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: size.cardNote, color: colors.white, opacity: 0.85 }}>
        {year}
      </div>
    ) : null}
    <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body * 1.15, color: colors.white, lineHeight: 1.35 }}>
      {name}
    </div>
    {role ? (
      <div style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: size.body * 0.72, color: colors.white, opacity: 0.85, lineHeight: 1.5 }}>
        {role}
      </div>
    ) : null}
  </div>
);
