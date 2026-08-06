import { useMemo } from 'react';
import type { Star } from '../types';
import { getConstellation } from '../data/constellations';
import { findNearestStars } from '../utils/distance';

interface StarInfoPanelProps {
  star: Star | null;
  stars: Star[];
  onClose: () => void;
  onSelectStar: (star: Star) => void;
}

export function StarInfoPanel({ star, stars, onClose, onSelectStar }: StarInfoPanelProps) {
  const nearbyStars = useMemo(() => {
    if (!star) return [];
    return findNearestStars(star, stars, 5);
  }, [star, stars]);

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

      <div className="nearby-stars">
        <h3>Nearby stars</h3>
        <ul className="nearby-stars-list">
          {nearbyStars.map(({ star: nearby, distance }) => (
            <li key={nearby.id}>
              <button
                type="button"
                className="nearby-star-button"
                onClick={() => onSelectStar(nearby)}
              >
                <span className="star-name">{nearby.name ?? nearby.catalogId}</span>
                <span className="star-distance">{distance.toFixed(1)} ly</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
