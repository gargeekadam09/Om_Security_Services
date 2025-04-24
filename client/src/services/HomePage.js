import React from 'react';
import { isLoggedIn, isAdmin } from '../services/authService';
import servicestoreImage from '../assets/service.png'; 

const HomePage = ({ onNavigate }) => {
  const userLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();

  return (
    <div className="home-page">
      <div className="home-banner">
        <div className="banner-content">
          <h1>Welcome to OM Security Services</h1>
          <p>Your trusted partner for professional, reliable, and affordable security solutions</p>

          {!userLoggedIn && (
            <div className="banner-buttons">
              <button 
                className="btn-primary" 
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => onNavigate('register')}
              >
                Register
              </button>
            </div>
          )}

          {userLoggedIn && !userIsAdmin && (
            <div className="banner-buttons">
              <button 
                className="btn-primary" 
                onClick={() => onNavigate('dashboard')}
              >
                My Dashboard
              </button>
            </div>
          )}

          {userIsAdmin && (
            <div className="banner-buttons">
              <button 
                className="btn-primary" 
                onClick={() => onNavigate('admin')}
              >
                Admin Panel
              </button>
            </div>
          )}
        </div>

        <div className="banner-image">
          <img 
            src={servicestoreImage} 
            alt="OM Security Services" 
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
        </div>
      </div>
      <div className="home-about">
        <h2>About OM Security Services</h2>
        <p>
          OM Security Services delivers top-tier security solutions to residential, commercial, and government clients. 
          With a commitment to excellence and a team of trained professionals, we ensure safety, trust, and peace of mind.
        </p>
        <p>
          Register today and let us help protect what matters most to you.
        </p>
      </div>

      <div className="home-features">
        <h2>Featured Services</h2>
        <div className="feature-buttons">
          <button 
            className="feature-button"
            onClick={() => onNavigate('services')}
          >
            <div className="feature-icon"></div>
            <span>Explore Services</span>
          </button>

          {userLoggedIn && !userIsAdmin && (
            <button 
              className="feature-button"
              onClick={() => onNavigate('purchases')}
            >
            </button>
          )}

          {userIsAdmin && (
            <>
              <button 
                className="feature-button"
                onClick={() => onNavigate('manageServices')}
              >
                <div className="feature-icon"></div>
                <span>Manage Services</span>
              </button>

              <button 
                className="feature-button"
                onClick={() => onNavigate('customers')}
              >
                <div className="feature-icon"></div>
                <span>Customers</span>
              </button>

              <button 
                className="feature-button"
                onClick={() => onNavigate('sales')}
              >
                <div className="feature-icon"></div>
                <span>Sales</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
