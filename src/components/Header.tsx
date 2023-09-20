import React from "react";
import "rc-slider/assets/index.css";

import {
  useConfigStore,
} from "../store/ConfigStore";
import { InfoModal } from "./InfoModal";
import { StationTripMap } from "../types/Data";
import { useBreakpoint } from "../helpers/breakpoints";
import { useQuery } from "@tanstack/react-query";
import { fetchAllData } from "../api/all_data";
import dayjs from "dayjs";

interface HeaderProps { }

export const Header: React.FC<HeaderProps> = () => {
  const { date } = useConfigStore(store => store);
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  const isMobile = !useBreakpoint("md");
  return (
    <div className="w-full top-0 z-20 bg-gray-800 rounded-md px-2 md:px-4 md:py-4 py-2 text-gray-100 pointer-events-auto border border-gray-700 shadow-md">
      <div className="flex flex-col ">
        <div className="flex flex-row gap-2 items-center">
          <h1 className="text-lg md:text-2xl truncate items-baseline">
            Bluebikes trips <span className="font-mono">{dayjs.monthsShort()[date.month]} {date.year}</span>
          </h1>
          <InfoModal />
        </div>
      </div>
    </div>
  );
};

const getTitle = (
  startStations: string[] | undefined,
  data_23: StationTripMap | undefined
) => {
  if (!startStations) return "Select a station";
  if (startStations.length === 1) {
    return (
      <h1>
        Trips from{" "}
        <span className="italic text-amber-500">
          {data_23 ? data_23[startStations[0]]?.name : "..."}
        </span>
      </h1>
    );
  }
  return (
    <h1>
      Trips departing from{" "}
      <span className="text-amber-500 bg-amber-500 bg-opacity-10 border border-amber-500 px-1">
        orange region
      </span>
    </h1>
  );
};
