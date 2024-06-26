// src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);

export const login = (userData) => axios.post(`${API_URL}/auth/login`, userData);

export const verifyOtp = (otpData) => axios.post(`${API_URL}/auth/verify-otp`, otpData);

export const getUserProfile = (token) => axios.get(`${API_URL}/user/profile`, {
  headers: { 'x-auth-token': token },
});

export const updateUserProfile = (userData, token) => axios.put(`${API_URL}/user/profile`, userData, {
  headers: { 'x-auth-token': token },
});

export const resendOtp = (emailData) => axios.post(`${API_URL}/auth/verify-otp`, emailData);

export const logout = (token) => axios.post(`${API_URL}/auth/logout`, {}, {
  headers: { 'x-auth-token': token },
});
