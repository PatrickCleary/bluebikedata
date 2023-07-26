import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { ComparisonChart } from "./charts/ComparisonChart";
import { MapView } from "./maps/Map";

function App() {
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
    <div className="w-full h-full px-16 py-8 bg-gray-900">
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-[640px]">
          <MapView />
        </div>
        <div className="flex flex-col overflow-auto  gap-16 pt-8 ">
          <div className="left-2 w-[16000px]">
            <ComparisonChart />
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
