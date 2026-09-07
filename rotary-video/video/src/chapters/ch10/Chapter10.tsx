/**
 * 第10章「エンディング」（0:45）
 * タイムライン（1905→1920→1940→1949→2026）を1本の線で左から引く →
 * 4 → 1,200,000 → 1,250,000 のカウントアップ（全体で3か所の例外の3つ目）→
 * 「次に変える数字を、私たちで決めませんか。」→ 金地カード「Create Lasting Impact」で締め。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, CountUpNumber, Em, Heading, NumberCard } from "../../components";
import { EASE, colors, fonts, layout, motion, size } from "../../theme";
import { CH10, CH10_A, CH10_B } from "./constants";

const SOURCE = "出典: rotary.org／RI日本事務局";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const MILESTONES = [
  { year: "1905", label: "シカゴで創立" },
  { year: "1920", label: "東京RC 創立" },
  { year: "1940", label: "RI 脱退" },
  { year: "1949", label: "復帰" },
  { year: "2026", label: "現在" },
];

/** 1本の線を左から引く */
const TimelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const W = layout.width - layout.paddingX * 2;
  const draw = interpolate(frame, [CH10_A.lineStart, CH10_A.lineStart + CH10_A.lineDur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <BodyScene source={SOURCE}>
      <div style={{ position: "relative", height: 300 }}>
        <div style={{ position: "absolute", top: 148, left: 0, width: W * draw, height: 6, backgroundColor: colors.gold }} />
        {MILESTONES.map((m, i) => {
          const x = (W / (MILESTONES.length - 1)) * i;
          const on = fadeIn(frame, CH10_A.lineStart + CH10_A.dotGap * (i + 1));
          return (
            <div key={m.year} style={{ position: "absolute", left: x - 90, top: 0, width: 180, textAlign: "center", opacity: on }}>
              <div style={{ fontFamily: fonts.number, fontWeight: 700, fontSize: size.body * 1.15, color: colors.white }}>
                {m.year}
              </div>
              <div style={{ margin: "18px auto 0", width: 18, height: 18, borderRadius: 9, backgroundColor: colors.gold }} />
              <div
                style={{
                  marginTop: 18,
                  fontFamily: fonts.body,
                  fontWeight: 400,
                  fontSize: size.cardNote,
                  color: colors.white,
                  opacity: 0.85,
                }}
              >
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </BodyScene>
  );
};

/** 4 → 1,200,000 → 1,250,000 */
const GrowthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const second = frame >= CH10_B.secondCount;
  return (
    <BodyScene source={SOURCE}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", height: layout.contentBottom }}>
        <div style={{ opacity: fadeIn(frame, 0) }}>
          {second ? (
            <CountUpNumber
              from={1200000}
              to={1250000}
              startAt={CH10_B.secondCount}
              durationInFrames={CH10_B.countDur}
              fontSize={size.cardNumberMin}
              color={colors.gold}
            />
          ) : (
            <CountUpNumber
              from={4}
              to={1200000}
              startAt={CH10_B.firstCount}
              durationInFrames={CH10_B.countDur}
              fontSize={size.cardNumberMin}
            />
          )}
        </div>
        <Body style={{ marginTop: 48, textAlign: "center", opacity: fadeIn(frame, CH10_B.noteAt) }}>
          創立125周年にあたる<Em>2030年</Em>までに会員<Em>125万人</Em>
        </Body>
      </AbsoluteFill>
    </BodyScene>
  );
};

/** 問いかけ */
const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source={SOURCE}>
      <div style={{ textAlign: "center" }}>
        <Body style={{ opacity: fadeIn(frame, 0) }}>女性比率8%。会員数8万。ポリオ、あと2か国。</Body>
        <div style={{ marginTop: 56, opacity: fadeIn(frame, motion.stagger * 2) }}>
          <Heading>次に変える数字を、私たちで決めませんか。</Heading>
        </div>
      </div>
    </BodyScene>
  );
};

export const Chapter10: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH10.timeline.from} durationInFrames={CH10.timeline.dur} name="タイムライン">
      <TimelineScene />
    </Sequence>
    <Sequence from={CH10.growth.from} durationInFrames={CH10.growth.dur} name="4 → 120万 → 125万">
      <GrowthScene />
    </Sequence>
    <Sequence from={CH10.question.from} durationInFrames={CH10.question.dur} name="問いかけ">
      <QuestionScene />
    </Sequence>
    <Sequence from={CH10.card.from} durationInFrames={CH10.card.dur} name="カード Create Lasting Impact">
      <NumberCard number="Create Lasting Impact" numberSize={132} caption="2026-27年度 会長メッセージ" />
    </Sequence>
  </AbsoluteFill>
);
