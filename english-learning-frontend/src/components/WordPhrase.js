import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../css/WordPhrase.css';

export default function WordPhrase() {
  const [word, setWord] = useState(null);
  const [phrase, setPhrase] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await api.get('/word/today/');
        setWord(res.data);
      } catch (err) {
        setError("Failed to load Word of the Day");
      }
    };

    const fetchPhrase = async () => {
      try {
        const res = await api.get('/phrase/today/');
        setPhrase(res.data);
      } catch (err) {
        setError("Failed to load Phrase of the Day");
      }
    };

    fetchWord();
    fetchPhrase();
  }, []);

  return (
    <div className="wordphrase-container">
      <h1 style={{fontFamily:'Montserrat', color:'#6c63ff'}}>Today's Word & Phrase</h1>

      {error && <p className="error">{error}</p>}

      {word && (
        <div className="card">
          <h2 className='main-label'>Word: {word.text}</h2>
          <p><strong className='section-heading'>Meaning:</strong> {word.meaning}</p>
          <p><strong className='section-heading'>Examples:</strong></p>
          <ul>
            {word.examples.map((ex, index) => <li key={index}>{ex}</li>)}
          </ul>
        </div>
      )}

      {phrase && (
        <div className="card">
          <h2 className='main-label'>Phrase: {phrase.text}</h2>
          <p><strong className='section-heading'>Meaning:</strong> {phrase.meaning}</p>
          <p><strong className='section-heading'>Context:</strong> {phrase.context}</p>
          <p><strong className='section-heading'>Examples:</strong></p>
          <ul>
            {phrase.examples.map((ex, index) => <li key={index}>{ex}</li>)}
          </ul>
        </div>
      )}

      <div className="button-group">
        <button onClick={() => navigate('/register')}>Sign Up</button>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
}
