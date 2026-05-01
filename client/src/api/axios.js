import axios from "axios";

// Base URL from Vite env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Safety check (prevents silent failures)
if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined in .env file");
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

export default API;