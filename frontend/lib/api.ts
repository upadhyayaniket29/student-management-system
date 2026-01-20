import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  studentSignup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/student/signup', data),
  adminSignup: (data: { name: string; email: string; password: string; adminSecretKey: string }) =>
    api.post('/auth/admin/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Student API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id: string) => api.get(`/students/${id}`),
  updateStatus: (id: string, isActive: boolean) =>
    api.patch(`/students/${id}/status`, { isActive }),
  getProfile: () => api.get('/students/profile/me'),
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/students/profile/me', data),
  uploadProfilePicture: (formData: FormData) => {
    return api.post('/students/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getActivity: (id: string) => api.get(`/students/${id}/activity`),
};

// Course API
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: { title: string; description: string; duration: string; fee: number; facultyId?: string; capacity?: number }) =>
    api.post('/courses', data),
  update: (id: string, data: { title?: string; description?: string; duration?: string; fee?: number; facultyId?: string; capacity?: number }) =>
    api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
};

// Enrollment API
export const enrollmentAPI = {
  getAll: () => api.get('/enrollments'),
  getStudentEnrollments: () => api.get('/enrollments/student/me'),
  create: (courseId: string) => api.post('/enrollments', { courseId }),
  delete: (id: string) => api.delete(`/enrollments/${id}`),
};

// Announcement API
export const announcementAPI = {
  getAll: () => api.get('/announcements'),
  getById: (id: string) => api.get(`/announcements/${id}`),
  create: (data: { title: string; content: string }) =>
    api.post('/announcements', data),
  update: (id: string, data: { title?: string; content?: string }) =>
    api.put(`/announcements/${id}`, data),
  delete: (id: string) => api.delete(`/announcements/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  upload: (imageUrl: string, title?: string, description?: string) =>
    api.post('/gallery', { imageUrl, title, description }),
  uploadFile: (formData: FormData) =>
    api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (id: string, data: { title?: string; description?: string; imageUrl?: string }) =>
    api.put(`/gallery/${id}`, data),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

// Faculty API
export const facultyAPI = {
  getAll: () => api.get('/faculties'),
  getById: (id: string) => api.get(`/faculties/${id}`),
  create: (data: any) => api.post('/faculties', data),
  update: (id: string, data: any) => api.put(`/faculties/${id}`, data),
  delete: (id: string) => api.delete(`/faculties/${id}`),
};

// Fee API
export const feeAPI = {
  getAll: () => api.get('/fees'),
  getStudentFees: () => api.get('/fees/student/me'),
  create: (data: { studentId: string; courseId: string }) => api.post('/fees', data),
  pay: (id: string, data: { paymentMethod: string; transactionId?: string }) =>
    api.post(`/fees/${id}/pay`, data),
  getStats: () => api.get('/fees/stats'),
};

// Suggestion API
export const suggestionAPI = {
  getAll: () => api.get('/suggestions'),
  getStudentSuggestions: () => api.get('/suggestions/student/me'),
  create: (data: { title: string; content: string; category?: string }) =>
    api.post('/suggestions', data),
  updateStatus: (id: string, data: { status: string; adminResponse?: string }) =>
    api.patch(`/suggestions/${id}/status`, data),
  delete: (id: string) => api.delete(`/suggestions/${id}`),
};

// Activity API
export const activityAPI = {
  getAll: (params?: { userId?: string; action?: string; limit?: number }) =>
    api.get('/activities', { params }),
  getStudentActivities: (id: string) => api.get(`/activities/student/${id}`),
  getRecent: (hours?: number) => api.get('/activities/recent', { params: { hours } }),
  getStats: () => api.get('/activities/stats'),
};

export default api;

