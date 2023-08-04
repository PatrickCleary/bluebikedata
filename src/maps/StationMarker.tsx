import React from "react";
import { LatLngExpression } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";

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
  return (
    <CircleMarker center={position}>
      <Popup>{name}</Popup>
    </CircleMarker>
  );
};
