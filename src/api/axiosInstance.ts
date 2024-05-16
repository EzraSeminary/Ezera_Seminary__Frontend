import axios, { AxiosInstance } from "axios";

function createAxiosInstance(token?: string): AxiosInstance {
  const instance = axios.create({
    // baseURL: "https://64.23.192.24",
    baseURL: "https://64.23.192.24",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return instance;
}

export default createAxiosInstance;
