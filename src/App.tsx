import React, { useEffect, useState } from "react";
import "./App.css";
import { MapView } from "./maps/Map";
import { Header } from "./components/Header";
import { useSearchParams } from "react-router-dom";
import { useConfigStore } from "./store/ConfigStore";
import { ShapeSelection } from "./components/ShapeSelection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NowDrawingPopup } from "./components/NowDrawingPopup";
import { MobileFilters } from "./components/MobileFilters";
import { Loading } from "./components/Loading";

function App() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadFromParams = useConfigStore((store) => store.loadFromParams);
  useEffect(() => {
    loadFromParams(Object.fromEntries(searchParams.entries()));

  }, [loadFromParams, searchParams])

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
    <div className="h-full w-[100vw] bg-[#222122] gap-y-4 flex flex-col">
      <QueryClientProvider client={queryClient}>
        <div className="absolute z-10 h-full w-full pointer-events-none p-2 flex  flex-col pb-5">
          <Header />
          <ShapeSelection />
          <MobileFilters />
        </div>
        <div className="absolute z-0 h-full w-full">
          <MapView setIsLoading={setIsLoading} />
        </div>
        <NowDrawingPopup />
        {/* <StationCountPopUp /> */}

        {isLoading ? <Loading /> : null}
      </QueryClientProvider>
    </div>
  );
}

export default App;
