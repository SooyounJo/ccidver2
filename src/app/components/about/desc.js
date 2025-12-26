"use client";
import { useEffect, useState } from "react";
import { useLanguageStore } from "../../store/languageStore";
import { pxGrotesk } from "@/fonts/fonts";
import { neuehaas } from "@/fonts/fonts";
import { sheetsStatic } from "@/app/data/sheetsStatic";
import GreyPlaceholder from "@/app/components/common/GreyPlaceholder";
import { motion, useAnimation } from "framer-motion";

function DescItem({ id, title, description, imageUrl, isOpen, onToggle }) {
  const textStyle =
    "leading-none text-[6vw] md:text-[5vw] lg:text-[2.4vw]";
  const textStyleKr =
    "leading-[1.3] mt-[-0.3vh] text-[5vw] md:text-[4.5vw] lg:text-[2.2vw]";
  const { lang } = useLanguageStore();

  return (
    <li
      className="h-auto bg-gradient-to-t from-[rgba(93,0,156,0.18)] via-[rgba(93,0,156,0)] to-[rgba(93,0,156,0)] lg:flex group overflow-hidden py-2 lg:py-[2vh] lg:px-[5vw] cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-[2px] focus-visible:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(93,0,156,0.10)] focus-visible:shadow-[0_10px_30px_rgba(93,0,156,0.10)]"
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
    >
      <h3  
        className={`${lang === 'en' ? textStyle : textStyleKr} ${neuehaas.className} lg:w-[52%] tracking-[-0.03] pt-[0.8em] px-[2.1vh] lg:mr-[1vw] mb-[1vh] lg:mb-[2vh]`}
      >
        {title}
      </h3>
      <div className="w-full lg:w-[48%]">
        {/* Show image box only when an image URL exists (otherwise no box) */}
        {typeof imageUrl === "string" && imageUrl.trim() !== "" && (
          <GreyPlaceholder className="w-full mb-[1.3vw] rounded-md aspect-[16/9]" />
        )}
        <div className="relative">
          {/* Collapsed preview (fade at bottom) vs expanded full text */}
          <div
            className={[
              "transition-[max-height] duration-500 ease-out overflow-hidden",
              isOpen ? "max-h-[70vh]" : "max-h-[7.6em] lg:max-h-[6.2em]",
            ].join(" ")}
            style={
              !isOpen
                ? {
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                  }
                : undefined
            }
          >
            <pre className={`whitespace-pre-wrap ${pxGrotesk.className} lg:pt-[2.3em] pt-[.3em] px-[1.8vh] pr-[3.8vh] pb-[3.8vh] ${lang === 'en' ? 'leading-[1.3] lg:leading-[1.38] text-[2.8vw] md:text-[2.4vw] lg:text-[1vw]' : 'leading-[1.8] text-[3.1vw] lg:text-[1.1vw]'} text-primaryB transition-all duration-500 ml-[4px] w-full`}>
              {description}
            </pre>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Desc({ sectionOn }) {
  const [aboutInfo, setAboutInfo] = useState(sheetsStatic?.desc || []);
  const { lang } = useLanguageStore();
  const listControls = useAnimation();
  // Default: "Who We Are" open on initial About render
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    setAboutInfo(sheetsStatic?.desc || []);
  }, []);

  useEffect(() => {
    if (sectionOn !== "about") return;

    // Quick rise-up + fade-in for the 3-set when entering About
    listControls.set({ y: 16, opacity: 0 });
    listControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.28, ease: "easeOut" },
    });
  }, [sectionOn, listControls]);

  const rows = Array.isArray(aboutInfo) ? aboutInfo : [];

  return (
    <motion.ul
      animate={listControls}
      className="border-primaryB w-full h-full mt-[1.3vw] px-0 text-primaryB pt-[8%] pb-[18%] flex flex-col"
    >
      {rows.map((item, i) => (
        <DescItem
          key={i}
          id={String(i + 1).padStart(2, "0")}
          title={lang === 'en' ? item[0] : item[2]}
          description={lang === 'en' ? item[1] : item[3]}
          imageUrl={item[4]}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
        />
      ))}
    </motion.ul>
  );
}
