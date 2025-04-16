import React, { useState, useEffect } from 'react';
import { createSale } from '../../services/saleService';
import { getAllBooks } from '../../services/bookService';
import { getAllCustomers } from '../../services/customerService';

const SaleForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    book_id: '',
    quantity: 1
  });
  
  const [books, setBooks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to safely format price
  const formatPrice = (price) => {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number
    if (isNaN(numPrice)) {
      return '0.00';
    }
    
    // Format with 2 decimal places
    return numPrice.toFixed(2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, customersData] = await Promise.all([
          getAllBooks(),
          getAllCustomers()
        ]);
        
        setBooks(booksData);
        setCustomers(customersData);
        
        // Set default values if data is available
        if (customersData.length > 0) {
          setFormData(prev => ({
            ...prev,
            customer_id: customersData[0].id
          }));
        }
        
        if (booksData.length > 0) {
          setFormData(prev => ({
            ...prev,
            book_id: booksData[0].id
          }));
        }
        
        setLoading(false);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load data' });
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer is required';
    }
    
    if (!formData.book_id) {
      newErrors.book_id = 'Book is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    // Check if selected book has enough stock
    if (formData.book_id && formData.quantity) {
      const selectedBook = books.find(book => book.id === parseInt(formData.book_id));
      if (selectedBook && selectedBook.stock < formData.quantity) {
        newErrors.quantity = `Only ${selectedBook.stock} copies available in stock`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setMessage(null);
      
      const saleData = {
        customer_id: parseInt(formData.customer_id),
        book_id: parseInt(formData.book_id),
        quantity: parseInt(formData.quantity)
      };
      
      await createSale(saleData);
      setMessage({ type: 'success', text: 'Sale recorded successfully!' });
      
      // Reset quantity after successful creation
      setFormData({
        ...formData,
        quantity: 1
      });
      
      // Notify parent component to refresh the list
      if (onSave) {
        onSave();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading data...</div>;

  return (
    <div>
      <h2>Record New Sale</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {(books.length === 0 || customers.length === 0) ? (
        <div className="message error">
          {books.length === 0 && 'No books available. Please add books first.'}
          {customers.length === 0 && 'No customers available. Please add customers first.'}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer_id">Customer:</label>
            <select
              id="customer_id"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
            >
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
            {errors.customer_id && <div className="error">{errors.customer_id}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="book_id">Book:</label>
            <select
              id="book_id"
              name="book_id"
              value={formData.book_id}
              onChange={handleChange}
            >
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} (${typeof book.price === 'string' ? parseFloat(book.price).toFixed(2) : book.price ? book.price.toFixed(2) : '0.00'}) - Stock: {book.stock}
                </option>
              ))}
            </select>
            {errors.book_id && <div className="error">{errors.book_id}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <div className="error">{errors.quantity}</div>}
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Record Sale'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SaleForm;