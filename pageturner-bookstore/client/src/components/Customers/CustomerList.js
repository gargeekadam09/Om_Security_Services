import React, { useState, useEffect } from 'react';
import { getAllCustomers, deleteCustomer } from '../../services/customerService';

const CustomerList = ({ onEdit, refreshTrigger, onAddNew }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [refreshTrigger]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch customers');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (err) {
        setError('Failed to delete customer');
      }
    }
  };

  if (loading) return <div className="loading">Loading customers...</div>;
  if (error) return <div className="message error">{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Customers List</h2>
        <button onClick={onAddNew}>Add New Customer</button>
      </div>
      
      {customers.length === 0 ? (
        <p>No customers found. Add a new customer to get started.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone || 'N/A'}</td>
                <td>
                  <button onClick={() => onEdit(customer)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(customer.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;