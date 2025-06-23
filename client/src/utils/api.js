import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://data-compression-decompression.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.error(
      "Response error:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const compressFile = async (fileId, algorithm) => {
  const response = await api.post(`/api/compress/${fileId}/${algorithm}`, {
    action: "compress",
  });
  return response.data;
};

export const compressAllAlgorithms = async (fileId) => {
  const response = await api.post(`/api/compress/${fileId}/all`);
  return response.data;
};

export const decompressFile = async (fileId, algorithm) => {
  const { data } = await api.post(`/api/compress/${fileId}/${algorithm}`, {
    action: "decompress",
  });
  return data;
};

export const downloadFile = (filename) => {
  const encodedFilename = encodeURIComponent(filename);
  return `${API_URL}/api/files/download/${encodedFilename}`;
};

export const getFileStats = async (fileId) => {
  const response = await api.get(`/api/files/stats/${fileId}`);
  return response.data;
};

export const getAllFiles = async () => {
  const response = await api.get("/api/files");
  return response.data;
};

export const getFile = async (fileId) => {
  const response = await api.get(`/api/files/${fileId}`);
  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await api.delete(`/api/files/${fileId}`);
  return response.data;
};

export default api;
