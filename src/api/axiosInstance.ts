import axios, { AxiosInstance } from "axios";

function createAxiosInstance(token?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5100",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return instance;
}

export default createAxiosInstance;
