import { API_URL } from "../constants/api";
import { SaveConfigParams } from "../types/apis";

export const saveConfig = async (params: SaveConfigParams) => {
  const response = await fetch(`${API_URL}/api/saveconfig`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error("Failed to save shape.");
  }
  return params.id;
};

export const getConfig = async (id: string) => {
  const url = new URL(`${API_URL}/api/getconfig`, window.location.origin);
  url.searchParams.append("id", id);
  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Failed to fetch shape");
  return await response.json();
};
