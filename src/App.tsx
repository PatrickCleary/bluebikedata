import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
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
    <div className="w-full h-min-[100vh] h-full px-4 md:px-2 lg:px-8 xl:px-16 py-4 bg-gray-900 gap-y-4 flex flex-col">
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="grid md:grid-cols-4 gap-4 w-full">
          <div className="md:col-span-3 w-full ">
            <div className="w-full h-[480px] md:h-[440px] 3xl:h-[640px] relative">
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
