import axios from "axios";

const API_PREFIX = "/api/v1";

const stripTrailingSlash = (value) => String(value || "").replace(/\/+$/, "");

const normalizeApiBaseUrl = (value) => {
    const rawBase = stripTrailingSlash(value);

    if (!rawBase) {
        return window.location.hostname === "localhost"
            ? `http://localhost:10000${API_PREFIX}`
            : API_PREFIX;
    }

    if (/^https?:\/\//i.test(rawBase)) {
        const url = new URL(rawBase);
        url.pathname = stripTrailingSlash(url.pathname);

        if (!url.pathname.endsWith(API_PREFIX)) {
            url.pathname = `${url.pathname}${API_PREFIX}`.replace(/\/{2,}/g, "/");
        }

        return stripTrailingSlash(url.toString());
    }

    return rawBase.endsWith(API_PREFIX) ? rawBase : `${rawBase}${API_PREFIX}`;
};

const normalizeRequestPath = (url = "") => {
    if (/^https?:\/\//i.test(url)) return url;

    return String(url).replace(new RegExp(`^${API_PREFIX}(?=/|$)`), "") || "/";
};

const API = axios.create({
    baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
    (config) => {
        config.url = normalizeRequestPath(config.url);

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
        return Promise.reject(error);
    }
);

export default API;
