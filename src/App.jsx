import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAutoTranslate from './hooks/useAutoTranslate';
import Home from './Pages/Home';
import Dashboard from './Components/Dashboard';
import FullVoterDetails from './Components/FullVoterDetails';
import Upload from './Components/Upload';
import LanguageSelector from './Components/LanguageSelector';
import './App.css';

function App() {
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(true);
  const { currentLanguage, changeLanguage, translating } = useAutoTranslate();

  useEffect(() => {
    // Check if user has already selected language
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setShowLanguageModal(false);
      changeLanguage(savedLanguage);
    }
  }, [changeLanguage]);

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    setShowLanguageModal(false);
  };

  const handleUploadComplete = (totalVoters) => {
    setUploadComplete(true);
  };

  // Simple translation function
  const t = (text) => {
    if (currentLanguage === 'en') return text;
    return text; // Actual translation handled by HOC
  };

  return (
    <Router>
      <div className="App bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100">
        {/* Language Selection Modal */}
        {showLanguageModal && (
          <LanguageSelector onLanguageSelect={handleLanguageSelect} />
        )}

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and App Name */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-l from bg-green-300 to-orange-400">
                 <img src="/logo.png" alt="" className='rounded-full'/>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Vinod <span className='text-orange-500'>Mapari</span></h1>
                  <p className="text-xs text-orange-600 font-medium">Prabhag 20</p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center space-x-4">
                {translating && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                    <span className="text-sm font-medium">Translating...</span>
                  </div>
                )}
                <button
                  onClick={() => setShowLanguageModal(true)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200 group"
                  title="Change Language"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 hidden sm:block">
                    {currentLanguage === 'en' ? 'English' : 
                     currentLanguage === 'hi' ? 'Hindi' : 
                     currentLanguage === 'mr' ? 'Marathi' : 'Language'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/upload" 
              element={<Upload onUploadComplete={handleUploadComplete} />} 
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/voter/:voterId" element={<FullVoterDetails />} />
            <Route 
              path="/home" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;