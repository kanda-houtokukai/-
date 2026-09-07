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

/** 本文A: $26.50 → 5億6,900万ドル。桁の跳ね上がりを縦棒2本の高さ差で見せる（対数） */
const GivingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = data.foundation_giving;
  const MAX_H = 380;
  // 桁が違いすぎるため対数で高さを取る（画面に「対数目盛」と明示する）
  const logs = s.values.map((v) => Math.log10(v));
  const maxLog = Math.max(...logs);
  return (
    <BodyScene source={s.source_note.replace(/。02_数値データ集.*$/, "")} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>財団に集まったお金</Heading>
        <Body style={{ marginTop: 16, opacity: 0.85 }}>対数目盛（桁が違うため）</Body>
      </div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "flex-end", gap: 200, height: MAX_H + 130 }}>
        {s.values.map((v, i) => {
          const start = CH6_A.barStart + i * CH6_A.barGap;
          const grow = interpolate(frame, [start, start + motion.chartGrowMin], [0, 1], {
            easing: EASE,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // 対数でも1917年の棒が潰れて見えなくなるため、最小の高さを持たせる
          const h = Math.max((logs[i] / maxLog) * MAX_H, 46) * grow;
          const on = fadeIn(frame, start + motion.chartGrowMin);
          return (
            <div key={s.labels?.[i]} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 360 }}>
              <div
                style={{
                  fontFamily: fonts.number,
                  fontWeight: 700,
                  fontSize: size.body * 1.25,
                  color: colors.gold,
                  opacity: on,
                  marginBottom: 14,
                }}
              >
                {s.display?.[i]}
              </div>
              <div style={{ width: 200, height: h, backgroundColor: colors.gold }} />
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: size.body * 0.8, color: colors.white }}>
                  {s.labels?.[i]}
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontWeight: 400,
                    fontSize: size.cardNote * 0.85,
                    color: colors.white,
                    opacity: 0.85 * on,
                    marginTop: 6,
                  }}
                >
                  {s.sublabels?.[i]}
                </div>
              </div>
            </div>
          );
        })}
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
