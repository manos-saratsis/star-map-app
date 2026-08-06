import type { Star } from '../types';
import { getConstellation } from '../data/constellations';

interface StarInfoPanelProps {
  star: Star | null;
  onClose: () => void;
}

export function StarInfoPanel({ star, onClose }: StarInfoPanelProps) {
  if (!star) return null;
  const constellation = getConstellation(star.constellationId);

  return (
    <div className="star-info-panel">
      <button className="close-button" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{star.name ?? star.catalogId}</h2>
      <dl>
        <dt>Catalog ID</dt>
        <dd>{star.catalogId}</dd>
        <dt>Magnitude</dt>
        <dd>{star.magnitude}</dd>
        <dt>Spectral class</dt>
        <dd>{star.spectralClass}</dd>
        <dt>Constellation</dt>
        <dd style={{ color: constellation?.color }}>{constellation?.name ?? 'Unknown'}</dd>
        <dt>Position</dt>
        <dd>
          x: {star.x.toFixed(1)}, y: {star.y.toFixed(1)}
        </dd>
      </dl>
    </div>
  );
}
