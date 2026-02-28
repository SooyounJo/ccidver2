"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a,button,input,textarea,select,summary,label,[role='button'],[role='link'],[data-cursor='pointer']";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState("circle"); // circle | triangle
  const [pressed, setPressed] = useState(false);
  const elRef = useRef(null);
  const rafRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0 });

  const mm = useMemo(() => {
    if (typeof window === "undefined") return null;
    if (typeof window.matchMedia !== "function") return null;
    return window.matchMedia("(hover: hover) and (pointer: fine)");
  }, []);

  useEffect(() => {
    if (!mm) return;

    const apply = () => {
      const ok = !!mm.matches;
      setEnabled(ok);
      setVisible(false);
      setPressed(false);
      setVariant("circle");
    };

    apply();
    mm.addEventListener?.("change", apply);
    return () => mm.removeEventListener?.("change", apply);
  }, [mm]);

  useEffect(() => {
    if (!enabled) return;

    const updatePos = (x, y) => {
      posRef.current = { x, y };
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        const el = elRef.current;
        if (!el) return;
        const p = posRef.current;
        el.style.left = `${p.x}px`;
        el.style.top = `${p.y}px`;
      });
    };

    const getVariantAtPoint = (x, y) => {
      const t = document.elementFromPoint?.(x, y);
      const el = t && t.nodeType === 1 ? t : null;
      if (!el) return "circle";
      const interactive = el.closest ? el.closest(INTERACTIVE_SELECTOR) : null;
      return interactive ? "triangle" : "circle";
    };

    const onMouseMove = (e) => {
      setVisible(true);
      updatePos(e.clientX, e.clientY);
      const next = getVariantAtPoint(e.clientX, e.clientY);
      setVariant((prev) => (prev === next ? prev : next));
    };
    const onMouseEnter = () => setVisible(true);
    const onMouseLeave = () => {
      setVisible(false);
      setPressed(false);
      setVariant("circle");
    };
    const onMouseDown = () => setPressed(true);
    const onMouseUp = () => setPressed(false);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseenter", onMouseEnter, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  // Style rules:
  // 1) translucent white, no outline
  // 2) drop shadow ~30% opacity
  const CURSOR_BG = "rgba(255,255,255,0.46)";
  const DROP_SHADOW = "rgba(0,0,0,0.30)";
  // Y-axis downward shadow, even less blur
  const CURSOR_FILTER = `drop-shadow(0 16px 10px ${DROP_SHADOW})`;
  const TRIANGLE_CLIP = "polygon(50% 6%, 6% 94%, 94% 94%)";
  const OUTER = 76;
  const INNER = 60;

  const base =
    "pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform opacity-0";
  const shown = visible ? "opacity-100" : "opacity-0";
  const pressScale = pressed ? "scale-[0.92]" : "scale-100";

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      className={`${base} ${shown} ${pressScale}`}
      style={{ transition: "opacity 160ms ease-out, transform 160ms ease-out" }}
    >
      {variant === "circle" ? (
        <div
          className="fixed left-0 top-0"
          style={{
            width: `${OUTER}px`,
            height: `${OUTER}px`,
            transform: "translate(-50%, -50%)",
            filter: CURSOR_FILTER,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: `${INNER}px`,
              height: `${INNER}px`,
              transform: "translate(-50%, -50%)",
              background: CURSOR_BG,
              border: "none",
              backdropFilter: "blur(12px) saturate(1.35)",
              WebkitBackdropFilter: "blur(12px) saturate(1.35)",
            }}
          />
        </div>
      ) : (
        <div
          className="fixed left-0 top-0"
          style={{
            width: `${OUTER}px`,
            height: `${OUTER}px`,
            transform: "translate(-50%, -50%) rotate(-18deg)",
            filter: CURSOR_FILTER,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: `${INNER}px`,
              height: `${INNER}px`,
              transform: "translate(-50%, -50%)",
              clipPath: TRIANGLE_CLIP,
              background: CURSOR_BG,
              border: "none",
              backdropFilter: "blur(12px) saturate(1.35)",
              WebkitBackdropFilter: "blur(12px) saturate(1.35)",
            }}
          />
        </div>
      )}
    </div>
  );
}

