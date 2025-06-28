// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  // const logout = () => {
  //   localStorage.removeItem('token');
  //   navigate('/');
  // };

  return (
    <div className="dashboard-container">
      <h2 style={{fontFamily:'Montserrat', color:'#6c63ff'}}>Welcome to Your Dashboard</h2>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/grammar/correct')}>Correct Grammar</button>
        <button onClick={() => navigate('/journals/submit')}>Submit Journal</button>
        <button onClick={() => navigate('/chat')}>Chat with AI</button>
        <button onClick={() => navigate('/progress')}>See Progress</button>
        {/* <button onClick={() => navigate('/list_journals')}>Journals written so far...</button>
        <button onClick={() => navigate('/list_words')}>Words learnt so far...</button>
        <button onClick={() => navigate('/list_phrases')}>Phrases learnt so far...</button>
        <button onClick={logout} className="logout">Logout</button> */}
      </div>
    </div>
  );
}
