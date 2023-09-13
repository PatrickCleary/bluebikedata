import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import dayjs from 'dayjs';
import { useConfigStore } from "../store/ConfigStore";


// TODO: Fix this for 
export const DateLabel = () => {
    const date = useConfigStore((store) => store.date);
    return (
        <div className="absolute bottom-7 left-2 md:bottom-0 md:left-0 md:m-0 md:relative md:h-full flex flex-end items-end">
            <Transition
                show={false}
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 -translate-y-full"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-full"
            >
                <h3 className="fixed font-bold font-mono text-2xl text-white">{`June ${date}`}</h3>
            </Transition>
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
                <h3 className="fixed font-bold font-mono text-2xl text-white">{`${dayjs.monthsShort()[date.month]} ${date.year}`}</h3>
            </Transition>
        </div>
    );
};
