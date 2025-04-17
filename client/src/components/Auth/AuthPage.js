import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');

  const switchToLogin = () => {
    setActiveTab('login');
  };

  return (
    <div className="auth-page">
      <div className="auth-tabs">
        <div 
          className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </div>
        <div 
          className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </div>
      </div>
      
      <div className="auth-content">
        {activeTab === 'login' ? (
          <Login onLogin={onLogin} />
        ) : (
          <Register onRegisterSuccess={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;