import React from 'react';

const LanguageSelector = ({ onLanguageSelect }) => {
  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी'
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Heavy dark overlay with backdrop blur */}
      <div className="absolute inset-0 backdrop-blur-xl" aria-hidden="true"></div>

      {/* Decorative blurred gradient blobs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 -left-10 w-[60%] h-[60%] rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-16 -right-10 w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 opacity-25 blur-2xl"></div>
      </div>

      <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all border border-white/20">
        {/* Header */}
        <div className="bg-orange-500 rounded-t-2xl p-6 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to VoterData Pro</h2>
          <p className="text-orange-100">Please select your preferred language</p>
        </div>

        {/* Language Options */}
        <div className="p-6">
          <div className="space-y-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => onLanguageSelect(language.code)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <span className="text-lg font-semibold text-orange-600">
                      {language.code.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-orange-600">
                      {language.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language.nativeName}
                    </div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              You can change this later in the settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;