import type { Star } from '../types';

/** Straight-line (Euclidean) distance between two stars in world-space units. */
export function distanceBetween(a: Star, b: Star): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export interface NearbyStar {
  star: Star;
  distance: number;
}

/**
 * Returns the `count` stars nearest to `target` (excluding `target` itself),
 * sorted nearest-first by straight-line distance.
 */
export function findNearestStars(target: Star, stars: Star[], count = 5): NearbyStar[] {
  const withDistance: NearbyStar[] = [];

  for (const candidate of stars) {
    if (candidate.id === target.id) continue;
    withDistance.push({ star: candidate, distance: distanceBetween(target, candidate) });
  }

  withDistance.sort((a, b) => a.distance - b.distance);
  return withDistance.slice(0, count);
}
