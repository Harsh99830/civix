import React from 'react';
import reportIcon from '../assets/report_icon.png'; // You'll need to add this icon

function ReportIssueButton({ onClick, style }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-[10001] bg-white hover:bg-gray-50 border-none rounded-full shadow-lg cursor-pointer w-12 h-12 flex items-center justify-center outline-none"
      style={style}
      title="Report Issue"
      aria-label="Report an issue"
    >
      <img 
        src={reportIcon} 
        alt="Report Issue" 
        width="20" 
        height="20"
        className="opacity-70 hover:opacity-100 transition-opacity duration-200"
      />
    </button>
  );
}

export default ReportIssueButton;
