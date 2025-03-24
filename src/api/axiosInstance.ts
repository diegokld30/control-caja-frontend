import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Interceptor para inyectar el token en Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // tu "access" JWT
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
