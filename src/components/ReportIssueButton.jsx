import React, { useMemo } from 'react';
import reportIcon from '../assets/report_icon.png';

function ReportIssueButton({ bottomSheetOpen, dragData, onClick }) {
  // Calculate button position based on bottom sheet position
  const buttonStyle = useMemo(() => {
    // On desktop (width >= 900px), keep button in fixed position
    if (window.innerWidth >= 900) {
      return {
        bottom: '2rem',
        right: '5.5rem', // Position to the left of the location button
      };
    }

    const { offset, closedOffset } = dragData || {};
    const buttonOffset = 16; // Distance above the sheet's top edge
    const peekHeight = 72;
    const sheetTopFromBottom = peekHeight + ((closedOffset || 0) - (offset || 0));
    const buttonBottom = sheetTopFromBottom + buttonOffset;

    return {
      bottom: `${buttonBottom}px`,
      right: '4.5rem', // Position to the left of the location button on mobile
    };
  }, [dragData]);

  return (
    <button
      onClick={onClick}
      className="fixed z-[10001] bg-white hover:bg-gray-50 border-none rounded-full shadow-lg cursor-pointer w-12 h-12 flex items-center justify-center outline-none transition-all duration-200"
      style={buttonStyle}
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

export default React.memo(ReportIssueButton);
