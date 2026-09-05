/** 出典表示。画面右下・26px・不透明度75%。安全域（下20%）に置いてよい唯一の要素。 */
import React from "react";
import { colors, fonts, layout, opacity, size } from "../theme";

export const SourceLine: React.FC<{ text: string; color?: string }> = ({ text, color = colors.white }) => (
  <div
    style={{
      position: "absolute",
      right: layout.sourceRight,
      bottom: layout.sourceBottom,
      fontFamily: fonts.body,
      fontWeight: 400,
      fontSize: size.source,
      color,
      opacity: opacity.source,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);
