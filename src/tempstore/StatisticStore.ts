import { create } from "zustand";

interface StatisticStore {
  statistics: { [key: string]: number };

  setStatistic: (statistic: string, value: number) => void;
}

export const useStatisticStore = create<StatisticStore>((set, get) => ({
  statistics: {},
  setStatistic: (statistic, number) => {
    const statistics = get().statistics;
    return set(() => ({ statistics: { ...statistics, [statistic]: number } }));
  },
}));
