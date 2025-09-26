import React, { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import LocationButton from './components/LocationButton'
import ReportIssueButton from './components/ReportIssueButton'
import pothole1 from './assets/pothole1.png'
import locationMarker from './assets/location_marker.png'
import streetLight from './assets/streetlight.png'
import garbage from './assets/garbage.png'
import sidewalk from './assets/sidewalk.png'
import waterleak from './assets/waterleakage.png'
import trafficsignal from './assets/trafficsignal.png'
import tree from './assets/tree.png'
const mockNearby = [
  {
    id: 1,
    title: 'Large Pothole on Main Street',
    description: 'A deep pothole has formed at the intersection causing traffic issues and potential damage to vehicles.',
    category: 'Pothole',
    progress: 45,
    image: pothole1,
    location: 'Main St & 5th Ave',
    issueDetails: {
      id: 1,
      title: 'Large Pothole on Main Street',
      description: 'A deep pothole has formed at the intersection causing traffic issues and potential damage to vehicles.',
      category: 'Pothole',
      progress: 45,
      image: pothole1,
      location: 'Main St & 5th Ave'
    }
  },
  {
    id: 2,
    title: 'Broken Street Light',
    description: 'The street light at the corner has been flickering and needs immediate attention for safety reasons.',
    category: 'Street Light',
    progress: 20,
    image: streetLight,
    location: 'Elm St & 3rd Ave',
    issueDetails: {
      id: 2,
      title: 'Broken Street Light',
      description: 'The street light at the corner has been flickering and needs immediate attention for safety reasons.',
      category: 'Street Light',
      progress: 20,
      image: streetLight,
      location: 'Elm St & 3rd Ave'
    }
  },
  {
    id: 3,
    title: 'Garbage Not Collected',
    description: 'Garbage has been piling up for days in the designated area, causing foul smell and hygiene issues.',
    category: 'Sanitation',
    progress: 65,
    image: garbage,
    location: 'Oak St & 7th Ave',
    issueDetails: {
      id: 3,
      title: 'Garbage Not Collected',
      description: 'Garbage has been piling up for days in the designated area, causing foul smell and hygiene issues.',
      category: 'Sanitation',
      progress: 65,
      image: garbage,
      location: 'Oak St & 7th Ave'
    }
  },
  {
    id: 4,
    title: 'Damaged Sidewalk',
    description: 'Uneven and broken sidewalk tiles creating a tripping hazard for pedestrians, especially during night time.',
    category: 'Sidewalk',
    progress: 30,
    image: sidewalk,
    location: 'Pine St & 2nd Ave',
    issueDetails: {
      id: 4,
      title: 'Damaged Sidewalk',
      description: 'Uneven and broken sidewalk tiles creating a tripping hazard for pedestrians, especially during night time.',
      category: 'Sidewalk',
      progress: 30,
      image: sidewalk,
      location: 'Pine St & 2nd Ave'
    }
  },
  {
    id: 5,
    title: 'Water Leakage',
    description: 'Continuous water leakage from the main water line is causing water wastage and road damage.',
    category: 'Water Supply',
    progress: 15,
    image: waterleak,
    location: 'Cedar St & 8th Ave',
    issueDetails: {
      id: 5,
      title: 'Water Leakage',
      description: 'Continuous water leakage from the main water line is causing water wastage and road damage.',
      category: 'Water Supply',
      progress: 15,
      image: waterleak,
      location: 'Cedar St & 8th Ave'
    }
  },
  {
    id: 6,
    title: 'Traffic Signal Malfunction',
    description: 'The traffic signal at the intersection is not functioning properly, causing traffic congestion.',
    category: 'Traffic',
    progress: 80,
    image: trafficsignal,
    location: 'Maple St & 4th Ave',
    issueDetails: {
      id: 6,
      title: 'Traffic Signal Malfunction',
      description: 'The traffic signal at the intersection is not functioning properly, causing traffic congestion.',
      category: 'Traffic',
      progress: 80,
      image: trafficsignal,
      location: 'Maple St & 4th Ave'
    }
  },
  {
    id: 7,
    title: 'Overgrown Trees',
    description: 'Tree branches are overgrown and obstructing the street lights and road signs.',
    category: 'Parks',
    progress: 25,
    image: tree,
    location: 'Birch St & 6th Ave',
    issueDetails: {
      id: 7,
      title: 'Overgrown Trees',
      description: 'Tree branches are overgrown and obstructing the street lights and road signs.',
      category: 'Parks',
      progress: 25,
      image: tree,
      location: 'Birch St & 6th Ave'
    }
  }
]

function BottomSheet({ items, onStateChange, onDragPosition }) {
  const sheetRef = useRef(null)
  const handleRef = useRef(null)
  const listRef = useRef(null)
  const startY = useRef(0)
  const dragStartOffset = useRef(0)
  const currentOffset = useRef(0)
  const closedOffset = useRef(0)
  const [isOpen, setIsOpen] = useState(false)
  const touchStartX = useRef(0)
  const touchStartScrollLeft = useRef(0)
  
  // Handle scroll momentum with better touch support
  // Handle touch start for mobile with passive: false for better control
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartScrollLeft.current = listRef.current?.scrollLeft || 0
    
    // Enable smooth scrolling for touch devices
    if (listRef.current) {
      listRef.current.style.scrollBehavior = 'smooth'
    }
  }, [])

  // Simple touch move handler
  const handleTouchMove = useCallback((e) => {
    if (!listRef.current) return
    
    const touch = e.touches[0]
    const touchX = touch.clientX
    const touchDiff = touchStartX.current - touchX
    
    const list = listRef.current
    const maxScroll = list.scrollWidth - list.clientWidth
    
    // Only handle horizontal scroll
    if (Math.abs(touchDiff) > 5) {
      e.preventDefault()
      let newScroll = touchStartScrollLeft.current + touchDiff
      
      // Prevent scrolling past boundaries
      newScroll = Math.max(0, Math.min(newScroll, maxScroll))
      list.scrollLeft = newScroll
      
      // Update touch start for next move
      touchStartX.current = touchX
      touchStartScrollLeft.current = newScroll
    }
  }, [])

  // Simple scroll handler with snapping
  const handleScroll = useCallback((e) => {
    if (!listRef.current) return
    
    const list = listRef.current
    const scrollLeft = list.scrollLeft
    const scrollWidth = list.scrollWidth - list.clientWidth
    const itemWidth = (list.firstChild?.clientWidth || list.clientWidth) + 16 // 16px gap
    
    // Prevent elastic scrolling
    if (scrollLeft < 0) {
      list.scrollLeft = 0
      return
    } else if (scrollLeft > scrollWidth) {
      list.scrollLeft = scrollWidth
      return
    }
    
    // Simple snap to nearest item when scrolling stops
    clearTimeout(list.scrollTimeout)
    list.scrollTimeout = setTimeout(() => {
      const snapIndex = Math.round(scrollLeft / itemWidth)
      const snapPosition = snapIndex * itemWidth
      
      if (Math.abs(scrollLeft - snapPosition) > 5) {
        list.scrollTo({
          left: snapPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }, [])

  useEffect(() => {
    const el = sheetRef.current
    const handle = handleRef.current
    if (!el || !handle) return

    // compute closed offset in pixels (how far down when closed)
    const computeClosedOffset = () => {
      const rect = el.getBoundingClientRect()
      const peek = 72 // matches CSS peek height
      const off = Math.max(0, rect.height - peek)
      closedOffset.current = off
    }
    computeClosedOffset()

    const onResize = () => {
      computeClosedOffset()
      // ensure transform cleared so class-based state applies after resize
      el.style.transform = ''
    }

    const onStart = (e) => {
      // prevent map from hijacking the gesture
      if (e.cancelable) e.preventDefault()
      if (typeof e.stopPropagation === 'function') e.stopPropagation()
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      startY.current = clientY
      dragStartOffset.current = isOpen ? 0 : closedOffset.current
      currentOffset.current = dragStartOffset.current
      el.style.transition = 'none'
      // prevent text selection while dragging with mouse
      document.body.style.userSelect = 'none'
    }

    const onMove = (e) => {
      // prevent page scroll / map pan during drag
      if (e && 'cancelable' in e && e.cancelable) e.preventDefault()
      if (startY.current === 0) return
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const dy = clientY - startY.current // down is +, up is -
      // offset increases when dragging down, decreases when dragging up
      const next = Math.min(
        closedOffset.current,
        Math.max(0, dragStartOffset.current + dy)
      )
      currentOffset.current = next
      el.style.transform = `translateY(${next}px)`
      
      // Notify parent of current drag position for button positioning
      if (onDragPosition) {
        const dragProgress = next / closedOffset.current // 0 = fully open, 1 = fully closed
        onDragPosition({ progress: dragProgress, offset: next, closedOffset: closedOffset.current })
      }
    }

    const onEnd = (e) => {
      // Skip if this is a touch end from the map
      if (e && e.type === 'touchend' && e.target.closest && e.target.closest('.map-iframe')) {
        return
      }
      
      // decide open/close based on how far we are from open (0) vs closed
      const threshold = closedOffset.current * 0.35 // 35% to open
      let newIsOpen
      if (currentOffset.current <= threshold) {
        newIsOpen = true
      } else if (currentOffset.current >= closedOffset.current * 0.65) {
        newIsOpen = false
      } else {
        // snap to nearest state
        newIsOpen = currentOffset.current < closedOffset.current / 2
      }
      setIsOpen(newIsOpen)
      if (onStateChange) onStateChange(newIsOpen)
      // Update drag position when transitioning to final state
      if (onDragPosition) {
        const finalOffset = newIsOpen ? 0 : closedOffset.current
        onDragPosition({ progress: newIsOpen ? 0 : 1, offset: finalOffset, closedOffset: closedOffset.current })
      }
      // restore transition and clear inline transform so class can animate
      el.style.transition = ''
      el.style.transform = ''
      startY.current = 0
      document.body.style.userSelect = ''
    }

    // attach only to handle for start, global for move/end
    handle.addEventListener('touchstart', onStart, { passive: false })
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
    handle.addEventListener('mousedown', onStart)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
    window.addEventListener('resize', onResize)

    return () => {
      handle.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      handle.removeEventListener('mousedown', onStart)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onEnd)
      window.removeEventListener('resize', onResize)
    }
  }, [isOpen])

  return (
    <div
      ref={sheetRef}
      className={`bottom-sheet ${isOpen ? 'open' : 'closed'}`}>
      <div className="sheet-handle" ref={handleRef}>
        <div className="handle-bar" />
        <span className="handle-label">Nearby</span>
      </div>

      <div className="sheet-content">
        <div 
          ref={listRef}
          className="nearby-list"
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {items.map((it) => (
            <div 
              key={it.id} 
              className="nearby-card"
            >
              <div className="p-4">
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {it.category || 'Pothole'}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{it.title}</h4>
                
                {/* Issue Image - Moved below title */}
                <div className="relative w-full h-48 bg-gray-100 mb-3 -mx-4">
                  {it.image ? (
                    <img 
                      src={it.image} 
                      alt={it.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{it.description}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{it.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${it.progress || 0}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{it.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MapView({ onMapReady }) {
  const mapEl = useRef(null)

  useEffect(() => {
    let scriptEl

    const init = () => {
      if (!window.google || !window.google.maps || !mapEl.current) return
      const center = { lat: -37.81732797975178, lng: 144.9556513153163 }
      // Create a flag to track map interaction
      let isMapInteracting = false
      
      const map = new window.google.maps.Map(mapEl.current, {
        center,
        zoom: 13,
        heading: 0,
        tilt: 0,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        fullscreenControl: false,
        streetViewControl: false,
        rotateControl: false,
        zoomControl: false,
        mapTypeControl: false,
        keyboardShortcuts: false,
      })
      
      // Notify parent component that map is ready
      if (onMapReady) onMapReady(map)
      
      // Add markers for the given coordinates
      const locations = [
        { lat: 26.778374, lng: 75.877988 },
        { lat: 26.776955, lng: 75.87657 },
        { lat: 26.778325, lng: 75.881454 },
        { lat: 26.781988, lng: 75.881922 },
        { lat: 26.786563, lng: 75.862612 },
        { lat: 26.773054, lng: 75.860337 },
        { lat: 26.768911, lng: 75.884617 }
      ]

      // Default marker options (red circle)
      const defaultIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#FF0000',
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 8
      };

      // Selected marker options (custom image)
      const selectedIcon = {
        url: locationMarker,
        scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40) // Center bottom of the image
      };

      // Store references to all markers
      const markers = [];
      let selectedMarker = null;

      locations.forEach((location, index) => {
        const marker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: `Location ${index + 1}`,
          icon: defaultIcon
        });

        // Add click event listener
        marker.addListener('click', () => {
          // Reset previously selected marker
          if (selectedMarker) {
            selectedMarker.setIcon(defaultIcon);
          }
          
          // Set new selected marker
          selectedMarker = marker;
          marker.setIcon(selectedIcon);
          
          // Zoom to the clicked marker with smooth animation
          map.panTo(marker.getPosition());
          map.setZoom(16); // You can adjust the zoom level (1-20 where 20 is most zoomed in)
        });

        markers.push(marker);
      })
      
      // Ensure container can host overlay elements
      try {
        if (mapEl.current && getComputedStyle(mapEl.current).position === 'static') {
          mapEl.current.style.position = 'relative'
        }
      } catch (_) {}
      
      // Create a centered loading overlay with a progress bar
      const loadingOverlay = document.createElement('div')
      loadingOverlay.style.position = 'absolute'
      loadingOverlay.style.inset = '0'
      loadingOverlay.style.display = 'none'
      loadingOverlay.style.alignItems = 'center'
      loadingOverlay.style.justifyContent = 'center'
      loadingOverlay.style.background = 'rgba(0,0,0,0.25)'
      loadingOverlay.style.zIndex = '3'
      
      const loadingBox = document.createElement('div')
      loadingBox.style.width = '60%'
      loadingBox.style.maxWidth = '260px'
      loadingBox.style.minWidth = '160px'
      loadingBox.style.background = '#ffffff'
      loadingBox.style.borderRadius = '10px'
      loadingBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
      loadingBox.style.padding = '14px 16px'
      loadingBox.style.display = 'flex'
      loadingBox.style.flexDirection = 'column'
      loadingBox.style.gap = '10px'
      
      const loadingText = document.createElement('div')
      loadingText.style.fontSize = '14px'
      loadingText.style.color = '#202124'
      loadingText.style.textAlign = 'center'
      
      // Inject spinner keyframes once
      if (!document.getElementById('civix-spinner-style')) {
        const style = document.createElement('style')
        style.id = 'civix-spinner-style'
        style.textContent = `@keyframes civix-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
        document.head.appendChild(style)
      }
      // Circular spinner
      const spinner = document.createElement('div')
      spinner.setAttribute('aria-label', 'Loading')
      spinner.style.width = '36px'
      spinner.style.height = '36px'
      spinner.style.margin = '0 auto'
      spinner.style.border = '3px solid #e0e0e0'
      spinner.style.borderTop = '3px solid #1A73E8'
      spinner.style.borderRadius = '50%'
      spinner.style.animation = 'civix-spin 1s linear infinite'
      
      loadingBox.appendChild(loadingText)
      loadingBox.appendChild(spinner)
      loadingOverlay.appendChild(loadingBox)
      mapEl.current.appendChild(loadingOverlay)
      
      const showLoading = () => {
        if (!loadingOverlay) return
        loadingOverlay.style.display = 'flex'
      }
      const hideLoading = () => {
        if (!loadingOverlay) return
        loadingOverlay.style.display = 'none'
      }
      
      // Add map interaction listeners
      const mapContainer = mapEl.current
      
      // Set initial interaction state
      map.set('isInteracting', false);
      map.set('userInteracted', false);
      
      const onInteractionStart = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        isMapInteracting = true;
        map.set('isInteracting', true);
        // Mark that user has manually interacted with the map
        map.set('userInteracted', true);
      };
      
      const onInteractionEnd = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        isMapInteracting = false;
        // Clear interaction flag after a short delay
        setTimeout(() => {
          map.set('isInteracting', false);
        }, 500);
      };
      
      const onMapDrag = () => {
        map.set('userInteracted', true);
      };
      
      // Add event listeners for both mouse and touch interactions
      const events = [
        'mousedown', 'mouseup', 'mousemove',
        'touchstart', 'touchend', 'touchmove',
        'dragstart', 'drag', 'dragend',
        'click', 'dblclick', 'center_changed',
        'bounds_changed', 'zoom_changed'
      ];
      
      events.forEach(event => {
        map.addListener(event, (e) => {
          if (event === 'drag' || event === 'touchmove') {
            onMapDrag();
          } else if (event.endsWith('start') || event === 'mousedown' || event === 'touchstart') {
            onInteractionStart(e);
          } else if (event.endsWith('end') || event === 'mouseup' || event === 'touchend' || event === 'click') {
            onInteractionEnd(e);
          }
        });
      });
      
      // Note: cleanup for these listeners is handled by the component lifecycle if needed.
      // Ensure no compass appears by keeping camera unrotated and untilted
      if (typeof map.setTilt === 'function') map.setTilt(0)
      if (typeof map.setHeading === 'function') map.setHeading(0)
      if (typeof map.setOptions === 'function') {
        map.setOptions({ heading: 0, tilt: 0 })
      }
      // Guard against gestures re-introducing tilt/heading (which shows compass)
      if (typeof map.addListener === 'function') {
        map.addListener('tilt_changed', () => {
          const t = typeof map.getTilt === 'function' ? map.getTilt() : 0
          if (t && typeof map.setTilt === 'function') map.setTilt(0)
        })
        map.addListener('heading_changed', () => {
          const h = typeof map.getHeading === 'function' ? map.getHeading() : 0
          if (h && typeof map.setHeading === 'function') map.setHeading(0)
        })
      }
      // Example marker (optional)
      // new window.google.maps.Marker({ position: center, map })


    }

    const ensureScript = () => new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve()
        return
      }
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.warn('VITE_GOOGLE_MAPS_API_KEY is not set. Please add it to your .env file.')
      }
      const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || ''}&v=weekly`
      scriptEl = document.createElement('script')
      scriptEl.src = src
      scriptEl.async = true
      scriptEl.defer = true
      scriptEl.onload = () => resolve()
      scriptEl.onerror = (e) => reject(e)
      document.head.appendChild(scriptEl)
    })

    ensureScript().then(init).catch((e) => {
      console.error('Failed to load Google Maps JS API', e)
    })

    return () => {
      // no explicit cleanup necessary for the script tag or map div here
      if (scriptEl && scriptEl.parentNode) {
        // leave the script in place to avoid reloading between navigations
      }
    }
  }, [])

  return <div ref={mapEl} className="map-iframe" />
}

export default function Home() {
  const [nearby] = useState(mockNearby)
  const [map, setMap] = useState(null)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [dragData, setDragData] = useState({ progress: 1, offset: 0, closedOffset: 0 })

  const handleMapReady = (mapInstance) => {
    setMap(mapInstance)
  }

  const handleBottomSheetStateChange = (isOpen) => {
    setBottomSheetOpen(isOpen)
  }

  const handleDragPosition = (data) => {
    setDragData(data)
  }

  return (
    <div className="app-root min-h-screen bg-gray-50">
      <Navbar />
      <header className="map-header pt-16">
        <div className="map-wrap tall">
          <MapView onMapReady={handleMapReady} />
        </div>
      </header>

      <main className="content">
        
      </main>

      <BottomSheet 
        items={nearby} 
        onStateChange={handleBottomSheetStateChange}
        onDragPosition={handleDragPosition}
      />
      
      {map && (
        <>
          <LocationButton 
            map={map} 
            bottomSheetOpen={bottomSheetOpen}
            dragData={dragData}
          />
          <ReportIssueButton 
            bottomSheetOpen={bottomSheetOpen}
            dragData={dragData}
            onClick={() => {
              // Handle report issue click
              console.log('Report issue clicked');
            }}
          />
        </>
      )}
    </div>
  )
}
