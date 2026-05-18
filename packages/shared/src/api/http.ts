import axios from "axios";
import { API_BASE_URL } from "../config";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.response) return `${fallback} (${error.response.status})`;
    if (error.code === "ECONNABORTED") return `${fallback} (timeout)`;
    return error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
