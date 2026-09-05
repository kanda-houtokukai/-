import React from "react";
import { Composition } from "remotion";
import { Chapter05 } from "./chapters/ch05/Chapter05";
import { CH5 } from "./chapters/ch05/constants";
import { FPS, layout } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Chapter05"
        component={Chapter05}
        durationInFrames={CH5.total}
        fps={FPS}
        width={layout.width}
        height={layout.height}
      />
    </>
  );
};
