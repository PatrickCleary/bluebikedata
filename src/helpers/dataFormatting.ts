import { StationTrip, StationTripMap } from "../types/Data";

const trips = "all";
const metric = "total";

export const formatData = (
  before_data: StationTripMap,
  after_data: StationTripMap
) => {
  const before_data_array = Object.values(before_data);
  before_data_array.sort(
    (valueA: StationTrip, valueB: StationTrip) =>
      valueB["values"]["all"]["total"] - valueA["values"]["all"]["total"]
  );
  const labels = before_data_array.map((value: StationTrip) => value["name"]);
  const data = before_data_array
    .map((entry: StationTrip) => {
      return (
        (after_data[entry.id]?.["values"]?.[trips]?.[metric] -
          entry["values"]?.[trips]?.[metric]) /
        entry["values"]?.[trips]?.[metric]
      );
    })
    .filter((value) => value);

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        label: "2022",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
};
