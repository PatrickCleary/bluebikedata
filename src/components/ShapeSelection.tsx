import React from "react";
import { useClearStartStations } from "../store/ConfigStore";
import { useMapStore, useSetOriginDocks } from "../store/MapStore";
import { ProjectOutlines } from "./ProjectOutlines";

export const ShapeSelection = () => {
  const { setOriginDocks } = useMapStore();
  const setOriginDocksFromShape = useSetOriginDocks();
  const clearStartStations = useClearStartStations();
  return (
    <div className="h-[25vh] md:h-[80vh] left-0 md:top-50 lg:top-40 flex flex-col bottom-0 top-auto fixed z-10 w-90 w-full md:w-auto m-2 bg-gray-700 gap-1 px-2 py-2 text-gray-100 rounded-md ">
      <h1 className="text-lg italic">Origin dock selection</h1>
      <button onClick={setOriginDocksFromShape}>get docks</button>
      <button
        onClick={() => {
          clearStartStations();
          setOriginDocks([]);
        }}
      >
        clear startShape.
      </button>
      <ProjectOutlines />
      <p className="px-2 pt-4">More coming soon...</p>
    </div>
  );
};
