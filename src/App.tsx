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
    <div className="w-full h-full">
      <QueryClientProvider client={queryClient}>
        <div className="w-full h-[512px]">
          <MapView />
        </div>
        <div className="flex flex-col gap-16 py-16 px-16">
          <div className="h-64 left-2 overflow-auto w-[4000px]">
            <ComparisonChart />
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
}

export default App;
