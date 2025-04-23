import { API_URL } from '../config';


export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        logoutUser();
      }
      throw new Error('Failed to get user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};
export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};
export const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin';
};
export const getToken = () => {
  return localStorage.getItem('token');
};
export const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};