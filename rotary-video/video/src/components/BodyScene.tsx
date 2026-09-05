/**
 * 本文画面（紺地・白文字）。強調のみ金・太字。
 * 子要素は画面上80%の内容域に置き、下20%は出典（SourceLine）専用。
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, fonts, layout, size } from "../theme";
import { SourceLine } from "./SourceLine";

type Props = {
  source?: string;
  /** 内容域の縦位置 */
  align?: "center" | "start";
  children?: React.ReactNode;
};

export const BodyScene: React.FC<Props> = ({ source, align = "center", children }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy }}>
      <div
        style={{
          position: "absolute",
          left: layout.paddingX,
          right: layout.paddingX,
          top: 0,
          height: layout.contentBottom,
          display: "flex",
          flexDirection: "column",
          justifyContent: align === "center" ? "center" : "flex-start",
          paddingTop: align === "start" ? 96 : 0,
          fontFamily: fonts.body,
          color: colors.white,
        }}
      >
        {children}
      </div>
      {source ? <SourceLine text={source} /> : null}
    </AbsoluteFill>
  );
};

/** 章見出し（100〜112px・700） */
export const Heading: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: size.headingMax,
      lineHeight: 1.3,
      color: colors.white,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 本文（54px・行間1.7・400） */
export const Body: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontWeight: 400,
      fontSize: size.body,
      lineHeight: size.bodyLineHeight,
      color: colors.white,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 強調（金・太字）。数字と印、台本の太字にだけ使う。 */
export const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: colors.gold, fontWeight: 700 }}>{children}</span>
);
