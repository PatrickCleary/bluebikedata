import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { ComparisonChart } from "./charts/ComparisonChart";
import { MapView } from "./maps/Map";
import { StationsByRidership } from "./components/StationsByRidership";
import { Widget } from "./widgets/widget";
import { Header } from "./components/Header";

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
    <div className="w-full h-[100vh] px-4 md:px-4 lg:px-8 xl:px-16 py-8 bg-gray-900">
      <QueryClientProvider client={queryClient}>
        <div className="grid xl:grid-cols-4 gap-4">
          <Header />
          <div className="xl:col-span-3">
            <div className="w-full h-[480px] lg:h-[640px]">
              <MapView
                selectedStation={selectedStation}
                setSelectedStation={setSelectedStation}
              />
            </div>
            <Widget stationId={selectedStation} />
          </div>
          <StationsByRidership
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
          />
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
