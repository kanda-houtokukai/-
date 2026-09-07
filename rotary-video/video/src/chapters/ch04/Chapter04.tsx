/**
 * 第4章「855番目のクラブ」（1:30）
 * カード855 → 1918年ダラス（米山梅吉・福島喜三次を NameBlock で）→ 日付の縦積み（YearStack）→
 * 「サービス第一、自己第二」を大きく1行 → 第70地区。文言は 04 第4章に従う。写真は使わない。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Body, BodyScene, Em, Heading, NameBlock, NumberCard, YearStack } from "../../components";
import { EASE, colors, fonts, motion, size } from "../../theme";
import { CH4, CH4_A, CH4_B } from "./constants";

const SOURCE = "出典: tokyo-rc.gr.jp「東京RCの歴史」";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 1918年1月 ダラスでの出会い */
const DallasScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source={SOURCE} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>1918年1月 テキサス州ダラス</Heading>
      </div>
      <div style={{ marginTop: 56, display: "flex", gap: 80 }}>
        <NameBlock
          name="米山梅吉"
          role="三井銀行 ／ 財政調査団の一員として渡米"
          opacity={fadeIn(frame, CH4_A.nameAt)}
          width="46%"
        />
        <NameBlock
          name="福島喜三次"
          role="三井物産ダラス支店 ／ 日本人初のロータリアン"
          opacity={fadeIn(frame, CH4_A.nameAt + CH4_A.gap)}
          width="46%"
        />
      </div>
      <Body style={{ marginTop: 56, opacity: fadeIn(frame, CH4_A.nameAt + CH4_A.gap * 2) }}>
        「自分の利益のためではなく、人のために」
      </Body>
    </BodyScene>
  );
};

/** 日付の縦積み */
const DatesScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source={SOURCE} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>東京ロータリークラブの誕生</Heading>
      </div>
      <div style={{ marginTop: 64 }}>
        <YearStack
          startAt={CH4_B.stackAt}
          rows={[
            { date: "1920年9月1日", label: "準備会" },
            { date: "1920年10月20日", label: "創立総会（銀行倶楽部）" },
            { date: "1921年4月1日", label: "国際ロータリーが加盟を承認" },
          ]}
        />
      </div>
      <Body style={{ marginTop: 56, opacity: fadeIn(frame, CH4_B.stackAt + motion.stagger * 3) }}>
        世界で<Em>855番目</Em>のクラブ
      </Body>
    </BodyScene>
  );
};

/** 「サービス第一、自己第二」を大きく1行 */
const ServiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source={SOURCE}>
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0) }}>
        <Body style={{ opacity: 0.85 }}>Service Above Self ／ 超我の奉仕</Body>
        <div
          style={{
            marginTop: 40,
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: size.headingMax,
            lineHeight: 1.35,
            color: colors.gold,
            opacity: fadeIn(frame, motion.stagger),
          }}
        >
          サービス第一、自己第二
        </div>
        <Body style={{ marginTop: 40, opacity: fadeIn(frame, motion.stagger * 3) }}>
          日本人には、このほうが分かりやすい（米山梅吉）
        </Body>
      </div>
    </BodyScene>
  );
};

/** 第70地区 */
const DistrictScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: 福岡西RC「ロータリーの歴史」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>1928年 第70地区</Heading>
        <Body style={{ marginTop: 20 }}>日本・朝鮮・満州。初代ガバナーは米山梅吉（4年）</Body>
      </div>
      <div style={{ marginTop: 56 }}>
        <Body style={{ opacity: fadeIn(frame, motion.stagger * 2) }}>
          1931年ごろ <Em>11クラブ・540名</Em>
        </Body>
        <Body style={{ marginTop: 20, opacity: fadeIn(frame, motion.stagger * 4) }}>
          1939年には <Em>46クラブ</Em>
        </Body>
      </div>
    </BodyScene>
  );
};

export const Chapter04: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH4.card.from} durationInFrames={CH4.card.dur} name="カード 855">
      <NumberCard number="855" unit="番目" caption={"1921年4月1日\n国際ロータリーが加盟を承認"} />
    </Sequence>
    <Sequence from={CH4.dallas.from} durationInFrames={CH4.dallas.dur} name="ダラスでの出会い">
      <DallasScene />
    </Sequence>
    <Sequence from={CH4.dates.from} durationInFrames={CH4.dates.dur} name="創立の日付">
      <DatesScene />
    </Sequence>
    <Sequence from={CH4.service.from} durationInFrames={CH4.service.dur} name="サービス第一、自己第二">
      <ServiceScene />
    </Sequence>
    <Sequence from={CH4.district.from} durationInFrames={CH4.district.dur} name="第70地区">
      <DistrictScene />
    </Sequence>
  </AbsoluteFill>
);
