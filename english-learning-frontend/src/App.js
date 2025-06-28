import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import About from './components/About';
import WordPhrase from './components/WordPhrase';
import Signup from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GrammarCheck from './components/GrammarCheck';
import JournalForm from './components/JournalForm';
import AIChat from './components/AIChat';
import Progress from './components/Progress';
import JournalList from './components/JournalList';
import WordsList from './components/WordsList';
import PhraseList from './components/PhraseList';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/explore" element={<WordPhrase />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/grammar/correct" element={<PrivateRoute><GrammarCheck /></PrivateRoute>} />
        <Route path="/journals/submit" element={<PrivateRoute><JournalForm /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><AIChat /></PrivateRoute>} />
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        <Route path="/list_journals" element={<PrivateRoute><JournalList /></PrivateRoute>} />
        <Route path="/list_words" element={<PrivateRoute><WordsList /></PrivateRoute>} />
        <Route path="/list_phrases" element={<PrivateRoute><PhraseList /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
