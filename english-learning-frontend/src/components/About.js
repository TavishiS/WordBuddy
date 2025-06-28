import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/About.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <h1 style={{fontFamily: 'Montserrat', color:'#6c63ff'}}>Welcome to your own English Learning App 😍</h1>
      <p className='about-message'>This app helps you improve English with daily words, phrases, journaling, grammar checks, and AI practice.</p>
      <button onClick={() => navigate('/explore')}>Explore the App</button>
    </div>
  );
}
