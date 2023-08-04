import React from "react";
import { CircleMarker, Popup } from "react-leaflet";
import { useMapStore } from "../store/MapStore";

export const PolygonVertices: React.FC = () => {
  const { startShape, removeStartShape } = useMapStore((store) => store);
  return (
    startShape?.map((point) => {
      return (
        <CircleMarker
          center={point.loc}
          pathOptions={{ color: "#FFFFFF", fillOpacity: 1 }}
          radius={5}
          stroke={false}
          eventHandlers={{
            click: (e) => {
              removeStartShape(point.id);
            },
          }}
        ></CircleMarker>
      );
    }) || null
  );
};
