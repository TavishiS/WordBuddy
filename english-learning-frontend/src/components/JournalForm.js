// src/components/Journal.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/Journal.css';

export default function JournalForm() {
  const [text, setText] = useState('');
  const [corrected, setCorrected] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter something in your journal.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://192.168.29.99:8000/journals/submit/',
        { text },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setCorrected(res.data.corrected_text);
      setFeedback(res.data.feedback);
      setError('');
    } catch (err) {
      setError('Failed to submit journal. Make sure you are logged in.');
    }
  };

  return (
    <div className="journal-container">
      <h2 style={{fontFamily: 'Montserrat', color:'#6c63ff'}}>Submit a Journal Entry</h2>
      <textarea
        placeholder="Write your thoughts here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p className="error">{error}</p>}

      {corrected && (
        <div className="result">
          <h4>Corrected Version:</h4>
          <p>{corrected}</p>
          <h4>Feedback:</h4>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
