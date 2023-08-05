import React from "react";
import "./App.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MapView } from "./maps/Map";
import { Widget } from "./widgets/widget";
import { Header } from "./components/Header";
import { useSearchParams } from "react-router-dom";
import { useConfigStore } from "./store/ConfigStore";
import { ShapeSelection } from "./components/ShapeSelection";
import { ContactAndInfo } from "./components/ContactAndInfo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NowDrawingPopup } from "./components/NowDrawingPopup";

function App() {
  const [searchParams] = useSearchParams();
  const loadFromParams = useConfigStore((store) => store.loadFromParams);
  loadFromParams(Object.fromEntries(searchParams.entries()));
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
    <div className="h-[100vh] w-[100vw] bg-[#222122] gap-y-4 flex flex-col">
      <QueryClientProvider client={queryClient}>
        <div className="absolute z-10 h-full w-full pointer-events-none">
          <Header />

          <ShapeSelection />
          <ContactAndInfo />
        </div>
        <div className="absolute z-0 h-full w-full">
          <MapView />
        </div>
        <NowDrawingPopup />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
