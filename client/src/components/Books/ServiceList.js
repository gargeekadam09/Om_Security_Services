import React, { useState, useEffect } from 'react';
import { getAllServices, deleteService } from '../../services/serviceService';

const ServiceList = ({ onEdit, refreshTrigger, onAddNew, isAdmin }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, [refreshTrigger]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch services');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (err) {
        setError('Failed to delete service');
      }
    }
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  if (loading) return <div className="loading">Loading services...</div>;
  if (error) return <div className="message error">{error}</div>;

  return (
    <div className="service-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Available Security Services</h2>
        {isAdmin && onAddNew && (
          <button onClick={onAddNew}>Add New Service</button>
        )}
      </div>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <img 
                src={service.image || 'https://via.placeholder.com/300x200?text=Security+Service'} 
                alt={service.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <h3>{service.title}</h3>
              <p><strong>Description:</strong> {service.description}</p>
              <p><strong>Price:</strong> ₹{formatPrice(service.price)}</p>
              {service.features && (
                <>
                  <p><strong>Features:</strong></p>
                  <ul>
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}
              {service.useCase && (
                <p><strong>Use Case:</strong> {service.useCase}</p>
              )}
              {isAdmin && (
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => onEdit(service)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(service.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
