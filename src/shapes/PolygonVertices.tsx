import React from "react";
import { CircleMarker } from "react-leaflet";
import { COLORS } from "../constants";
import { useConfigStore } from "../store/ConfigStore";
import { useMapStore, useSetStartStations } from "../store/MapStore";

export const PolygonVertices: React.FC = () => {
  const { startShape, removeStartShape } = useMapStore((store) => store);
  const direction = useConfigStore((store) => store.direction)
  const setStartStations = useSetStartStations();
  return (
    <>{
      startShape?.map((point) => {
        return (
          <CircleMarker
            key={point.id}
            center={point.loc}
            pathOptions={{ color: `${COLORS[direction]}80`, fillOpacity: 1 }}
            radius={5}
            stroke={false}
            bubblingMouseEvents={false}
            eventHandlers={{
              click: (e) => {
                removeStartShape(point.id);
                setStartStations();
              },
            }}
          ></CircleMarker>
        );
      }) || null}</>
  );
};
