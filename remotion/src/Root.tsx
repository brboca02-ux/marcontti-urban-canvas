import { Composition, CalculateMetadataFunction } from "remotion";
import { MainVideo } from "./MainVideo";

const calculateMetadata: CalculateMetadataFunction = async () => {
  return {
    defaultCodec: "vp9",
    defaultVideoImageFormat: "jpeg",
    defaultPixelFormat: "yuv420p",
  };
};

export const RemotionRoot = () => (
  <Composition
    id="hero-bolt"
    component={MainVideo}
    durationInFrames={180}
    fps={30}
    width={800}
    height={1000}
    calculateMetadata={calculateMetadata}
  />
);
