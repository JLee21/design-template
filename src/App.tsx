import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Instructions from './pages/Blank';
import Audit from './pages/Audit';
import DatabaseCreate from './pages/DatabaseCreate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DatabaseCreate />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/audit" element={<Audit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
