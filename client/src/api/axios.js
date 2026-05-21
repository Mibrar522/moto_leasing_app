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


const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";
let sessionRedirecting = false;

const decodeJwtPayload = (token) => {
    try {
        const payload = String(token || "").split(".")[1];
        if (!payload) return null;
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
        return JSON.parse(window.atob(padded));
    } catch (_) {
        return null;
    }
};

const isJwtExpired = (token) => {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return false;
    return Number(payload.exp) * 1000 <= Date.now();
};

const redirectToLoginForExpiredSession = () => {
    if (sessionRedirecting) return;
    sessionRedirecting = true;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.setItem("sessionExpiredMessage", SESSION_EXPIRED_MESSAGE);

    if (window.location.pathname !== "/login") {
        window.location.replace("/login");
    }
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
            if (isJwtExpired(token)) {
                redirectToLoginForExpiredSession();
                return Promise.reject(new axios.Cancel(SESSION_EXPIRED_MESSAGE));
            }

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
        const requestUrl = normalizeRequestPath(error?.config?.url || "");
        const isLoginRequest = requestUrl === "/auth/login";

        if (error?.response?.status === 401 && !isLoginRequest && localStorage.getItem("token")) {
            redirectToLoginForExpiredSession();
        }

        return Promise.reject(error);
    }
);

export default API;
