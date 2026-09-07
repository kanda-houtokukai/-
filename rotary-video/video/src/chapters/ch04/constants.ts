/** 第4章「855番目のクラブ」の尺（秒）。 */
import { sec } from "../../theme";

export const CH4_SECONDS = {
  card: 4.5,
  dallas: 26,
  dates: 24,
  service: 22,
  district: 14,
} as const;

const d = {
  card: sec(CH4_SECONDS.card),
  dallas: sec(CH4_SECONDS.dallas),
  dates: sec(CH4_SECONDS.dates),
  service: sec(CH4_SECONDS.service),
  district: sec(CH4_SECONDS.district),
};

export const CH4 = {
  card: { from: 0, dur: d.card },
  dallas: { from: d.card, dur: d.dallas },
  dates: { from: d.card + d.dallas, dur: d.dates },
  service: { from: d.card + d.dallas + d.dates, dur: d.service },
  district: { from: d.card + d.dallas + d.dates + d.service, dur: d.district },
  total: d.card + d.dallas + d.dates + d.service + d.district,
} as const;

export const CH4_A = { nameAt: sec(0.8), gap: sec(0.6) } as const;
export const CH4_B = { stackAt: sec(0.8) } as const;
