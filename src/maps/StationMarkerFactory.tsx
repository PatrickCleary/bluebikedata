import { useQuery } from "@tanstack/react-query";
import { LayerGroup } from "react-leaflet";
import { fetchAllData } from "../api/all_data";
import { useMultipleDestinationsData } from "../api/destinations";
import { formatDestinations } from "../helpers/formatDestinations";
import { pointInsidePolygon } from "../helpers/testLocation";
import { useConfigStore } from "../store/ConfigStore";
import { useMapStore } from "../store/MapStore";
import { StationTrip } from "../types/Data";
import { StationMarker } from "./StationMarker";

export const StationMarkerFactory: React.FC = () => {
  const configStore = useConfigStore((store) => store);
  const mapStore = useMapStore((store) => store);
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  const destinationsData = useMultipleDestinationsData(
    configStore.startStations ?? []
  );
  const formattedDestinationsData = destinationsData
    .map((query) => query.data)
    .filter((entry) => entry !== undefined);

  const destinations = formatDestinations(formattedDestinationsData);
  if (data_23.isError || data_23.isLoading || !data_23.data || !data_22.data)
    return null;
  return (
    <LayerGroup>
      {Object.values(data_23.data)
        .map((station: StationTrip) => {
          const inside = mapStore.startShape
            ? pointInsidePolygon(
                [station.latitude, station.longitude],
                mapStore.startShape
              )
            : false;
          if (station.values["all"]?.total < configStore.ridershipMin)
            return null;
          if (!destinations[station.id] && configStore.startStations?.length)
            return null;
          const value = Math.max(
            0.25,
            Math.min(destinations[station.id] / 50, 1)
          );
          const lat = station["latitude"];
          const lng = station["longitude"];
          return (
            <StationMarker
              position={[lat, lng]}
              key={station["id"]}
              value={value}
              rides={destinations[station.id]}
              name={station["name"]}
              inside={inside}
            />
          );
        })
        .filter((obj) => obj)}
    </LayerGroup>
  );
};
