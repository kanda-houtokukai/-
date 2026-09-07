/** 第7章「日本が世界を動かした年」の尺（秒）。 */
import { sec } from "../../theme";

export const CH7_SECONDS = {
  card: 4.5,
  conventions: 34,
  presidents: 12,
  cardYoneyama: 4.5,
  yoneyama: 28,
  tomo: 10,
} as const;

const d = Object.fromEntries(
  Object.entries(CH7_SECONDS).map(([k, v]) => [k, sec(v)]),
) as Record<keyof typeof CH7_SECONDS, number>;

let at = 0;
const step = (dur: number) => {
  const from = at;
  at += dur;
  return { from, dur };
};

export const CH7 = {
  card: step(d.card),
  conventions: step(d.conventions),
  presidents: step(d.presidents),
  cardYoneyama: step(d.cardYoneyama),
  yoneyama: step(d.yoneyama),
  tomo: step(d.tomo),
  total: 0,
};
CH7.total = at;

/** 棒は下から伸びる（1.0〜1.2秒）。値のラベルは伸び終わってから点く。 */
export const CH7_A = {
  barStart: sec(1.0),
  barDur: sec(1.1),
  barGap: sec(0.5),
} as const;

export const CH7_B = { lineAt: sec(0.8) } as const;
