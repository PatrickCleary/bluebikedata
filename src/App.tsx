import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { ComparisonChart } from "./charts/ComparisonChart";
import { MapView } from "./maps/Map";
import { Widget } from "./widgets/widget";

function App() {
  const [selectedStation, setSelectedStation] = useState("S32040");
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 10000, // 10 seconds
      },
    },
  });

  return (
    <div className="w-full h-[100vh] px-4 md:px-4 lg:px-16 py-8 bg-gray-900">
      <QueryClientProvider client={queryClient}>
        <div className="w-full xl:w-3/4 h-[480px] lg:h-[640px]">
          <MapView
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
          />
        </div>
        <Widget stationId={selectedStation} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
