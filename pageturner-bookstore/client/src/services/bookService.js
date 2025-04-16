// src/services/bookService.js
import { authHeader } from './authService';

const API_URL = 'http://localhost:5000/api';

export const getAllBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getBookById:', error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create book');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in createBook:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in updateBook:', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in deleteBook:', error);
    throw error;
  }
};