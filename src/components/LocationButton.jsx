import React, { useEffect, useState, useRef } from 'react';
import myLocationIcon from '../assets/my_location.png';

function LocationButton({ map, bottomSheetOpen, dragData = { progress: 1, offset: 0, closedOffset: 0 } }) {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const watchIdRef = useRef(null);
  const firstFixRef = useRef(true);

  const setButtonActive = (active) => {
    setIsTracking(active);
  };

  const updateAccuracyCircle = (loc, accuracy) => {
    if (!window.google || !window.google.maps || !map) return;
    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = new window.google.maps.Circle({
        strokeColor: '#1A73E8',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: '#1A73E8',
        fillOpacity: 0.15,
        map,
        center: loc,
        radius: accuracy || 30,
      });
    } else {
      accuracyCircleRef.current.setCenter(loc);
      if (typeof accuracy === 'number') accuracyCircleRef.current.setRadius(accuracy);
    }
  };

  const startTracking = () => {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }
    
    setIsLoading(true);
    firstFixRef.current = true;
    setButtonActive(false);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const accuracy = position.coords.accuracy;

          // Blue dot style icon (Google-like)
          const userIcon = {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#1A73E8',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          };

          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition(loc);
            if (typeof userMarkerRef.current.setIcon === 'function') userMarkerRef.current.setIcon(userIcon);
          } else {
            userMarkerRef.current = new window.google.maps.Marker({
              position: loc,
              map,
              title: 'Your location',
              icon: userIcon,
              clickable: false,
              optimized: true,
              zIndex: 9999,
            });
          }
          updateAccuracyCircle(loc, accuracy);

          if (firstFixRef.current) {
            setIsLoading(false);
            setButtonActive(true);
            // Zoom in to a closer level on first fix
            map.panTo(loc);
            map.setZoom(Math.max(map.getZoom() || 13, 16));
            firstFixRef.current = false;
          } else {
            // Follow the user in real-time
            map.panTo(loc);
          }
        },
        (error) => {
          console.warn('watchPosition error:', error);
          setIsLoading(false);
          setButtonActive(false);
          stopTracking();
        },
        options
      );
    } catch (e) {
      console.warn('Failed to start watchPosition', e);
      setIsLoading(false);
      setButtonActive(false);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current != null && navigator.geolocation && navigator.geolocation.clearWatch) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  const handleLocationClick = (e) => {
    e.stopPropagation();
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // Auto-start tracking when map is available
  useEffect(() => {
    if (map && !isTracking && !isLoading) {
      startTracking();
    }
  }, [map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current != null && navigator.geolocation && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Calculate button position based on actual bottom sheet position
  const getButtonPosition = () => {
    // On desktop (width >= 900px), keep button in fixed position
    if (window.innerWidth >= 900) {
      return '2rem'; // Fixed bottom position on desktop
    }
    
    const { offset, closedOffset } = dragData
    const buttonOffset = 16 // Distance above the sheet's top edge
    
    // The bottom sheet is positioned with bottom: 0 and translateY(offset)
    // When offset = 0: sheet is fully open, its top edge is high up
    // When offset = closedOffset: sheet is mostly hidden, only peek (72px) is visible
    
    // The sheet's effective top position from the bottom of the screen is:
    // screenHeight - sheetHeight + offset
    // But since we only care about the relative position, we can simplify:
    // When fully closed: the visible top is at 72px from bottom
    // When fully open: the visible top is at (72 + closedOffset) from bottom
    
    const peekHeight = 72
    const sheetTopFromBottom = peekHeight + (closedOffset - offset)
    const buttonBottom = sheetTopFromBottom + buttonOffset
    
    return `${buttonBottom}px`
  };

  const getRightPosition = () => {
    // On desktop, position relative to sidebar
    if (window.innerWidth >= 900) {
      return '26rem'; // Account for sidebar width + margin
    }
    return '1rem'; // Mobile position
  };

  const buttonStyle = {
    bottom: getButtonPosition(),
    right: getRightPosition(),
    transition: dragData.progress === 0 || dragData.progress === 1 ? 'bottom 300ms cubic-bezier(.22,.9,.35,1)' : 'none'
  };

  if (isLoading) {
    return (
      <button
        className="fixed z-[10001] bg-white border-none rounded-full shadow-lg cursor-pointer w-12 h-12 flex items-center justify-center outline-none"
        style={buttonStyle}
        disabled
        aria-label="Loading location"
      >
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleLocationClick}
      className="fixed z-[10001] bg-white hover:bg-gray-50 border-none rounded-full shadow-lg cursor-pointer w-12 h-12 flex items-center justify-center outline-none"
      style={buttonStyle}
      title="Live location"
      aria-label="Toggle live location"
    >
      <img 
        src={myLocationIcon} 
        alt="My Location" 
        width="25" 
        height="25"
        className={`transition-opacity duration-200 ${isTracking ? 'opacity-100' : 'opacity-70'}`}
      />
    </button>
  );
}

export default LocationButton;