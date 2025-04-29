import axios from "axios";

// export const baseUrl = "http://localhost:8000";
export const baseUrl = "https://be-bpool.vercel.app/";

export const publicClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để thêm token vào privateClient
privateClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

