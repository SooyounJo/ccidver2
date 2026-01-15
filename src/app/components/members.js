"use client";

import { useEffect, useState } from "react";
import { neuehaas } from "@/fonts/fonts";
import { sheetsStatic } from "@/app/data/sheetsStatic";
import GreyPlaceholder from "@/app/components/common/GreyPlaceholder";

export default function Members() {
  const [membersInfo, setMembersInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = sheetsStatic;
    const categorizedMembers = (data?.members || []).reduce((acc, member) => {
      const category = member[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push(member);
      return acc;
    }, {});

    setMembersInfo(categorizedMembers);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg md:text-xl">Loading members...</p>
      </div>
    );
  }

  const categories = Object.entries(membersInfo);
  const [firstCategory, ...otherCategories] = categories;

  const chunkPairs = (list) => {
    const out = [];
    for (let i = 0; i < list.length; i += 2) {
      out.push([list[i], list[i + 1]].filter(Boolean));
    }
    return out;
  };

  const colStartClasses = {
    1: "col-start-1",
    2: "col-start-2",
    3: "col-start-3",
    4: "col-start-4",
    5: "col-start-5",
    6: "col-start-6",
    7: "col-start-7",
    8: "col-start-8",
  };

  const renderMemberBlock = (member, colStart, isDirector = false) => {
    const [, name, image, role, bio] = member;
    const imageColClass = colStartClasses[colStart] || "col-start-1";
    const textColClass = colStartClasses[colStart + 1] || "col-start-2";

    return (
      <>
        <div className={`${imageColClass} col-span-1`}>
          <div className="h-[178px] overflow-hidden rounded-[19px]">
            {image ? (
              <img
                src={image}
                alt={name || "member"}
                className={`w-full h-full object-cover ${
                  isDirector ? "mix-blend-luminosity" : ""
                }`}
              />
            ) : (
              <GreyPlaceholder className="w-full h-full" />
            )}
          </div>
        </div>
        <div className={`${textColClass} col-span-1 w-[250px] flex flex-col items-start text-left`}>
          <div className="h-[40px] flex items-center overflow-hidden">
            <p className={`${neuehaas.className} text-[16px] leading-[1.45] font-medium text-black`}>
              {name || ""}
            </p>
          </div>
          {role && (
            <div className="flex flex-col items-start">
              <p className={`${neuehaas.className} text-[16px] leading-[1.45] font-light text-black/70`}>
                {role}
              </p>
            </div>
          )}
          <div className="w-full h-px bg-black/70 mt-[8px]" />
          <div className="h-[16px] w-full" />
          {bio && (
            <div
              className={`${neuehaas.className} text-[12px] leading-[1.45] font-light text-black/70 whitespace-pre-wrap w-full`}
            >
              {bio}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full text-black pt-[60px] pb-0">
      <div className="w-full">
        <div className="border-b border-black pb-[16px]">
          <p className={`${neuehaas.className} text-[32px] leading-[1.45]`}>Members</p>
        </div>

        <div className="pt-[16px] flex flex-col gap-[16px]">
          {firstCategory?.[1]?.length ? (
            <div className="grid grid-cols-8 gap-x-[32px] border-b border-black pb-[32px]">
              {renderMemberBlock(firstCategory[1][0], 1, true)}
            </div>
          ) : null}

          {otherCategories.map(([category, members]) => (
            <div key={category} className="flex flex-col gap-[16px]">
              {chunkPairs(members).map((pair, idx) => (
                <div
                  key={`${category}-${idx}`}
                  className={`grid grid-cols-8 gap-x-[32px] pb-[32px] ${
                    idx === chunkPairs(members).length - 1 ? "border-b border-black" : ""
                  }`}
                >
                  {pair[0] && renderMemberBlock(pair[0], 1)}
                  {pair[1] && renderMemberBlock(pair[1], 4)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
