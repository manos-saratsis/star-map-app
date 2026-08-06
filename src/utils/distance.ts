import type { Star } from '../types';

/** Straight-line (Euclidean) distance between two stars in world-space units. */
export function starDistance(a: Star, b: Star): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export interface NearbyStar {
  star: Star;
  distance: number;
}

/**
 * Returns the `count` nearest stars to `origin` (excluding `origin` itself),
 * sorted nearest-first by straight-line distance.
 */
export function getNearestStars(origin: Star, stars: Star[], count = 5): NearbyStar[] {
  return stars
    .filter((s) => s.id !== origin.id)
    .map((s) => ({ star: s, distance: starDistance(origin, s) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}
