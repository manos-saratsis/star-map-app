import { useMemo, useState } from 'react';
import { StarMapCanvas } from './components/StarMapCanvas';
import { SearchBar } from './components/SearchBar';
import { StarInfoPanel } from './components/StarInfoPanel';
import { ConstellationLegend } from './components/ConstellationLegend';
import { MagnitudeFilter } from './components/MagnitudeFilter';
import { useStarData } from './hooks/useStarData';
import { useCamera } from './hooks/useCamera';
import type { Star } from './types';
import './App.css';

const MIN_MAGNITUDE = 0.5;
const MAX_MAGNITUDE = 7;

function App() {
  const stars = useStarData(4000);
  const { camera, pan, zoomAt, panTo } = useCamera();
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [magnitudeLimit, setMagnitudeLimit] = useState(MAX_MAGNITUDE);

  // Only stars at or brighter than the selected magnitude threshold are
  // rendered (and thus selectable/hit-testable) on the canvas.
  const visibleStars = useMemo(
    () => stars.filter((star) => star.magnitude <= magnitudeLimit),
    [stars, magnitudeLimit]
  );

  const handleSelectFromSearch = (star: Star) => {
    setSelectedStar(star);
    panTo(star.x, star.y, Math.max(camera.zoom, 2.5));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Star Map</h1>
        <SearchBar stars={stars} onSelectStar={handleSelectFromSearch} />
        <MagnitudeFilter
          value={magnitudeLimit}
          onChange={setMagnitudeLimit}
          min={MIN_MAGNITUDE}
          max={MAX_MAGNITUDE}
          visibleCount={visibleStars.length}
          totalCount={stars.length}
        />
      </header>

      <main className="app-main">
        <StarMapCanvas
          stars={visibleStars}
          camera={camera}
          selectedStar={selectedStar}
          onSelectStar={setSelectedStar}
          onPan={pan}
          onZoom={zoomAt}
        />
        <ConstellationLegend />
        <StarInfoPanel star={selectedStar} onClose={() => setSelectedStar(null)} />
      </main>
    </div>
  );
}

export default App;
