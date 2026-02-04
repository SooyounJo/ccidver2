"use client";
import { useState } from "react";
import { sheetsStatic } from "@/app/data/sheetsStatic";
import LiquidBackground from "@/app/components/landing/liquidBackground";
import GradientText from "@/app/components/common/GradientText";

export default function Contact({ borderRadius, sectionOn, colorPalette = 2 }) {
  const [aboutInfo] = useState(sheetsStatic?.about || null);
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useState({ current: null })[0];
  const emailText = aboutInfo?.[0]?.[2] || "";

  const handleCopy = async (e) => {
    e.preventDefault();
    if (!emailText) return;
    try {
      await navigator.clipboard.writeText(emailText);
      setIsCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 1600);
    } catch (err) {
      // Fallback: select text by opening mailto if clipboard fails
      window.location.href = `mailto:${emailText}`;
    }
  };

  return (
    <div
      className={`transition-all duration-[1000ms] ease-out absolute top-0 left-0 w-full h-full overflow-hidden`}
    >
      {/* Intro(Cover)와 동일: bgt 텍스처 + LiquidBackground */}
      <div
        className="absolute inset-0 z-0 bg-[url('/img/bgt.png')] bg-repeat bg-contain bg-center"
        aria-hidden
      />
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <LiquidBackground colorPalette={colorPalette} />
      </div>

      {/* gradient layer (sectionOn에 따른 전환 - 기존 유지) */}
      <div
        className={`z-[1] ${sectionOn === "contact" ? "opacity-0" : "opacity-100"} transition-opacity delay-[0.5s] duration-[1s] ease-in-out bg-gradient-to-b from-primaryW via-[rgba(93,0,156,0)] via-[rgba(93,0,156,0)] to-[rgba(93,0,156,0)] absolute top-0 left-0 w-full h-full pointer-events-none`}
      />

      {/* SVG glow filter (expand filter area, primitiveUnits for relative lengths) */}
      <svg width="0" height="0" aria-hidden="true" className="contact-glow-svg">
        <defs>
          <filter
            id="contactGlow"
            x="-50%"
            y="-200%"
            width="200%"
            height="500%"
            primitiveUnits="objectBoundingBox"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.025 0.2" result="blur" />
            <feColorMatrix in="blur" type="saturate" values="1.3" result="saturated" />
            <feBlend in="SourceGraphic" in2="saturated" />
          </filter>
        </defs>
      </svg>

      {/* 텍스트 - Intro처럼 흰색 */}
      <div className="text-white absolute w-full h-full top-0 left-0 flex flex-col justify-center text-center font-[400] leading-[1.8] text-[3.5vw] md:text-[3vw] lg:text-[1.05vw] z-[2]">
        <p className="leading-snug z-[1]">
          For business inquiries please contact:
        </p>

        <div className="z-[1] relative inline-flex flex-col items-center">
          <a
            href={`mailto:${emailText}`}
            onClick={handleCopy}
            className="leading-snug pb-1 relative group contact-email-glow hover:opacity-90 transition-opacity duration-300 inline-flex items-center gap-2"
          >
            <GradientText
              colors={["#5B2BFF", "#FF4FD8", "#7BFFEB", "#B19EEF"]}
              animationSpeed={8}
              showBorder={false}
              className="contact-gradient-text"
            >
              {emailText || "Loading..."}
            </GradientText>
          </a>
          {isCopied && (
            <div className="pointer-events-none absolute top-full mt-2 text-[0.85em] text-white/80">
              copied
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
