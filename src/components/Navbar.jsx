import React from 'react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-4">
            <button 
              className="inline-flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none transition-colors duration-200"
              aria-label="Menu"
            >
              <svg 
                className="h-7 w-7 block" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-gray-900 tracking-tight leading-none">civix</span>
            </div>
          </div>
          <div className="flex items-center">
            {/* Add any additional navigation items here */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
