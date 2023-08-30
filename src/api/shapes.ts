import { v4 as uuidv4 } from "uuid";
import { LatLngExpression } from "leaflet";
import { API_URL } from "../constants/api";

export const saveShape = async (
  shape: { id: string; loc: LatLngExpression }[]
) => {
  const id = uuidv4().slice(0, 8);
  const body = { id: id, shape: shape };
  const response = await fetch(`/api/saveshape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to save shape.");
  }
  return id;
};

export const getShape = async (id: string) => {
  console.log(id);
  const url = new URL(`${API_URL}/api/getshape`, window.location.origin);
  url.searchParams.append("id", id);
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch shape");
  return await response.json();
};
