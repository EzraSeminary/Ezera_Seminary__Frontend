import axios from "axios";

function createAxiosInstance(token: string) {
  const instance = axios.create({
    // baseURL: "http://localhost:5100",
    baseURL: "https://ezra-seminary.mybese.tech",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return instance;
}

export default createAxiosInstance;
