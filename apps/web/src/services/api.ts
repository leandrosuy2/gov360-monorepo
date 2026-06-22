import { createGov360Client } from "@gov360/api-client";

function resolveApiUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (configured && configured !== "http://localhost:3001") {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    return typeof window === "undefined"
      ? (process.env.API_URL ?? "http://127.0.0.1:3001")
      : "";
  }

  return configured || "http://localhost:3001";
}

const apiUrl = resolveApiUrl();

export const api = createGov360Client({
  baseURL: apiUrl,
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },
});
