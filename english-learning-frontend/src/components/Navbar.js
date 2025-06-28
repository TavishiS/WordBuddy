import React from 'react';
import NavbarGuest from './NavbarGuest';
import NavbarUser from './NavbarUser';

export default function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token');
  return isLoggedIn ? <NavbarUser /> : <NavbarGuest />;
}
