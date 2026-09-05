/** 黒コマ。全体で第5章「1940年 脱退」の直前1回だけ使う（07 §4 例外②）。長さは motion.blackFrame（0.3秒）。 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

export const BlackFrame: React.FC = () => <AbsoluteFill style={{ backgroundColor: colors.black }} />;
