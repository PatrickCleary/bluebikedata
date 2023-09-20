import { LatLngExpression } from "leaflet";

export const pointInsidePolygon = (
  point,
  polygon: { id: string; loc: LatLngExpression }[]
) => {
  const [x, y] = point;
  const n = polygon.length;
  let inside = false;

  for (let i = 0; i < n; i++) {
    const [x1, y1] = [polygon[i].loc[0], polygon[i].loc[1]];
    const [x2, y2] = [polygon[(i + 1) % n].loc[0], polygon[(i + 1) % n].loc[1]];

    if (y > Math.min(y1, y2)) {
      if (y <= Math.max(y1, y2)) {
        if (x <= Math.max(x1, x2)) {
          if (y1 !== y2) {
            const x_intersect = ((y - y1) * (x2 - x1)) / (y2 - y1) + x1;
            if (x <= x_intersect) {
              inside = !inside;
            }
          }
        }
      }
    }
  }
  return inside;
};
