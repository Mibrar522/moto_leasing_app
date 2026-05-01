import axios from "axios";

// Base URL from Vite env - Ensure it ends with /api/v1
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

if (API_BASE_URL && !API_BASE_URL.endsWith("/api/v1")) {
    // Clean trailing slash then append /api/v1
    API_BASE_URL = API_BASE_URL.replace(/\/$/, "") + "/api/v1";
}

// Safety check (prevents silent failures)
if (!API_BASE_URL && import.meta.env.MODE === "production") {
    console.warn("VITE_API_BASE_URL is not defined. Using relative path /api/v1");
    API_BASE_URL = "/api/v1";
} else if (!API_BASE_URL) {
    API_BASE_URL = "http://localhost:10000/api/v1"; // Local default
}

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