import React, { useLayoutEffect, useRef } from 'react';
import reportIcon from '../assets/report_icon.png';

function ReportIssueButton({ bottomSheetOpen, dragData = {}, onClick }) {
  const buttonRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastUpdate = useRef(0);
  
  useLayoutEffect(() => {
    const updatePosition = (timestamp) => {
      // Throttle updates to ~60fps (16ms)
      if (timestamp - lastUpdate.current < 16 && dragData.offset !== undefined) {
        animationFrameId.current = requestAnimationFrame(updatePosition);
        return;
      }
      
      lastUpdate.current = timestamp;
      
      if (!buttonRef.current) return;
      
      // On desktop (width >= 900px), keep button in fixed position
      if (window.innerWidth >= 900) {
        buttonRef.current.style.bottom = '2rem';
        buttonRef.current.style.right = '5.5rem';
        return;
      }
      
      const { offset = 0, closedOffset = 0 } = dragData;
      const buttonOffset = 16; // Distance above the sheet's top edge
      const peekHeight = 72;
      const sheetTopFromBottom = peekHeight + (closedOffset - offset);
      const buttonBottom = sheetTopFromBottom + buttonOffset;
      
      // Directly update the DOM for better performance
      buttonRef.current.style.bottom = `${buttonBottom}px`;
      
      // Schedule next update
      animationFrameId.current = requestAnimationFrame(updatePosition);
    };
    
    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(updatePosition);
    
    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dragData.offset, dragData.closedOffset]);
  
  // Handle window resize
  useLayoutEffect(() => {
    const handleResize = () => {
      if (!buttonRef.current) return;
      
      if (window.innerWidth >= 900) {
        buttonRef.current.style.bottom = '2rem';
        buttonRef.current.style.right = '5.5rem';
      } else {
        buttonRef.current.style.right = '4.5rem';
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="fixed z-[10001] bg-white hover:bg-gray-50 border-none rounded-full shadow-lg cursor-pointer w-12 h-12 flex items-center justify-center outline-none transition-transform duration-200 right-[4.5rem]"
      style={{
        bottom: '1rem',
        right: '4.5rem',
        transform: 'translateZ(0)', // Force GPU acceleration
        willChange: 'transform, bottom' // Hint browser to optimize these properties
      }}
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
