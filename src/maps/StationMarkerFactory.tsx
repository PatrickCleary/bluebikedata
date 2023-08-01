import { useQuery } from "@tanstack/react-query";
import { MarkerLayer } from "react-leaflet-marker";
import { fetchAllData } from "../api/all_data";
import { useMultipleDestinationsData } from "../api/destinations";
import { formatDestinations } from "../helpers/formatDestinations";
import {
  useAddOrRemoveStartStation,
  useConfigStore,
  useUpdateStation,
} from "../store/ConfigStore";
import { StationTrip } from "../types/Data";
import { StationMarker } from "./StationMarker";

export const StationMarkerFactory: React.FC<{
  stationId: string | undefined;
}> = ({ stationId }) => {
  const configStore = useConfigStore((store) => store);
  const updateStation = useUpdateStation();
  const addOrRemoveStation = useAddOrRemoveStartStation();
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  const destinationsData = useMultipleDestinationsData(
    configStore.startStations ?? []
  );
  const formattedDestinationsData = destinationsData
    .map((query) => query.data)
    .filter((entry) => entry !== undefined);

  console.log(configStore.startStations);
  const destinations = formatDestinations(formattedDestinationsData);
  if (data_23.isError || data_23.isLoading || !data_23.data || !data_22.data)
    return null;
  return (
    <MarkerLayer>
      {Object.values(data_23.data)
        .map((station: StationTrip) => {
          if (station.values["all"]?.total < configStore.ridershipMin)
            return null;
          if (!destinations[station.id] && configStore.startStations?.length)
            return null;
          const lat = station["latitude"];
          const lng = station["longitude"];
          const isNew = data_22.data[station.id] == null;
          const selected = Boolean(
            configStore.startStations?.includes(station.id)
          );
          // const value =
          //   (data_23.data[station.id]?.values[configStore.distance]?.[
          //     configStore.metric
          //   ] -
          //     data_22.data[station.id]?.values[configStore.distance]?.[
          //       configStore.metric
          //     ]) /
          //   data_22.data[station.id]?.values[configStore.distance]?.[
          //     configStore.metric
          //   ];
          const value = configStore.startStations
            ? Math.min(1, destinations[station.id] / 100)
            : 1;

          return (
            <StationMarker
              isNew={isNew}
              id={station.id}
              position={[lat, lng]}
              key={station["id"]}
              name={station["name"]}
              selected={selected}
              onClick={() => addOrRemoveStation(station.id)}
              value={value}
            />
          );
        })
        .filter((obj) => obj)}
    </MarkerLayer>
  );
};
