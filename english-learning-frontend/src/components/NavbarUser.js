import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavbarUser.css';

export default function NavbarUser() {
  const navigate = useNavigate();
//   const username = localStorage.getItem('username') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar-user">
      <div className="nav-left">
        <Link to="/" className="logo">WordBuddy</Link>
      </div>
      <div className="nav-right">
        <Link to="/">About</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
