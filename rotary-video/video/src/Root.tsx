import React from "react";
import { Composition } from "remotion";
import { Chapter00 } from "./chapters/ch00/Chapter00";
import { CH0 } from "./chapters/ch00/constants";
import { Chapter01 } from "./chapters/ch01/Chapter01";
import { CH1 } from "./chapters/ch01/constants";
import { Chapter02 } from "./chapters/ch02/Chapter02";
import { CH2 } from "./chapters/ch02/constants";
import { Chapter03 } from "./chapters/ch03/Chapter03";
import { CH3 } from "./chapters/ch03/constants";
import { Chapter04 } from "./chapters/ch04/Chapter04";
import { CH4 } from "./chapters/ch04/constants";
import { Chapter05 } from "./chapters/ch05/Chapter05";
import { CH5 } from "./chapters/ch05/constants";
import { Chapter07 } from "./chapters/ch07/Chapter07";
import { CH7 } from "./chapters/ch07/constants";
import { Chapter10 } from "./chapters/ch10/Chapter10";
import { CH10 } from "./chapters/ch10/constants";
import { FPS, layout } from "./theme";

/** 章ごとに再生できる状態にする。章の結合（通し）は区切り④で行う。 */
export const RemotionRoot: React.FC = () => {
  const common = { fps: FPS, width: layout.width, height: layout.height } as const;
  return (
    <>
      <Composition id="Chapter00" component={Chapter00} durationInFrames={CH0.total} {...common} />
      <Composition id="Chapter01" component={Chapter01} durationInFrames={CH1.total} {...common} />
      <Composition id="Chapter02" component={Chapter02} durationInFrames={CH2.total} {...common} />
      <Composition id="Chapter03" component={Chapter03} durationInFrames={CH3.total} {...common} />
      <Composition id="Chapter04" component={Chapter04} durationInFrames={CH4.total} {...common} />
      <Composition id="Chapter05" component={Chapter05} durationInFrames={CH5.total} {...common} />
      <Composition id="Chapter07" component={Chapter07} durationInFrames={CH7.total} {...common} />
      <Composition id="Chapter10" component={Chapter10} durationInFrames={CH10.total} {...common} />
    </>
  );
};
