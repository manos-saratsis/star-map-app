import { useState } from 'react';
import { StarMapCanvas } from './components/StarMapCanvas';
import { SearchBar } from './components/SearchBar';
import { StarInfoPanel } from './components/StarInfoPanel';
import { SelectedStarsTable } from './components/SelectedStarsTable';
import { ConstellationLegend } from './components/ConstellationLegend';
import { useStarData } from './hooks/useStarData';
import { useCamera } from './hooks/useCamera';
import type { Star } from './types';
import './App.css';

function App() {
  const stars = useStarData(4000);
  const { camera, pan, zoomAt, panTo } = useCamera();
  const [selectedStars, setSelectedStars] = useState<Star[]>([]);

  const handleSelectFromSearch = (star: Star) => {
    setSelectedStars([star]);
    panTo(star.x, star.y, Math.max(camera.zoom, 2.5));
  };

  const handleSelectStar = (star: Star, shiftKey: boolean) => {
    if (shiftKey) {
      // Shift-click toggles the star in the multi-selection.
      setSelectedStars((prev) =>
        prev.some((s) => s.id === star.id)
          ? prev.filter((s) => s.id !== star.id)
          : [...prev, star],
      );
    } else {
      // A plain click clears any multi-selection and selects just this star.
      setSelectedStars([star]);
    }
  };

  const handleRemoveStar = (id: string) => {
    setSelectedStars((prev) => prev.filter((s) => s.id !== id));
  };

  const handleClearSelection = () => setSelectedStars([]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Star Map</h1>
        <SearchBar stars={stars} onSelectStar={handleSelectFromSearch} />
      </header>

      <main className="app-main">
        <StarMapCanvas
          stars={stars}
          camera={camera}
          selectedStars={selectedStars}
          onSelectStar={handleSelectStar}
          onPan={pan}
          onZoom={zoomAt}
        />
        <ConstellationLegend />
        {selectedStars.length > 1 ? (
          <SelectedStarsTable
            stars={selectedStars}
            onClose={handleClearSelection}
            onRemoveStar={handleRemoveStar}
          />
        ) : (
          <StarInfoPanel star={selectedStars[0] ?? null} onClose={handleClearSelection} />
        )}
      </main>
    </div>
  );
}

export default App;
