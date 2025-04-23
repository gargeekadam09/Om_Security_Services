import React, { useState, useEffect } from 'react';
import { getCustomerSales } from '../../services/saleService';
import { getAllServices } from '../../services/serviceService';
import { createSale } from '../../services/saleService';

const CustomerDashboard = ({ user }) => {
  const [purchases, setPurchases] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  useEffect(() => {
    console.log("CustomerDashboard mounted, user:", user);
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const servicesData = await getAllServices();
        console.log("Services fetched:", servicesData);
        setServices(servicesData);
        
        if (servicesData.length > 0) {
          setSelectedService(servicesData[0].id);
        }
      
        try {
          const purchasesData = await getCustomerSales();
          console.log("Purchases fetched:", purchasesData);
          setPurchases(purchasesData);
        } catch (purchaseErr) {
          console.error("Error fetching purchases:", purchaseErr);
          setPurchases([]);

        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in dashboard:", err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    
    if (!selectedService || quantity < 1) {
      setMessage({
        type: 'error',
        text: 'Please select a service and quantity'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const saleData = {
        service_id: parseInt(selectedService),
        quantity: parseInt(quantity)
      };
      
      console.log("Submitting purchase:", saleData);
      await createSale(saleData);
      
      try {
        const purchasesData = await getCustomerSales();
        setPurchases(purchasesData);
      } catch (err) {
        console.error("Error refreshing purchases:", err);
      }
 
      setQuantity(1);
      
      setMessage({
        type: 'success',
        text: 'Purchase completed successfully!'
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Purchase error:", err);
      setMessage({
        type: 'error',
        text: err.message || 'Purchase failed. Please try again.'
      });
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && services.length === 0 && purchases.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="customer-dashboard">
      <h2>Welcome, {user.name || user.username}!</h2>
      
      <div className="dashboard-content">
        <div className="purchase-section">
          <h3>Buy a Service</h3>
          
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handlePurchase}>
            <div className="form-group">
              <label htmlFor="service">Select Service:</label>
              <select
                id="service"
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                disabled={loading || services.length === 0}
              >
                {services.length === 0 ? (
                  <option value="">No services available</option>
                ) : (
                  services.map(service => (
                    <option key={service.id} value={service.id} disabled={service.stock < 1}>
                      {service.title} - ${formatPrice(service.price)} {service.stock < 1 ? '(Out of stock)' : `(${service.stock} available)`}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                disabled={loading || services.length === 0}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || services.length === 0}
            >
              {loading ? 'Processing...' : 'Purchase'}
            </button>
          </form>
        </div>
        
        <div className="purchases-section">
          <h3>Your Purchase History</h3>
          
          {error && <div className="message error">{error}</div>}
          
          {purchases.length === 0 ? (
            <p>You haven't made any purchases yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td>{formatDate(purchase.sale_date)}</td>
                    <td>{purchase.service_title}</td>
                    <td>{purchase.quantity}</td>
                    <td>${formatPrice(purchase.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;