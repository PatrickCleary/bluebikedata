import React from "react";

import "leaflet/dist/leaflet.css";
import { Marker } from "react-leaflet-marker";
import { LatLngExpression } from "leaflet";
import classNames from "classnames";

interface StationMarkerProps {
  position: LatLngExpression;
  name: string;
  isNew: boolean;
}

export const StationMarker: React.FC<StationMarkerProps> = ({
  position,
  name,
  isNew,
}) => {
  return (
    <Marker position={position} placement="top">
      <div
        className={classNames(
          isNew ? "bg-green-500 opacity-80" : "bg-blue-500 opacity-50",
          "absolute rounded-full border border-blue-300 w-2 h-2"
        )}
      ></div>
    </Marker>
  );
};
