// src/components/Grammar.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/Grammar.css';

export default function GrammarCheck() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const checkGrammar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://192.168.29.99:8000/grammar/correct/',
        { text },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setResult(res.data);
      setError('');
    } catch (err) {
      setError('Something went wrong. Make sure you are logged in.');
    }
  };

  return (
    <div className="grammar-container">
      <h2 style={{fontFamily: 'Montserrat', color:'#6c63ff'}}>Grammar Correction</h2>
      <textarea
        placeholder="Type your sentence here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={checkGrammar}>Check Grammar</button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p><strong>Original:</strong> {result.original}</p>
          <p><strong>Corrected:</strong> {result.corrected}</p>
          <h4>Issues:</h4>
          <ul>
            {result.issues.map((issue, index) => (
              <li key={index}>
                <strong>{issue.bad}</strong> → {issue.better?.[0] || '(no suggestion)'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
