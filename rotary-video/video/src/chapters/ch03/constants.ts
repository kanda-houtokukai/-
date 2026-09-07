/** 第3章「言葉は変わる」の尺（秒）。 */
import { sec } from "../../theme";

export const CH3_SECONDS = {
  motto: 30,
  card: 4.5,
  taylor: 24,
  fourWay: 18,
  japanese: 24,
} as const;

const d = {
  motto: sec(CH3_SECONDS.motto),
  card: sec(CH3_SECONDS.card),
  taylor: sec(CH3_SECONDS.taylor),
  fourWay: sec(CH3_SECONDS.fourWay),
  japanese: sec(CH3_SECONDS.japanese),
};

export const CH3 = {
  motto: { from: 0, dur: d.motto },
  card: { from: d.motto, dur: d.card },
  taylor: { from: d.motto + d.card, dur: d.taylor },
  fourWay: { from: d.motto + d.card + d.taylor, dur: d.fourWay },
  japanese: { from: d.motto + d.card + d.taylor + d.fourWay, dur: d.japanese },
  total: d.motto + d.card + d.taylor + d.fourWay + d.japanese,
} as const;

/** 標語の語が置き換わるタイミング（位置は動かさない） */
export const CH3_A = {
  serviceAt: sec(0.6),
  wordSwap: [sec(9.0), sec(14.0), sec(19.0)],
  /** 3語同時に置き換わる時間 */
  swapDur: sec(0.4),
} as const;

export const CH3_B = { lineStart: sec(0.8) } as const;
