import type { Star } from '../types';
import { getConstellation } from '../data/constellations';
import { getNearestStars } from '../utils/distance';

interface StarInfoPanelProps {
  star: Star | null;
  stars: Star[];
  onClose: () => void;
  onSelectStar: (star: Star) => void;
}

export function StarInfoPanel({ star, stars, onClose, onSelectStar }: StarInfoPanelProps) {
  if (!star) return null;
  const constellation = getConstellation(star.constellationId);
  const nearbyStars = getNearestStars(star, stars, 5);

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

      <h3>Nearby stars</h3>
      <ul className="nearby-stars">
        {nearbyStars.map(({ star: nearStar, distance }) => (
          <li key={nearStar.id}>
            <button
              type="button"
              className="nearby-star-button"
              onClick={() => onSelectStar(nearStar)}
            >
              <span className="star-name">{nearStar.name ?? nearStar.catalogId}</span>
              <span className="star-mag">{distance.toFixed(1)} units</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
