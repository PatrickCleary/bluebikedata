import React from "react";
import { useConfigStore, useMaxSize } from "../store/ConfigStore";

export const Scale = () => {
    const maxSize = useMaxSize();
    const ridershipMin = useConfigStore((store) => store.ridershipMin)
    return (
        <div className="bg-gray-800 flex flex-col text-white text-opacity-95 gap-1 px-2 py-4 rounded-md m-2 md:m-auto md:mt-1 md:relative absolute bottom-0 left-0 shadow-md w-[100px]">
            <div className="flex flex-row gap-2 w-full items-center">
                <div className="w-8 flex items-center justify-center"><div className="rounded-full w-2 h-2 bg-sky-500 bg-opacity-70"></div></div>
                <p className="text-sm italic">{ridershipMin}</p>
            </div>
            <div className="flex flex-row gap-2 w-full items-center">

                <div className="rounded-full w-8 h-8 bg-sky-500 bg-opacity-70"></div>
                <p className="text-sm italic">{`${maxSize}+`}</p>
            </div>

        </div >
    )
}