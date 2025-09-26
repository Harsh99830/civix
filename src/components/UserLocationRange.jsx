import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * A component that displays a 2km radius circle at the current location
 */
function UserLocationRange({ map, userLocation }) {
  const rangeCircleRef = useRef(null);
  const [center, setCenter] = useState(null);
  
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
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default UserLocationRange;