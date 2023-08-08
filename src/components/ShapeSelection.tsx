import React from "react";
import { useBreakpoint } from "../helpers/breakpoints";
import { DateToggle } from "./DateToggle";
import { DrawingMenu } from "./DrawingMenu";
import { ProjectOutlines } from "./ProjectOutlines";

export const ShapeSelection = () => {
  const isMobile = !useBreakpoint("md");
  return (
    <div className="md:h-full my-2 flex flex-row md:flex-col z-10 w-full md:w-fit bg-gray-800 md:gap-4 gap-2 px-1 md:px-4 py-2 text-gray-100 rounded-md pointer-events-auto  items-center border border-gray-500">
      <DrawingMenu />
      <hr className="md:h-[1px] h-full w-[1px] md:w-full bg-neutral-200" />
      <DateToggle />
      {!isMobile ? <ProjectOutlines /> : null}
    </div>
  );
};
