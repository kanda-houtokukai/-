/**
 * 数字カード（金地・紺文字）。数字は0.3秒でフェードして静止し、以後動かない。
 * 対比（before → after）は2段組み: 上段=変化前 / 中央に小さい金の矢印 / 下段=変化後（07 §4-2-4）。
 * 説明56px・注記38px。出典は置かない（金地は1章あたり5秒以内に本文へ戻す）。
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cardNumberSize, colors, fonts, layout, motion, size } from "../theme";

type Props = {
  /** 単段のとき: 表示する数字 */
  number?: string;
  /** 2段組みのとき: 変化前 */
  before?: string;
  /** 2段組みのとき: 変化後 */
  after?: string;
  /** 数字に添える単位（数字の0.5倍で右下に置く） */
  unit?: string;
  caption?: string;
  note?: string;
  numberSize?: number;
};

const Figure: React.FC<{ text: string; fontSize: number; unit?: string }> = ({ text, fontSize, unit }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
    <span
      style={{
        fontFamily: fonts.number,
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
        color: colors.navy,
        whiteSpace: "nowrap",
        letterSpacing: "-0.01em",
      }}
    >
      {text}
    </span>
    {unit ? (
      <span
        style={{
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: fontSize * size.unitRatio,
          lineHeight: 1.1,
          color: colors.navy,
          marginLeft: fontSize * 0.06,
        }}
      >
        {unit}
      </span>
    ) : null}
  </div>
);

export const NumberCard: React.FC<Props> = ({ number, before, after, unit, caption, note, numberSize }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, motion.fadeIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isPair = before !== undefined && after !== undefined;
  // 2段組みは縦に2つ並ぶため、1段あたりの高さを抑える
  // 2段組みは縦に2つ並ぶため、内容域（画面高80%）に矢印・説明とともに収まる高さに抑える
  const pairSize = numberSize ?? Math.min(cardNumberSize(before ?? ""), cardNumberSize(after ?? ""), layout.height * 0.26);
  const soloSize = numberSize ?? cardNumberSize(number ?? "");

  return (
    <AbsoluteFill style={{ backgroundColor: colors.gold }}>
      <div
        style={{
          position: "absolute",
          left: layout.paddingX,
          right: layout.paddingX,
          top: 0,
          height: layout.contentBottom,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: fade,
        }}
      >
        {isPair ? (
          <>
            <Figure text={before as string} fontSize={pairSize} unit={unit} />
            <div
              style={{
                fontFamily: fonts.number,
                fontWeight: 700,
                fontSize: pairSize * size.arrowRatio,
                lineHeight: 1,
                color: colors.navy,
                margin: `${pairSize * 0.06}px 0`,
              }}
            >
              ↓
            </div>
            <Figure text={after as string} fontSize={pairSize} unit={unit} />
          </>
        ) : (
          <Figure text={number as string} fontSize={soloSize} unit={unit} />
        )}
        {caption ? (
          <div
            style={{
              marginTop: 40,
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: size.cardCaption,
              color: colors.navy,
              textAlign: "center",
              whiteSpace: "pre-line",
            }}
          >
            {caption}
          </div>
        ) : null}
        {note ? (
          <div
            style={{
              marginTop: 18,
              fontFamily: fonts.body,
              fontWeight: 400,
              fontSize: size.cardNote,
              color: colors.navy,
              textAlign: "center",
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
