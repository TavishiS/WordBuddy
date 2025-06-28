import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/WordsList.css';

export default function WordsList() {
  const [words, setWords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchWords = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://192.168.29.99:8000/list_words/', {
        headers: { Authorization: `Token ${token}` },
      });
      setWords(res.data);
    };
    fetchWords();
  }, []);

  // Calculate current words to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWords = words.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(words.length / itemsPerPage);

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
    <div className="words-list">
      <h2 style={{fontFamily:'Montserrat', color:'#6c63ff'}}>Words You've Learned</h2>
      
      {currentWords.map((word, index) => (
        <div key={index} className="word-item">
          <h3 className="word-text">{word.text}</h3>
          <p className="word-meaning"><strong>Meaning:</strong> {word.meaning}</p>
          <ul className="word-examples">
            {word.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      ))}

      {words.length > itemsPerPage && (
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