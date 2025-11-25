import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.0.2:8080';

const api = axios.create({
    baseURL: API_URL
});

export default api;