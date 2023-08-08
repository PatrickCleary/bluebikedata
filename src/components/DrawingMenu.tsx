import {
  faArrowCircleRight,
  faCircleXmark,
  faDrawPolygon,
  faHandPointer,
  faICursor,
  faMouse,
  faMousePointer,
  faPencil,
  faRotateLeft,
  faTrash,
  faX,
  faXmark,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import classNames from "classnames";
import React from "react";
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
      <h1 className="text-sm italic w-full text-center">Dock selection</h1>

      <div className="w-full flex flex-row md:px-6 justify-between px-2">
        <div className="w-full flex flex-row gap-2 justify-center md:justify-start">
          <FontAwesomeIcon
            icon={faHandPointer}
            className={classNames(
              "h-6 w-6 cursor-pointer ",
              mapStore.isDrawing ? "text-white" : "text-amber-500"
            )}
            onClick={() => mapStore.setIsDrawing(false)}
          />

          <Switch
            checked={mapStore.isDrawing}
            onChange={() => {
              mapStore.setIsDrawing(!mapStore.isDrawing);
            }}
            className={`${
              mapStore.isDrawing ? "bg-amber-500" : "bg-amber-100"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Enable Drawing Mode</span>
            <span
              className={`${
                mapStore.isDrawing
                  ? "translate-x-6 bg-amber-100"
                  : "translate-x-1 bg-amber-500"
              } inline-block h-4 w-4 transform rounded-full transition`}
            />
          </Switch>
          <FontAwesomeIcon
            icon={faPencil}
            className={classNames(
              "h-6 w-6 cursor-pointer ",
              !mapStore.isDrawing ? "text-white" : "text-amber-500"
            )}
            onClick={() => mapStore.setIsDrawing(true)}
          />
        </div>
        <button
          disabled={!clearEnabled}
          className={classNames(
            !clearEnabled ? "text-neutral-700" : "text-neutral-100",
            "rounded-full gap-1 flex flex-row px-2 items-center py-[2px] "
          )}
          onClick={() => {
            clearStartStations();
          }}
        >
          <FontAwesomeIcon icon={faTrash} className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
