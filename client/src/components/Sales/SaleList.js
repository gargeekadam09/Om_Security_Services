import React, { useState, useEffect } from 'react';
import { getAllSales, deleteSale } from '../../services/saleService';

const SaleList = ({ refreshTrigger }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSales();
  }, [refreshTrigger]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await getAllSales();
      setSales(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch sales');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      try {
        await deleteSale(id);
        fetchSales();
      } catch (err) {
        setError('Failed to delete sale');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  if (loading) return <div className="loading">Loading sales...</div>;
  if (error) return <div className="message error">{error}</div>;

  return (
    <div>
      <h2>Sales List</h2>
      
      {sales.length === 0 ? (
        <p>No sales found. Create a new sale to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.service_title || 'Unknown Service'}</td>
                <td>{sale.customer_name || 'Unknown Customer'}</td>
                <td>{sale.quantity}</td>
                <td>${formatPrice(sale.total_price)}</td>
                <td>{formatDate(sale.sale_date)}</td>
                <td>
                  <button className="delete" onClick={() => handleDelete(sale.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SaleList;