import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import dayjs from 'dayjs';
import { useConfigStore } from "../store/ConfigStore";
import { useStatisticStore } from "../store/StatisticStore";
import { StatisticsWidget } from "./StatisticsWidget";


// TODO: Fix this for 
export const DataWidget = () => {
    const date = useConfigStore((store) => store.date);
    const statistics = useStatisticStore((store) => store.statistics)
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
                <div className="fixed font-mono flex flex-row rounded-md p-4 items-baseline bg-gray-500 h-20">
                    <h3 className="font-bold self-start font-mono text-md mb-4 text-white">{`${dayjs.monthsShort()[date.month]} ${date.year}`}</h3>
                    <StatisticsWidget />
                </div>
            </Transition>
        </div>
    );
};
