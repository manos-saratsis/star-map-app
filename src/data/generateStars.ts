import type { Star } from '../types';
import { CONSTELLATIONS } from './constellations';

const SPECTRAL_CLASSES: Star['spectralClass'][] = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

// A small set of "named" stars mixed into the field so search has
// recognizable results, similar to Sirius/Betelgeuse/etc in a real catalog.
const NAMED_STARS = [
  'Aldebaran', 'Betelgeuse', 'Rigel', 'Bellatrix', 'Sirius', 'Procyon',
  'Capella', 'Pollux', 'Castor', 'Regulus', 'Spica', 'Antares',
  'Vega', 'Deneb', 'Altair', 'Polaris', 'Mizar', 'Alcor',
  'Arcturus', 'Alnilam', 'Alnitak', 'Mintaka', 'Shaula', 'Sargas',
];

// Simple deterministic PRNG so the same seed always produces the same field.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateStarField(count: number, seed = 42): Star[] {
  const rand = mulberry32(seed);
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    // Cluster stars loosely around a random constellation anchor, with
    // some spread so regions overlap a bit (more realistic than tight blobs).
    const constellation = CONSTELLATIONS[Math.floor(rand() * CONSTELLATIONS.length)];
    const spread = 180;
    const x = constellation.anchorX + (rand() - 0.5) * spread * 2;
    const y = constellation.anchorY + (rand() - 0.5) * spread * 2;

    const magnitude = Math.round((rand() * 6.5 + 0.5) * 10) / 10;
    const spectralClass = SPECTRAL_CLASSES[Math.floor(rand() * SPECTRAL_CLASSES.length)];

    const isNamed = i < NAMED_STARS.length;

    stars.push({
      id: `star-${i}`,
      name: isNamed ? NAMED_STARS[i] : null,
      catalogId: `HD ${100000 + Math.floor(rand() * 899999)}`,
      x,
      y,
      magnitude,
      spectralClass,
      constellationId: constellation.id,
    });
  }

  return stars;
}
