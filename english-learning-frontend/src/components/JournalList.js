import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/JournalList.css';

export default function JournalList() {
  const [journals, setJournals] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://192.168.29.99:8000/list_journals/', {
        headers: { Authorization: `Token ${token}` },
      });
      setJournals(res.data);
    };
    fetchJournals();
  }, []);

  const goToPrev = () => {
    if (currentIndex > 0) {
      setTransitionDirection('prev');
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < journals.length - 1) {
      setTransitionDirection('next');
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="journal-list">
      <h2 style={{fontFamily: 'Montserrat', color: '#6c63ff'}}>Your Journals</h2>
      
      <div className="journal-carousel">
        {/* Previous arrow - disabled when at first item */}
        <button 
          className={`journal-nav prev ${currentIndex === 0 ? 'disabled' : ''}`}
          onClick={goToPrev}
          aria-label="Previous journal"
        />
        
        {/* Journal items container */}
        <div className="journal-items-container">
          {journals.map((entry, index) => (
            <div 
              key={index} 
              className={`
                journal-item
                ${index === currentIndex ? 'active' : ''}
                ${transitionDirection === 'next' && index === currentIndex - 1 ? 'slide-out-left' : ''}
                ${transitionDirection === 'prev' && index === currentIndex + 1 ? 'slide-out-right' : ''}
              `}
            >
              <p className="journal-date">
                <span role="img" aria-label="date">📅</span> {entry.date_created}
              </p>
              <p className="journal-content"><strong>Original:</strong> {entry.text}</p>
              <p className="journal-content">
                <strong>Corrected:</strong> 
                <span style={{fontWeight: 'bold', color: '#006400'}}>
                  {entry.corrected_text || 'None'}
                </span>
              </p>
              {entry.feedback && (
                <p className="journal-feedback">
                  <strong>Feedback:</strong> {entry.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
        
        {/* Next arrow - disabled when at last item */}
        <button 
          className={`journal-nav next ${currentIndex === journals.length - 1 ? 'disabled' : ''}`}
          onClick={goToNext}
          aria-label="Next journal"
        />
      </div>
      
      {/* Page indicator */}
      {journals.length > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          fontFamily: 'Montserrat',
          color: '#6c63ff'
        }}>
          {currentIndex + 1} / {journals.length}
        </div>
      )}
    </div>
  );
}