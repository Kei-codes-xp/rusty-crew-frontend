import axios from "axios";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const TOKEN_KEY = "token";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.log("401 from:", error.config.url);

      if (typeof window !== "undefined") {
        const isLoginPage = window.location.pathname === "/login";

        if (!isLoginPage) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;