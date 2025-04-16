import React from 'react';
import { isLoggedIn, isAdmin } from '../services/authService';
import bookstoreImage from '../assets/bookstore.jpg'; // You'll need to add this image to your assets folder

const HomePage = ({ onNavigate }) => {
  const userLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  
  return (
    <div className="home-page">
      <div className="home-banner">
        <div className="banner-content">
          <h1>Welcome to PageTurner Bookstore</h1>
          <p>Your one-stop destination for quality books at affordable prices</p>
          
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
        <h2>Featured Books</h2>
        <div className="feature-buttons">
          <button 
            className="feature-button"
            onClick={() => onNavigate('books')}
          >
            <div className="feature-icon">📚</div>
            <span>Browse Books</span>
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
                <span>Manage Books</span>
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
        <h2>About PageTurner Bookstore</h2>
        <p>
          PageTurner Bookstore is your local bookstore with a wide selection of books across all genres.
          We pride ourselves on our knowledgeable staff, competitive prices, and excellent customer service.
        </p>
        <p>
          Browse our collection, register for an account, and start building your personal library today!
        </p>
      </div>
    </div>
  );
};

export default HomePage;