import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavbarGuest.css';

export default function NavbarGuest() {
  return (
    <nav className="navbar-guest">
      <div className="nav-left">
        <Link to="/" className="logo">WordBuddy</Link>
      </div>
      <div className="nav-right">
        <Link to="/">About</Link>
      </div>
    </nav>
  );
}
