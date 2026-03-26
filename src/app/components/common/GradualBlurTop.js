"use client";

export default function GradualBlurTop({ sectionOn }) {
  // Blur only (no bright gradient fill).
  const background = "transparent";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 h-[120px] z-[450]"
      style={{
        background,
        // 더 은은한 톤: 블러와 채도를 조금 낮춤
        backdropFilter: "blur(8px) saturate(125%)",
        WebkitBackdropFilter: "blur(8px) saturate(125%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 26%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 26%, rgba(0,0,0,0) 100%)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    />
  );
}


