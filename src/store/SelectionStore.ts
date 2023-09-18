import { LatLngExpression } from "leaflet";
import { create } from "zustand";
import { fetchAllDocks } from "../api/all_data";
import { pointInsidePolygon } from "../helpers/testLocation";
import { Shape } from "../types/apis";

interface SelectionStore {
  direction: "destination" | "origin";
  selectedDocks: {
    origin: string[];
    destination: string[];
  };
  id: {
    origin: number;
    destination: number;
  };
  isDrawing: boolean;
  shape: {
    origin: { id: string; loc: LatLngExpression }[];
    destination: { id: string; loc: LatLngExpression }[];
  };
  switchDirections: () => void;
  setDocks: (docks: { origin: string[]; destination: string[] }) => void;
  setOrClearSingleDock: (startStation: string) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  addShapeVertex: (latLng: LatLngExpression) => void;
  deleteShapeVertex: (id: string) => void;
  setShape: (shape: { id: string; loc: LatLngExpression }[]) => void;
  deleteShape: () => void;
  flipDocks: () => void;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  direction: "origin",
  selectedDocks: { origin: [], destination: [] },
  isDrawing: false,
  id: {
    origin: 0,
    destination: 0,
  },
  shape: { origin: [], destination: [] },
  switchDirections: () => {
    if (get().direction === "origin")
      return set(() => ({ direction: "destination" }));
    return set(() => ({ direction: "origin" }));
  },
  setDocks: (docks) =>
    set(() => ({
      selectedDocks: docks,
    })),
  setIsDrawing: (isDrawing) => {
    return set(() => ({ isDrawing: isDrawing }));
  },
  setOrClearSingleDock: (newDock) => {
    const direction = get().direction;
    const docks = get().selectedDocks;
    if (docks[direction]?.includes(newDock))
      return set(() => ({
        selectedDocks: { ...docks, [direction]: [] },
      }));
    return set(() => ({ selectedDocks: { ...docks, [direction]: [newDock] } }));
  },
  addShapeVertex: (latLng) => {
    const { direction, shape, id } = get();
    const currentShape = shape[direction];
    const currentId = id[direction];
    currentShape?.push({ id: currentId.toString(), loc: latLng });
    return set(() => ({
      id: { ...id, [direction]: currentId + 1 },
      shape: { ...shape, [direction]: currentShape },
    }));
  },
  setShape: (newShape) => {
    const { direction, shape, id } = get();

    return set(() => ({
      shape: { ...shape, [direction]: newShape },
      id: { ...id, [direction]: newShape.length },
    }));
  },
  deleteShapeVertex: (id) => {
    const { shape, direction } = get();
    const currentShape = shape[direction];
    currentShape?.splice(
      currentShape?.findIndex((point) => point.id === id),
      1
    );
    return set(() => ({
      shape: { ...shape, direction: currentShape },
    }));
  },
  deleteShape: () => {
    const { direction, shape, id } = get();
    return set(() => ({
      shape: { ...shape, [direction]: [] },
      id: { ...id, [direction]: 0 },
    }));
  },
  flipDocks: () => {
    const { shape, selectedDocks } = get();
    return set(() => ({
      shape: { origin: shape.destination, destination: shape.origin },
      selectedDocks: {
        origin: selectedDocks.destination,
        destination: selectedDocks.origin,
      },
    }));
  },
}));

export const useClearDocks = () => {
  const { setDocks, direction, selectedDocks, deleteShape } = useSelectionStore(
    (store) => store
  );
  return () => {
    setDocks({ ...selectedDocks, [direction]: [] });
    deleteShape();
  };
};

export const useSetDocks = () => {
  const { shape, setDocks } = useSelectionStore((store) => store);
  return async (newShape?: Shape) => {
    const docks = await fetchAllDocks();
    const loadedShapeOrCurrent = newShape ?? shape;
    if (!docks || !loadedShapeOrCurrent) return null;
    const newDocks = { origin: [], destination: [] };
    Object.entries(loadedShapeOrCurrent).forEach(
      ([direction, directionalShape]) => {
        newDocks[direction] = Object.values(docks)
          ?.filter((dock) => {
            if (!directionalShape) return null;
            return pointInsidePolygon(
              [dock.Latitude, dock.Longitude],
              directionalShape
            );
          })
          .map((dock) => dock.id);
      }
    );

    setDocks(newDocks);
  };
};

export const useSelectionType = () => {
  const { shape, selectedDocks } = useSelectionStore((store) => store);
  if (
    (shape.origin.length > 0 || selectedDocks.origin.length > 0) &&
    (shape.destination.length > 0 || selectedDocks.destination.length > 0)
  )
    return "both";
  if (selectedDocks.origin.length > 0 || shape.origin.length > 0)
    return "origin";
  return "destination";
};

export const useIsDoubleSelection = () => {
  const { shape, selectedDocks } = useSelectionStore((store) => store);
  return (
    (shape.origin.length > 0 || selectedDocks.origin.length > 0) &&
    (shape.destination.length > 0 || selectedDocks.destination.length > 0)
  );
};
