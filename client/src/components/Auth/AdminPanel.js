import React from 'react';

const AdminPanel = () => {
  const handleAdminAccess = () => {
    const adminUser = {
      id: 999,
      username: 'admin',
      role: 'admin',
      name: 'Administrator',
      email: 'admin@example.com',
      customerId: null
    };
    
    const token = 'admin-direct-access-token';
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(adminUser));
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px auto', maxWidth: '500px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Admin Direct Access</h2>
      <p>Use this button to directly access the admin panel without authentication:</p>
      <button 
        onClick={handleAdminAccess}
        style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Enter as Admin
      </button>
      <p style={{ marginTop: '20px', fontSize: '0.8em', color: '#666' }}>
        Note: This is for development purposes only and bypasses normal authentication.
      </p>
    </div>
  );
};

export default AdminPanel;
