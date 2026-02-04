"use client";

import { useEffect, useState } from "react";
import { ABOUT_SECTIONS } from "./aboutData";
import { pxGrotesk } from "@/fonts/fonts";

export default function AboutIntro({ activeId, onChange, aboutStyle = 2 }) {
  const [displayId, setDisplayId] = useState(activeId);
  const [isFade, setIsFade] = useState(true);

  useEffect(() => {
    setIsFade(false);
    const timer = setTimeout(() => {
      setDisplayId(activeId);
      setIsFade(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [activeId]);

  const titleSection =
    ABOUT_SECTIONS.find((section) => section.id === activeId) ||
    ABOUT_SECTIONS[0];

  const contentSection =
    ABOUT_SECTIONS.find((section) => section.id === displayId) ||
    ABOUT_SECTIONS[0];

  const safeParagraphs = Array.isArray(contentSection.paragraphs)
    ? contentSection.paragraphs
    : [];

  const paragraphs2 = [safeParagraphs[0] || "", safeParagraphs[1] || ""].filter(
    Boolean
  );

  return (
    <div className={`w-full relative z-10 ${pxGrotesk.className}`}>
      <div className="flex flex-col lg:flex-row items-start lg:gap-[2vw]">
        <div className="w-full lg:w-[28%]">
          {aboutStyle === 1 ? (
            <h2 className="text-left font-[500] leading-tight text-[28px] tracking-[-0.03em]">
              {titleSection.title}
            </h2>
          ) : (
            <ul className="flex flex-col gap-2">
              {ABOUT_SECTIONS.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <li
                    key={section.id}
                    className={`text-left leading-tight text-[28px] tracking-[-0.03em] ${
                      isActive ? "font-[500] text-[#0f0f13]" : "font-[500] text-[#9D9C9C]"
                    }`}
                  >
                    {section.title}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={`w-full lg:w-[72%] transition-opacity duration-300 ease-in-out ${
            isFade ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {paragraphs2.map((paragraph, index) => (
              <p key={index} className="text-[16px] leading-[1.45]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className={`w-full lg:pb-[5vh] ${displayId === "who" ? "mt-10" : "mt-14"}`}>
            {displayId === "who" ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="w-full aspect-[16/9] relative overflow-hidden rounded-[3px]">
                  <img src="/img/about_1.png" alt="About 1" className="object-cover w-full h-full" />
                </div>
                <div className="w-full aspect-[16/9] relative overflow-hidden rounded-[3px]">
                  <img src="/img/about_2.png" alt="About 2" className="object-cover w-full h-full" />
                </div>
              </div>
            ) : displayId === "sectors" ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="w-full aspect-[16/9] relative overflow-hidden rounded-[3px]">
                  <img src="/img/about_3.png" alt="About 3" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:block" />
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="w-full aspect-[16/9] relative overflow-hidden rounded-[3px]">
                  <img
                    src="/img/about_4.png"
                    alt="About 4"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="w-full aspect-[16/9] relative overflow-hidden rounded-[3px]">
                  <img
                    src="/img/about_5.png"
                    alt="About 5"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// const aboutInfo = [
//   {
//     title:"Founded in 2015 at Carnegie Mellon University, QrST is a global design convergence collective",
//     description: "QrST는 카네기멜론대학교 Computational Creativity Lab에 이어 한국예술종합학교에 설립된 디자인 콜렉티브 이니셔티브입니다. 우리는 컴퓨테이셔널 디자인 프로세스와 방법론을 통해 첨단기술과 창의성 사이에서 의미있고 실현가능한 새로운 가능성을 발굴합니다."
//   },
//   {
//     title: "Collaborating with international partners, we push the boundaries of innovation and creativity",
//     description: "QrST는 국제적인 협력 관계를 가지며 스튜디오, 리서치, 랩으로 나뉩니다. 스튜디오 팀은 다양한 뉴미디어 에이전시, 디자인 스튜디오와 협업하며 트랜스미디어 브랜딩, 미디어 아트 등 커머셜 프로젝트를 진행합니다. 리서치 팀은 인공지능 상호작용 기반의 선행적인 컨셉 디자인과 사용자 경험 디자인 및 연구, 특히 정량, 정성 데이터 수집, 분석 및 시각화에 전문성을 가지고 있습니다. 랩 팀은 디자인 이외 공학, 의학 등 연구중심대학 및 연구소와 협력을 통해 다가올 미래의 새로운 가치를 탐색합니다."
//   }
// ];
