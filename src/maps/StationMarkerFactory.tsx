import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";

import { LayerGroup } from "react-leaflet";
import { fetchAllData, useMonthlyDestinations } from "../api/all_data";
import { useBreakpoint } from "../helpers/breakpoints";
import { getSize } from "../helpers/stationMarkerSize";
import { useConfigStore } from "../store/ConfigStore";
import { useMapStore } from "../store/MapStore";
import { StationTrip } from "../types/Data";
import { StationMarker } from "./StationMarker";

export const StationMarkerFactory: React.FC<{
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setIsLoading }) => {
  const configStore = useConfigStore((store) => store);


  const mapStore = useMapStore((store) => store);
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));
  const data_22_static = useMonthlyDestinations(
    configStore.startStations ?? [],
    "2022"
  );
  const data_23_static = useMonthlyDestinations(
    configStore.startStations ?? [],
    "2023"
  );
  const isMobile = !useBreakpoint("md");
  const startStationsSelected =
    configStore.startStations && configStore.startStations.length > 0;

  if (!data_23_static || !data_22_static || !data_23.data || data_23.isError)
    return null;
  const data = configStore.date === "2023" ? data_23_static : data_22_static;

  const maxSizeMultiplier = Math.log(.0001) / 100;
  setIsLoading(false);
  return (
    <LayerGroup>
      {Object.values(data_23.data)
        .map((station: StationTrip) => {
          if (
            startStationsSelected &&
            !data_23_static[station.id] &&
            !data_22_static[station.id]
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
            <StationMarker
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
              percentageValue={percentageValue}
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