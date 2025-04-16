import React from 'react';
import { isLoggedIn, isAdmin } from '../services/authService';
import bookstoreImage from '../assets/service.png'; 

const HomePage = ({ onNavigate }) => {
  const userLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  
  return (
    <div className="home-page">
      <div className="home-banner">
        <div className="banner-content">
          <h1>Welcome to OM Security Services</h1>
          <p>Providing trusted and professional security solutions tailored to your needs.</p>
          
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
            src={bookstoreImage} 
            alt="Bookstore" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x300?text=Bookstore';
            }}
          />
        </div>
      </div>
      
      <div className="home-features">
        <h2>Featured Services </h2>
        <div className="feature-buttons">
          <button 
            className="feature-button"
            onClick={() => onNavigate('books')}
          >
            <div className="feature-icon">📚</div>
            <span>Browse Our Services</span>
          </button>
          
          {userLoggedIn && !userIsAdmin && (
            <button 
              className="feature-button"
              onClick={() => onNavigate('purchases')}
            >
              <div className="feature-icon">🛒</div>
              <span>My Purchases</span>
            </button>
          )}
          
          {userIsAdmin && (
            <>
              <button 
                className="feature-button"
                onClick={() => onNavigate('manageBooks')}
              >
                <div className="feature-icon">📝</div>
                <span>Manage Services</span>
              </button>
              
              <button 
                className="feature-button"
                onClick={() => onNavigate('customers')}
              >
                <div className="feature-icon">👥</div>
                <span>Customers</span>
              </button>
              
              <button 
                className="feature-button"
                onClick={() => onNavigate('sales')}
              >
                <div className="feature-icon">💰</div>
                <span>Sales</span>
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="home-about">
        <h2>About Om Security Services</h2>
        <p>
        Om Security Services is dedicated to providing professional, reliable, and affordable security solutions tailored to your needs. 
        Our trained personnel ensure safety and peace of mind for residential, commercial, and industrial clients alike.
        </p>
      </div>
    </div>
  );
};

export default HomePage;