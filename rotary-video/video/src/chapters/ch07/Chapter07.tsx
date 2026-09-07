/**
 * 第7章「日本が世界を動かした年」（1:30）
 * 3大会（23,366 / 39,834 / 45,381）は棒の高さで比較。棒は下から伸び、値は伸び終わってから点く。
 * 3人のRI会長は年度と氏名のみ（写真なし）。文言は 04 第7章に従う。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, Em, Heading, NameBlock, NumberCard } from "../../components";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { CH7, CH7_A, CH7_B } from "./constants";

const SOURCE = "出典: rotary.org/ja「国際大会の歴史」";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const CONVENTIONS = [
  { year: "1961年", city: "東京", value: 23366, note: "アジア初・当時最多" },
  { year: "1978年", city: "東京", value: 39834, note: "3-H補助金の創設を発表" },
  { year: "2004年", city: "大阪", value: 45381, note: "有料参加者の史上最多" },
];

/** 3大会の棒比較 */
const ConventionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const MAX_H = 330;
  const max = Math.max(...CONVENTIONS.map((c) => c.value));
  return (
    <BodyScene source={SOURCE} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>日本で開かれた国際大会</Heading>
      </div>
      <div style={{ marginTop: 32, display: "flex", alignItems: "flex-end", gap: 110 }}>
        {CONVENTIONS.map((c, i) => {
          const start = CH7_A.barStart + i * CH7_A.barGap;
          const grow = interpolate(frame, [start, start + CH7_A.barDur], [0, 1], {
            easing: EASE,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const h = (c.value / max) * MAX_H * grow;
          const labelOn = fadeIn(frame, start + CH7_A.barDur);
          return (
            <div key={c.year} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 340 }}>
              <div
                style={{
                  fontFamily: fonts.number,
                  fontWeight: 700,
                  fontSize: size.body * 1.3,
                  color: colors.gold,
                  opacity: labelOn,
                  marginBottom: 12,
                }}
              >
                {c.value.toLocaleString("en-US")}
              </div>
              <div style={{ width: 190, height: h, backgroundColor: colors.gold }} />
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body * 0.85, color: colors.white }}>
                  {c.year} {c.city}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontWeight: 400,
                    fontSize: size.cardNote * 0.8,
                    color: colors.white,
                    opacity: 0.85 * labelOn,
                    marginTop: 6,
                  }}
                >
                  {c.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BodyScene>
  );
};

/** 3人のRI会長（年度と氏名のみ） */
const PresidentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const list = [
    { year: "1968-69年", name: "東ヶ崎潔" },
    { year: "1982-83年", name: "向笠廣次" },
    { year: "2012-13年", name: "田中作次" },
  ];
  return (
    <BodyScene source="出典: tokyo-rc.gr.jp／中津RC／八潮RC" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>日本から3人のRI会長</Heading>
      </div>
      <div style={{ marginTop: 56, display: "flex", gap: 60 }}>
        {list.map((p, i) => (
          <NameBlock key={p.name} name={p.name} year={p.year} opacity={fadeIn(frame, CH7_B.lineAt + i * motion.stagger)} width="30%" />
        ))}
      </div>
    </BodyScene>
  );
};

/** 米山記念奨学会 */
const YoneyamaScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary-yoneyama.or.jp" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>米山記念奨学会</Heading>
        <Body style={{ marginTop: 20 }}>1952年 東京クラブが米山梅吉の追悼事業として開始</Body>
      </div>
      <div style={{ marginTop: 48 }}>
        {[
          <>
            第1号はタイから来た<Em>ソムチャード</Em>さん（東京大学で養蚕学）
          </>,
          <>
            累計<Em>24,830人</Em>・<Em>134の国と地域</Em>（2025年7月現在）
          </>,
          <>
            年間<Em>約950人</Em>を採用する、日本最大の民間奨学事業
          </>,
          <>
            元奨学生からの寄付も累計<Em>1億3,200万円</Em>
          </>,
        ].map((node, i) => (
          <Body key={i} style={{ marginTop: i === 0 ? 0 : 22, opacity: fadeIn(frame, CH7_B.lineAt + i * motion.stagger) }}>
            {node}
          </Body>
        ))}
      </div>
    </BodyScene>
  );
};

/** ロータリーの友 */
const TomoScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary-no-tomo.jp" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>『ロータリーの友』</Heading>
      </div>
      <Body style={{ marginTop: 40, opacity: fadeIn(frame, CH7_B.lineAt) }}>
        1953年1月創刊、定価50円、<Em>3,300部</Em>から始まりました
      </Body>
    </BodyScene>
  );
};

export const Chapter07: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH7.card.from} durationInFrames={CH7.card.dur} name="カード 23,366">
      <NumberCard number="23,366" unit="人" caption={"1961年 東京国際大会\nアジア初・当時最多"} />
    </Sequence>
    <Sequence from={CH7.conventions.from} durationInFrames={CH7.conventions.dur} name="3大会の比較">
      <ConventionScene />
    </Sequence>
    <Sequence from={CH7.presidents.from} durationInFrames={CH7.presidents.dur} name="3人のRI会長">
      <PresidentScene />
    </Sequence>
    <Sequence from={CH7.cardYoneyama.from} durationInFrames={CH7.cardYoneyama.dur} name="カード 24,830">
      <NumberCard number="24,830" unit="人" caption={"米山奨学生の累計\n2025年7月現在"} />
    </Sequence>
    <Sequence from={CH7.yoneyama.from} durationInFrames={CH7.yoneyama.dur} name="米山記念奨学会">
      <YoneyamaScene />
    </Sequence>
    <Sequence from={CH7.tomo.from} durationInFrames={CH7.tomo.dur} name="ロータリーの友">
      <TomoScene />
    </Sequence>
  </AbsoluteFill>
);
