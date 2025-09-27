import React from 'react';

const categories = [
  { id: 'all', name: 'All Issues', icon: '📋' },
  { id: 'pothole', name: 'Potholes', icon: '🕳️' },
  { id: 'street_light', name: 'Street Lights', icon: '💡' },
  { id: 'garbage', name: 'Garbage', icon: '🗑️' },
  { id: 'sidewalk', name: 'Sidewalks', icon: '🚶' },
  { id: 'water', name: 'Water Leaks', icon: '💧' },
  { id: 'traffic', name: 'Traffic', icon: '🚦' },
  { id: 'trees', name: 'Trees', icon: '🌳' },
  { id: 'graffiti', name: 'Graffiti', icon: '🎨' },
  { id: 'other', name: 'Other', icon: '📌' },
];

function CategoryFilter({ activeCategory, onSelectCategory }) {
  const scrollContainerRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  
  // Auto-scroll to show the active category
  React.useEffect(() => {
    if (scrollContainerRef.current && activeCategory && !isDragging) {
      const container = scrollContainerRef.current;
      const activeElement = container.querySelector(`[data-category="${activeCategory}"]`);
      
      if (activeElement) {
        const containerWidth = container.offsetWidth;
        const activeElementLeft = activeElement.offsetLeft;
        const activeElementWidth = activeElement.offsetWidth;
        const scrollTo = activeElementLeft - (containerWidth / 2) + (activeElementWidth / 2);
        
        container.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory, isDragging]);
  
  const onMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  
  const onMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Reduced scroll multiplier for slower scrolling
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const onMouseUp = () => {
    setIsDragging(false);
  };
  
  const onMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Touch event handlers for mobile
  const onTouchStart = (e) => {
    if (!scrollContainerRef.current) return;
    const touch = e.touches[0];
    setStartX(touch.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  
  const onTouchMove = (e) => {
    if (!scrollContainerRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const x = touch.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 0.99; // Further reduced scroll multiplier for mobile
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="sticky top-16 z-40">
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 px-3 py-3 overflow-x-auto hide-scrollbar"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch', // Enable smooth scrolling on iOS
          touchAction: 'pan-x' // Enable horizontal touch scrolling
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            data-category={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex-shrink-0 px-3 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 flex items-center space-x-1.5 border ${
              activeCategory === category.id 
                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
          >
            <span className="text-sm">{category.icon}</span>
            <span className="text-xs">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
