import React from "react";
import { CircleMarker } from "react-leaflet";
import { COLORS } from "../constants";
import { useSelectionStore, useSetDocks } from "../store/SelectionStore";

export const PolygonVertices: React.FC<{ direction: 'origin' | 'destination' }> = ({ direction }) => {
  const { shape, deleteShapeVertex } = useSelectionStore((store) => store);
  const setDocks = useSetDocks();
  return (
    <>{
      shape[direction]?.map((point) => {
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
                deleteShapeVertex(point.id);
                setDocks();
              },
            }}
          ></CircleMarker>
        );
      }) || null}</>
  );
};
