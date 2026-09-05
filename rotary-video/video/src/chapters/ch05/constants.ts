/**
 * 第5章「48から7へ」の尺（秒）。
 * いまは音声が無いので 03_動画構成案.md の尺（1:30）を目安に仮置き。
 * 区切り③で ElevenLabs の実尺が出たら、この数値だけを差し替える。
 */
import { motion, sec } from "../../theme";

export const CH5_SECONDS = {
  /** カード「48 → 7」（数字フェード0.3秒を含む） */
  card: 4.5,
  /** 本文A: 1940年 脱退（48個の四角が7個を残して消える） */
  sceneA: 27,
  /** 本文B: 水曜会／金曜会 */
  sceneB: 14,
  /** 本文C: 1949年3月 復帰の3条件 */
  sceneC: 40,
} as const;

/** フレーム換算した各区間の開始位置 */
const card = sec(CH5_SECONDS.card);
const crossover = motion.crossover; // カード→黒（転換0.9秒）
const black = motion.blackFrame;
const sceneA = sec(CH5_SECONDS.sceneA);
const sceneB = sec(CH5_SECONDS.sceneB);
const sceneC = sec(CH5_SECONDS.sceneC);

export const CH5 = {
  card: { from: 0, dur: card },
  crossover: { from: card, dur: crossover },
  black: { from: card + crossover, dur: black },
  sceneA: { from: card + crossover + black, dur: sceneA },
  sceneB: { from: card + crossover + black + sceneA, dur: sceneB },
  sceneC: { from: card + crossover + black + sceneA + sceneB, dur: sceneC },
  total: card + crossover + black + sceneA + sceneB + sceneC,
} as const;

/** 本文A内の動き（フレーム） */
export const CH5_A = {
  squaresAppear: sec(0.6),
  vanishStart: sec(4.0),
  vanishDur: motion.vanish, // 0.8秒
} as const;

/** 本文C内の動き（フレーム） */
export const CH5_C = {
  firstLine: sec(0.8),
  lineGap: motion.stagger,
  reregister: sec(7.0),
} as const;
