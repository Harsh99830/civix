import React from 'react';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-6">
            <button 
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              aria-label="Menu"
            >
              <svg 
                className="h-7 w-7" 
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
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">civix</span>
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
