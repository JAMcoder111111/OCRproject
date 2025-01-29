import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import HomePage from './pages/homePage';

function App() {
  return (
    <div>


        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<div>Upload Page</div>} />
        </Routes>
      
    </div>
  );
}

export default App;
