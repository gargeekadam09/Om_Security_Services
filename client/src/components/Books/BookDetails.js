import React, { useState, useEffect } from 'react';
import { getServiceById } from '../../services/serviceService';

const ServiceDetails = ({ serviceId, onBack }) => {
  const [{"title": "Residential Security Guard Services", "description": "Professional guards to protect homes and residential communities.", "price": 200, "image": "residential.jpg"}, {"title": "Event Security Management", "description": "Secure and manage small to large-scale events with expert personnel.", "price": 500, "image": "event.jpg"}, {"title": "Commercial Security Solutions", "description": "Tailored security for businesses, offices, and corporate premises.", "price": 350, "image": "commercial.jpg"}, {"title": "Personal Bodyguard Services", "description": "Trained bodyguards for personal protection and VIP escort.", "price": 800, "image": "bodyguard.jpg"}]service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchServiceDetails = async () => {
      if (!serviceId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getServiceById(serviceId);
        setService(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch service details');
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (loading) return <div className="loading">Loading service details...</div>;
  if (error) return <div className="message error">{error}</div>;
  if (!service) return <div className="message">No service selected</div>;

  return (
    <div className="service-details">
      <h2>Service Details</h2>
      
      <div className="details-container">
        <div className="detail-row">
          <span className="detail-label">Title:</span>
          <span className="detail-value">{service.title}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Author:</span>
          <span className="detail-value">{service.author}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">ISBN:</span>
          <span className="detail-value">{service.isbn}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Price:</span>
          <span className="detail-value">${formatPrice(service.price)}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">In Stock:</span>
          <span className="detail-value">{service.stock} copies</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Added on:</span>
          <span className="detail-value">{new Date(service.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <button onClick={onBack} style={{ marginTop: '20px' }}>
        Back to Service List
      </button>
    </div>
  );
};

export default ServiceDetails;