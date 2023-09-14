import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";

import { LayerGroup } from "react-leaflet";
import { fetchAllDocks, useMonthlyDestinations } from "../api/all_data";
import { useBreakpoint } from "../helpers/breakpoints";
import { getSize } from "../helpers/stationMarkerSize";
import { useConfigStore } from "../store/ConfigStore";
import { useMapStore } from "../store/MapStore";

import { DockMarker } from "./DockMarker";

export const StationMarkerFactory: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setIsLoading }) => {
  const configStore = useConfigStore((store) => store);


  const mapStore = useMapStore((store) => store);
  const all_docks = useQuery(["all_docks"], () => fetchAllDocks());

  const data = useMonthlyDestinations(
    configStore.startStations ?? undefined,
    configStore.date.year,
    configStore.date.month
  );
  const isMobile = !useBreakpoint("md");
  const startStationsSelected =
    configStore.startStations && configStore.startStations.length > 0;

  if (!data || !all_docks || !all_docks.data)
    return null;

  const maxSizeMultiplier = Math.log(.0001) / 100;
  setIsLoading(false);

  return (
    <LayerGroup>
      {Object.values(all_docks.data)
        .map((station) => {
          if (
            // startStationsSelected &&
            !data.docks.includes(station.id)
          ) {
            // console.log('no', station.id)
            return null;
          }
          const inside = configStore.startStations?.includes(station.id)
          let absValue = data ? data.totals[station.id] : undefined;
          if (
            startStationsSelected &&
            absValue &&
            absValue < configStore.ridershipMin
          )
            absValue = 0;
          const percentageValue = absValue
            ? Math.max(0.1, 1 - Math.pow(1.2, maxSizeMultiplier * absValue))
            : 0;
          const size = getSize(inside, isMobile, startStationsSelected, absValue, percentageValue)
          return (
            <DockMarker
              position={[station["Latitude"], station["Longitude"]]}
              select={
                mapStore.isDrawing
                  ? undefined
                  : () => {
                    configStore.setOrClearStartStation(station["id"]);
                    mapStore.clearStartShape();
                  }
              }
              key={station["id"]}
              id={station["id"]}
              absValue={absValue}
              startStationsSelected={Boolean(startStationsSelected)}
              isMobile={isMobile}
              name={station["name"]}
              inside={inside ?? false}
              size={size}
            />
          );
        })
        .filter((obj) => obj)}
    </LayerGroup>
  );
};