import { Console } from "console";
import { LatLngExpression } from "leaflet";
import { create } from "zustand";
import { fetchAllDocks } from "../api/all_data";
import { getArea, pointInsidePolygon } from "../helpers/polygonHelpers";
import { Shape, ShapeVertex } from "../types/apis";

export type Direction = "destination" | "origin";

interface SelectionStore {
  direction: Direction;
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
  shapeArea: {
    origin: number;
    destination: number;
  };
  setBothShapeArea: (shapeArea: {
    origin: number;
    destination: number;
  }) => void;
  setDirection: (direction?: Direction) => void;
  setDocks: (docks: { origin: string[]; destination: string[] }) => void;
  setOrClearSingleDock: (startStation: string) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  addShapeVertex: (latLng: LatLngExpression) => void;
  deleteShapeVertex: (id: string) => void;
  setShape: (
    shape: { id: string; loc: LatLngExpression }[],
    directionInput?: Direction
  ) => void;
  setBothShapes: (shape: Shape) => void;
  deleteShape: () => void;
  flipDocks: () => void;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  direction: "origin",
  selectedDocks: { origin: [], destination: [] },
  isDrawing: false,
  shapeArea: { origin: 0, destination: 0 },
  id: {
    origin: 0,
    destination: 0,
  },
  shape: { origin: [], destination: [] },
  setBothShapeArea: (shapeArea) => set(() => ({ shapeArea: shapeArea })),
  setDirection: (direction) => {
    if (direction) return set(() => ({ direction: direction }));
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
  setBothShapes: (shape) => set(() => ({ shape: shape })),
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
  setShape: (newShape, directionInput) => {
    const { direction, shape, id } = get();
    const directionToSet = directionInput ?? direction;

    return set(() => ({
      shape: { ...shape, [directionToSet]: newShape },
      id: { ...id, [directionToSet]: newShape.length },
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
      shape: { ...shape, [direction]: currentShape },
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
    getArea(loadedShapeOrCurrent.destination);
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
  if (selectedDocks.destination.length > 0 || shape.destination.length > 0)
    return "destination";
  return "none";
};

export const useSetNewShapeAndDocks = () => {
  const { selectedDocks, setDocks, setShape, direction } = useSelectionStore(
    (store) => store
  );
  return async (
    shapeInput: ShapeVertex[],
    directionInput?: "origin" | "destination"
  ) => {
    const directionToSet = directionInput ?? direction;
    const docks = await fetchAllDocks();
    setShape(shapeInput, directionToSet);
    const newDocks = Object.values(docks)
      ?.filter((dock) => {
        return pointInsidePolygon([dock.Latitude, dock.Longitude], shapeInput);
      })
      .map((dock) => dock.id);
    setDocks({ ...selectedDocks, [directionToSet]: newDocks });
  };
};

export const useShapeArea = () => {
  const selectionType = useSelectionType();
  const shapeArea = useSelectionStore((store) => store.shapeArea);
  if (selectionType !== "origin" && selectionType !== "destination")
    return 0.0005;
  console.log(shapeArea[selectionType]);
  if (shapeArea[selectionType]) return shapeArea[selectionType];
  return 0.0005;
};

export const useSetBothShapesAndDocks = () => {
  const { setBothShapes, setDocks } = useSelectionStore((store) => store);
  return async (
    shapeInput: Shape,
    singleDocks: {
      origin: string | undefined;
      destination: string | undefined;
    }
  ) => {
    const docks = await fetchAllDocks();
    setBothShapes(shapeInput);
    const docksToSet: { origin: string[]; destination: string[] } = {
      origin: singleDocks.origin ? [singleDocks.origin] : [],
      destination: singleDocks.destination ? [singleDocks.destination] : [],
    };
    Object.entries(shapeInput).forEach(([direction, shape]) => {
      if (!shape.length) return;
      const newDocks = Object.values(docks)
        ?.filter((dock) => {
          return pointInsidePolygon([dock.Latitude, dock.Longitude], shape);
        })
        .map((dock) => dock.id);
      docksToSet[direction] = newDocks;
    });
    setDocks(docksToSet);
  };
};

export const setShapeAreas = (
  shape: Shape,
  setBothShapeArea: (shapeArea: { origin: number; destination: number }) => void
) => {
  const shapeArea = { origin: 0, destination: 0 };
  Object.entries(shape).forEach(([label, value]) => {
    shapeArea[label] = getArea(value);
  });
  setBothShapeArea(shapeArea);
};
