import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";

import { LayerGroup } from "react-leaflet";
import { fetchAllData } from "../api/all_data";
import { useMultipleDestinationsData } from "../api/destinations";
import { Loading } from "../components/Loading";
import { MAX_STATIONS } from "../constants";
import { useBreakpoint } from "../helpers/breakpoints";
import { formatDestinations } from "../helpers/formatDestinations";
import { pointInsidePolygon } from "../helpers/testLocation";
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
  const isMobile = !useBreakpoint("md");
  const startStationsSelected =
    configStore.startStations && configStore.startStations.length > 0;

  const destinationsData = useMultipleDestinationsData(
    configStore.startStations ?? [],
    configStore.startStations &&
      configStore.startStations.length <= MAX_STATIONS
  );
  const formattedDestinationsData_2023 = destinationsData["2023"]
    .map((query) => query.data)
    .filter((entry) => entry !== undefined);
  const formattedDestinationsData_2022 = destinationsData["2022"]
    .map((query) => query.data)
    .filter((entry) => entry !== undefined);

  const destinations_23 = formatDestinations(formattedDestinationsData_2023);
  const destinations_22 = formatDestinations(formattedDestinationsData_2022);
  if (data_23.isError || data_23.isLoading || !data_23.data || !data_22.data)
    return null;
  const data = configStore.date === "2023" ? destinations_23 : destinations_22;
  const docksList = configStore.date === "2023" ? data_23 : data_22;

  if (destinationsData[configStore.date].some((query) => query.isLoading)) {
    setIsLoading(true);
    return null;
  }
  setIsLoading(false);
  return (
    <LayerGroup>
      {Object.values(data_23.data)
        .map((station: StationTrip) => {
          if (
            startStationsSelected &&
            !destinations_22[station.id] &&
            !destinations_23[station.id]
          )
            return null;
          const inside = mapStore.startShape
            ? pointInsidePolygon(
                [station.latitude, station.longitude],
                mapStore.startShape
              )
            : false;
          let absValue = data ? data[station.id] : undefined;
          if (startStationsSelected && absValue < configStore.ridershipMin)
            absValue = 0;

          const percentageValue = absValue
            ? Math.max(0.1, Math.min(1 - Math.exp(-0.03 * absValue), 1))
            : 0;
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
              inside={
                (inside ||
                  configStore.startStations?.includes(station["id"])) ??
                false
              }
            />
          );
        })
        .filter((obj) => obj)}
    </LayerGroup>
  );
};
