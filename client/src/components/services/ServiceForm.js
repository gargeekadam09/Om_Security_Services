import React, { useState } from 'react';
import axios from 'axios';

const ServiceForm = ({ onServiceAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/services', formData)
      .then((response) => {
        alert('Service added successfully!');
        setFormData({ name: '', description: '', price: '' });
        if (onServiceAdded) onServiceAdded();
      })
      .catch((error) => {
        console.error('Error adding service:', error);
        alert('Failed to add service.');
      });
  };

  return (
    <div className="service-form">
      <h2>Add New Service</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Service Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Price (₹):
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default ServiceForm;
