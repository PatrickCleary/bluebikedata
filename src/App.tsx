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
    <div className="w-full h-min-[100vh] h-full px-4 md:px-2 lg:px-8 xl:px-16 py-4 bg-[#222122] gap-y-4 flex flex-col">
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="grid md:grid-cols-4 gap-4 w-full">
          <div className="md:col-span-3 w-full ">
            <div className="w-full h-[480px] md:h-[440px] 3xl:h-[640px] relative">
              <MapView />
            </div>
            <Widget />
          </div>
          <ShapeSelection />
          <ContactAndInfo />
        </div>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
