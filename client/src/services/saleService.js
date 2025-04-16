// src/services/saleService.js
import { authHeader } from './authService';

const API_URL = 'http://localhost:5000/api';

export const getAllSales = async () => {
  try {
    const response = await fetch(`${API_URL}/sales`, {
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sales');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAllSales:', error);
    throw error;
  }
};

export const getCustomerSales = async () => {
  try {
    const response = await fetch(`${API_URL}/sales/my-purchases`, {
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch purchases');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getCustomerSales:', error);
    throw error;
  }
};

export const getSaleById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sale');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getSaleById:', error);
    throw error;
  }
};

export const createSale = async (saleData) => {
  try {
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(saleData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create sale');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createSale:', error);
    throw error;
  }
};

export const deleteSale = async (id) => {
  try {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete sale');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in deleteSale:', error);
    throw error;
  }
};