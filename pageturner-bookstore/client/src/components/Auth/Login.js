import React, { useState } from 'react';
import { loginUser } from '../../services/authService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await loginUser(formData);
      
      // Call the onLogin callback to update app state
      if (onLogin) {
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      
      {error && <div className="message error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          background-image: url('https://www.example.com/your-background-image.jpg'); /* Replace with your background image URL */
          background-size: cover;
          background-position: center;
          margin: 0;
          padding: 0;
          color: #fff;
        }

        .login-container {
          width: 100%;
          max-width: 400px;
          margin: 100px auto;
          background-color: rgba(0, 0, 0, 0.7); /* Transparent black background */
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
        }

        h2 {
          text-align: center;
          color: #fff;
          margin-bottom: 20px;
          font-size: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-size: 18px; /* Larger font size */
          font-weight: bold; /* Make the label bold */
          color: #fff; /* White color for visibility */
          margin-bottom: 8px; /* Spacing between label and input */
        }

        input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #fff;
          color: #333;
        }

        input:disabled {
          background-color: #f4f4f4;
        }

        button {
          width: 100%;
          padding: 12px;
          background-color: #4CAF50;
          color: white;
          border: none;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:disabled {
          background-color: #ddd;
        }

        button:hover:not(:disabled) {
          background-color: #45a049;
        }

        .message.error {
          color: #ff4d4d;
          background-color: rgba(255, 0, 0, 0.1);
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Login;
