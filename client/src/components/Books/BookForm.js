import React, { useState, useEffect } from 'react';
import { createService, updateService } from '../../services/serviceService';
  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      const priceValue = typeof service.price === 'number' 
        ? service.price.toString() 
        : service.price;
        
      setFormData({
        name: service.name,
        service: service.service,
        price: priceValue,
        stock: service.stock
      });
    } else {

      setFormData({
        name: '',
        service: '',
        price: '',
        stock: ''
      });
    }
 
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
      newErrors.title = 'Name is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Service is required';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'Price is required';
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
        await updateService(service.id, serviceData);
        setMessage({ type: 'success', text: 'Service updated successfully!' });
      } else {
        await createService(serviceData);
        setMessage({ type: 'success', text: 'Service created successfully!' });
        setFormData({
          name: '',
          service: '',
          price: '',
          stock: ''
        });
      }

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
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="service">Service:</label>
          <input
            type="text"
            id="service"
            name="service"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.service && <div className="error">{errors.service}</div>}
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
