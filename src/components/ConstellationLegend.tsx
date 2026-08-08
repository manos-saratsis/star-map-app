import { CONSTELLATIONS } from '../data/constellations';

interface ConstellationLegendProps {
  activeConstellationId: string | null;
  onToggleConstellation: (id: string) => void;
}

// Legend entries are clickable to filter/highlight the star field by
// constellation. Clicking the active entry again clears the filter.
export function ConstellationLegend({
  activeConstellationId,
  onToggleConstellation,
}: ConstellationLegendProps) {
  return (
    <div className="constellation-legend">
      <h3>Constellations</h3>
      <ul>
        {CONSTELLATIONS.map((c) => {
          const isActive = activeConstellationId === c.id;
          return (
            <li key={c.id}>
              <button
                type="button"
                className={`legend-entry${isActive ? ' active' : ''}`}
                aria-pressed={isActive}
                onClick={() => onToggleConstellation(c.id)}
              >
                <span className="swatch" style={{ backgroundColor: c.color }} />
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
