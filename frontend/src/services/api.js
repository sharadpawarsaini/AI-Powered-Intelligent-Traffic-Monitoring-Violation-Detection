import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('traffic_ai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const analyticsAPI = {
  getSummary: async () => {
    const res = await api.get('/analytics/summary');
    return res.data;
  }
};

export const eventsAPI = {
  getEvents: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data;
  },
  getViolations: async (params = {}) => {
    const res = await api.get('/events/violations', { params });
    return res.data;
  },
  getAccidents: async (params = {}) => {
    const res = await api.get('/events/accidents', { params });
    return res.data;
  }
};

export const camerasAPI = {
  getCameras: async () => {
    const res = await api.get('/cameras');
    return res.data;
  },
  createCamera: async (data) => {
    const res = await api.post('/cameras', data);
    return res.data;
  }
};

export const assistantAPI = {
  query: async (queryText) => {
    const res = await api.post('/assistant/query', { query: queryText });
    return res.data;
  }
};

export const reportsAPI = {
  getCSVReportUrl: () => `${API_BASE_URL}/reports/daily/csv`
};

export default api;
