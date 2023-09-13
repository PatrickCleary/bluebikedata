import dayjs from 'dayjs';
import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { useConfigStore } from "../store/ConfigStore";
import localeData from 'dayjs/plugin/localeData';
import { MONTHS, YEARS } from '../constants';


dayjs.extend(localeData);

export const DateToggle: React.FC = () => {
  const configStore = useConfigStore((store) => store);
  return (
    <div className="relative flex-col gap-2 w-full text-sm text-black">
      <div className="flex flex-row items-center justify-center md:justify-start w-full bg-gray-500 gap-[1px] rounded-md border border-gray-500">
        <Listbox value={configStore.date.month} onChange={(value) => configStore.setDate({ ...configStore.date, month: value })}>
          <div className="relative mt-1">
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-3 w-16 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{dayjs.monthsShort()[configStore.date.month]}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {MONTHS.map((month, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-2 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    value={index}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-bold' : 'font-normal'
                            }`}
                        >
                          {month.short}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <Listbox value={configStore.date.year} onChange={(value) => configStore.setDate({ ...configStore.date, year: value })}>
          <div className="relative mt-1">
            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-3 w-16 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{configStore.date.year}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {YEARS.map((year, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-2 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    value={year}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-bold' : 'font-normal'
                            }`}
                        >
                          {year}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <button onClick={() => { configStore.incrementMonth() }} className="bg-white text-black w-12 h-12">+</button>
    </div>
  );
};
