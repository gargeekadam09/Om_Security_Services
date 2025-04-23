
import { authHeader } from './authService';

export const getAllCustomers = async () => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getAllCustomers:', error);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createCustomer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    throw error;
  }
};