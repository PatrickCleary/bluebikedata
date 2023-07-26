import React, { SetStateAction } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { fetchAllData } from "../api/all_data";
import { Chart, registerables } from "chart.js";
import { formatData } from "../helpers/dataFormatting";
Chart.register(...registerables);

interface ComparisonChartProps {
  selectedStation: string | undefined;
  setSelectedStation: React.Dispatch<SetStateAction<string>>;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  selectedStation,
  setSelectedStation,
}) => {
  const data_22 = useQuery(["all_stations_2022"], () => fetchAllData("2022"));
  const data_23 = useQuery(["all_stations_2023"], () => fetchAllData("2023"));

  if (data_22.isLoading || data_23.isLoading || !data_22.data || !data_23.data)
    return null;

  const data = formatData(data_22.data, data_23.data);
  const options = {
    scales: {
      y: {
        max: 1,
        min: -1,
        beginAtZero: true,
      },
    },
  };

  return <Bar width={16000} height={360} data={data} options={options} />;
};
