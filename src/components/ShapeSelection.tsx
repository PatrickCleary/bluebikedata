import React, { useState } from "react";
import { presets } from "../constants/presets";
import { useBreakpoint } from "../helpers/breakpoints";
import { useConfigStore } from "../store/ConfigStore";
import { useSelectionStore, useSetDocks, useSetNewShapeAndDocks } from "../store/SelectionStore";
import { ContactAndInfo } from "./ContactAndInfo";
import { DateControl } from "./date/DateToggle";
import { DrawingMenu } from "./DrawingMenu";
import { ProjectOutlines } from "./ProjectOutlines";
import { ShareButton } from "./ShareButton";

export const ShapeSelection = () => {
  const isMobile = !useBreakpoint("md");
  const { shape, setShape } = useSelectionStore((store) => store);
  const setShapeAndDocks = useSetNewShapeAndDocks()

  return (
    <div className="relative md:h-full md:my-2 flex flex-row md:flex-col z-10 w-full md:w-fit bg-gray-800 md:gap-4 px-2 md:px-4 py-2 text-gray-100 rounded-md pointer-events-auto  items-center border border-gray-700 shadow-md">
      <DrawingMenu />
      <hr className="md:h-[1px] h-full invisible md:visible md:w-full border-gray-600" />
      <DateControl />
      <hr className="md:h-[1px] h-full invisible md:visible md:w-full border-gray-600" />
      <div className="h-64 flex flex-col overflow-y-scroll items-start">
        {Object.entries(presets).map(([name, value]) => (
          <button
            onClick={() => {
              setShapeAndDocks(value.coords)
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="absolute flex-col  gap-2 items-center flex bottom-4 invisible md:visible">
        <ShareButton />
        <ContactAndInfo />
      </div>
    </div>
  );
};
