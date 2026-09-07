/** 第0章「オープニング」の尺（秒）。音声実尺が出たらこの CH0_SECONDS だけ差し替える。 */
import { motion, sec } from "../../theme";

export const CH0_SECONDS = {
  /** 黒→紺の明転と 4 → 1,200,000 のカウントアップ（全編の掴み・静止長め） */
  countUp: 16,
  /** タイトル */
  title: 24,
} as const;

export const CH0 = {
  countUp: { from: 0, dur: sec(CH0_SECONDS.countUp) },
  title: { from: sec(CH0_SECONDS.countUp), dur: sec(CH0_SECONDS.title) },
  total: sec(CH0_SECONDS.countUp) + sec(CH0_SECONDS.title),
} as const;

export const CH0_A = {
  /** 黒→紺の明転 */
  fadeUp: sec(1.2),
  /** 4 の静止 */
  fourAt: sec(1.6),
  /** カウントアップ開始 */
  countStart: sec(4.0),
  countDur: motion.countUp,
  /** 注記「1905年 → 2026年」 */
  noteAt: sec(6.4),
} as const;
