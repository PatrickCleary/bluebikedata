import React from "react";

import "leaflet/dist/leaflet.css";
import { Marker } from "react-leaflet-marker";
import { LatLngExpression } from "leaflet";
import classNames from "classnames";
import { getDivergingColor } from "../helpers/colors";

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
  const color = getDivergingColor(value);
  return (
    <Marker position={position} placement="top" riseOnHover={true}>
      <div
        className="absolute flex items-center justify-center cursor-pointer h-6 w-6 group"
        onClick={() => onClick(id)}
      >
        {selected ? (
          <>
            <div className="h-[2px] w-[100px] bg-red-500 absolute rotate-45" />
            <div className="h-[100px] w-[2px] bg-red-500 rotate-45 absolute " />
          </>
        ) : null}
        <div
          className={classNames(
            isNew ? "border border-green-500" : "",
            selected ? "opacity-100 w-6 h-6" : "opacity-80 w-2 h-2",
            "absolute rounded-full w-3 h-3 group-hover:opacity-100 items-center justify-center flex overflow-visible"
          )}
          style={{ backgroundColor: color }}
        ></div>
      </div>
    </Marker>
  );
};
