import { CONSTELLATIONS } from '../data/constellations';

// Static legend today; a natural extension point is making these entries
// clickable to filter/highlight the star field by constellation.
export function ConstellationLegend() {
  return (
    <div className="constellation-legend">
      <h3>Constellations</h3>
      <ul>
        {CONSTELLATIONS.map((c) => (
          <li key={c.id}>
            <span className="swatch" style={{ backgroundColor: c.color }} />
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
