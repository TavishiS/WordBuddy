import React, { useState } from 'react';
import axios from 'axios';
import '../css/Register.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // Accept event parameter and prevent default form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!form.username || !form.password) {
      setError('❗ Both username and password are required.');
      return;
    }

    try {
      const res = await axios.post('http://192.168.29.99:8000/register/', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', form.username);
      window.location.href = '/dashboard';
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 400) {
          if (data.username && data.username[0]) {
            setError(`❌ ${data.username[0]}`);
          } else if (data.password && data.password[0]) {
            setError(`❌ ${data.password[0]}`);
          } else if (data.non_field_errors && data.non_field_errors[0]) {
            setError(`❌ ${data.non_field_errors[0]}`);
          } else {
            setError('⚠️ Invalid input. Please check and try again.');
          }
        } else {
          setError('⚠️ Unexpected server error. Please try again later.');
        }
      } else if (err.request) {
        setError('📡 Could not reach server. Is your backend running?');
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="register-container">
      <h2 style={{fontFamily:'Montserrat', color:'#6c63ff'}}>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
