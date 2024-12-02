import React from "react";
import ReactGA from 'react-ga4';
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Main } from "./main";

function App() {
  if (window.location.hostname !== "localhost")
    ReactGA.initialize('G-YLTKJQHRYM')

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: Infinity,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
}

export default App;
