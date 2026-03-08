"use client";

import { neuehaas } from "@/fonts/fonts";
import { useState, useEffect, useRef } from "react";
import { sheetsStatic } from "@/app/data/sheetsStatic";

export default function Cover() {
  const [mainText, setMainText] = useState(null);
  const [typedWords, setTypedWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startWaveAnim, setStartWaveAnim] = useState(false);
  const [activeWords, setActiveWords] = useState([]);

  const WAVE_ANIMATION_DURATION = 8000; // ms, matches .wave-text animation duration

  const line0Ref = useRef(null);
  const line1Ref = useRef(null);
  const baseFontPxRef = useRef({ 0: null, 1: null });

  useEffect(() => {
    const flatText = (sheetsStatic?.main || [])
      .map((row) => row?.[0])
      .filter(Boolean);
    setMainText(flatText);
    setTypedWords(flatText.map(() => ""));
  }, []);

  useEffect(() => {
    const fitLine = (el, key) => {
      if (!el) return;
      // Skip when not visible (e.g., md:hidden).
      if (el.offsetParent === null) return;
      if (typeof window === "undefined") return;

      const computed = window.getComputedStyle(el);
      if (!baseFontPxRef.current[key]) {
        const px = parseFloat(computed.fontSize || "");
        baseFontPxRef.current[key] = Number.isFinite(px) ? px : null;
      }

      const maxPx = baseFontPxRef.current[key] || 48;
      const minPx = 12;

      el.style.whiteSpace = "nowrap";
      el.style.fontSize = `${maxPx}px`;

      const cw = el.clientWidth;
      if (!cw) return;

      const sw0 = el.scrollWidth;
      if (!sw0) return;

      if (sw0 > cw) {
        const ratio = cw / sw0;
        let next = Math.max(minPx, Math.floor(maxPx * ratio));
        el.style.fontSize = `${next}px`;
        // Final tighten (handles rounding / font metrics)
        while (el.scrollWidth > cw && next > minPx) {
          next -= 1;
          el.style.fontSize = `${next}px`;
        }
      }
    };

    // Fit on each typing step + after layout changes.
    const raf = window.requestAnimationFrame(() => {
      fitLine(line0Ref.current, 0);
      fitLine(line1Ref.current, 1);
    });

    const onResize = () => {
      fitLine(line0Ref.current, 0);
      fitLine(line1Ref.current, 1);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [typedWords]);

  useEffect(() => {
    if (!mainText || currentWordIndex >= mainText.length) {
      setTimeout(() => {
        setStartWaveAnim(true);
      }, 1000);
      return;
    }

    const word = mainText[currentWordIndex];
    let charIndex = 0;

    const typeNextChar = () => {
      setTypedWords((prev) => {
        const newWords = [...prev];
        newWords[currentWordIndex] = word.slice(0, charIndex + 1);
        return newWords;
      });

      charIndex++;

      if (charIndex < word.length) {
        const progress = charIndex / word.length;
        const nextDelay = Math.max(5, 50 * (1 - progress * 0.8));
        setTimeout(typeNextChar, nextDelay);
      } else {
        setTimeout(() => setCurrentWordIndex((prev) => prev + 1), 80);
      }
    };

    typeNextChar();
  }, [currentWordIndex, mainText]);

  useEffect(() => {
    if (startWaveAnim && mainText && mainText[1]) {
      setActiveWords([0]); // Start wave on typedWords[1]
      setTimeout(() => {
        setActiveWords([0, 1]);
      }, WAVE_ANIMATION_DURATION);
    }
  }, [startWaveAnim, mainText]);

  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStartAnim(true);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  const scaleStyle = startAnim
    ? {
        scale: 0.97,
        transformOrigin: "left center",
        transition: "scale 18s ease-out",
      }
    : { transformOrigin: "left center" };

  return (
    <div className="relative flex flex-col w-full h-full lg:pt-[38dvh] pt-[29vh] px-0 -translate-x-2 lg:-translate-x-6 gap-[4vw] md:gap-[2.4vw] lg:gap-[1.5vw]">
      <div className="text-left relative inline-block w-full h-auto min-h-[3.2em] md:min-h-0 text-[7.5vw] md:text-[4.2vw] lg:text-[3vw] text-[#0f0f13]">
        <pre
          className={`${neuehaas.className} tracking-[1px] md:hidden whitespace-pre-wrap overflow-visible relative leading-[0.82] ${
            currentWordIndex === 0 ? "blinking-cursor" : ""
          }`}
          style={{ ...scaleStyle }}
        >
          {startWaveAnim && mainText && mainText[0] ? (
            <span className={`wave-text ${activeWords.includes(1) ? "active" : ""}`}>
              {typedWords[0]}
            </span>
          ) : (
            <span className="first-part" style={{ opacity: 1, color: "#0f0f13" }}>
              {typedWords[0]}
            </span>
          )}
        </pre>
        <p
          ref={line0Ref}
          className={`${neuehaas.className} tracking-[-1px] hidden md:block overflow-visible relative leading-[0.92] whitespace-nowrap ${
            currentWordIndex === 0 ? "blinking-cursor" : ""
          }`}
          style={{ ...scaleStyle }}
        >
          {startWaveAnim && mainText && mainText[0] ? (
            <span className={`wave-text ${activeWords.includes(1) ? "active" : ""}`}>
              {typedWords[0]}
            </span>
          ) : (
            <span className="first-part" style={{ opacity: 1, color: "#0f0f13" }}>
              {typedWords[0]}
            </span>
          )}
        </p>
      </div>

      <div className="text-left relative inline-block w-full h-auto min-h-[3.2em] md:min-h-0 text-[7.5vw] md:text-[4.2vw] lg:text-[3vw] text-white">
        <pre
          className={`${neuehaas.className} tracking-[1px] md:hidden whitespace-pre-wrap overflow-visible relative leading-[0.82] ${
            currentWordIndex === 1 ? "blinking-cursor" : ""
          }`}
          style={{ ...scaleStyle }}
        >
          {startWaveAnim && mainText && mainText[1] ? (
            <span className={`wave-text ${activeWords.includes(0) ? "active" : ""}`}>
              {typedWords[1]}
            </span>
          ) : (
            <span className="first-part" style={{ opacity: 1 }}>
              {typedWords[1]}
            </span>
          )}
        </pre>
        <p
          ref={line1Ref}
          className={`${neuehaas.className} tracking-[-1px] hidden md:block overflow-visible relative leading-[0.92] whitespace-nowrap ${
            currentWordIndex === 1 ? "blinking-cursor" : ""
          }`}
          style={{ ...scaleStyle }}
        >
          {startWaveAnim && mainText && mainText[1] ? (
            <span className={`wave-text ${activeWords.includes(0) ? "active" : ""}`}>
              {typedWords[1]}
            </span>
          ) : (
            <span className="first-part" style={{ opacity: 1 }}>
              {typedWords[1]}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
