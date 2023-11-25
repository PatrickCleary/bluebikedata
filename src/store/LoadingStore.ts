import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;

  setIsLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<LoadingStore>((set, get) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading: isLoading })),
}));
