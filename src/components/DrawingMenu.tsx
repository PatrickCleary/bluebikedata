import {
  faArrowCircleRight,
  faDrawPolygon,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React from "react";
import { useClearStartStations, useConfigStore } from "../store/ConfigStore";
import { useMapStore, useSetOriginDocks } from "../store/MapStore";

export const DrawingMenu = () => {
  const setOriginDocksFromShape = useSetOriginDocks();
  const clearStartStations = useClearStartStations();
  const mapStore = useMapStore((store) => store);
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="text-lg italic w-full">Origin dock selection</h1>

      <div className="w-full flex flex-row px-6">
        <button
          className="w-full"
          onClick={() => mapStore.setIsDrawing(!mapStore.isDrawing)}
        >
          <FontAwesomeIcon
            icon={faPencil}
            size="xl"
            className={classNames(
              mapStore.isDrawing
                ? "bg-white text-green-500"
                : " bg-green-500 text-white",
              " hover:text-green-500 hover:bg-white  p-2 rounded-md"
            )}
          />
        </button>
        <button
          disabled={
            mapStore.startShape === undefined || mapStore.startShape?.length < 1
          }
          className="w-full"
          onClick={() => {
            setOriginDocksFromShape();
            clearStartStations();
          }}
        >
          <FontAwesomeIcon
            icon={faTrash}
            size="xl"
            className={classNames(
              mapStore.startShape === undefined ||
                mapStore.startShape?.length < 1
                ? "bg-neutral-600"
                : "bg-red-500",
              " text-white-100 p-2 rounded-md"
            )}
          />
        </button>
        <button
          className="w-full"
          onClick={() => {
            setOriginDocksFromShape();
            mapStore.setIsDrawing(false);
          }}
          disabled={!(mapStore.startShape && mapStore.startShape.length >= 3)}
        >
          <FontAwesomeIcon
            icon={faArrowCircleRight}
            size="xl"
            className={classNames(
              mapStore.startShape && mapStore.startShape.length >= 3
                ? "bg-sky-400"
                : "bg-neutral-600",
              "text-white p-2 rounded-md"
            )}
          />
        </button>
      </div>
    </div>
  );
};
