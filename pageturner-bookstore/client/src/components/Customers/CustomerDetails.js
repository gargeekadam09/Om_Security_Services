import React, { useState, useEffect } from 'react';
import { getCustomerById } from '../../services/customerService';

const CustomerDetails = ({ customerId, onBack }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getCustomerById(customerId);
        setCustomer(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer details');
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [customerId]);

  if (loading) return <div className="loading">Loading customer details...</div>;
  if (error) return <div className="message error">{error}</div>;
  if (!customer) return <div className="message">No customer selected</div>;

  return (
    <div className="customer-details">
      <h2>Customer Details</h2>
      
      <div className="details-container">
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{customer.name}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{customer.email}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{customer.phone || 'Not provided'}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Address:</span>
          <span className="detail-value">{customer.address || 'Not provided'}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Customer since:</span>
          <span className="detail-value">{new Date(customer.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <button onClick={onBack} style={{ marginTop: '20px' }}>
        Back to Customer List
      </button>
    </div>
  );
};

export default CustomerDetails;