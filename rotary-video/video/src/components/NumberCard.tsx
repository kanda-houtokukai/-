/**
 * 数字カード（金地・紺文字）。数字は0.3秒でフェードして静止し、以後動かない。
 * 説明56px・注記38px。出典は置かない（金地は4〜5秒以内に本文へ戻す）。
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { cardNumberSize, colors, fonts, layout, motion, size } from "../theme";

type Props = {
  number: string;
  caption?: string;
  note?: string;
  /** 数字サイズを明示したいとき（省略時は桁数から自動） */
  numberSize?: number;
};

export const NumberCard: React.FC<Props> = ({ number, caption, note, numberSize }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, motion.fadeIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fontSize = numberSize ?? cardNumberSize(number);

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
        <div
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
          {number}
        </div>
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
