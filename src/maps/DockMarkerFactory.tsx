import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction, useEffect } from "react";

import { LayerGroup } from "react-leaflet";
import { fetchAllDocks, useMonthlyData } from "../api/all_data";
import { COLORS } from "../constants";
import { useBreakpoint } from "../helpers/breakpoints";
import { getSize } from "../helpers/stationMarkerSize";
import { useConfigStore } from "../store/ConfigStore";
import { setShapeAreas, useSelectionStore, useSelectionType, useShapeArea } from "../store/SelectionStore";
import { DockMarker } from "./DockMarker";

export const StationMarkerFactory: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setIsLoading }) => {
  const configStore = useConfigStore((store) => store);
  const { selectedDocks, isDrawing, setOrClearSingleDock, deleteShape, shape, setBothShapeArea, shapeArea } = useSelectionStore((store) => store);
  const currentShapeArea = useShapeArea();
  const all_docks = useQuery(["all_docks"], () => fetchAllDocks());
  useEffect(() => {
    setShapeAreas(shape, setBothShapeArea)
  }, [shape, setBothShapeArea])
  const data = useMonthlyData(
    selectedDocks,
    configStore.date.year,
    configStore.date.month
  );
  const isMobile = !useBreakpoint("md");
  const docksSelected =
    Boolean(Object.values(selectedDocks).some((dockList) => dockList?.length > 0))

  if (!data || !all_docks || !all_docks.data)
    return null;

  const maxSizeMultiplier = Math.log(.0001) / Math.max(50, (300000 * currentShapeArea));

  setIsLoading(false);

  const isFullSelection = selectedDocks.destination.length > 0 && selectedDocks.origin.length > 0;

  return (
    <LayerGroup>
      {Object.values(all_docks.data)
        .map((station) => {
          if (
            !data.docks.includes(station.id.toString())
          ) {
            return null;
          }
          const insideDestination = selectedDocks.destination.includes(station.id)
          const insideOrigin = selectedDocks.origin.includes(station.id)
          const inside = insideDestination || insideOrigin
          let absValue = data ? data.totals[station.id] : undefined;
          if (
            docksSelected &&
            absValue &&
            absValue < configStore.ridershipMin
          )
            absValue = 0;
          const percentageValue = absValue
            ? Math.max(0.1, 1 - Math.pow(1.2, maxSizeMultiplier * absValue))
            : 0;
          const size = getSize(inside, isMobile, docksSelected, absValue, percentageValue, isFullSelection)
          return (
            <DockMarker
              position={[station["Latitude"], station["Longitude"]]}
              select={
                isDrawing
                  ? undefined
                  : () => {
                    setOrClearSingleDock(station["id"]);
                    deleteShape();
                  }
              }
              key={`${station["id"]}${station["name"]}`}
              id={`${station["id"]}${station["name"]}`}
              absValue={absValue}
              startStationsSelected={Boolean(docksSelected)}
              isMobile={isMobile}
              name={station["name"]}
              inside={inside ?? false}
              color={inside ? COLORS[insideOrigin ? 'origin' : 'destination'] : "#38bdf8"}
              size={size}
            />
          );
        })
        .filter((obj) => obj)}
    </LayerGroup>
  );
};