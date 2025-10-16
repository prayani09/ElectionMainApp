// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import FullVoterDetails from './Components/FullVoterDetails';
import Upload from './Components/Upload';

function App() {
  const [currentView, setCurrentView] = useState('upload');
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleUploadComplete = (totalVoters) => {
    setUploadComplete(true);
    setCurrentView('dashboard');
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <nav className="bg-orange-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">VoterData Pro</h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('upload')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'upload' ? 'bg-orange-700' : 'hover:bg-orange-700'
                  }`}
                >
                 <Link to="/upload">Upload</Link>
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard' ? 'bg-orange-700' : 'hover:bg-orange-700'
                  }`}
                >
                  <Link to="/dashboard">Dashboard</Link>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route 
            path="/upload" 
            element={<Upload onUploadComplete={handleUploadComplete} />} 
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/voter/:voterId" element={<FullVoterDetails />} />
          <Route 
            path="/" 
            element={<Navigate to={uploadComplete ? "/dashboard" : "/upload"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
