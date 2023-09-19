import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import dayjs from "dayjs";
import { useConfigStore } from "../../store/ConfigStore";
import { StatisticsOverlay } from "./StatisticsOverlay";
import { StatisticsHeader } from "./StatisticsHeader";

// TODO: Fix this for
export const DataWidget = () => {
    const date = useConfigStore((store) => store.date);
    return (
        <div className="absolute bottom-7 left-2 md:bottom-0 md:left-0 md:m-0 md:relative md:h-full flex flex-end items-end">
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
                <div className="fixed flex flex-col rounded-md p-4 gap-2 items-baseline bg-gray-800 shadow-sm border border-gray-700 w-full max-w-sm">
                    <h3 className="self-start col-1 row-2 text-md text-white text-sm italic">
                        {`${dayjs.monthsShort()[date.month]} ${date.year}`} Trips <StatisticsHeader />
                    </h3>
                    <StatisticsOverlay />
                </div>
            </Transition>
        </div>
    );
};
