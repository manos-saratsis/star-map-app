import { useState } from 'react';
import { StarMapCanvas } from './components/StarMapCanvas';
import { SearchBar } from './components/SearchBar';
import { StarInfoPanel } from './components/StarInfoPanel';
import { ConstellationLegend } from './components/ConstellationLegend';
import { useStarData } from './hooks/useStarData';
import { useCamera } from './hooks/useCamera';
import type { Star } from './types';
import './App.css';

function App() {
  const stars = useStarData(4000);
  const { camera, pan, zoomAt, panTo } = useCamera();
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);

  // Selects a star and pans/zooms the camera to center on it. Used by the
  // search bar and by the "nearby stars" list in the info panel so that
  // re-selecting a star always brings it into view.
  const handleSelectStar = (star: Star) => {
    setSelectedStar(star);
    panTo(star.x, star.y, Math.max(camera.zoom, 2.5));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Star Map</h1>
        <SearchBar stars={stars} onSelectStar={handleSelectStar} />
      </header>

      <main className="app-main">
        <StarMapCanvas
          stars={stars}
          camera={camera}
          selectedStar={selectedStar}
          onSelectStar={setSelectedStar}
          onPan={pan}
          onZoom={zoomAt}
        />
        <ConstellationLegend />
        <StarInfoPanel
          star={selectedStar}
          stars={stars}
          onClose={() => setSelectedStar(null)}
          onSelectStar={handleSelectStar}
        />
      </main>
    </div>
  );
}

export default App;
