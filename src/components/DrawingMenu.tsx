import React from "react";
import {
  faCircle,
  faCircleNodes,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useClearStartStations, useConfigStore } from "../store/ConfigStore";
import { useMapStore } from "../store/MapStore";

export const DrawingMenu = () => {
  const clearStartStations = useClearStartStations();
  const mapStore = useMapStore((store) => store);
  const configStore = useConfigStore((store) => store);
  const clearEnabled =
    configStore.startStations?.length || mapStore.startShape?.length;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-row justify-center md:justify-start rounded-md gap-[1px] bg-gray-500 border border-gray-500 overflow-hidden">
          <FontAwesomeIcon
            icon={faCircle}
            className={classNames(
              "h-3 w-3 cursor-pointer py-2 px-3 ",
              mapStore.isDrawing
                ? "text-white bg-gray-700"
                : "text-amber-500 bg-gray-500"
            )}
            onClick={() => mapStore.setIsDrawing(false)}
          />
          <FontAwesomeIcon
            icon={faCircleNodes}
            className={classNames(
              "h-5 w-5 cursor-pointer py-1 px-2",
              !mapStore.isDrawing
                ? "text-white bg-gray-700"
                : "text-amber-500 bg-gray-500"
            )}
            onClick={() => mapStore.setIsDrawing(true)}
          />
        </div>
        <button
          disabled={!clearEnabled}
          className={classNames(
            !clearEnabled ? "text-neutral-700" : "text-gray-100",
            "rounded-full gap-1 flex flex-row px-2 items-center py-[2px] "
          )}
          onClick={() => {
            clearStartStations();
          }}
        >
          <FontAwesomeIcon icon={faRotateLeft} className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
