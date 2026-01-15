"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguageStore } from "@/app/store/languageStore";
import { motion, useAnimation } from "framer-motion";
import { pxGrotesk, neuehaas, programme} from "@/fonts/fonts";
import { sheetsStatic } from "@/app/data/sheetsStatic";
import GreyPlaceholder from "@/app/components/common/GreyPlaceholder";

export default function Works({ textColor, sectionOn }) {
  const [worksInfo, setWorksInfo] = useState(sheetsStatic?.works || []);
  const { lang } = useLanguageStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredRowKey, setHoveredRowKey] = useState(null);
  const [hoveredRowMedia, setHoveredRowMedia] = useState([]);
  const [hoveredMediaIndex, setHoveredMediaIndex] = useState(0);
  const headerControls = useAnimation();
  const lineControls = useAnimation();
  const contentControls = useAnimation();
  const [contentFont, setContentFont] = useState("default");
  const rootRef = useRef(null);

  const EXPANDED_BODY =
    "LG Electronics: Affectionate Ingelligence CX DesignLG Electronics: Affectionate Ingelligence CX DesignLG Electronics: Affectionate Ingelligence CX DesignLG Electronics: Affectionate Ingelligence CX Design";
  
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

  // Slideshow on hover-expanded row: rotate available media every 5s.
  useEffect(() => {
    if (!hoveredRowKey) return;
    if (!Array.isArray(hoveredRowMedia) || hoveredRowMedia.length <= 1) return;

    const id = window.setInterval(() => {
      setHoveredMediaIndex((prev) => (prev + 1) % hoveredRowMedia.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, [hoveredRowKey, hoveredRowMedia]);

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
          "Hyeonji Lee, Sooyoun Jo, Ji Min Rhee,\nTae Eun Kim, Youngchae Seo, Buyeon Kwon\nGaeun Huh, Eun Seol Kim",
        "CJ CGV & Naver Cloud":
          "Hyeonji Lee, Jiwon Park, Tae Eun Kim\nYaeji Jang, Sooyoun Jo",
        "Hyundai Motors":
          "Hyeonji Lee, Jiwon Park, Tae Eun Kim\nYaeji Jang, Sooyoun Jo, Hyeonji Lee,\nJiwon Park, Tae Eun Kim, Yaeji Jang",
      };
      const tf =
        currentYear === "2025" && tfByClient2025[client] ? tfByClient2025[client] : "";

      // Shortened / overridden description per Figma design
      const titleOverrides2025 = {
        "LG Electronics": "Affectionate Intelligence CX design",
        "CJ CGV & Naver Cloud": "AI-Driven AR Interaction Platform",
        "Hyundai Motors": "Development of AI-Driven Design Process",
      };

      let description = project;
      if (currentYear === "2025") {
        if (titleOverrides2025[client]) {
          description = titleOverrides2025[client];
        } else if (client === "Ministry of Trade, Industry and Energy") {
          // Fallback: keep original project title for this client
          description = project;
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
  const initialYearNum = Number(INITIAL_YEAR);
  const isValidYearProject = (p) => {
    const yStr = String(p?.year ?? "").trim();
    if (!/^\d{4}$/.test(yStr)) return false;
    const y = Number(yStr);
    return Number.isFinite(y) && y <= initialYearNum;
  };

  // Expanded: show all projects up to INITIAL_YEAR (includes years before 2025).
  const projectsAll = selectedProjects
    .filter(isValidYearProject)
    .sort((a, b) => Number(b.year) - Number(a.year));
  const initialYearProjects = projectsAll.filter((p) => p.year === INITIAL_YEAR);
  const collapsedProjects = (initialYearProjects.length > 0 ? initialYearProjects : projectsAll).slice(0, 3);
  const visibleProjects = isExpanded ? projectsAll : collapsedProjects;

  const hasMore = projectsAll.length > collapsedProjects.length;
  const toggleAriaLabel = isExpanded
    ? (lang === "kr" ? "접기" : "Collapse")
    : (lang === "kr" ? "더보기" : "More");

  const toggleExpanded = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      // When collapsing, return to the top of the Works section so the first rows are visible.
      if (prev && !next) {
        window.requestAnimationFrame(() => {
          document
            .querySelector("#works")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return next;
    });
  };

  const renderRow = (p, idx, keyPrefix) => {
    // Figma: most rows use 160px content height + 32px bottom padding (=192px total).
    // CJ row uses 137px content height + 32px bottom padding (=169px total).
    const clientKey = String(p?.client || "").toLowerCase();
    const isCJ = clientKey === "cj cgv & naver cloud";
    // Base (non-hover) size should stay at the original 197.33×160 feel.
    const contentH = 160;
    const rowH = contentH + 32;
    const contentHHover = 360;
    const rowHHover = contentHHover + 32;
    const hasTwoImages = Array.isArray(p?.images) && p.images.length === 2;
    // On hover, always collapse to a single "hero" image (matches the intended interaction).
    const useHeroOnHover = true;
    const rowKey = `${keyPrefix}-${p.year}-${idx}-${p.title}`;
    const isHover = hoveredRowKey === rowKey;
    const mediaCandidates = Array.isArray(p?.images)
      ? p.images
          .slice(0, 3)
          .map((x) => String(x || "").trim())
          .filter((x) => x.length > 0)
      : [];
    const mediaList =
      p.year === "2025" && p.client === "CJ CGV & Naver Cloud"
        ? mediaCandidates.slice(0, 2)
        : mediaCandidates;
    const heroMedia =
      isHover && hoveredRowMedia.length > 0 ? hoveredRowMedia[hoveredMediaIndex] : mediaList[0];
    const heroIsVideo = String(heroMedia || "").toLowerCase().endsWith(".mp4");

    return (
      <div
        key={rowKey}
        onMouseEnter={() => {
          setHoveredRowKey(rowKey);
          setHoveredRowMedia(mediaList);
          setHoveredMediaIndex(0);
        }}
        onMouseLeave={() => {
          setHoveredRowKey(null);
          setHoveredRowMedia([]);
          setHoveredMediaIndex(0);
        }}
        className={`border-b border-primaryB pt-0 pb-[32px] overflow-hidden transition-[max-height,background-color] duration-300 ease-out ${
          isHover ? "bg-black/[0.02]" : ""
        }`}
        style={{
          maxHeight: isHover ? `${rowHHover}px` : `${rowH}px`,
        }}
      >
        <div
          className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:gap-x-8 items-stretch transition-[height] duration-300 ease-out"
          style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
        >
          {/* Left: Client + Year (296×contentH) */}
          <div className="lg:basis-[296px] lg:flex-none overflow-hidden">
            <div className={`${neuehaas.className} tracking-[-0.03em] flex flex-col`}>
              {/* Title block: pb 5px */}
              <div className="pb-[5px]">
                <div className="text-[24px] leading-[1.45] font-medium text-primaryB w-[220px]">
                  {isCJ ? (
                    <>
                      <p className="m-0">CJ CGV &amp; NAVER</p>
                      <p className="m-0">CLOUD</p>
                    </>
                  ) : (
                    (p.client ? p.client.toUpperCase() : p.project.toUpperCase())
                  )}
                </div>
              </div>

              {/* Year: 16px, light */}
              <div className="text-[16px] leading-[1.45] font-light text-primaryB">
                {p.year || ""}
              </div>
            </div>
          </div>

        {/* Middle: meta (≈296px) */}
        <div className="lg:basis-[296px] lg:flex-none px-1 md:px-3 lg:px-0">
          <div
            className={`${pxGrotesk.className} h-full flex flex-col text-[1rem] leading-[1.45]`}
          >
            {/* Title + description block (Frame 3 + Frame 2) */}
            {/* Figma: title→names spacing is 17px */}
            <div
              className={`min-w-0 pr-2 lg:pr-4 flex flex-col gap-[17px] w-full max-w-[17.625rem] ${
                isHover ? "overflow-visible" : "overflow-hidden"
              }`}
            >
              {/* Title: 16px, weight 500, full opacity */}
              <span
                className="truncate font-medium"
                style={
                  contentFont === "hel"
                    ? { fontFamily: "Helvetica, Arial, sans-serif" }
                    : contentFont === "pre"
                    ? {
                        fontFamily:
                          'pretendardR, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      }
                    : undefined
                }
              >
                {p.description || ""}
              </span>

              {/* Expanded body uses the old "names" slot */}
              {isHover ? (
                <div
                  className="opacity-80 text-[1rem] leading-[1.45] whitespace-pre-wrap"
                  style={
                    contentFont === "hel"
                      ? { fontFamily: "Helvetica, Arial, sans-serif" }
                      : contentFont === "pre"
                      ? {
                          fontFamily:
                            'pretendardR, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        }
                      : undefined
                  }
                >
                  {EXPANDED_BODY}
                </div>
              ) : (
                p.tf &&
                String(p.tf).trim() !== "" && (
                  <div
                    className="opacity-70 text-[1rem] leading-[1.45]"
                    style={
                      contentFont === "hel"
                        ? { fontFamily: "Helvetica, Arial, sans-serif" }
                        : contentFont === "pre"
                        ? {
                            fontFamily:
                              'pretendardR, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                          }
                        : undefined
                    }
                  >
                    {String(p.tf)
                      .split(/\n+/)
                      .filter((line) => line && line.trim().length > 0)
                      .map((line, i) => {
                        const lineText = line.trim();
                        if (!lineText) return null;
                        return (
                          <p
                            key={`${keyPrefix}-${p.year}-${idx}-tf-line-${i}`}
                            className="m-0 whitespace-nowrap"
                          >
                            {lineText}
                          </p>
                        );
                      })}
                  </div>
                )
              )}
            </div>

            {/* Tags pinned to bottom (Frame 1) */}
            {!isHover && Array.isArray(p.categories) && p.categories.length > 0 && (
              <div className="mt-auto pt-[1.5rem] flex flex-wrap gap-[0.625rem]">
                {[...p.categories]
                  .sort((a, b) => (a === "Cooperation") - (b === "Cooperation"))
                  .map((c) => (
                    <span
                      key={`${keyPrefix}-${p.year}-${idx}-${c}`}
                      className={`${pxGrotesk.className} inline-flex items-center justify-center rounded-full border border-primaryB px-[0.9375rem] py-[5px] leading-none text-[0.75rem] text-primaryB`}
                    >
                      {c}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: image boxes (3-up, ≈624px wide) */}
        <div className="flex-1 pt-0 lg:pt-0 overflow-hidden">
          {/* Figma: image grid gap 16px */}
          <div
            className={`flex flex-wrap lg:flex-nowrap gap-[1rem] transition-[gap] duration-300 ease-out ${
              isHover && useHeroOnHover ? "lg:gap-0" : ""
            }`}
          >
            {Array.isArray(p.images) && p.images.length > 0 ? (
              <>
                {p.images[0] ? (
                  <div
                    className={`w-full bg-[#F6F0FF] overflow-hidden flex-none transition-[width,height,opacity,transform] duration-300 ease-out ${
                      !isHover && hasTwoImages ? "lg:w-[197.33px]" : "lg:w-[197.33px]"
                    } ${isHover && useHeroOnHover ? "lg:flex-1 lg:w-auto" : ""}`}
                    style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
                  >
                    {heroIsVideo ? (
                      <video
                        key={heroMedia}
                        src={heroMedia}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        key={heroMedia}
                        src={heroMedia || p.images[0]}
                        alt={`${p.client || "project"} image 1`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <GreyPlaceholder
                    className={`w-full bg-[#F6F0FF] overflow-hidden flex-none transition-[width,height,opacity] duration-300 ease-out ${
                      "lg:w-[197.33px]"
                    } ${isHover && useHeroOnHover ? "lg:flex-1 lg:w-auto" : ""}`}
                    style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
                  />
                )}

                {p.images[1] ? (
                  <div
                    className={`w-full bg-[#F6F0FF] overflow-hidden flex-none transition-[width,height,opacity,transform] duration-300 ease-out ${
                      "lg:w-[197.33px]"
                    } ${isHover && useHeroOnHover ? "lg:w-0 lg:max-w-0 lg:opacity-0" : ""}`}
                    style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
                  >
                    <img
                      src={p.images[1]}
                      alt={`${p.client || "project"} image 2`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <GreyPlaceholder
                    className={`w-full bg-[#F6F0FF] overflow-hidden flex-none transition-[width,height,opacity] duration-300 ease-out ${
                      "lg:w-[197.33px]"
                    } ${
                      isHover && useHeroOnHover
                        ? "lg:w-0 lg:max-w-0 lg:opacity-0"
                        : ""
                    }`}
                    style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
                  />
                )}

                {!(p.year === "2025" && p.client === "CJ CGV & Naver Cloud") &&
                  (p.images[2] ? (
                    String(p.images[2]).toLowerCase().endsWith(".mp4") ? (
                      <div
                        className={`w-full lg:w-[197.33px] bg-[#F6F0FF] overflow-hidden flex-none transition-[width,height,opacity] duration-300 ease-out ${
                          isHover && useHeroOnHover
                            ? "lg:w-0 lg:max-w-0 lg:opacity-0"
                            : "lg:opacity-100"
                        }`}
                        style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
                      >
                        <video
                          src={p.images[2]}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-full lg:w-[197.33px] bg-[#F6F0FF] overflow-hidden flex-none transition-[width,height,opacity] duration-300 ease-out ${
                          isHover && useHeroOnHover
                            ? "lg:w-0 lg:max-w-0 lg:opacity-0"
                            : "lg:opacity-100"
                        }`}
                        style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
                      >
                        <img
                          src={p.images[2]}
                          alt={`${p.client || "project"} image 3`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  ) : (
                    <GreyPlaceholder
                      className={`w-full lg:w-[197.33px] bg-[#F6F0FF] overflow-hidden flex-none transition-[width,height,opacity] duration-300 ease-out ${
                        isHover && useHeroOnHover ? "lg:w-0 lg:max-w-0 lg:opacity-0" : ""
                      }`}
                      style={{ height: isHover ? `${contentHHover}px` : `${contentH}px` }}
                    />
                  ))}
              </>
            ) : (
              <>
                <GreyPlaceholder className="w-full lg:w-[197.33px]" />
                <GreyPlaceholder className="w-full lg:w-[197.33px]" />
                {!(p.year === "2025" && p.client === "CJ CGV & Naver Cloud") && (
                  <GreyPlaceholder className="w-full lg:w-[197.33px]" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    );
  };

  return (
    <>
      <div
        ref={rootRef}
        className="text-primaryB w-full font-[400] relative py-8 lg:py-10 px-4"
      >
        {/* Font toggle controls (hel / pre) on the right */}
        <div className="hidden lg:flex absolute right-20 top-10 z-[550] gap-2 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full border border-primaryB/20 shadow-sm">
          <button
            type="button"
            onClick={() => setContentFont("hel")}
            className={`${pxGrotesk.className} border border-primaryB/60 px-2.5 py-1 rounded-full text-[0.75rem] ${contentFont === "hel" ? "bg-primaryB text-white" : "text-primaryB"}`}
            aria-pressed={contentFont === "hel"}
          >
            hel
          </button>
          <button
            type="button"
            onClick={() => setContentFont("pre")}
            className={`${pxGrotesk.className} border border-primaryB/60 px-2.5 py-1 rounded-full text-[0.75rem] ${contentFont === "pre" ? "bg-primaryB text-white" : "text-primaryB"}`}
            aria-pressed={contentFont === "pre"}
          >
            pre
          </button>
        </div>
        {visibleProjects.length > 0 ? (
          <div className="relative z-10 text-primaryB">
            <div
              className={`mx-auto w-[80rem] ${isExpanded ? "h-auto" : "h-[52.5rem]"} flex flex-col`}
              style={{ backgroundColor: "#f0f0ec" }}
            >
              {/* Header row */}
              <div className="h-[3.875rem] border-b border-primaryB flex items-end pb-4">
                <motion.div
                  animate={headerControls}
                  className={`${neuehaas.className} tracking-[-0.03em] leading-none whitespace-nowrap text-[1.75rem] md:text-[1.875rem] lg:text-[2rem]`}
                >
                  {selectedHeaderRaw}
                </motion.div>
              </div>

              <div className="flex-1 flex flex-col">
                <motion.div
                  animate={contentControls}
                  className={`relative ${isExpanded ? "flex-none overflow-visible" : "flex-1 overflow-y-auto"} pt-[1rem] space-y-[1rem]`}
                >
                  {visibleProjects.map((p, idx) => renderRow(p, idx, "list"))}
                  {(hasMore || isExpanded) && (
                    <div
                      className={`pt-5 pb-6 flex justify-center sticky ${
                        isExpanded ? "bottom-6" : "bottom-4"
                      } z-20`}
                    >
                      <button
                        type="button"
                        onClick={toggleExpanded}
                        aria-label={toggleAriaLabel}
                        className={`${pxGrotesk.className} group border-2 border-primaryB w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-primaryB hover:bg-primaryB hover:text-primaryW transition-colors`}
                      >
                        <span
                          aria-hidden="true"
                          className={`transition-transform duration-300 ease-out ${
                            isExpanded ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="block relative -top-0.5"
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

    </>
  );
}