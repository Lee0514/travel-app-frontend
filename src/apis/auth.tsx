import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_DEVELOP_URL || 'http://localhost:3001/api';

/**
 * 註冊
 */
export const signup = async (email: string, password: string, passwordCheck: string, username: string) => {
  const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
    email,
    password,
    passwordCheck,
    userName: username
  });

  return res.data;
};

/**
 * 登入
 */
export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });
  return res.data;
};

/**
 * 登出
 */
export const logout = async () => {
  const res = await axios.post(
    `${API_BASE_URL}/auth/logout`,
    {},
    {
      withCredentials: true
    }
  );
  return res.data;
};

/**
 * 編輯個人檔案
 */
export const editProfile = async (formData: FormData) => {
  const token = localStorage.getItem('accessToken'); // 從 localStorage 取出登入時存的 accessToken

  const response = await axios.post(`${API_BASE_URL}/auth/edit-profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}` // 帶上 token
    }
  });

  return response.data.user; // 回傳更新後的 user
};

/**
 * OAuth 登入 (Google / Line)
 * 會回傳一個 redirect URL
 */
export const getOAuthUrl = async (provider: 'google' | 'line') => {
  const res = await axios.get(`${API_BASE_URL}/auth/oauth/${provider}`);
  return res.data;
};

/**
 * 取得目前登入使用者（支援 LINE cookie 登入）
 */
export const getMe = async () => {
  const res = await axios.get(`${API_BASE_URL}/auth/me`, {
    withCredentials: true // ✅ 必須，cookie 才會帶上
  });

  return res.data; // { user: {...} }
};
