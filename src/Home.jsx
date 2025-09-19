import React,{ useEffect, useRef, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import LocationButton from './components/LocationButton'

const mockNearby = [
  {
    id: 1,
    title: 'Central Library',
    summary: 'Popular public library with free wifi',
    location: 'Main St & 4th Ave'
  },
  {
    id: 2,
    title: 'Riverside Cafe',
    summary: 'Local cafe, known for brunch',
    location: 'Riverside Park'
  },
  {
    id: 3,
    title: 'City Garden',
    summary: 'Small community garden with benches',
    location: 'Oak St & 7th'
  }
]

function BottomSheet({ items, onStateChange, onDragPosition }) {
  const sheetRef = useRef(null)
  const handleRef = useRef(null)
  const startY = useRef(0)
  const dragStartOffset = useRef(0)
  const currentOffset = useRef(0)
  const closedOffset = useRef(0)
  const [isOpen, setIsOpen] = useState(false)

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
        <div className="nearby-list">
          {items.map((it) => (
            <div key={it.id} className="nearby-card">
              <div className="nearby-info">
                <h4>{it.title}</h4>
                <p className="nearby-sub">{it.summary}</p>
                <p className="nearby-loc">{it.location}</p>
              </div>
              <div className="nearby-actions">
                <button className="btn btn-primary">Directions</button>
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
      const onMapTouchStart = () => {
        isMapInteracting = true
      }
      
      const onMapTouchEnd = (e) => {
        // Prevent touch end from bubbling to parent elements
        if (isMapInteracting) {
          e.stopPropagation()
          isMapInteracting = false
        }
      }
      
      // Use capture phase to ensure we catch the event first
      mapContainer.addEventListener('touchstart', onMapTouchStart, { passive: true })
      mapContainer.addEventListener('touchend', onMapTouchEnd, { passive: false })
      
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
        <LocationButton 
          map={map} 
          bottomSheetOpen={bottomSheetOpen}
          dragData={dragData}
        />
      )}
    </div>
  )
}
