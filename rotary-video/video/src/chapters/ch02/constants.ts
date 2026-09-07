/** 第2章「24と6、そしてキー溝」の尺（秒）。 */
import { sec } from "../../theme";

export const CH2_SECONDS = {
  card: 4.5,
  wheel: 30,
  keyway: 24,
} as const;

export const CH2 = {
  card: { from: 0, dur: sec(CH2_SECONDS.card) },
  wheel: { from: sec(CH2_SECONDS.card), dur: sec(CH2_SECONDS.wheel) },
  keyway: { from: sec(CH2_SECONDS.card) + sec(CH2_SECONDS.wheel), dur: sec(CH2_SECONDS.keyway) },
  total: sec(CH2_SECONDS.card) + sec(CH2_SECONDS.wheel) + sec(CH2_SECONDS.keyway),
} as const;

export const CH2_A = {
  /** 荷馬車の車輪を見せてから、24歯6本へ入れ替わるまで */
  morphStart: sec(6.0),
  morphDur: sec(0.8),
  /** 俗説の否定を出す */
  mythAt: sec(10.0),
} as const;

export const CH2_B = {
  /** キー溝の丸が拡大（1.0倍→2.2倍） */
  zoomStart: sec(3.0),
  zoomDur: sec(1.0),
  quoteAt: sec(5.5),
} as const;
