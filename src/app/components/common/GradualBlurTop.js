"use client";

export default function GradualBlurTop({ sectionOn }) {
  // Blur only (neutral) behind the nav.
  const background =
    "linear-gradient(to bottom, rgba(240,240,236,0.9) 0%, rgba(240,240,236,0.7) 42%, rgba(240,240,236,0) 100%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 h-[120px] z-[450]"
      style={{
        background,
        backdropFilter: "blur(14px) saturate(160%)",
        WebkitBackdropFilter: "blur(14px) saturate(160%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0) 100%)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    />
  );
}


