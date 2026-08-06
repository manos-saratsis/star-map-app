import type { Star } from '../types';
import { getConstellation } from '../data/constellations';

interface StarInfoPanelProps {
  stars: Star[];
  onClose: () => void;
}

export function StarInfoPanel({ stars, onClose }: StarInfoPanelProps) {
  if (stars.length === 0) return null;

  if (stars.length > 1) {
    return <StarComparisonTable stars={stars} onClose={onClose} />;
  }

  const star = stars[0];
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

interface StarComparisonTableProps {
  stars: Star[];
  onClose: () => void;
}

function StarComparisonTable({ stars, onClose }: StarComparisonTableProps) {
  return (
    <div className="star-info-panel star-comparison-panel">
      <button className="close-button" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{stars.length} stars selected</h2>
      <table className="star-comparison-table">
        <thead>
          <tr>
            <th>Star</th>
            <th>Magnitude</th>
            <th>Constellation</th>
          </tr>
        </thead>
        <tbody>
          {stars.map((star) => {
            const constellation = getConstellation(star.constellationId);
            return (
              <tr key={star.id}>
                <td>{star.name ?? star.catalogId}</td>
                <td>{star.magnitude}</td>
                <td style={{ color: constellation?.color }}>
                  {constellation?.name ?? 'Unknown'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
