import React from "react";
import { useClearStartStations, useConfigStore } from "../store/ConfigStore";
import { useMapStore, useSetOriginDocks } from "../store/MapStore";
import { DateToggle } from "./DateToggle";
import { DrawingMenu } from "./DrawingMenu";
import { ProjectOutlines } from "./ProjectOutlines";

export const ShapeSelection = () => {
  const { setOriginDocks } = useMapStore();
  const configStore = useConfigStore((store) => store);
  return (
    <div className="h-[25vh] md:h-[80vh] left-0 md:top-50 lg:top-40 flex flex-col bottom-0 top-auto fixed z-10 w-90 w-full md:w-auto m-2 bg-neutral-900 gap-4 px-4 py-2 text-gray-100 rounded-md pointer-events-auto shadow-md items-center ">
      <DrawingMenu />
      <hr className="h-[1px] w-full bg-neutral-800" />
      <DateToggle />
      <ProjectOutlines />
    </div>
  );
};
