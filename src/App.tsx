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
  const [activeConstellationId, setActiveConstellationId] = useState<string | null>(null);

  const handleSelectFromSearch = (star: Star) => {
    setSelectedStar(star);
    panTo(star.x, star.y, Math.max(camera.zoom, 2.5));
  };

  const handleToggleConstellation = (id: string) => {
    setActiveConstellationId((current) => (current === id ? null : id));
  };

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
          selectedStar={selectedStar}
          onSelectStar={setSelectedStar}
          onPan={pan}
          onZoom={zoomAt}
          activeConstellationId={activeConstellationId}
        />
        <ConstellationLegend
          activeConstellationId={activeConstellationId}
          onToggleConstellation={handleToggleConstellation}
        />
        <StarInfoPanel star={selectedStar} onClose={() => setSelectedStar(null)} />
      </main>
    </div>
  );
}

export default App;
