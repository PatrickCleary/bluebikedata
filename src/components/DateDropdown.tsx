import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

interface DateDropdownProps {
    value: number;
    displayValue: string;
    onChange: (value: number) => void;
    listItem: (item: any) => string;
    options: any[];
}

export const DateDropdown: React.FC<DateDropdownProps> = ({
    value,
    options,
    listItem,
    onChange,
    displayValue,
}) => {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className=" h-full">
                <Listbox.Button className="cursor-pointer flex h-full bg-gray-700 hover:bg-gray-500 px-0 items-center justify-center w-10 md:w-14 text-left shadow-md focus:outline-none focus-visible:border-indigo-700 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-xs md:text-base">
                    <span className="block truncate">{displayValue}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center "></span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 max-h-90 w-auto overflow-auto rounded-md bg-gray-500 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option, index) => (
                            <Listbox.Option
                                key={index}
                                className={({ active, selected }) =>
                                    `relative cursor-pointer select-none text-white py-2 px-2  ${selected ? "bg-gray-600" : ""
                                    }
              ${active ? "bg-gray-700 text-white" : "text-gray-900"}
              `
                                }
                                value={index}
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? "font-bold" : "font-normal"
                                                }`}
                                        >
                                            {listItem(option)}
                                        </span>
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};
