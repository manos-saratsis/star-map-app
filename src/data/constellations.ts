import type { Constellation } from '../types';

// A handful of constellation "regions" spread across our world space.
// Each has an anchor point that star generation clusters around.
export const CONSTELLATIONS: Constellation[] = [
  { id: 'ori', name: 'Orion', color: '#7dd3fc', anchorX: -300, anchorY: 150 },
  { id: 'uma', name: 'Ursa Major', color: '#fca5a5', anchorX: 250, anchorY: 300 },
  { id: 'cas', name: 'Cassiopeia', color: '#fcd34d', anchorX: -150, anchorY: -280 },
  { id: 'cyg', name: 'Cygnus', color: '#c4b5fd', anchorX: 100, anchorY: -120 },
  { id: 'leo', name: 'Leo', color: '#86efac', anchorX: -400, anchorY: -100 },
  { id: 'sco', name: 'Scorpius', color: '#f9a8d4', anchorX: 350, anchorY: -250 },
  { id: 'aql', name: 'Aquila', color: '#93c5fd', anchorX: -50, anchorY: 350 },
  { id: 'gem', name: 'Gemini', color: '#fdba74', anchorX: 400, anchorY: 100 },
  { id: 'tau', name: 'Taurus', color: '#a3e635', anchorX: -350, anchorY: -350 },
  { id: 'lyr', name: 'Lyra', color: '#67e8f9', anchorX: 200, anchorY: -380 },
];

export function getConstellation(id: string): Constellation | undefined {
  return CONSTELLATIONS.find((c) => c.id === id);
}
