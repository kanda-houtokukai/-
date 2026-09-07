/** グラフ共通の作法（07 §5・区切り③の指示）。グリッド線は引かない。 */
import { colors, size } from "../../theme";

export const AXIS = {
  /** 軸の線は白の不透明度35% */
  color: colors.white,
  opacity: 0.35,
  width: 3,
  /** 目盛ラベル */
  tickSize: size.cardNote,
  tickOpacity: 0.85,
} as const;

/** 伸びる時間（1.0〜1.2秒） */
export const GROW = { dur: 33, labelDelay: 4 } as const;
