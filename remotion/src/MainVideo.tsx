import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { HeroScene } from "./scenes/HeroScene";

export function MainVideo() {
  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <HeroScene />
    </AbsoluteFill>
  );
}
