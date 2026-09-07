/** 第8章「世界のいま」の尺（秒）。 */
import { sec } from "../../theme";

export const CH8_SECONDS = {
  intro: 10,
  card: 4.5,
  theme: 30,
  presidents: 30,
  dues: 24,
  other: 14,
} as const;

const d = Object.fromEntries(Object.entries(CH8_SECONDS).map(([k, v]) => [k, sec(v)])) as Record<
  keyof typeof CH8_SECONDS,
  number
>;

let at = 0;
const step = (dur: number) => {
  const from = at;
  at += dur;
  return { from, dur };
};

export const CH8 = {
  intro: step(d.intro),
  card: step(d.card),
  theme: step(d.theme),
  presidents: step(d.presidents),
  dues: step(d.dues),
  other: step(d.other),
  total: 0,
};
CH8.total = at;

/** 本文A: 左の語が消え、同じ位置に右の語が置かれる */
export const CH8_A = { swapAt: sec(4.0), swapDur: sec(0.5), noteAt: sec(6.0), lastThemeAt: sec(9.0) } as const;
export const CH8_B = { firstAt: sec(0.8), secondAt: sec(6.0) } as const;
export const CH8_C = { chartAt: sec(1.0), deficitAt: sec(8.0) } as const;
