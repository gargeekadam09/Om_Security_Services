import React from 'react';

const AdminPanel = () => {
  const handleAdminAccess = () => {
    // Create admin user data directly
    const adminUser = {
      id: 999,
      username: 'admin',
      role: 'admin',
      name: 'Administrator',
      email: 'admin@example.com',
      customerId: null
    };
    
    // Create a mock token (this is just for demonstration)
    const token = 'admin-direct-access-token';
    
    // Store in localStorage just like regular login
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    // Reload the page to apply changes
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', margin: '50px auto', maxWidth: '500px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Admin Direct Access</h2>
      <button 
        onClick={handleAdminAccess}
        style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Enter as Admin
      </button>
      <p style={{ marginTop: '20px', fontSize: '0.8em', color: '#666' }}>
      </p>
    </div>
  );
};

export default AdminPanel;