import { useQuery } from "react-query";
import { fetchAllData } from "../api/all_data";
import { StationTrip } from "../types/Data";
import { StationMarker } from "./StationMarker";

export const StationMarkerFactory = () => {
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));
  if (data_23.isError || data_23.isLoading || !data_23.data || !data_22.data)
    return null;
  return (
    <>
      {Object.values(data_23.data).map((station: StationTrip) => {
        const lat = station["latitude"];
        const lng = station["longitude"];
        const isNew = data_22.data[station.id] == null;
        return (
          <StationMarker
            isNew={isNew}
            position={[lat, lng]}
            key={station["id"]}
            name={station["name"]}
          />
        );
      })}
    </>
  );
};
