import React from 'react';
import { isLoggedIn, isAdmin, logoutUser } from '../services/authService';

const MainNavigation = ({ activeTab, setActiveTab, userName }) => {
  const userLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  
  const handleLogout = () => {
    logoutUser();
    setActiveTab('home');
  };

  return (
    <div className="main-navigation">
      <div className="nav-logo" onClick={() => setActiveTab('home')}>
        <span className="logo-text">PageTurner</span>
      </div>
      
      <div className="nav-links">
        <div 
          className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </div>
        
        <div 
          className={`nav-link ${activeTab === 'service' ? 'active' : ''}`} 
          onClick={() => setActiveTab('service')}
        >
          Services
        </div>
        
        {userLoggedIn && !userIsAdmin && (
          <div 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            My Dashboard
          </div>
        )}
        
        {userIsAdmin && (
          <>
            <div 
              className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`} 
              onClick={() => setActiveTab('customers')}
            >
              Customers
            </div>
            
            <div 
              className={`nav-link ${activeTab === 'sales' ? 'active' : ''}`} 
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </div>
          </>
        )}
      </div>
      
      <div className="nav-auth">
        {!userLoggedIn ? (
          <>
            <button 
              className="nav-btn login" 
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className="nav-btn register" 
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </>
        ) : (
          <div className="user-controls">
            <span className="welcome-text">
              Welcome, {userName || 'User'}
              {userIsAdmin && <span className="admin-badge">Admin</span>}
            </span>
            <button 
              className="nav-btn logout" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavigation;