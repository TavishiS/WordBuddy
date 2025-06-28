import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Progress.css';

export default function Progress() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://192.168.29.99:8000/progress/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setProgress(res.data);
        setError('');
      } catch (err) {
        setError('Unable to fetch progress. Are you logged in?');
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="progress-container">
      <h2 style={{ fontFamily: 'Montserrat', color:'#6c63ff'}}>Your Learning Progress</h2>
      {error && <p className="error">{error}</p>}
      {progress && (
        <div className="progress-stats">
          <div className="progress-item">
            <span className="progress-icon">📚</span>
            <button className="progress-check" onClick={() => navigate('/list_words')}>
              Words Learned
            </button>
            <span className="progress-count">{progress.words_learned}</span>
          </div>
          
          <div className="progress-item">
            <span className="progress-icon">🗣️</span>
            <button className="progress-check" onClick={() => navigate('/list_phrases')}>
              Phrases Practiced
            </button>
            <span className="progress-count">{progress.phrases_practiced}</span>
          </div>
          
          <div className="progress-item">
            <span className="progress-icon">💬</span>
            <button className="progress-check">
              Conversations Done
            </button>
            <span className="progress-count">{progress.conversations_done}</span>
          </div>
          
          <div className="progress-item">
            <span className="progress-icon">📝</span>
            <button className="progress-check" onClick={() => navigate('/list_journals')}>
              Journals Written
            </button>
            <span className="progress-count">{progress.journals_written}</span>
          </div>
          
          <div className="progress-meta">
            <p>Last Updated: {new Date(progress.last_updated).toLocaleString()}</p>
            <p className="progress-quote">
              "Develop a passion for learning. If you do, you will never cease to grow."
              <br />
              <strong>— Anthony J. D'Angelo</strong>
            </p>
            <p className="progress-encouragement">
              <strong style={{color:'#4B0082'}}>Explore the dashboard and start or resume learning :)</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}