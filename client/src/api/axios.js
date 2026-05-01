import axios from "axios";

// Base URL from Vite env - Robust resolution
let envBase = import.meta.env.VITE_API_BASE_URL || "";

// If we have a URL, ensure it doesn't have a trailing slash, then ensure it ends with /api/v1
if (envBase) {
    envBase = envBase.replace(/\/$/, "");
    if (!envBase.endsWith("/api/v1")) {
        envBase += "/api/v1";
    }
} else {
    // Fallback for development/production if variable is missing
    envBase = window.location.hostname === "localhost" 
        ? "http://localhost:10000/api/v1" 
        : "/api/v1";
}

const API_BASE_URL = envBase;

// Create axios instance
const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and potentially redirect
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;