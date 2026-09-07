/** 第1章「4人と711号室」の尺（秒）。 */
import { motion, sec } from "../../theme";

export const CH1_SECONDS = {
  card4: 4.5,
  members: 22,
  card711: 4.5,
  room: 14,
  ruggles: 18,
  toilet: 22,
} as const;

const f = {
  card4: sec(CH1_SECONDS.card4),
  members: sec(CH1_SECONDS.members),
  card711: sec(CH1_SECONDS.card711),
  room: sec(CH1_SECONDS.room),
  ruggles: sec(CH1_SECONDS.ruggles),
  toilet: sec(CH1_SECONDS.toilet),
};

let at = 0;
const step = (dur: number) => {
  const from = at;
  at += dur;
  return { from, dur };
};

export const CH1 = {
  card4: step(f.card4),
  members: step(f.members),
  card711: step(f.card711),
  room: step(f.room),
  ruggles: step(f.ruggles),
  toilet: step(f.toilet),
  total: 0,
} as unknown as {
  card4: { from: number; dur: number };
  members: { from: number; dur: number };
  card711: { from: number; dur: number };
  room: { from: number; dur: number };
  ruggles: { from: number; dur: number };
  toilet: { from: number; dur: number };
  total: number;
};
CH1.total = at;

export const CH1_A = {
  nameGap: motion.stagger, // 1行ずつ0.4秒差で置く
  firstName: sec(0.6),
} as const;
