import React, { useState, useEffect } from 'react';
import { getServiceById } from '../services/serviceService';
import { isLoggedIn } from '../services/authService';
import { createSale } from '../services/saleService';

const ServiceDetailPage = ({ serviceId, onBack, onLogin }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  const userLoggedIn = isLoggedIn();

  useEffect(() => {
    const fetchService = async () => {
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

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const getServiceCover = (service) => {
    if (service?.image) {
      return `/images/${service.image}`;
    }
    return `https://via.placeholder.com/300x450?text=${encodeURIComponent(service?.title || 'Service')}`;
  };

  const handlePurchase = async () => {
    if (!userLoggedIn) {
      setMessage({
        type: 'error',
        text: 'You need to log in to purchase services',
      });
      return;
    }

    if (!service || quantity < 1) {
      setMessage({
        type: 'error',
        text: 'Please select a valid quantity',
      });
      return;
    }

    try {
      setPurchasing(true);

      const saleData = {
        service_id: service.id,
        quantity: parseInt(quantity),
      };

      await createSale(saleData);

      setMessage({
        type: 'success',
        text: 'Service purchased successfully!',
      });

      setService({
        ...service,
        stock: service.stock - quantity,
      });

      setQuantity(1);
      setPurchasing(false);
    } catch (err) {
      console.error('Purchase error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Purchase failed. Please try again.',
      });
      setPurchasing(false);
    }
  };

  if (loading) return <div className="loading">Loading service details...</div>;
  if (error) return <div className="message error">{error}</div>;
  if (!service) return <div className="message">Service not found</div>;

  return (
    <div className="service-detail-page">
      <button className="btn-back" onClick={onBack}>
        &larr; Back to Services
      </button>

      <div className="service-detail-content">
        <div className="service-detail-image">
          <img
            src={getServiceCover(service)}
            alt={service.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(service.title)}`;
            }}
          />
        </div>

        <div className="service-detail-info">
          <h1 className="service-title">{service.title}</h1>
          <p className="service-price"><strong>Price:</strong> ${formatPrice(service.price)}</p>
          <p className={`service-stock ${service.stock < 1 ? 'out-of-stock' : ''}`}>
            <strong>Availability:</strong> {service.stock > 0 ? `${service.stock} in stock` : 'Out of Stock'}
          </p>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {service.stock > 0 ? (
            <div className="purchase-section">
              {userLoggedIn ? (
                <>
                  <div className="quantity-control">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={service.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <button
                    className="btn-purchase"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? 'Processing...' : 'Purchase Now'}
                  </button>
                </>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to purchase this service</p>
                  <button className="btn-login" onClick={onLogin}>
                    Log In / Register
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="out-of-stock-message">
              This service is currently out of stock. Please check back later.
            </div>
          )}

          <div className="service-description">
            <h3>Service Description</h3>
            <p>{service.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
