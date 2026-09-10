import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";

const BOLT_PATH = "M0.58 0 L0.05 0.55 L0.42 0.55 L0.28 1 L0.95 0.4 L0.55 0.4 L0.78 0 Z";

export function HeroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle continuous float of the bike
  const floatY = interpolate(Math.sin((frame / fps) * 1.5), [-1, 1], [-8, 8]);

  // Glow pulse
  const glowOpacity = interpolate(
    Math.sin((frame / fps) * 2),
    [-1, 1],
    [0.45, 0.75]
  );

  // Mini bolts orbit
  const bolt1Y = interpolate(Math.sin((frame / fps) * 2.2), [-1, 1], [-12, 12]);
  const bolt2Y = interpolate(Math.sin((frame / fps) * 1.8 + 1), [-1, 1], [-10, 10]);
  const bolt3Y = interpolate(Math.sin((frame / fps) * 2.6 + 2), [-1, 1], [-8, 8]);

  // Initial reveal spring
  const reveal = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 120 },
    durationInFrames: 40,
  });
  const scale = interpolate(reveal, [0, 1], [0.92, 1]);
  const opacity = reveal;

  return (
    <AbsoluteFill
      style={{
        background: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="video-bolt" clipPathUnits="objectBoundingBox">
            <path d={BOLT_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div
        style={{
          position: "relative",
          width: "92%",
          height: "92%",
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Glow behind bolt */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-10%",
            borderRadius: "50%",
            background:
              "radial-gradient(55% 55% at 55% 50%, rgba(248,96,0,0.55), transparent 70%)",
            opacity: glowOpacity,
            filter: "blur(40px)",
          }}
        />

        {/* Bolt container with clip-path */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "url(#video-bolt)",
            WebkitClipPath: "url(#video-bolt)",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          {/* Electric streaks inside the bolt */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(248,96,0,0.12) 0%, transparent 40%, rgba(248,96,0,0.08) 100%)",
            }}
          />

          {/* Bike image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateY(${floatY}px)`,
            }}
          >
            <Img
              src={staticFile("images/x12-hero-transparent.png")}
              alt="Klug X12 1000W"
              style={{
                width: "110%",
                height: "auto",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </div>
        </div>

        {/* Floating mini bolts outside */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            position: "absolute",
            top: "6%",
            left: "12%",
            width: 42,
            height: 42,
            color: "#f86000",
            filter: "drop-shadow(0 0 14px rgba(248,96,0,0.7))",
            transform: `translateY(${bolt1Y}px)`,
          }}
          aria-hidden="true"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            position: "absolute",
            top: "34%",
            right: "6%",
            width: 32,
            height: 32,
            color: "#f86000",
            filter: "drop-shadow(0 0 12px rgba(248,96,0,0.6))",
            transform: `translateY(${bolt2Y}px)`,
          }}
          aria-hidden="true"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{
            position: "absolute",
            bottom: "12%",
            left: "8%",
            width: 26,
            height: 26,
            color: "#f86000",
            filter: "drop-shadow(0 0 10px rgba(248,96,0,0.5))",
            transform: `translateY(${bolt3Y}px)`,
          }}
          aria-hidden="true"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>

        {/* Destaque badge */}
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(15,23,42,0.82)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
              fontSize: 11,
              fontWeight: 900,
              color: "#f86000",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
            }}
          >
            Destaque
          </span>
          <span
            style={{
              fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
              fontSize: 14,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "0.05em",
            }}
          >
            X12 1000W
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
