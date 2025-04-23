import React, { useState, useEffect } from 'react';
import { createSale } from '../../services/saleService';
import { getAllServices } from '../../services/serviceService';
import { getAllCustomers } from '../../services/customerService';

const SaleForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    service_id: '',
    quantity: 1
  });
  
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
      return '0.00';
    }
    return numPrice.toFixed(2);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, customersData] = await Promise.all([
          getAllServices(),
          getAllCustomers()
        ]);
        
        setServices(servicesData);
        setCustomers(customersData);
       
        if (customersData.length > 0) {
          setFormData(prev => ({
            ...prev,
            customer_id: customersData[0].id
          }));
        }
        
        if (servicesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            service_id: servicesData[0].id
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
    
    if (!formData.service_id) {
      newErrors.service_id = 'Service is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (formData.service_id && formData.quantity) {
      const selectedService = services.find(service => service.id === parseInt(formData.service_id));
      if (selectedService && selectedService.stock < formData.quantity) {
        newErrors.quantity = `Only ${selectedService.stock} copies available in stock`;
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
        service_id: parseInt(formData.service_id),
        quantity: parseInt(formData.quantity)
      };
      
      await createSale(saleData);
      setMessage({ type: 'success', text: 'Sale recorded successfully!' });
      setFormData({
        ...formData,
        quantity: 1
      });
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
      
      {(services.length === 0 || customers.length === 0) ? (
        <div className="message error">
          {services.length === 0 && 'No services available. Please add services first.'}
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
            <label htmlFor="service_id">Service:</label>
            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
            >
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.title} by {service.author} (${typeof service.price === 'string' ? parseFloat(service.price).toFixed(2) : service.price ? service.price.toFixed(2) : '0.00'}) - Stock: {service.stock}
                </option>
              ))}
            </select>
            {errors.service_id && <div className="error">{errors.service_id}</div>}
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