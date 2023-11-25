import React from "react";
import "rc-slider/assets/index.css";

import {
  useConfigStore,
} from "../store/ConfigStore";

import dayjs from "dayjs";

interface HeaderProps { }

export const Header: React.FC<HeaderProps> = () => {
  const { date } = useConfigStore(store => store);

  return (
    <div className="w-full top-0 z-20 bg-gray-800 rounded-md px-2 md:px-4 md:py-4 py-2 text-gray-100 pointer-events-auto border border-gray-700 shadow-md">
      <div className="flex flex-col ">
        <div className="flex flex-row gap-2 items-center">
          <h1 className="text-lg md:text-2xl truncate items-baseline">
            Bluebikes trips <span className="font-mono">{dayjs.monthsShort()[date.month]} {date.year}</span>
          </h1>
        </div>
      </div>
    </div>
  );
};
