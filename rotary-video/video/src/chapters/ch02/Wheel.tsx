/**
 * 歯車のSVG（この作品で唯一の作図・07 §6-2）。
 * t=0 で1905年の荷馬車の車輪（スポーク13本・歯なし）、t=1 で現行の24歯6本スポーク。
 * 歯は t に応じて外周から生え、スポークは 13→6 に入れ替わる（不要な本数が消え、残りが太る）。
 */
import React from "react";
import { colors } from "../../theme";

const CX = 300;
const CY = 300;
const R_OUTER = 240; // リムの外周（歯の付け根）
const R_RIM = 214; // リムの内側
const R_HUB = 78; // ハブ外径
const R_HUB_IN = 46; // ハブ内径（軸穴）
const TOOTH_H = 40; // 歯の高さ
const TEETH = 24;
const OLD_SPOKES = 13;
const NEW_SPOKES = 6;

const polar = (r: number, deg: number): [number, number] => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
};

/** 台形の歯を1つ描くパス */
const toothPath = (index: number, grow: number): string => {
  const step = 360 / TEETH;
  const a = index * step;
  const halfBase = step * 0.30;
  const halfTip = step * 0.17;
  const rTip = R_OUTER + TOOTH_H * grow;
  const [x1, y1] = polar(R_OUTER, a - halfBase);
  const [x2, y2] = polar(rTip, a - halfTip);
  const [x3, y3] = polar(rTip, a + halfTip);
  const [x4, y4] = polar(R_OUTER, a + halfBase);
  return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;
};

export const Wheel: React.FC<{ t: number; size?: number; color?: string; showKeyway?: boolean }> = ({
  t,
  size = 600,
  color = colors.gold,
  showKeyway = true,
}) => {
  const teethGrow = t;
  return (
    <svg width={size} height={size} viewBox="0 0 600 600">
      {/* 歯（24枚・t に応じて生える） */}
      {teethGrow > 0.001
        ? Array.from({ length: TEETH }).map((_, i) => (
            <path key={`t${i}`} d={toothPath(i, teethGrow)} fill={color} />
          ))
        : null}
      {/* リム */}
      <circle cx={CX} cy={CY} r={(R_OUTER + R_RIM) / 2} fill="none" stroke={color} strokeWidth={R_OUTER - R_RIM} />
      {/* 旧スポーク13本（t が進むと消える） */}
      {Array.from({ length: OLD_SPOKES }).map((_, i) => {
        const a = (360 / OLD_SPOKES) * i;
        const [x1, y1] = polar(R_HUB, a);
        const [x2, y2] = polar(R_RIM, a);
        const o = Math.max(0, 1 - t * 1.6);
        return o <= 0 ? null : (
          <line key={`o${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={10} opacity={o} />
        );
      })}
      {/* 新スポーク6本（t が進むと現れて太る） */}
      {Array.from({ length: NEW_SPOKES }).map((_, i) => {
        const a = (360 / NEW_SPOKES) * i;
        const [x1, y1] = polar(R_HUB, a);
        const [x2, y2] = polar(R_RIM, a);
        const o = Math.max(0, (t - 0.35) / 0.65);
        return o <= 0 ? null : (
          <line key={`n${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={10 + 18 * o} opacity={o} />
        );
      })}
      {/* ハブ */}
      <circle cx={CX} cy={CY} r={(R_HUB + R_HUB_IN) / 2} fill="none" stroke={color} strokeWidth={R_HUB - R_HUB_IN} />
      {/* キー溝（軸穴の上に切り欠き） */}
      {showKeyway && t > 0.9 ? (
        <rect x={CX - 14} y={CY - R_HUB_IN - 14} width={28} height={46} fill={color} />
      ) : null}
    </svg>
  );
};

/** キー溝の画面座標（600×600 の viewBox 内） */
export const KEYWAY_POS = { x: CX, y: CY - R_HUB_IN + 4, viewBox: 600 };
