import React, { useState } from 'react';
import './Login-style.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';
import axios from 'axios';


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signin`,
        { username, password }
      );

      console.log('Login successful:', response.data);

      const body = response.data?.body;
      const accessToken = body?.accessToken;  
      const refreshToken = body?.token;       

      if (!accessToken) {
        console.error('accessToken missing in response:', response.data);
        setError('Login failed: access token not returned');
        return;
      }

      // Save tokens and user info
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken ?? '');
      localStorage.setItem('user', JSON.stringify(body));

      console.log('Access token saved:', localStorage.getItem('token'));

      onLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
