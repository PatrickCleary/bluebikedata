import React, { Fragment, useEffect, useState } from "react";
import dayjs from "dayjs";
import { Listbox, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import localeData from "dayjs/plugin/localeData";
import { isMaxDate, useConfigStore } from "../../store/ConfigStore";
import { CURRENT_MAX, CURRENT_MIN, MONTHS, YEARS } from "../../constants";
import { ChangeMonthButton } from "../ChangeMonthButton";
import { DateDropdown } from "./DateDropdown";

dayjs.extend(localeData);

export const DateControl: React.FC = () => {
  const configStore = useConfigStore((store) => store);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    let interval;
    if (isPlaying && !interval && !isMaxDate(configStore.date)) {
      interval = setInterval(() => {
        configStore.incrementMonth(1);
      }, 300);
    }
    if (!isPlaying) {
      clearInterval(interval);
    }
    if (isMaxDate(configStore.date)) {
      clearInterval(interval);
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [configStore, isPlaying]);

  const hitPlay = () => {
    if (isMaxDate(configStore.date)) {
      configStore.setDate(CURRENT_MIN);
      setIsPlaying(true);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative flex-col gap-2 text-sm text-white">
      <div className="flex flex-row items-center justify-center md:justify-start h-10 w-full bg-gray-500 gap-[2px] p-[1px]  rounded-lg border border-gray-700">
        <div className="flex flex-row items-center  border border-gray-700 justify-center w-full h-full rounded-md overflow-hidden">
          <ChangeMonthButton
            amount={-1}
            disabled={
              configStore.date.year === CURRENT_MIN.year &&
              configStore.date.month === CURRENT_MIN.month
            }
          />

          <DateDropdown
            value={configStore.date.month}
            displayValue={dayjs.monthsShort()[configStore.date.month]}
            onChange={(value) =>
              configStore.setDate({ ...configStore.date, month: value })
            }
            listItem={(item) => item.short}
            options={MONTHS}
          />
          <ChangeMonthButton amount={1} disabled={
            configStore.date.year === CURRENT_MAX.year &&
            configStore.date.month === CURRENT_MAX.month
          } />
        </div>

        <div className="flex h-full flex-row items-center justify-center w-full rounded-md overflow-hidden border border-gray-700 ">
          <ChangeMonthButton
            amount={-12}
            disabled={configStore.date.year === CURRENT_MIN.year}
          />
          <DateDropdown
            value={configStore.date.year}
            displayValue={configStore.date.year.toString()}
            onChange={(value) =>
              configStore.setDate({ ...configStore.date, year: YEARS[value] })
            }
            listItem={(item) => item}
            options={YEARS}
          />

          <ChangeMonthButton
            amount={12}
            disabled={
              configStore.date.year === CURRENT_MAX.year ||
              (configStore.date.month > CURRENT_MAX.month &&
                configStore.date.year === CURRENT_MAX.year - 1)
            }
          />
        </div>
        <button
          onClick={hitPlay}
          className="bg-gray-700 hover:bg-gray-500 border border-gray-700 text-white px-2 shrink h-full rounded-md"
        >
          <FontAwesomeIcon
            icon={isPlaying ? faPause : faPlay}
            className="w-4"
          />
        </button>
      </div>
    </div>
  );
};
