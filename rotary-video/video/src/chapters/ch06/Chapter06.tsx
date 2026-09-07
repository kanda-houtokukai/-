/**
 * 第6章「26ドル50セントから30億人へ」（2:00）
 * 数値はすべて src/data.ts（= scripts/data.json）から読む。
 * 本文Bのカウントダウン（350,000 → 22）は全体で3か所しかないカウント演出の2つ目（07 §4 例外①）。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, CountUpNumber, Em, Heading, LogLineChart, NumberCard } from "../../components";
import { data } from "../../data";
import { EASE, colors, fonts, layout, motion, size } from "../../theme";
import { CH6, CH6_A, CH6_B, CH6_C } from "./constants";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * 本文A: $26.50（1917年）と 5億6,900万ドル（2024-25年度）を上下2段の大きな数字で置き、間に「107年」を添える。
 * 棒・軸・目盛は使わない（対数で下駄を履かせると高さの比が正しくなくなるため・2026-09-07 の判断）。
 */
const GivingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = data.foundation_giving;
  const row = (i: number, delay: number) => (
    <div style={{ textAlign: "center", opacity: fadeIn(frame, delay) }}>
      <div
        style={{
          fontFamily: fonts.number,
          fontWeight: 700,
          fontSize: size.body * 3.2,
          lineHeight: 1.05,
          color: colors.gold,
        }}
      >
        {s.display?.[i]}
      </div>
      <div style={{ fontFamily: fonts.body, fontWeight: 400, fontSize: size.cardNote, color: colors.white, opacity: 0.9, marginTop: 10 }}>
        {s.labels?.[i]}　{s.sublabels?.[i]}
      </div>
    </div>
  );
  return (
    <BodyScene source={s.source_note.replace(/。02_数値データ集.*$/, "")}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {row(0, 0)}
        <div
          style={{
            margin: "28px 0",
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: size.body,
            color: colors.white,
            opacity: fadeIn(frame, CH6_A.spanAt) * 0.9,
          }}
        >
          107年
        </div>
        {row(1, CH6_A.secondAt)}
      </div>
    </BodyScene>
  );
};

/** 本文B: 対数の折れ線と、最後の点でのカウントダウン */
const PolioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = data.polio_wpv;
  const first = s.values[0];
  const last = s.values[s.values.length - 1];
  return (
    <BodyScene source="出典: GPEI／WHO東地中海地域事務局 ポリオ速報" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>野生株ポリオの年間症例数</Heading>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <LogLineChart
          years={s.years as number[]}
          values={s.values}
          width={layout.width - layout.paddingX * 2 - 400}
          height={430}
          startAt={CH6_B.chartStart}
          showLastLabel={false}
        />
        <div style={{ width: 400, textAlign: "center" }}>
          <div style={{ opacity: fadeIn(frame, CH6_B.countStart - motion.fadeIn) }}>
            <CountUpNumber
              from={first}
              to={last}
              startAt={CH6_B.countStart}
              durationInFrames={CH6_B.countDur}
              fontSize={size.body * 2.6}
              color={colors.gold}
            />
          </div>
          <Body style={{ marginTop: 20, fontSize: size.cardNote, opacity: fadeIn(frame, CH6_B.countStart + CH6_B.countDur) }}>
            件（2026年 途中まで）
          </Body>
          <Body style={{ marginTop: 28, opacity: fadeIn(frame, CH6_B.countStart + CH6_B.countDur + motion.stagger) }}>
            残るは<Em>2か国</Em>
          </Body>
        </div>
      </div>
    </BodyScene>
  );
};

/** 本文C: 日本の1960年の流行と1980年の最後の患者 */
const JapanScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: 国立健康危機管理研究機構「ポリオとは」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>日本も他人事ではなかった</Heading>
      </div>
      <div style={{ marginTop: 48 }}>
        {[
          <>
            <Em>1960年</Em> 北海道や九州を中心に大流行
          </>,
          <>母親たちの声に押されて、翌年ソ連から生ワクチンを緊急輸入</>,
          <>
            国内で野生株の患者が出たのは<Em>1980年</Em>が最後
          </>,
        ].map((node, i) => (
          <Body key={i} style={{ marginTop: i === 0 ? 0 : 24, opacity: fadeIn(frame, CH6_C.lineAt + i * motion.stagger) }}>
            {node}
          </Body>
        ))}
      </div>
    </BodyScene>
  );
};

/** 本文D: 累計とゲイツ財団 */
const GatesScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary.org「Ending polio」／「Gates Foundation extending fundraising partnership」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>ロータリーが積み上げたもの</Heading>
      </div>
      <div style={{ marginTop: 48 }}>
        {[
          <>
            累計拠出 <Em>29億ドル超</Em>
          </>,
          <>
            <Em>122か国</Em>で<Em>30億人</Em>の子どもに接種
          </>,
          <>
            ゲイツ財団は1ドルに2ドルを上乗せ（<Em>2:1</Em>）。2025年6月に<Em>3年延長</Em>
          </>,
        ].map((node, i) => (
          <Body key={i} style={{ marginTop: i === 0 ? 0 : 24, opacity: fadeIn(frame, CH6_C.lineAt + i * motion.stagger) }}>
            {node}
          </Body>
        ))}
      </div>
    </BodyScene>
  );
};

/** 本文E: 目標年の延期を正直に1行で */
const TargetScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: polioeradication.org「GPEI announces strategy extension」">
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0) }}>
        <Heading>
          根絶の目標年は<Em>2027年末</Em>に延びた
        </Heading>
        <Body style={{ marginTop: 44, opacity: fadeIn(frame, motion.stagger * 2) }}>
          「あと少し」が一番長い。だから今も続けています。
        </Body>
      </div>
    </BodyScene>
  );
};

export const Chapter06: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH6.card.from} durationInFrames={CH6.card.dur} name="カード $26.50">
      <NumberCard number="$26.50" caption={"1917年 最初の寄付\nカンザスシティRC"} />
    </Sequence>
    <Sequence from={CH6.giving.from} durationInFrames={CH6.giving.dur} name="財団に集まったお金">
      <GivingScene />
    </Sequence>
    <Sequence from={CH6.cardPolio.from} durationInFrames={CH6.cardPolio.dur} name="カード 99.9%">
      <NumberCard number="99.9%" caption="ポリオ症例の減少率" />
    </Sequence>
    <Sequence from={CH6.polio.from} durationInFrames={CH6.polio.dur} name="ポリオ症例数の折れ線">
      <PolioScene />
    </Sequence>
    <Sequence from={CH6.japan.from} durationInFrames={CH6.japan.dur} name="日本の流行">
      <JapanScene />
    </Sequence>
    <Sequence from={CH6.gates.from} durationInFrames={CH6.gates.dur} name="累計とゲイツ財団">
      <GatesScene />
    </Sequence>
    <Sequence from={CH6.target.from} durationInFrames={CH6.target.dur} name="目標年の延期">
      <TargetScene />
    </Sequence>
  </AbsoluteFill>
);
