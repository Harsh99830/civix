import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * A component that displays a 2km radius circle at the current location by default
 * and allows moving it with a long-press.
 */
function UserLocationRange({ map, userLocation }) {
  const rangeCircleRef = useRef(null);
  const [center, setCenter] = useState(null);
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);
  
  // Convert 2km to meters (Google Maps uses meters for circle radius)
  const RANGE_RADIUS_METERS = 2000;

  // Function to fit the map bounds to show the entire circle
  const fitCircleBounds = (map, center) => {
    if (!map || !center) return;
    
    const circle = new window.google.maps.Circle({
      center,
      radius: RANGE_RADIUS_METERS
    });
    
    const bounds = circle.getBounds();
    map.fitBounds(bounds);
    
    // Optional: Add some padding around the circle
    map.panToBounds(bounds, {
      top: 50,    // 50px padding from top
      right: 50,  // 50px padding from right
      bottom: 50, // 50px padding from bottom
      left: 50    // 50px padding from left
    });
  };

  // Set initial center to user's location when available and fit bounds
  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
      if (map) {
        // Small delay to ensure map is fully loaded
        const timer = setTimeout(() => {
          fitCircleBounds(map, userLocation);
        }, 300);
        return () => clearTimeout(timer);
      }
    } else if (map) {
      // Fallback to map center if user location is not available
      const initialCenter = map.getCenter();
      setCenter({ lat: initialCenter.lat(), lng: initialCenter.lng() });
    }
  }, [userLocation, map]);

  // Initialize event listeners when the map is ready
  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Track touch points to detect multi-touch
    let touchCount = 0;
    let touchStartTime = 0;
    const LONG_PRESS_DURATION = 500; // ms
    const TOUCH_MOVE_TOLERANCE = 10; // pixels
    let touchStartCoords = { x: 0, y: 0 };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        // Single touch - start long press timer
        touchCount = 1;
        touchStartTime = Date.now();
        touchStartCoords = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        
        longPressTimer.current = setTimeout(() => {
          if (touchCount === 1) { // Only trigger if still a single touch
            isLongPress.current = true;
            const touch = e.touches[0];
            const latLng = new window.google.maps.LatLng(
              touch.latLng.lat(),
              touch.latLng.lng()
            );
            const newCenter = { lat: latLng.lat(), lng: latLng.lng() };
            setCenter(newCenter);
            // Fit bounds after moving circle with long press
            fitCircleBounds(map, newCenter);
          }
        }, LONG_PRESS_DURATION);
      } else {
        // Multi-touch - cancel any pending long press
        touchCount = e.touches.length;
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 1) {
        // Multi-touch - cancel any pending long press
        touchCount = e.touches.length;
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        return;
      }

      // For single touch, check if finger moved too much
      if (touchCount === 1 && touchStartTime > 0) {
        const touch = e.touches[0];
        const dx = Math.abs(touch.clientX - touchStartCoords.x);
        const dy = Math.abs(touch.clientY - touchStartCoords.y);
        
        // If finger moved too much, cancel the long press
        if (dx > TOUCH_MOVE_TOLERANCE || dy > TOUCH_MOVE_TOLERANCE) {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      // Reset touch state
      touchCount = 0;
      touchStartTime = 0;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    // Mouse event handlers for desktop
    const handleMouseDown = (e) => {
      // Only handle left mouse button
      if (e.domEvent.button !== 0) return;
      
      isLongPress.current = false;
      touchStartCoords = {
        x: e.domEvent.clientX,
        y: e.domEvent.clientY
      };
      
      longPressTimer.current = setTimeout(() => {
        isLongPress.current = true;
        const latLng = e.latLng || map.getCenter();
        const newCenter = { lat: latLng.lat(), lng: latLng.lng() };
        setCenter(newCenter);
        // Fit bounds after moving circle with long press
        fitCircleBounds(map, newCenter);
      }, LONG_PRESS_DURATION);
    };

    const handleMouseUp = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    const handleMouseMove = (e) => {
      if (longPressTimer.current && touchStartCoords) {
        const dx = Math.abs(e.domEvent.clientX - touchStartCoords.x);
        const dy = Math.abs(e.domEvent.clientY - touchStartCoords.y);
        
        // If mouse moved too much, cancel the long press
        if (dx > TOUCH_MOVE_TOLERANCE || dy > TOUCH_MOVE_TOLERANCE) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
      }
    };

    // Add event listeners
    const mouseDownListener = map.addListener('mousedown', handleMouseDown);
    const mouseUpListener = map.addListener('mouseup', handleMouseUp);
    const mouseMoveListener = map.addListener('mousemove', handleMouseMove);
    
    // Touch event listeners
    const touchStartListener = map.addListener('touchstart', handleTouchStart);
    const touchMoveListener = map.addListener('touchmove', handleTouchMove, { passive: true });
    const touchEndListener = map.addListener('touchend', handleTouchEnd);
    const touchCancelListener = map.addListener('touchcancel', handleTouchEnd);

    // Cleanup
    return () => {
      mouseDownListener.remove();
      mouseUpListener.remove();
      mouseMoveListener.remove();
      touchStartListener.remove();
      touchMoveListener.remove();
      touchEndListener.remove();
      touchCancelListener.remove();
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (rangeCircleRef.current) {
        rangeCircleRef.current.setMap(null);
      }
    };
  }, [map]);

  // Update circle position when center changes
  useEffect(() => {
    if (!map || !window.google?.maps || !center) return;

    // Create or update the circle
    if (!rangeCircleRef.current) {
      rangeCircleRef.current = new window.google.maps.Circle({
        strokeColor: '#34D399',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: '#34D399',
        fillOpacity: 0.1,
        map,
        center,
        radius: RANGE_RADIUS_METERS,
        clickable: false,
        zIndex: 1,
      });
      
      // Fit bounds when circle is first created
      fitCircleBounds(map, center);
    } else {
      rangeCircleRef.current.setCenter(center);
      rangeCircleRef.current.setMap(map);
    }

    return () => {
      if (rangeCircleRef.current) {
        rangeCircleRef.current.setMap(null);
      }
    };
  }, [center, map]);

  return null; // This component doesn't render anything visible
}

UserLocationRange.propTypes = {
  map: PropTypes.object,
  userLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
};

export default UserLocationRange;
