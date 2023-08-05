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
  let total_out = 0;
  let total = 0;
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
          if (!data[station.id] && configStore.startStations?.length)
            return null;
          const value = data[station.id];
          if (value < configStore.ridershipMin) return null;
          if (!inside) total_out += value;
          total += value;
          // console.log("total:", total);
          // console.log("total_out:", total_out);
          const pct_value = Math.max(
            0.15,
            Math.min(1 - Math.exp(-0.03 * value), 1)
          );
          return (
            <StationMarker
              position={[station["latitude"], station["longitude"]]}
              key={station["id"]}
              value={pct_value}
              rides={value}
              name={station["name"]}
              inside={inside}
            />
          );
        })
        .filter((obj) => obj)}
    </LayerGroup>
  );
};
