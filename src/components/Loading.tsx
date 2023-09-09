import React from "react";
import { MAX_STATIONS } from "../constants";
import { useConfigStore } from "../store/ConfigStore";
export const Loading = () => {
  const startStations = useConfigStore((store) => store.startStations);
  const disable = Boolean(startStations && startStations.length > MAX_STATIONS);
  if (disable) return null;
  return (
    <div className="fixed m-auto left-0 right-0 top-0 bottom-0 w-20 h-24 bg-black backdrop-blur-sm bg-opacity-50 rounded-lg gap-1 text-white items-center flex justify-center flex-col">
      <div className="rounded-full h-12 w-12 bg-gradient-to-r from-amber-500 to-sky-400 animate-spin bg-opacity-100 border border-black"></div>
      <p>Loading</p>
    </div>
  );
};
