import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";

import { LayerGroup } from "react-leaflet";
import { fetchAllData, useMonthlyDestinations } from "../api/all_data";
import { useBreakpoint } from "../helpers/breakpoints";
import { getSize } from "../helpers/stationMarkerSize";
import { useConfigStore } from "../store/ConfigStore";
import { useMapStore } from "../store/MapStore";
import { StationTrip } from "../types/Data";
import { DockMarker } from "./DockMarker";

export const StationMarkerFactory: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setIsLoading }) => {
  const configStore = useConfigStore((store) => store);


  const mapStore = useMapStore((store) => store);
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  const data = useMonthlyDestinations(
    configStore.startStations ?? [],
    configStore.date.year,
    configStore.date.month
  );
  const isMobile = !useBreakpoint("md");
  const startStationsSelected =
    configStore.startStations && configStore.startStations.length > 0;

  if (!data || !data_23 || !data_23.data)
    return null;

  const maxSizeMultiplier = Math.log(.0001) / 100;
  setIsLoading(false);
  return (
    <LayerGroup>
      {Object.values(data_23.data)
        .map((station: StationTrip) => {
          if (
            startStationsSelected &&
            !data[station.id]
          )
            return null;

          const inside = configStore.startStations?.includes(station.id)
          let absValue = data ? data[station.id] : undefined;
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
              position={[station["latitude"], station["longitude"]]}
              select={
                mapStore.isDrawing
                  ? undefined
                  : () => {
                    configStore.setOrClearStartStation(station["id"]);
                    mapStore.clearStartShape();
                  }
              }
              key={station["id"]}
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