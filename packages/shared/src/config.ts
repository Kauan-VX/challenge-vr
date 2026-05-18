const inject = typeof process !== "undefined" ? process.env.API_BASE_URL : undefined;

export const API_BASE_URL = inject ?? "https://dummyjson.com";
