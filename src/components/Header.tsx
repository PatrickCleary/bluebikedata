import React from "react";
import "rc-slider/assets/index.css";

import {
  DISTANCE_MIN_MAP,
  DISTANCE_TITLE_MAP,
  METRIC_MAP,
  METRIC_TITLE_MAP,
} from "../constants";
import { useConfigStore } from "../store/ConfigStore";
import { TabsWithLabel } from "./TabsWithLabel";
import { TripSlider } from "./Slider";
import { Popover } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { Tabs } from "./Tabs";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const configStore = useConfigStore((store) => store);
  return (
    <div className="w-full xl:col-span-4 bg-gray-700 rounded-t-md px-2 md:px-4 py-4 text-gray-100 ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col ">
          <h1 className="text-lg md:text-2xl whitespace-nowrap">
            {METRIC_TITLE_MAP[configStore.metric]} from dock{" "}
            <span className="text-xs truncate md:text-lg">
              (June 2022 vs. June 2023)
            </span>
          </h1>
          <h3 className="italic text-sm md:text-lg">
            {DISTANCE_TITLE_MAP[configStore.distance]}
          </h3>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-end w-full">
            <Tabs setValue={configStore.setMetric} options={METRIC_MAP} />
            <Popover>
              <Popover.Button className="outline-none">
                {({ open }) => {
                  return (
                    <div
                      className={classNames(
                        open ? "rounded-t-md" : "rounded-md",
                        "py-2 md:py-1 bg-gray-800 px-4 gap-4 flex flex-row items-center"
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
                <div className="flex flex-col md:flex-row w-fit min-w-[20rem] md:min-w-[32rem] max-w-[48rem] bg-gray-700 z-20 absolute py-2 px-4 gap-4 rounded-md shadow-md mt-2">
                  <TabsWithLabel
                    label={"Trip distances"}
                    setValue={configStore.setDistance}
                    options={DISTANCE_MIN_MAP}
                    defaultIndex={Object.entries(DISTANCE_MIN_MAP).findIndex(
                      ([key, entry]) => key === configStore.distance
                    )}
                  />
                  <TripSlider />
                </div>
              </Popover.Panel>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};
