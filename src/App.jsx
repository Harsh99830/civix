import { useEffect, useRef, useState } from 'react'
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
  const startY = useRef(0)
  const currentY = useRef(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const el = sheetRef.current
    if (!el) return

    const onTouchStart = (e) => {
      startY.current = e.touches ? e.touches[0].clientY : e.clientY
      el.style.transition = 'none'
    }

    const onTouchMove = (e) => {
      const y = e.touches ? e.touches[0].clientY : e.clientY
      const dy = y - startY.current
      currentY.current = dy
      // only drag upwards when open/closed appropriately
      if (!isOpen && dy < 0) return
      if (isOpen && dy > 0 && dy > window.innerHeight * 0.6) return
      el.style.transform = `translateY(${Math.max(0, -dy)}px)`
    }

    const onTouchEnd = () => {
      el.style.transition = ''
      // simple threshold
      if (-currentY.current > 80) {
        setIsOpen(true)
      } else if (currentY.current > 120) {
        setIsOpen(false)
      }
      el.style.transform = ''
      currentY.current = 0
    }

    el.addEventListener('touchstart', onTouchStart)
    el.addEventListener('touchmove', onTouchMove)
    el.addEventListener('touchend', onTouchEnd)
    // mouse support
    el.addEventListener('mousedown', onTouchStart)
    window.addEventListener('mousemove', onTouchMove)
    window.addEventListener('mouseup', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('mousedown', onTouchStart)
      window.removeEventListener('mousemove', onTouchMove)
      window.removeEventListener('mouseup', onTouchEnd)
    }
  }, [isOpen])

  return (
    <div
      ref={sheetRef}
      className={`bottom-sheet ${isOpen ? 'open' : 'closed'}`}>
      <div className="sheet-handle" onClick={() => setIsOpen(!isOpen)}>
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

function App() {
  const [nearby] = useState(mockNearby)

  return (
    <div className="app-root">
      <header className="map-header">
        <div className="map-wrap tall">
          <iframe
            title="City map"
            className="map-iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9556513153163!3d-37.81732797975178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f1f1f1%3A0x1!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1610000000000"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </header>

      <main className="content">
       
      </main>

      <BottomSheet items={nearby} />
    </div>
  )
}

export default App
