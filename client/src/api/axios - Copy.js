import axios from 'axios';

const API_BASE_URL = 'http://192.168.8.119:6001/api/v1';

const API = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach JWT for secure routes (Admin/Lease)
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
