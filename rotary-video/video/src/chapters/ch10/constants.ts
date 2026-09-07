/** 第10章「エンディング」の尺（秒）。 */
import { motion, sec } from "../../theme";

export const CH10_SECONDS = {
  timeline: 14,
  growth: 16,
  question: 10,
  card: 5,
} as const;

const d = {
  timeline: sec(CH10_SECONDS.timeline),
  growth: sec(CH10_SECONDS.growth),
  question: sec(CH10_SECONDS.question),
  card: sec(CH10_SECONDS.card),
};

export const CH10 = {
  timeline: { from: 0, dur: d.timeline },
  growth: { from: d.timeline, dur: d.growth },
  question: { from: d.timeline + d.growth, dur: d.question },
  card: { from: d.timeline + d.growth + d.question, dur: d.card },
  total: d.timeline + d.growth + d.question + d.card,
} as const;

export const CH10_A = {
  /** 1本の線を左から引く */
  lineStart: sec(0.6),
  lineDur: sec(2.4),
  dotGap: sec(0.45),
} as const;

export const CH10_B = {
  firstCount: sec(1.0),
  secondCount: sec(5.0),
  countDur: motion.countUp,
  noteAt: sec(8.0),
} as const;
