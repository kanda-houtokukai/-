/** 第6章「26ドル50セントから30億人へ」の尺（秒）。 */
import { motion, sec } from "../../theme";

export const CH6_SECONDS = {
  card: 4.5,
  giving: 22,
  cardPolio: 4.5,
  polio: 34,
  japan: 18,
  gates: 22,
  target: 12,
} as const;

const d = Object.fromEntries(Object.entries(CH6_SECONDS).map(([k, v]) => [k, sec(v)])) as Record<
  keyof typeof CH6_SECONDS,
  number
>;

let at = 0;
const step = (dur: number) => {
  const from = at;
  at += dur;
  return { from, dur };
};

export const CH6 = {
  card: step(d.card),
  giving: step(d.giving),
  cardPolio: step(d.cardPolio),
  polio: step(d.polio),
  japan: step(d.japan),
  gates: step(d.gates),
  target: step(d.target),
  total: 0,
};
CH6.total = at;

/** 本文A: 上下2段の数字（棒は使わない） */
export const CH6_A = { spanAt: sec(2.0), secondAt: sec(3.0) } as const;

/** 本文B: 折れ線とカウントダウン（全体で2か所目のカウント演出） */
export const CH6_B = {
  chartStart: sec(1.2),
  countStart: sec(4.0),
  countDur: motion.countUp, // 1.6秒
} as const;

export const CH6_C = { lineAt: sec(0.8) } as const;
