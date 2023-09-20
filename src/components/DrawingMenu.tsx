import React from "react";
import {
  faCircle,
  faCircleNodes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useNotificationStore } from "../store/NotificationStore";
import { useClearDocks, useSelectionStore } from "../store/SelectionStore";

export const DrawingMenu = () => {
  const clearDocks = useClearDocks();
  const selectionStore = useSelectionStore((store) => store)
  const setNotification = useNotificationStore(
    (store) => store.setNotification
  );
  const color = selectionStore.direction === 'origin' ? 'text-amber-500' : 'text-fuchsia-500'
  const clearEnabled = selectionStore.selectedDocks[selectionStore.direction]?.length || selectionStore.shape[selectionStore.direction]?.length

  return (
    <div className="flex flex-row gap-2 w-full items-center">
      <div className="w-full flex flex-row ">
        <div className="flex flex-row justify-center md:justify-start rounded-md gap-[1px] bg-gray-500 border border-gray-700 overflow-hidden">
          <FontAwesomeIcon
            icon={faCircle}
            className={classNames(
              "h-3 w-3 cursor-pointer py-2 px-3 rounded-md",
              selectionStore.isDrawing
                ? "text-white bg-gray-500 hover:bg-gray-700 rounded-md"
                : `${color} bg-gray-700`
            )}
            onClick={() => {
              selectionStore.setIsDrawing(false);
              setNotification({ text: "Tap/click a dock to select." });
            }}
          />
          <FontAwesomeIcon
            icon={faCircleNodes}
            className={classNames(
              "h-5 w-5 cursor-pointer py-1 px-2  rounded-md",
              !selectionStore.isDrawing
                ? "text-white bg-gray-500 hover:bg-gray-700 "
                : `${color} bg-gray-700`
            )}
            onClick={() => {
              selectionStore.setIsDrawing(true);
              setNotification({ text: "Click/tap on the map to draw." });
            }}
          />
        </div>
        <button
          disabled={!clearEnabled}
          className={classNames(
            !clearEnabled ? "text-neutral-700" : "text-gray-100 hover:text-gray-300",
            "rounded-full gap-1 flex flex-row px-1 sm:px-2 pr-2  items-center py-[2px] "
          )}
          onClick={() => {
            clearDocks();
          }}
        >
          <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
        </button>
      </div>

    </div>
  );
};
