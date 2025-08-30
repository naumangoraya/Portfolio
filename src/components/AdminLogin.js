'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const StyledLoginOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledLoginForm = styled.div`
  background: var(--light-navy);
  padding: 40px;
  border-radius: 8px;
  border: 1px solid var(--green);
  min-width: 300px;
  
  h2 {
    color: var(--lightest-slate);
    margin-bottom: 20px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      color: var(--light-slate);
      margin-bottom: 8px;
      font-size: var(--fz-sm);
    }
    
    input {
      width: 100%;
      padding: 12px;
      background: var(--navy);
      border: 1px solid var(--lightest-navy);
      border-radius: 4px;
      color: var(--lightest-slate);
      font-size: var(--fz-md);
      
      &:focus {
        border-color: var(--green);
        outline: none;
      }
    }
  }
  
  .login-button {
    width: 100%;
    padding: 12px;
    background: var(--green);
    color: var(--navy);
    border: none;
    border-radius: 4px;
    font-size: var(--fz-md);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    
    &:hover {
      background: var(--light-green);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  .error-message {
    color: #ff6b6b;
    text-align: center;
    margin-bottom: 20px;
    font-size: var(--fz-sm);
  }
`;

const AdminLogin = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledLoginOverlay onClick={onClose}>
      <StyledLoginForm onClick={(e) => e.stopPropagation()}>
        <h2>Admin Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </StyledLoginForm>
    </StyledLoginOverlay>
  );
};

export default AdminLogin;
