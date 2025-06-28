import React, { useState } from 'react';
import axios from 'axios';
import '../css/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    setError(''); // Clear previous error

    // Client-side validation
    if (!username || !password) {
      setError('❗ Please fill out both username and password.');
      return;
    }

    try {
      const res = await axios.post('http://192.168.29.99:8000/login/', {
        username,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', username);
      window.location.href = '/dashboard';
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        if (status === 401) {
          if (data.non_field_errors) {
            setError(`❌ ${data.non_field_errors[0]}`);
          } else if (data.detail) {
            setError(`❌ ${data.detail}`);
          } else {
            setError('❌ Invalid username or password.');
          }
        } else {
          setError('⚠️ Unexpected error. Please try again later.');
        }
      } else if (err.request) {
        setError('📡 Could not reach server. Is your backend running?');
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
