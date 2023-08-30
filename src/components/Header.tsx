import React from "react";
import "rc-slider/assets/index.css";

import {
  useConfigStore,
} from "../store/ConfigStore";
import { TripSlider } from "./Slider";
import { Popover } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { InfoModal } from "./InfoModal";
import { StationTripMap } from "../types/Data";
import { useBreakpoint } from "../helpers/breakpoints";
import { useQuery } from "@tanstack/react-query";
import { fetchAllData } from "../api/all_data";

interface HeaderProps { }

export const Header: React.FC<HeaderProps> = () => {
  const configStore = useConfigStore((store) => store);
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  const isMobile = !useBreakpoint("md");
  return (
    <div className="w-full top-0 z-20  bg-gray-800 rounded-md px-2 md:px-4 md:py-4 py-2 text-gray-100 pointer-events-auto border border-gray-500">
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="flex flex-col ">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-lg md:text-2xl truncate items-baseline">
              {getTitle(configStore.startStations, data_23.data)}
            </h1>
            <InfoModal />
          </div>
        </div>
        {!isMobile ? (
          <div className="flex flex-row justify-between">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-end w-full">
              <Popover>
                <Popover.Button className="outline-none w-full">
                  {({ open }) => {
                    return (
                      <div
                        className={classNames(
                          open ? "rounded-t-md" : "rounded-md",
                          "py-2 md:py-1 bg-gray-800 w-full border border-gray-500 text-gray-200 px-4 gap-4 flex flex-row items-center justify-between"
                        )}
                      >
                        <p>Filters</p>
                        <FontAwesomeIcon
                          icon={open ? faChevronUp : faChevronDown}
                          className="w-4 h-4"
                        />
                      </div>
                    );
                  }}
                </Popover.Button>
                <Popover.Overlay className="fixed inset-0 bg-black opacity-50 z-10" />

                <Popover.Panel>
                  <div className="flex flex-col md:flex-row w-fit min-w-[20rem] md:min-w-[32rem] max-w-[48rem] bg-gray-800 z-20 absolute py-4 px-4 gap-4 rounded-md shadow-md mt-2">
                    <TripSlider />
                  </div>
                </Popover.Panel>
              </Popover>
            </div>
          </div>
        ) : null}
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
        <span className="italic text-sm text-amber-500">
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
