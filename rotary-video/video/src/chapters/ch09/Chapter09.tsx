/**
 * 第9章「8.3%と27.1%」（1:30）
 * 数値は src/data.ts（= scripts/data.json）から読む。
 * 末尾の★差し込み欄★は insert.ts の CLUB_INSERT を表示するだけ（文言は Chat から渡す）。
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { BarPair, Body, BodyScene, Em, Heading, LineChart, NameBlock, NumberCard } from "../../components";
import { data } from "../../data";
import { EASE, colors, layout, motion, size } from "../../theme";
import { CH9, CH9_A, CH9_B, CH9_C } from "./constants";
import { CLUB_INSERT } from "./insert";

const fadeIn = (frame: number, start: number, dur = motion.fadeIn): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 本文A: 日本の会員数の折れ線 */
const MembersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = data.japan_members_recent;
  const clubs = s.clubs ?? [];
  return (
    <BodyScene source={s.source_note.replace(/^出典: /, "出典: ")} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>日本のロータリー会員数</Heading>
      </div>
      <LineChart
        labels={s.labels as string[]}
        values={s.values}
        width={layout.width - layout.paddingX * 2}
        height={390}
        startAt={CH9_A.chartAt}
      />
      <Body style={{ marginTop: 8, opacity: fadeIn(frame, CH9_A.clubsAt) }}>
        クラブ数は<Em>{clubs[0]?.toLocaleString("en-US")}</Em>から<Em>{clubs[clubs.length - 1]?.toLocaleString("en-US")}</Em>へ
      </Body>
      <Body style={{ marginTop: 16, opacity: fadeIn(frame, CH9_A.covidAt) }}>
        コロナ禍の数年は、年におよそ2,000人のペースで減りました
      </Body>
    </BodyScene>
  );
};

/** 本文B: 女性会員比率の2本の棒 */
const RatioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = data.women_ratio;
  return (
    <BodyScene source={`出典: ロータリーボイス（${s.as_of}現在）`} align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>女性会員の比率</Heading>
      </div>
      <BarPair
        names={s.names as string[]}
        values={s.values}
        width={layout.width - layout.paddingX * 2}
        height={420}
        startAt={CH9_B.chartAt}
      />
      <div style={{ marginTop: 16, opacity: fadeIn(frame, CH9_B.noteAt), textAlign: "center" }}>
        <Body>
          <Em>25%になれば、日本の会員数は10万人を超える</Em>
        </Body>
        <Body style={{ marginTop: 12, fontSize: size.cardNote }}>RI日本事務局が示している見方</Body>
      </div>
    </BodyScene>
  );
};

/** 本文C: 衛星クラブ */
const SatelliteScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: 藤沢南RC／rotary.org「2025 Council approves…」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>実際に動いているクラブがあります</Heading>
      </div>
      <div style={{ marginTop: 56 }}>
        <Body style={{ opacity: fadeIn(frame, CH9_C.lineAt) }}>
          藤沢南クラブは45周年を前に、退会した元会員も呼び戻して<Em>16名</Em>で衛星クラブを作りました
        </Body>
        <Body style={{ marginTop: 28, opacity: fadeIn(frame, CH9_C.lineAt + motion.stagger * 2) }}>
          新しいクラブに必要な創立会員の数も、<Em>20名から15名</Em>に緩和されています
        </Body>
      </div>
    </BodyScene>
  );
};

/** 本文D: 日本から2人のRI理事 */
const DirectorScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source="出典: rotary.org/ja「国際ロータリー理事」" align="start">
      <div style={{ opacity: fadeIn(frame, 0) }}>
        <Heading>2026-28年度 RI理事に日本から2人</Heading>
      </div>
      <div style={{ marginTop: 56, display: "flex", gap: 80 }}>
        <NameBlock name="中谷研一" role="足利東クラブ" opacity={fadeIn(frame, CH9_C.lineAt)} width="46%" />
        <NameBlock name="四宮孝郎" role="大阪西南クラブ" opacity={fadeIn(frame, CH9_C.lineAt + motion.stagger)} width="46%" />
      </div>
      <Body style={{ marginTop: 48, opacity: fadeIn(frame, CH9_C.lineAt + motion.stagger * 3) }}>
        同じ年度に日本から2人は異例です
      </Body>
    </BodyScene>
  );
};

/** 本文E: ★差し込み欄★（文言は insert.ts） */
const InsertScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <BodyScene source={CLUB_INSERT.source}>
      <div style={{ textAlign: "center" }}>
        <Body style={{ opacity: fadeIn(frame, 0), fontSize: size.body * 1.15 }}>{CLUB_INSERT.text}</Body>
        <Body style={{ marginTop: 56, opacity: fadeIn(frame, motion.stagger * 3) }}>
          世界で起きている変化は、そのまま私たちのクラブの議題です
        </Body>
      </div>
    </BodyScene>
  );
};

export const Chapter09: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.navy }}>
    <Sequence from={CH9.card.from} durationInFrames={CH9.card.dur} name="カード 8.3%">
      <NumberCard number="8.3%" caption={"日本の女性会員比率\n2025年9月現在"} />
    </Sequence>
    <Sequence from={CH9.members.from} durationInFrames={CH9.members.dur} name="会員数の折れ線">
      <MembersScene />
    </Sequence>
    <Sequence from={CH9.ratio.from} durationInFrames={CH9.ratio.dur} name="女性比率の棒">
      <RatioScene />
    </Sequence>
    <Sequence from={CH9.satellite.from} durationInFrames={CH9.satellite.dur} name="衛星クラブ">
      <SatelliteScene />
    </Sequence>
    <Sequence from={CH9.directors.from} durationInFrames={CH9.directors.dur} name="RI理事2人">
      <DirectorScene />
    </Sequence>
    <Sequence from={CH9.insert.from} durationInFrames={CH9.insert.dur} name="★差し込み欄★">
      <InsertScene />
    </Sequence>
  </AbsoluteFill>
);
