import React from "react";

import "leaflet/dist/leaflet.css";
import { Marker } from "react-leaflet-marker";
import { LatLngExpression } from "leaflet";
import classNames from "classnames";
import { getDivergingColor } from "../helpers/colors";
import { useMapStore } from "../store/MapStore";
import { zoomLevelToMarkerSize } from "../constants";

interface StationMarkerProps {
  position: LatLngExpression;
  id: string;
  name: string;
  isNew: boolean;
  selected: boolean;
  value: number;

  onClick: (stationId: string) => void;
}

export const StationMarker: React.FC<StationMarkerProps> = ({
  position,
  id,
  name,
  selected,
  value,
  onClick,
  isNew,
}) => {
  const size = { width: `${8 + value * 16}px`, height: `${8 + value * 16}px` };
  const color = getDivergingColor(value);
  // const size = zoomLevelToMarkerSize(mapZoom);
  return (
    <Marker position={position} placement="center" riseOnHover={true}>
      <div
        className={classNames(
          "absolute flex items-center justify-center cursor-pointer group"
        )}
        style={size}
        onClick={() => onClick(id)}
      >
        {selected ? (
          <>
            <div
              className={classNames(
                "absolute bg-transparent border-white border h-full w-full"
              )}
            />
          </>
        ) : null}
        <div
          className={classNames(
            isNew ? "border border-green-500" : "",
            "absolute rounded-full group-hover:opacity-100 items-center justify-center flex overflow-visible h-full w-full",
            selected ? "opacity-100" : "opacity-80"
          )}
          style={{ backgroundColor: color }}
        ></div>
      </div>
    </Marker>
  );
};
