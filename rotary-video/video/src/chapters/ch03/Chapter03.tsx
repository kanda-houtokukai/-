/**
 * 第3章「言葉は変わる」（1:30）
 * 標語の変遷は He → They → One の語だけが置き換わる（位置は動かさない・07 §6-3）。
 * 四つのテストは4行、行頭に金の細い縦線。文言は 04 第3章に従う。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, Em, Heading, NumberCard } from "../../components";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { CH3, CH3_A, CH3_B } from "./constants";

const SOURCE = "出典: rotary.org「The history of Rotary's mottoes」";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 標語の変遷。語だけが入れ替わる。 */
const MottoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const words = [
    { word: "He", year: "〜2004年" },
    { word: "They", year: "2004年" },
    { word: "One", year: "2010年" },
  ];
  // 現在どの語かを決める（位置は固定・語だけ置き換わる）
  let idx = 0;
  CH3_A.wordSwap.forEach((f, i) => {
    if (frame >= f) idx = i;
  });
  const swapOpacity = interpolate(
    frame,
    [CH3_A.wordSwap[idx], CH3_A.wordSwap[idx] + motion.fadeIn],
    [0, 1],
    { easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <BodyScene source={SOURCE} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>超我の奉仕</Heading>
        <Body style={{ marginTop: 20, opacity: fadeIn(frame, CH3_A.serviceAt) }}>
          公式標語は<Em>1950年</Em>、第一標語は<Em>1989年</Em>
        </Body>
      </div>
      <div style={{ marginTop: 80, opacity: fadeIn(frame, CH3_A.wordSwap[0] - motion.stagger) }}>
        <Body>最もよく奉仕する者、最も多く報いられる</Body>
        <div style={{ marginTop: 28, display: "flex", alignItems: "baseline" }}>
          <div style={{ width: 300, textAlign: "right", marginRight: 24 }}>
            <span
              style={{
                fontFamily: fonts.number,
                fontWeight: 700,
                fontSize: size.headingMax,
                color: colors.gold,
                opacity: swapOpacity,
              }}
            >
              {words[idx].word}
            </span>
          </div>
          <span style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: size.body, color: colors.white }}>
            profits most who serves best
          </span>
        </div>
        <div style={{ marginLeft: 0, width: 300, textAlign: "right", opacity: swapOpacity }}>
          <span style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: size.cardNote, color: colors.white, opacity: 0.85 }}>
            {words[idx].year}
          </span>
        </div>
      </div>
    </BodyScene>
  );
};

/** ハーバート・テイラーと会社の再建 */
const TaylorScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary5630.org「History of the Four-Way Test」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>1932年 ハーバート・テイラー</Heading>
      </div>
      <div style={{ marginTop: 48 }}>
        {[
          <>倒産寸前の台所用品会社 クラブ・アルミナム</>,
          <>
            負債は<Em>40万ドル</Em>
          </>,
          <>社員が迷ったときの物差しとして、4つの問いを書いた</>,
          <>
            のちに株主へ<Em>100万ドル以上</Em>の配当
          </>,
          <>
            ロータリーが正式に採用したのは<Em>1943年</Em>
          </>,
        ].map((node, i) => (
          <Body key={i} style={{ marginTop: i === 0 ? 0 : 20, opacity: fadeIn(frame, CH3_B.lineStart + i * motion.stagger) }}>
            {node}
          </Body>
        ))}
      </div>
    </BodyScene>
  );
};

/** 四つのテスト（4行・行頭に金の細い縦線） */
const FourWayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lines = ["真実かどうか", "みんなに公平か", "好意と友情を深めるか", "みんなのためになるかどうか"];
  return (
    <BodyScene source="出典: rotary-no-tomo.jp「四つのテスト」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>四つのテスト</Heading>
      </div>
      <div style={{ marginTop: 48 }}>
        {lines.map((text, i) => (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: i === 0 ? 0 : 22,
              opacity: fadeIn(frame, CH3_B.lineStart + i * motion.stagger),
            }}
          >
            <div style={{ width: 6, height: size.body * 1.3, backgroundColor: colors.gold, marginRight: 36 }} />
            <Body>{text}</Body>
          </div>
        ))}
      </div>
    </BodyScene>
  );
};

/** 日本語訳の公募 */
const JapaneseScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: tokyo-rc.gr.jp「東京RCの歴史」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>1954年 日本語訳の公募</Heading>
        <Body style={{ marginTop: 20 }}>ロータリー創立50周年の記念事業として</Body>
      </div>
      <div style={{ marginTop: 56 }}>
        <Body style={{ opacity: fadeIn(frame, CH3_B.lineStart) }}>
          応募は<Em>70数件</Em>
        </Body>
        <Body style={{ marginTop: 20, opacity: fadeIn(frame, CH3_B.lineStart + motion.stagger) }}>
          当選は東京クラブの<Em>本田親男</Em>さんの訳
        </Body>
        <Body style={{ marginTop: 20, opacity: fadeIn(frame, CH3_B.lineStart + motion.stagger * 2) }}>
          いま<Em>100以上の言語</Em>に訳されている
        </Body>
      </div>
    </BodyScene>
  );
};

export const Chapter03: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH3.motto.from} durationInFrames={CH3.motto.dur} name="標語の変遷">
      <MottoScene />
    </Sequence>
    <Sequence from={CH3.card.from} durationInFrames={CH3.card.dur} name="カード 1932">
      <NumberCard number="1932" caption="四つのテストの誕生年" />
    </Sequence>
    <Sequence from={CH3.taylor.from} durationInFrames={CH3.taylor.dur} name="ハーバート・テイラー">
      <TaylorScene />
    </Sequence>
    <Sequence from={CH3.fourWay.from} durationInFrames={CH3.fourWay.dur} name="四つのテスト">
      <FourWayScene />
    </Sequence>
    <Sequence from={CH3.japanese.from} durationInFrames={CH3.japanese.dur} name="日本語訳の公募">
      <JapaneseScene />
    </Sequence>
  </AbsoluteFill>
);
