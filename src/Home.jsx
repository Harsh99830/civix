import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

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

function BottomSheet({ items }) {
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
    }

    const onEnd = () => {
      // decide open/close based on how far we are from open (0) vs closed
      const threshold = closedOffset.current * 0.35 // 35% to open
      if (currentOffset.current <= threshold) {
        setIsOpen(true)
      } else if (currentOffset.current >= closedOffset.current * 0.65) {
        setIsOpen(false)
      } else {
        // snap to nearest state
        setIsOpen(currentOffset.current < closedOffset.current / 2)
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

function MapView() {
  const mapEl = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current || !mapEl.current) return
    const center = [-37.81732797975178, 144.9556513153163]
    const map = L.map(mapEl.current, {
      center,
      zoom: 13,
      zoomControl: true,
      dragging: true,
      touchZoom: true,
      tap: false // helps with React pointer events on some devices
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return <div ref={mapEl} className="map-iframe" />
}

export default function Home() {
  const [nearby] = useState(mockNearby)

  return (
    <div className="app-root">
      <header className="map-header">
        <div className="map-wrap tall">
          <MapView />
        </div>
      </header>

      <main className="content">
        
      </main>

      <BottomSheet items={nearby} />
    </div>
  )
}
