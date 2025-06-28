import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PhraseList.css';

export default function PhraseList() {
  const [phrases, setPhrases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of phrases per page

  useEffect(() => {
    const fetchPhrases = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://192.168.29.99:8000/list_phrases/', {
        headers: { Authorization: `Token ${token}` },
      });
      setPhrases(res.data);
    };
    fetchPhrases();
  }, []);

  // Calculate current phrases to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPhrases = phrases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(phrases.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="phrases-list">
      <h2 style={{fontFamily:'Montserrat', color:'#6c63ff'}}>Phrases You've Practiced</h2>
      
      {currentPhrases.map((phrase, index) => (
        <div key={index} className="phrase-item">
          <h3 className='phrase-text'>{phrase.text}</h3>
          <p className='phrase-meaning'><strong>Meaning:</strong> {phrase.meaning}</p>
          <p className='phrase-context'><strong>Context:</strong> {phrase.context}</p>
          <ul className='phrase-examples'>
            {phrase.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      ))}

      {phrases.length > itemsPerPage && (
        <div className="pagination-controls">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}