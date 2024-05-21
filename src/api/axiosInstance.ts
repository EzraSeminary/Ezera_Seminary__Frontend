import axios, { AxiosInstance } from "axios";

function createAxiosInstance(token?: string): AxiosInstance {
  const instance = axios.create({
    // baseURL: "https://ezra-seminary.me",
    baseURL: "https://ezra-seminary.me",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return instance;
}

export default createAxiosInstance;
