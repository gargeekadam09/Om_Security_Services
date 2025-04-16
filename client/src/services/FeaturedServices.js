import React, { useState, useEffect } from 'react';
import { getAllServices } from '../services/serviceService';

// Fallback image map if needed (you can customize this)
const serviceCovers = {
  "Residential Security Guard Services": "residential.jpg",
  "Event Security Management": "event.jpg",
  "Commercial Security Solutions": "commercial.jpg",
  "Personal Bodyguard Services": "bodyguard.jpg"
};

const FeaturedServices = ({ onViewService }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getAllServices();
        
        // Get only first 5 services or fewer for featuring
        const featuredServices = data.slice(0, 5);
        setServices(featuredServices);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const getServiceCover = (service) => {
    if (serviceCovers[service.title]) {
      return `/assets/${serviceCovers[service.title]}`; // adjust path if needed
    }
    return `https://via.placeholder.com/150x220?text=${encodeURIComponent(service.title)}`;
  };

  if (loading) return <div className="loading">Loading featured services...</div>;
  if (error) return <div className="message error">{error}</div>;
  if (services.length === 0) return <div className="message">No services available at the moment.</div>;

  return (
    <div className="featured-services">
      <h2>Featured Services</h2>
      <div className="service-grid">
        {services.map(service => (
          <div className="service-card" key={service.id}>
            <div className="service-cover">
              <img 
                src={getServiceCover(service)} 
                alt={service.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/150x220?text=${encodeURIComponent(service.title)}`;
                }}
              />
            </div>
            <div className="service-info">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-author">by {service.author || 'Admin'}</p>
              <p className="service-price">${formatPrice(service.price)}</p>
              <p className="service-stock">
                {service.stock > 0 ? `${service.stock} in stock` : 'Out of stock'}
              </p>
              <button 
                className="btn-view-service"
                onClick={() => onViewService(service.id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedServices;
