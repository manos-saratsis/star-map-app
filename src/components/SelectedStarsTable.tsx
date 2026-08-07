import type { Star } from '../types';
import { getConstellation } from '../data/constellations';

interface SelectedStarsTableProps {
  stars: Star[];
  onClose: () => void;
  onRemoveStar: (id: string) => void;
}

export function SelectedStarsTable({ stars, onClose, onRemoveStar }: SelectedStarsTableProps) {
  if (stars.length === 0) return null;

  return (
    <div className="star-info-panel selected-stars-table">
      <button className="close-button" onClick={onClose} aria-label="Close">
        ×
      </button>
      <h2>{stars.length} stars selected</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Magnitude</th>
            <th>Constellation</th>
            <th aria-label="Remove" />
          </tr>
        </thead>
        <tbody>
          {stars.map((star) => {
            const constellation = getConstellation(star.constellationId);
            return (
              <tr key={star.id}>
                <td>{star.name ?? star.catalogId}</td>
                <td>{star.magnitude}</td>
                <td style={{ color: constellation?.color }}>{constellation?.name ?? 'Unknown'}</td>
                <td>
                  <button
                    className="remove-star-button"
                    onClick={() => onRemoveStar(star.id)}
                    aria-label={`Remove ${star.name ?? star.catalogId}`}
                  >
                    ×
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
