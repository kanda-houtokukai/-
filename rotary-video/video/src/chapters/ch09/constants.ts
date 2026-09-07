/** 第9章「8.3%と27.1%」の尺（秒）。 */
import { sec } from "../../theme";

export const CH9_SECONDS = {
  card: 4.5,
  members: 26,
  ratio: 26,
  satellite: 20,
  directors: 16,
  insert: 12,
} as const;

const d = Object.fromEntries(Object.entries(CH9_SECONDS).map(([k, v]) => [k, sec(v)])) as Record<
  keyof typeof CH9_SECONDS,
  number
>;

let at = 0;
const step = (dur: number) => {
  const from = at;
  at += dur;
  return { from, dur };
};

export const CH9 = {
  card: step(d.card),
  members: step(d.members),
  ratio: step(d.ratio),
  satellite: step(d.satellite),
  directors: step(d.directors),
  insert: step(d.insert),
  total: 0,
};
CH9.total = at;

export const CH9_A = { chartAt: sec(1.0), clubsAt: sec(4.0), covidAt: sec(7.0) } as const;
export const CH9_B = { chartAt: sec(1.0), noteAt: sec(6.0) } as const;
export const CH9_C = { lineAt: sec(0.8) } as const;
