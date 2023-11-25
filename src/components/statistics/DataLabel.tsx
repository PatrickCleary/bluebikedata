import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import dayjs from "dayjs";
import { useConfigStore } from "../../store/ConfigStore";
import { StatisticsOverlay } from "./StatisticsOverlay";
import { StatisticsHeader } from "./StatisticsHeader";
import { useSelectStore } from "../../store/SelectStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";

// TODO: Fix this for
export const DataWidget = () => {
  const { flipDocks } = useSelectStore((store) => store);
  return (
    <Transition
      show={true}
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 translate-y-full"
      enterTo="opacity-100 translate-y-0"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-full"
    >
      <div className="flex flex-col rounded-md px-4 py-2 md:p-4 gap-2 items-baseline bg-gray-800 shadow-sm border border-gray-700 w-full md:max-w-sm pointer-events-auto">
        <h3 className="relative flex flex-row self-start col-1 row-2 text-lg md:text-md text-white italic">
          <StatisticsHeader />
          <button
            className={
              "rounded-full gap-1 flex flex-row px-1 sm:px-2 pr-2  items-center py-[2px] "
            }
            onClick={() => {
              flipDocks();
            }}
          >
            <FontAwesomeIcon icon={faRepeat} className="h-5 w-5" />
          </button>
        </h3>
        <StatisticsOverlay />
      </div>
    </Transition>
  );
};
