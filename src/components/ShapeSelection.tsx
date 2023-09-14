import React from "react";
import { useBreakpoint } from "../helpers/breakpoints";
import { ContactAndInfo } from "./ContactAndInfo";
import { DateControl } from "./DateToggle";
import { DrawingMenu } from "./DrawingMenu";
import { ProjectOutlines } from "./ProjectOutlines";
import { ShareButton } from "./ShareButton";

export const ShapeSelection = () => {
  const isMobile = !useBreakpoint("md");
  return (
    <div className="relative md:h-full md:my-2 flex flex-row md:flex-col z-10 w-full md:w-fit bg-gray-800 md:gap-4 px-2 md:px-4 py-2 text-gray-100 rounded-md pointer-events-auto  items-center border border-gray-500 shadow-md">
      <DrawingMenu />
      <hr className="md:h-[1px] h-full invisible md:visible md:w-full border-gray-600" />
      <DateControl />
      <hr className="md:h-[1px] h-full invisible md:visible md:w-full border-gray-600" />

      {!isMobile ? <ProjectOutlines /> : null}
      <div className="absolute flex-col  gap-2 items-center flex bottom-4 invisible md:visible">
        <ShareButton />
        <ContactAndInfo />
      </div>
    </div>
  );
};
