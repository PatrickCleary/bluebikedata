import { faArrowsSpin, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import { useNotificationStore } from "../store/NotificationStore";
import { useSelectionStore } from "../store/SelectionStore";
export const DirectionToggle = () => {
    const selectionStore = useSelectionStore((store) => store);
    const { setNotification } = useNotificationStore((store) => store);
    return (
        <div className="w-full flex flex-row ">
            <div className="flex flex-row justify-center md:justify-start rounded-md gap-[1px] bg-gray-500 border border-gray-500 overflow-hidden">
                <div
                    className={classNames(
                        "h-5 w-5 cursor-pointer rounded-md shadow-sm",
                        selectionStore.direction === "destination"
                            ? "bg-amber-500 "
                            : "bg-amber-500 bg-opacity-20"
                    )}
                    onClick={() => {
                        selectionStore.switchDirections();
                        setNotification({ text: "Selecting destination" });
                    }}
                />
                <div
                    className={classNames(
                        "h-5 w-5 cursor-pointer rounded-md shadow-sm",
                        selectionStore.direction === "origin"
                            ? "bg-fuchsia-500 "
                            : "bg-fuchsia-500 bg-opacity-20"
                    )}
                    onClick={() => {
                        selectionStore.switchDirections();
                        setNotification({ text: "Selecting origin" });
                    }}
                />
            </div>
            <button
                className={classNames(

                    "rounded-full gap-1 flex flex-row px-1 sm:px-2 pr-2  items-center py-[2px] "
                )}
                onClick={() => {
                    selectionStore.flipShapes();
                }}
            >
                <FontAwesomeIcon icon={faRepeat} className="h-5 w-5" />
            </button>
        </div>
    );
};
