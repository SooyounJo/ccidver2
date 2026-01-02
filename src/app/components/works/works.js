"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/app/store/languageStore";
import { motion, useAnimation } from "framer-motion";
import { pxGrotesk, neuehaas, programme} from "@/fonts/fonts";
import { sheetsStatic } from "@/app/data/sheetsStatic";
import GreyPlaceholder from "@/app/components/common/GreyPlaceholder";

export default function Works({ textColor, sectionOn }) {
  const [worksInfo, setWorksInfo] = useState(sheetsStatic?.works || []);
  const { lang } = useLanguageStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const headerControls = useAnimation();
  const lineControls = useAnimation();
  const contentControls = useAnimation();
  const [contentFont, setContentFont] = useState("default");
  
  useEffect(() => {
    setWorksInfo(sheetsStatic?.works || []);
  }, []);

  useEffect(() => {
    if (sectionOn !== "works") return;

    // Fast, sequential entrance: header -> line -> content
    headerControls.set({ y: 14, opacity: 0 });
    lineControls.set({ scaleX: 0 });
    contentControls.set({ y: 10, opacity: 0 });

    let cancelled = false;
    (async () => {
      await headerControls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.22, ease: "easeOut" },
      });
      if (cancelled) return;
      await lineControls.start({
        scaleX: 1,
        transition: { duration: 0.28, ease: "easeInOut" },
      });
      if (cancelled) return;
      await contentControls.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.22, ease: "easeOut" },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [sectionOn, headerControls, lineControls, contentControls]);

  const rows = Array.isArray(worksInfo) ? worksInfo : [];
  // The sheet is organized in 3-row blocks:
  // [yearsRow, enTitlesRow, krTitlesRow] repeated.
  // 2022~2020 lives in the 2nd block, so we must parse all blocks (like the previous list UI did).
  const normalizeOneLine = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
  const selectedHeaderRaw = "Selected Projects";

  const parseBlock = (baseIdx) => {
    const yearsRow = rows[baseIdx] || [];
    const enRow = rows[baseIdx + 1] || [];
    const krRow = rows[baseIdx + 2] || [];

    const titleRow =
      (lang === "en" ? enRow : krRow) && (lang === "en" ? enRow : krRow).length > 0
        ? (lang === "en" ? enRow : krRow)
        : enRow;

    const out = [];
    let currentYear = "";
    const colCount = Math.max(yearsRow.length, enRow.length, krRow.length);

    for (let j = 1; j < colCount; j += 1) {
      const yr = normalizeOneLine(yearsRow?.[j]);
      if (/^\d{4}$/.test(yr)) currentYear = yr;

      const titleRaw = normalizeOneLine(titleRow?.[j]);
      if (!titleRaw) continue;

      const parts = titleRaw.split(":");
      const client = parts.length > 1 ? parts[0].trim() : "";
      const project = parts.length > 1 ? parts.slice(1).join(":").trim() : titleRaw;

      // Helper to shorten description at a specific keyword (case-insensitive)
      const cutAtWord = (str, word) => {
        const s = String(str || "");
        const w = String(word || "");
        if (!s || !w) return s;
        const idx = s.toLowerCase().indexOf(w.toLowerCase());
        if (idx === -1) return s;
        return s.slice(0, idx + w.length).trim();
      };

      const categoriesByClient2025 = {
        "LG Electronics": ["Cooperation", "CX"],
        "CJ CGV & Naver Cloud": ["Cooperation", "UX"],
        "Hyundai Motors": ["Cooperation", "UX"],
        "Ministry of Trade, Industry and Energy": ["Cooperation", "UX"],
      };
      const categories =
        currentYear === "2025" && categoriesByClient2025[client]
          ? categoriesByClient2025[client]
          : [];

      const tfByClient2025 = {
        "LG Electronics":
          "Hyeonji Lee, Sooyoun Jo, Ji Min Rhee, Tae Eun Kim, Youngchae Seo, Buyeon Kwon, Gaeun Huh,\nEun Seol Kim",
        "CJ CGV & Naver Cloud":
          "Hyeonji Lee, Jiwon Park, Tae Eun Kim, Yaeji Jang, Sooyoun Jo",
        "Hyundai Motors":
          "Hyeonji Lee, Jiwon Park, Tae Eun Kim, Yaeji Jang, Sooyoun Jo, Hyeonji Lee,  Jiwon Park, Tae Eun Kim, Yaeji Jang",
      };
      const tf =
        currentYear === "2025" && tfByClient2025[client] ? tfByClient2025[client] : "";

      // Shortened description per design, still rendered as a single line
      let description = project;
      if (currentYear === "2025") {
        if (client === "LG Electronics") description = cutAtWord(project, "CX");
        if (client === "CJ CGV & Naver Cloud") description = cutAtWord(project, "Platform");
        if (client === "Hyundai Motors") {
          description = cutAtWord(project, "Process");
          // Remove "Exterior" word per request
          description = description.replace(/\bExterior\b\s*/i, "");
        }
      }

      const imagesByClient2025 = {
        "LG Electronics": ["/img/2025/lg/1.png", "/img/2025/lg/2.png", "/img/2025/lg/3.png"],
        // CJ: only 2 images (3rd slot intentionally omitted)
        "CJ CGV & Naver Cloud": ["/img/2025/cj/co1.png", "/img/2025/cj/co2.png"],
        "Hyundai Motors": ["/img/2025/hy/hy1.png", "/img/2025/hy/hy3.png", "/img/2025/hy/hy2.png"],
        "Ministry of Trade, Industry and Energy": ["/img/2025/mini/mi1.png", "/img/2025/mini/mi2.png", "/img/2025/mini/mi3.png"],
      };
      const images =
        currentYear === "2025" && imagesByClient2025[client]
          ? imagesByClient2025[client]
          : [];

      out.push({
        year: currentYear,
        title: titleRaw,
        client,
        // Use existing project text as the description body for now.
        description,
        // Placeholder; user will fill later.
        tf,
        categories,
        images,
      });
    }

    return out;
  };

  const selectedProjects = [];
  for (let i = 0; i < rows.length; i += 3) {
    const blockProjects = parseBlock(i);
    if (blockProjects.length === 0) continue;
    selectedProjects.push(...blockProjects);
  }

  const INITIAL_YEAR = "2025";
  const MIN_YEAR = 2020;
  const inRangeTo2020 = (p) => {
    const y = Number(p?.year);
    return Number.isFinite(y) && y >= MIN_YEAR && y <= Number(INITIAL_YEAR);
  };

  const projectsInRange = selectedProjects.filter(inRangeTo2020);
  const visibleProjects = (isExpanded
    ? projectsInRange
    : projectsInRange.filter((p) => p.year === INITIAL_YEAR)
  );

  const hasMore = projectsInRange.some((p) => p.year !== INITIAL_YEAR);
  const toggleLabel = isExpanded ? (lang === "kr" ? "접기" : "Collapse") : (lang === "kr" ? "더보기" : "More");

  return (
    <>
      <div
        className={`text-primaryB pt-[12%] pb-[80%] ${lang === 'kr' ? 'lg:pt-[4dvh]' : 'lg:pt-[8%]'} lg:pb-[10%] lg:px-[5.5vw] w-full h-full font-[400] relative overflow-hidden`}
      >
        {/* Font toggle controls (hel / pre) on the right */}
        <div className="hidden lg:flex absolute right-[5.5vw] top-10 z-[550] gap-2 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full border border-primaryB/20 shadow-sm">
          <button
            type="button"
            onClick={() => setContentFont("hel")}
            className={`${pxGrotesk.className} border border-primaryB/60 px-2.5 py-1 rounded-full text-[0.8vw] ${contentFont === "hel" ? "bg-primaryB text-white" : "text-primaryB"}`}
            aria-pressed={contentFont === "hel"}
          >
            hel
          </button>
          <button
            type="button"
            onClick={() => setContentFont("pre")}
            className={`${pxGrotesk.className} border border-primaryB/60 px-2.5 py-1 rounded-full text-[0.8vw] ${contentFont === "pre" ? "bg-primaryB text-white" : "text-primaryB"}`}
            aria-pressed={contentFont === "pre"}
          >
            pre
          </button>
        </div>
        {/* Subtle bottom-to-top lavender gradient shown only when Works is active */}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{
            opacity: sectionOn === "works" ? 1 : 0,
            y: sectionOn === "works" ? 0 : 16,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[34vh] z-0"
          style={{
            background:
              "linear-gradient(to top, rgba(193,184,251,0.14) 0%, rgba(193,184,251,0) 80%)",
          }}
        />
        {visibleProjects.length > 0 ? (
          <div className="relative z-10 text-primaryB bg-[rgba(240,240,236,0.55)] backdrop-blur-[2px]">
            {/* Header row */}
            <div className="pt-3 lg:pt-4">
              <motion.div
                animate={headerControls}
                className={`${neuehaas.className} tracking-[-0.03em] leading-none whitespace-nowrap text-[6.8vw] md:text-[4.6vw] lg:text-[2.8vw]`}
              >
                {selectedHeaderRaw}
              </motion.div>
              <motion.div
                animate={lineControls}
                className="mt-2 lg:mt-3 h-[2px] bg-primaryB origin-left"
              />
            </div>

            <motion.div animate={contentControls}>
              {visibleProjects.map((p, idx) => (
                <div
                  key={`${p.year}-${idx}-${p.title}`}
                  className="border-b-2 border-primaryB pt-3 pb-10 lg:pt-4 lg:pb-14"
                >
                  <div className="grid grid-cols-12 gap-y-4 lg:gap-y-8 gap-x-5 md:gap-x-6 lg:gap-x-8 items-stretch">
                  {/* Left: Title + Year */}
                  <div className="col-span-12 lg:col-span-3 pt-2 lg:pt-3">
                    <div className={`${neuehaas.className} tracking-[-0.03em] leading-[1.05] h-full flex flex-col`}>
                      <div className="text-[5.8vw] md:text-[4.1vw] lg:text-[1.9vw]">
                        {p.client ? p.client.toUpperCase() : p.project.toUpperCase()}
                      </div>
                      <div className={`${pxGrotesk.className} text-[4.8vw] md:text-[3.4vw] lg:text-[1.25vw] mt-1`}>
                        {p.year || ""}
                      </div>

                      {/* Single keyword directly under the year (bottom-left of the year block) */}
                      {Array.isArray(p.categories) && p.categories.length > 0 && (
                        <div className="mt-3 lg:mt-auto flex flex-wrap gap-2">
                          {[...p.categories]
                            .sort((a, b) => (a === "Cooperation") - (b === "Cooperation"))
                            .map((c) => (
                              <span
                                key={c}
                                className={`${pxGrotesk.className} inline-flex items-center rounded-full border border-primaryB px-2.5 py-1 leading-[1] text-[2.8vw] md:text-[1.9vw] lg:text-[0.78vw] text-primaryB`}
                              >
                                {c}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                          </div>
                        
                  {/* Middle: meta */}
                  <div className="col-span-12 lg:col-span-3 pt-2 lg:pt-3 px-1 md:px-3 lg:px-4">
                    {/* Details: Brief (single line) + TF (wrapped), with label column */}
                    <div className={`${pxGrotesk.className} h-full flex flex-col gap-2 text-[3vw] md:text-[2.2vw] lg:text-[0.95vw] leading-[1.2]`}>
                      <div className="min-w-0 pr-2 lg:pr-4 lg:pb-2 overflow-hidden">
                        <span
                          className="opacity-70 truncate"
                          style={
                            contentFont === "hel"
                              ? { fontFamily: 'Helvetica, Arial, sans-serif' }
                              : contentFont === "pre"
                              ? { fontFamily: 'pretendardR, Pretendard, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif' }
                              : undefined
                          }
                        >
                          {p.description || ""}
                        </span>
                      </div>
                      {p.tf && String(p.tf).trim() !== "" && (
                        <div className="min-w-0 mt-1 lg:mt-auto">
                          <span className="opacity-70 text-[3vw] md:text-[2.2vw] lg:text-[0.95vw] leading-[1.12]">
                            <span style={contentFont === "hel" ? { fontFamily: 'Helvetica, Arial, sans-serif' } : (contentFont === "pre" ? { fontFamily: 'pretendardR, Pretendard, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif' } : undefined)}>
                            {String(p.tf)
                              .split(/,\s*|\n+/)
                              .filter((n) => n && n.trim().length > 0)
                              .map((name, i, arr) => (
                                <span key={`${name}-${i}`}>
                                  <span className="whitespace-nowrap">{name.trim()}</span>
                                  {i < arr.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: image boxes (grey-toned) */}
                  <div className="col-span-12 lg:col-span-6 pt-2 lg:pt-3">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-[6px] lg:gap-[10px]">
                      {/* Bigger boxes like reference: taller aspect + a bit more presence */}
                      {Array.isArray(p.images) && p.images.length > 0 ? (
                        <>
                          {/*
                            CJ(2025): hide the 3rd slot entirely.
                            Keep the 3-col grid so the first two boxes don't change size/position.
                          */}
                          {p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={`${p.client || "project"} image 1`}
                              className="w-full rounded-sm aspect-[16/10] object-cover"
                            />
                          ) : (
                            <GreyPlaceholder className="w-full rounded-sm aspect-[16/10]" />
                          )}

                          {p.images[1] ? (
                            <img
                              src={p.images[1]}
                              alt={`${p.client || "project"} image 2`}
                              className="w-full rounded-sm aspect-[16/10] object-cover"
                            />
                          ) : (
                            <GreyPlaceholder className="w-full rounded-sm aspect-[16/10]" />
                          )}

                          {!(p.year === "2025" && p.client === "CJ CGV & Naver Cloud") &&
                            (p.images[2] ? (
                              String(p.images[2]).toLowerCase().endsWith(".mp4") ? (
                                <video
                                  src={p.images[2]}
                                    className="w-full rounded-sm aspect-[16/10] object-cover"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  src={p.images[2]}
                                  alt={`${p.client || "project"} image 3`}
                                    className="w-full rounded-sm aspect-[16/10] object-cover"
                                />
                              )
                            ) : (
                              <GreyPlaceholder className="w-full rounded-sm aspect-[16/10]" />
                            ))}
                        </>
                      ) : (
                        <>
                          <GreyPlaceholder className="w-full rounded-sm aspect-[16/10]" />
                          <GreyPlaceholder className="w-full rounded-sm aspect-[16/10]" />
                          {!(p.year === "2025" && p.client === "CJ CGV & Naver Cloud") && (
                            <GreyPlaceholder className="w-full rounded-sm aspect-[16/10]" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </motion.div>

            {hasMore && (
              <div className="pt-10 pb-14 lg:pt-12 lg:pb-16 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded((v) => !v)}
                  className={`${pxGrotesk.className} border-2 border-primaryB px-6 py-3 lg:px-7 lg:py-3 rounded-full text-[3.2vw] md:text-[2.1vw] lg:text-[0.9vw] text-primaryB hover:bg-primaryB hover:text-primaryW transition-colors`}
                >
                  {toggleLabel}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}