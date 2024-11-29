import { faCircleNodes, faHandPointer, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import React, { Fragment } from "react";
import { presets } from "../constants/presets";
import { useNotificationStore } from "../store/NotificationStore";
import {
    Direction,
    useSelectStore,
    useSetNewShapeAndDocks,
} from "../store/SelectStore";

export const RegionSelection: React.FC<{
    direction: Direction;
    active?: boolean;
}> = ({ direction, active = true }) => {
    const setShapeAndDocks = useSetNewShapeAndDocks();
    const { setIsDrawing, setDirection } = useSelectStore();
    const { setNotification } = useNotificationStore(store => store)
    const color =
        direction === "origin"
            ? "bg-amber-500 border-amber-500"
            : " border-fuchsia-400 bg-fuchsia-400";
    const activeStyle = active
        ? "bg-opacity-80"
        : "border border-opacity-50 rounded-full right-0 hover:bg-opacity-50 text-gray-300";
    return (
        <div className="relative self-end">
            <Listbox
                onChange={(value) =>
                    value
                        ? setShapeAndDocks(presets[value]?.coords, direction)
                        : setShapeAndDocks([], direction)
                }
            >
                <span className={classNames(activeStyle, color, "mx-1 shadow-sm  bg-opacity-20 border rounded-md")}>
                    <Listbox.Button>
                        <span className='px-2'>
                            {!active ? "add " : ""}
                            {direction}
                        </span>
                    </Listbox.Button>
                    {active && (<button
                        className='px-2'
                        onClick={() => {
                            setShapeAndDocks([], direction);
                        }}
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-white text-opacity-80 hover:text-opacity-100" />
                    </button>)}
                </span>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="flex absolute z-20 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 shadow-lg top-10 md:top-auto md:bottom-10 flex-col max-h-96 overflow-y-scroll w-48 sm:w-52">
                        <Listbox.Option
                            value={null}
                            onClick={() => {
                                setIsDrawing(true);
                                setDirection(direction);
                                setNotification({ text: 'Click/tap the map to draw' })
                            }}
                            className={classNames(
                                color,
                                "hover:bg-opacity-50 bg-opacity-0 rounded-sm px-1 cursor-pointer border-b"
                            )}
                        >
                            <FontAwesomeIcon icon={faCircleNodes} className='pr-1' />
                            Draw a region
                        </Listbox.Option>
                        <Listbox.Option
                            value={null}
                            onClick={() => {
                                setIsDrawing(false);
                                setDirection(direction);
                                setNotification({ text: 'Click/tap a dock to select' })

                            }}
                            className={classNames(
                                color,
                                "hover:bg-opacity-50 bg-opacity-0 rounded-sm px-1 cursor-pointer border-b"
                            )}
                        >
                            <FontAwesomeIcon icon={faHandPointer} className='pr-1' />

                            Select a dock
                        </Listbox.Option>

                        {Object.entries(presets).map(([name, value]) => (
                            <Listbox.Option
                                value={name}
                                key={name}
                                className={classNames(
                                    color,
                                    "hover:bg-opacity-50 bg-opacity-0 rounded-sm px-1 cursor-pointer"
                                )}
                            >
                                <p>{name}</p>
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </Listbox></div>

    );
};
