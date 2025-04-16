import React, { useState, useEffect } from 'react';
import { createService, updateService } from '../../services/serviceService';

const ServiceForm = ({ service, onSave }) => {
  const [{"title": "Residential Security Guard Services", "description": "Professional guards to protect homes and residential communities.", "price": 200, "image": "residential.jpg"}, {"title": "Event Security Management", "description": "Secure and manage small to large-scale events with expert personnel.", "price": 500, "image": "event.jpg"}, {"title": "Commercial Security Solutions", "description": "Tailored security for businesses, offices, and corporate premises.", "price": 350, "image": "commercial.jpg"}, {"title": "Personal Bodyguard Services", "description": "Trained bodyguards for personal protection and VIP escort.", "price": 800, "image": "bodyguard.jpg"}]formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    stock: ''
  });
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      // Convert price to string for the form input if it's not already
      const priceValue = typeof service.price === 'number' 
        ? service.price.toString() 
        : service.price;
        
      setFormData({
        title: service.title,
        author: service.author,
        isbn: service.isbn,
        price: priceValue,
        stock: service.stock
      });
    } else {
      // Reset form if no service is selected
      setFormData({
        title: '',
        author: '',
        isbn: '',
        price: '',
        stock: ''
      });
    }
    
    // Clear messages when service changes
    setMessage(null);
    setErrors({});
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.stock === '') {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
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
      
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      
      if (service) {
        // Update existing service
        await updateService(service.id, serviceData);
        setMessage({ type: 'success', text: 'Service updated successfully!' });
      } else {
        // Create new service
        await createService(serviceData);
        setMessage({ type: 'success', text: 'Service created successfully!' });
        
        // Reset form after successful creation
        setFormData({
          title: '',
          author: '',
          isbn: '',
          price: '',
          stock: ''
        });
      }
      
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

  return (
    <div>
      <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && <div className="error">{errors.author}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="isbn">ISBN:</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
          {errors.isbn && <div className="error">{errors.isbn}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price ($):</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <div className="error">{errors.price}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
          />
          {errors.stock && <div className="error">{errors.stock}</div>}
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (service ? 'Update Service' : 'Add Service')}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;