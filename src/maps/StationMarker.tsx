import React from "react";
import { LatLngExpression } from "leaflet";
import { CircleMarker, Popup } from "react-leaflet";

interface StationMarkerProps {
  position: LatLngExpression;

  name: string;
  inside: boolean;
  value: number | undefined;
  rides: number | undefined;
}

export const StationMarker: React.FC<StationMarkerProps> = ({
  position,
  name,
  value,
  rides,
  inside,
}) => {
  return (
    <CircleMarker
      center={position}
      color={inside ? "#d97706" : "#38bdf8"}
      fillOpacity={inside ? 1 : 0.5}
      key={`${name}-${inside}`}
      stroke={false}
      radius={inside ? 4 : value ? value * 16 : 16}
    >
      <Popup>
        {name} - {rides}
      </Popup>
    </CircleMarker>
  );
};
