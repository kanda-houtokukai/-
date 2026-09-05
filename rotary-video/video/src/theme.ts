/**
 * デザイントークン（正本: rotary-video/07_絵コンテと画面設計.md §3・§4）
 * 色・書体・文字サイズ・安全域・動きの定数をここに集約する。他ファイルで数値を直書きしない。
 */
import { Easing } from "remotion";
import { loadFont as loadBiz } from "@remotion/google-fonts/BIZUDPGothic";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

// Google Fonts は loadFont が内部で delayRender を掛けるため、読み込み完了までフレームは確定しない（初回フレーム崩れ対策）。
const biz = loadBiz("normal", {
  weights: ["400", "700"],
  subsets: ["japanese", "latin"],
  ignoreTooManyRequestsWarning: true, // 日本語サブセットは unicode-range で分割配信されるため要求数が多いのは正常
});
const oswald = loadOswald("normal", { weights: ["700"], subsets: ["latin"] });

export const colors = {
  navy: "#17458F",
  gold: "#F7A81B",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const fonts = {
  /** 本文・見出し */
  body: `"${biz.fontFamily}", "BIZ UDPGothic", "Hiragino Sans", "Noto Sans JP", sans-serif`,
  /** 数字 */
  number: `"${oswald.fontFamily}", "Oswald", "Arial Narrow", sans-serif`,
} as const;

/** 文字サイズ（1080p基準・px） */
export const size = {
  cardNumberMin: 560,
  cardNumberMax: 760,
  cardCaption: 56,
  cardNote: 38,
  headingMin: 100,
  headingMax: 112,
  body: 54,
  bodyLineHeight: 1.7,
  source: 26,
} as const;

export const opacity = { source: 0.75 } as const;

/** 画面寸法と安全域。下20%には出典以外を置かない。 */
export const layout = {
  width: 1920,
  height: 1080,
  contentBottom: 1080 * 0.8,
  paddingX: 140,
  sourceRight: 60,
  sourceBottom: 44,
} as const;

export const FPS = 30;
/** 秒→フレーム */
export const sec = (s: number): number => Math.round(s * FPS);

/** 標準イージング */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** 動きの規約（フレーム） */
export const motion = {
  fadeIn: sec(0.3),
  cardHoldMin: sec(3),
  crossover: sec(0.9),
  blackFrame: sec(0.3),
  chartGrowMin: sec(1.0),
  chartGrowMax: sec(1.2),
  vanish: sec(0.8),
  stagger: sec(0.4),
} as const;

/**
 * カードの数字サイズ。桁数で調整し、画面幅の85%を超えない。
 * Oswald 700 の概算字幅（em）で見積もる。
 */
const EM_WIDTH: Record<string, number> = {
  " ": 0.24,
  "→": 0.9,
  $: 0.5,
  "%": 0.75,
  ",": 0.2,
  ".": 0.2,
  "/": 0.35,
  "1": 0.38,
};
export const cardNumberSize = (text: string): number => {
  const em = Array.from(text).reduce((acc, ch) => {
    if (EM_WIDTH[ch] !== undefined) return acc + EM_WIDTH[ch];
    if (/[0-9]/.test(ch)) return acc + 0.5;
    if (/[ -~]/.test(ch)) return acc + 0.55; // 半角英字
    return acc + 1.0; // 全角
  }, 0);
  const fit = (layout.width * 0.85) / Math.max(em, 0.5);
  return Math.min(fit, size.cardNumberMax); // 最小560を下回る場合は85%規則を優先
};

export const waitForFonts = (): Promise<unknown> =>
  Promise.all([biz.waitUntilDone(), oswald.waitUntilDone()]);
