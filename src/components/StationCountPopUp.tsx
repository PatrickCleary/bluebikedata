import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { MAX_STATIONS } from "../constants";
import { useConfigStore } from "../store/ConfigStore";
import { useMapStore } from "../store/MapStore";

export const StationCountPopUp = () => {
  const startStations = useConfigStore((store) => store.startStations);
  const disable = Boolean(startStations && startStations.length > MAX_STATIONS);

  return (
    <div className="fixed bottom-0 h-0 w-full z-10 flex justify-center">
      <Transition
        as={Fragment}
        show={disable}
        enter="transform transition duration-[400ms]"
        enterFrom="opacity-0 translate-y-5"
        enterTo="opacity-100  -translate-y-5"
        leave="transform duration-200 transition ease-in-out "
        leaveFrom="opacity-100   -translate-y-5"
        leaveTo="opacity-0  translate-y-5 "
      >
        <div className="px-4 py-2 opacity-90 shadow-sm  bottom-4 fixed rounded-md bg-red-500 text-white ">
          <p>
            {`Stations selected: ${startStations?.length}/`}
            <span className="font-bold">15</span>
          </p>
        </div>
      </Transition>
    </div>
  );
};
