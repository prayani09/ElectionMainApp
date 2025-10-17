import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [showBranding, setShowBranding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBranding(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      action: () => navigate('/dashboard')
    },
    {
      id: 'filters',
      title: 'Filters',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
      ),
      action: () => navigate('/filters')
    },
    {
      id: 'new-voter',
      title: 'Add Voter',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      action: () => navigate('/new-voter')
    },
    {
      id: 'booth-management',
      title: 'Booths',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      action: () => navigate('/booth-management')
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      action: () => navigate('/settings')
    },
    {
      id: 'upload',
      title: 'Upload',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      action: () => navigate('/upload')
    }
  ];

  if (showBranding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-full h-screen sm:h-[70vh] md:h-screen overflow-hidden">
          {/* Background image - responsive and covers area */}
          <img
            src="/bannerstarting.jpg"
            alt="Campaign banner"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Dark gradient overlay to improve contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"></div>

          {/* Optional centered branding text (keeps visual interest while loading) */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-600 drop-shadow-lg">JanNetaa</h1>
            <p className="mt-3 text-sm sm:text-base text-white/90">Election Management System</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Compact Brand Card (attention-grabbing, responsive) */}
      <div className="mb-6 px-4">
        <div className="max-w-md mx-auto backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 flex items-center gap-4 p-3 sm:p-4">
          {/* Gradient logo badge */}
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 transform transition-all hover:scale-105">
            <img src="https://cdn-icons-png.flaticon.com/128/17873/17873030.png" alt="JanNetaa" />
          </div>

          {/* Title, CTA and micro-stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-extrabold leading-tight text-gray-900 truncate">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">Jan</span>
                  <span className="ml-1 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">Netaa</span>
                </h1>
                <p className="text-xs text-gray-700 truncate font-semibold">By WebReich Solutions</p>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Get Started
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Compact Features Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={feature.action}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-3 text-center hover:shadow-md transition-all duration-200 hover:border-orange-300">
              <div className="flex justify-center mb-2">
                <div className="text-orange-500 group-hover:text-orange-600 transition-colors">
                  {feature.icon}
                </div>
              </div>
              <div className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                {feature.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Political Branding Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-4 text-white max-w-md mx-auto">
        {/* <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="" className='rounded-full p-0' />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Bharatiya Janata Party</h3>
            <p className="text-orange-100 text-sm mb-2">Building a Better Tomorrow</p>
            <div className="bg-white text-orange-600 text-sm font-bold px-3 py-1 rounded-full inline-block">
              Prabhag 20
            </div>
          </div>
        </div> */}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            <div className="font-bold text-sm text-gray-900">10K+</div>
            <div className="text-xs text-orange-600">Voters</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            <div className="font-bold text-sm text-gray-900">50+</div>
            <div className="text-xs text-orange-600">Booths</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-2">
            <div className="font-bold text-sm text-gray-900">99%</div>
            <div className="text-xs text-orange-600">Accuracy</div>
          </div>
        </div>
      </div>


      {/* Second politicial branding section  */}
      {/* Enhanced Political Branding Section */}
      <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto border-2 border-orange-300">
        <div className="flex h-auto"> {/* Fixed height for consistency */}

          {/* Left Side - Politician Image (30%) */}
          <div className="w-5/10 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-transparent z-10"></div>
            <img
              src="/banner2.png"
              alt="Political Leader"
              className="w-full h-full object-cover items-center bg-amber-50"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='192' viewBox='0 0 120 192'%3E%3Crect width='120' height='192' fill='%23fed7aa'/%3E%3Ccircle cx='60' cy='70' r='30' fill='%23fdba74'/%3E%3Crect x='45' y='110' width='30' height='60' fill='%23fdba74'/%3E%3C/svg%3E";
              }}
            />
            {/* Badge on image */}
            {/* <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-xs font-bold text-orange-600">Official</span>
            </div> */}
          </div>

          {/* Right Side - Content (70%) */}
          <div className="w-7/10 p-4 flex flex-col justify-between bg-amber-50">

            {/* Top Section - Party Logos and Heading */}
            <div>
              {/* Party Alliance Logos */}
              <div className="flex justify-center items-center mb-3">
                <div className="flex space-x-2">
                  {/* Main Party Logo */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center ">
                    <img src="https://crystalpng.com/wp-content/uploads/2023/05/bjp-logo-png-1024x1024.png" alt="BJP" />
                  </div>
                  {/* Alliance Partner 1 */}
                  <div className="w-9 h-9 rounded flex items-center justify-center">
                    <img src="https://images.seeklogo.com/logo-png/39/2/shiv-sena-logo-png_seeklogo-393250.png?v=1957904908623799264" alt="Partner" />
                  </div>
                  {/* Alliance Partner 2 */}
                  <div className="w-8 h-8 rounded flex items-center justify-center">
                    <img src="https://www.clipartmax.com/png/middle/429-4291464_rashtrawadi-punha-clipart-nationalist-congress-party-rashtrawadi-congress-party-logo-png.png" alt="Partner" />
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <h3 className="text-orange-500 font-bold text-lg mb-1 leading-tight">
                Vinod Murlidhar Mapari
              </h3>

              {/* Tagline */}
              <p className="text-gray-800 text-sm mb-3 font-medium leading-tight">
                Akola Mahanagarpalika 2025 Sarvatrik Nivadanuak Prabhag Kr. 20 che Adhikrut Umedvaar
              </p>
            </div>

            {/* Middle Section - Campaign Slogan */}
            <div className="mb-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                <p className="text-gray-900 text-sm font-bold text-center leading-tight">
                  "Your Vote, Your Voice - Let's Build Together!"
                </p>
              </div>
            </div>

            {/* Bottom Section - Call to Action */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-white text-orange-600 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-orange-50 transition-all duration-200 active:scale-95 text-center">
                Vote Now
              </button>
              <button className="flex-1 bg-orange-800 text-white py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-orange-900 transition-all duration-200 active:scale-95 text-center border border-orange-300">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="grid grid-cols-3 divide-x divide-white/20">
            <div className="py-2 text-center">
              <div className="text-white font-bold text-sm">10K+</div>
              <div className="text-orange-200 text-xs">Supporters</div>
            </div>
            <div className="py-2 text-center">
              <div className="text-white font-bold text-sm">50+</div>
              <div className="text-orange-200 text-xs">Booths</div>
            </div>
            <div className="py-2 text-center">
              <div className="text-white font-bold text-sm">98%</div>
              <div className="text-orange-200 text-xs">Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-6 max-w-md mx-auto">
        <button className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm">
          Campaign Updates
        </button>
      </div>
    </div>
  );
};

export default Home;