// src/services/serviceService.js
import { authHeader } from './authService';

const API_URL = 'http://localhost:5000/api';

console.log("API URL:", API_URL);

export const getAllServices = async () => {
  try {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllServices:', error);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/services/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getServiceById:', error);
    throw error;
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(serviceData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create service');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createService:', error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(serviceData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update service');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in updateService:', error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete service');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in deleteService:', error);
    throw error;
  }
};