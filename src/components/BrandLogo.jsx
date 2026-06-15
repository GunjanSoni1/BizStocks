// src/components/BrandLogo.jsx
import React from 'react';

const BrandLogo = ({ setCurrentPage }) => (
  <div 
    onClick={() => setCurrentPage && setCurrentPage('Overview')}
    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage && setCurrentPage('Overview');
      }
    }}
  >
    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 text-white font-black text-xl grid place-items-center shadow-lg">
      BZ
    </div>
    <div>
      <p className="text-lg font-semibold tracking-wide text-white">BizStock</p>
    </div>
  </div>
);

export default BrandLogo;


