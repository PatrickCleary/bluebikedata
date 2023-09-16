import { LatLngExpression } from "leaflet";
import { create } from "zustand";
import { fetchAllDocks } from "../api/all_data";
import { ShapeSelection } from "../components/ShapeSelection";
import { pointInsidePolygon } from "../helpers/testLocation";

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
  setDocks: (stations: string[] | undefined) => void;
  setOrClearSingleDock: (startStation: string) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  addShapeVertex: (latLng: LatLngExpression) => void;
  deleteShapeVertex: (id: string) => void;
  setShape: (shape: { id: string; loc: LatLngExpression }[]) => void;
  deleteShape: () => void;
  flipShapes: () => void;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  direction: "destination",
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

  setDocks: (docks) => {
    const { direction, selectedDocks } = get();
    return set(() => ({
      selectedDocks: { ...selectedDocks, [direction]: docks },
    }));
  },
  setIsDrawing: (isDrawing) => {
    return set(() => ({ isDrawing: isDrawing }));
  },
  setOrClearSingleDock: (newDocks) => {
    const direction = get().direction;
    const docks = get().selectedDocks;
    if (docks[direction]?.includes(newDocks))
      return set(() => ({
        selectedDocks: { ...docks, [direction]: undefined },
      }));
    return set(() => ({ selectedDocks: { ...docks, [direction]: undefined } }));
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
  flipShapes: () => {
    const shape = get().shape;
    return set(() => ({
      shape: { origin: shape.destination, destination: shape.origin },
    }));
  },
}));

export const useClearDocks = () => {
  const { setDocks, deleteShape } = useSelectionStore((store) => store);
  return () => {
    setDocks(undefined);
    deleteShape();
  };
};

export const useSetDocks = () => {
  const { shape, setDocks, direction } = useSelectionStore((store) => store);
  return async (newShape?: { id: string; loc: LatLngExpression }[]) => {
    const docks = await fetchAllDocks();
    const loadedShapeOrCurrent = newShape ?? shape[direction];
    if (docks && loadedShapeOrCurrent) {
      const docksToSet = Object.values(docks)
        ?.filter((dock) =>
          pointInsidePolygon(
            [dock.Latitude, dock.Longitude],
            loadedShapeOrCurrent
          )
        )
        .map((dock) => dock.id);
      setDocks(docksToSet);
    }
  };
};
