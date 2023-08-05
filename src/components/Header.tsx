import React from "react";
import "rc-slider/assets/index.css";

import {
  DISTANCE_MIN_MAP,
  DISTANCE_TITLE_MAP,
  METRIC_MAP,
  METRIC_TITLE_MAP,
} from "../constants";
import {
  useConfigStore,
  useUpdateDistance,
  useUpdateMetric,
} from "../store/ConfigStore";
import { TabsWithLabel } from "./TabsWithLabel";
import { TripSlider } from "./Slider";
import { Popover } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { Tabs } from "./Tabs";
import { InfoModal } from "./InfoModal";
import { MetricsType } from "../types/Data";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const configStore = useConfigStore((store) => store);
  const updateDistance = useUpdateDistance();
  const updateMetric = useUpdateMetric();
  return (
    <div className="w-full fixed top-0 z-20  bg-neutral-900 m-2 rounded-md px-2 md:px-4 py-4 text-gray-100 pointer-events-auto shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col ">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-lg md:text-2xl truncate items-baseline">
              {METRIC_TITLE_MAP[configStore.metric]}{" "}
            </h1>
            <InfoModal />
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-end w-full">
            <Popover>
              <Popover.Button className="outline-none w-full">
                {({ open }) => {
                  return (
                    <div
                      className={classNames(
                        open ? "rounded-t-md" : "rounded-md",
                        "py-2 md:py-1 bg-gray-800 w-full border border-gray-700 text-gray-200 px-4 gap-4 flex flex-row items-center justify-between"
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
      </div>
    </div>
  );
};
