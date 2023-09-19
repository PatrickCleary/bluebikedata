import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import React, { Fragment } from "react";
import { presets } from "../constants/presets";
import { Direction, useSelectionStore, useSetNewShapeAndDocks } from "../store/SelectionStore";

export const RegionSelection: React.FC<{ direction: Direction, active?: boolean }> = ({
    direction, active = true
}) => {
    const setShapeAndDocks = useSetNewShapeAndDocks()
    const { setIsDrawing, setDirection } = useSelectionStore();
    const color = direction === 'origin' ? 'bg-amber-500 border-amber-500' : ' border-fuchsia-400 bg-fuchsia-400'
    const activeStyle = active ? 'rounded-sm' : 'bg-opacity-0 border border-opacity-50 rounded-full right-0 hover:bg-opacity-50'
    return (
        <Listbox onChange={(value) => value ? setShapeAndDocks(presets[value]?.coords, direction) : setShapeAndDocks([], direction)}>
            <Listbox.Button><span className={classNames(activeStyle, color, "mx-1 px-1 shadow-sm")}>{!active ? 'add ' : ''}{direction}</span></Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >

                <Listbox.Options className="flex absolute bg-gray-800 px-4 py-2 rounded-md shadow-sm bottom-10 flex-col max-h-96 overflow-y-scroll">
                    <Listbox.Option value={null} onClick={() => { setIsDrawing(true); setDirection(direction) }} className={classNames(color, "hover:bg-opacity-50 bg-opacity-0 rounded-sm px-1 cursor-pointer border-b border-gray-600")}>Draw a region</Listbox.Option>
                    <Listbox.Option value={null} onClick={() => { setIsDrawing(false); setDirection(direction) }} className={classNames(color, "hover:bg-opacity-50 bg-opacity-0 rounded-sm px-1 cursor-pointer border-b border-gray-600")}>Select a dock</Listbox.Option>

                    {Object.entries(presets).map(([name, value]) =>
                        <Listbox.Option value={name} key={name} className={classNames(color, "hover:bg-opacity-50 bg-opacity-0 rounded-sm px-1 cursor-pointer")}>
                            <p>{name}</p>
                        </Listbox.Option>
                    )}
                </Listbox.Options>
            </Transition>
        </Listbox >
    );
};
