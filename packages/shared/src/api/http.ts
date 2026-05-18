import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config";

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

const NETWORK_ERROR = "Sem conexão com o servidor";
const TIMEOUT_ERROR = "A requisição demorou demais para responder";

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      throw new ApiError(TIMEOUT_ERROR, undefined, error.code);
    }
    if (!error.response) {
      throw new ApiError(NETWORK_ERROR, undefined, error.code);
    }
    const status = error.response.status;
    const message = describeStatus(status);
    throw new ApiError(message, status, error.code);
  },
);

function describeStatus(status: number): string {
  if (status >= 500) return "Falha no servidor. Tente novamente em instantes";
  if (status === 404) return "Recurso não encontrado";
  if (status === 401 || status === 403) return "Acesso não autorizado";
  if (status === 400) return "Requisição inválida";
  return `Falha na requisição (${status})`;
}
