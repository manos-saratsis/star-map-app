import type { Camera, Star } from '../types';

/** Converts a world-space point to screen-space pixel coordinates. */
export function worldToScreen(
  wx: number,
  wy: number,
  camera: Camera,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } {
  return {
    x: viewportWidth / 2 + (wx - camera.x) * camera.zoom,
    y: viewportHeight / 2 + (wy - camera.y) * camera.zoom,
  };
}

/** Converts a screen-space pixel coordinate back to world space. */
export function screenToWorld(
  sx: number,
  sy: number,
  camera: Camera,
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number } {
  return {
    x: camera.x + (sx - viewportWidth / 2) / camera.zoom,
    y: camera.y + (sy - viewportHeight / 2) / camera.zoom,
  };
}

/** Radius in pixels a star should be drawn at, based on its magnitude. */
export function magnitudeToRadius(magnitude: number): number {
  const clamped = Math.max(0, Math.min(7, magnitude));
  return Math.max(0.6, 3.2 - clamped * 0.4);
}

/** Finds the nearest star to a screen-space click point, within a pixel tolerance. */
export function hitTestStar(
  sx: number,
  sy: number,
  stars: Star[],
  camera: Camera,
  viewportWidth: number,
  viewportHeight: number,
  tolerancePx = 8
): Star | null {
  let closest: Star | null = null;
  let closestDist = Infinity;

  for (const star of stars) {
    const p = worldToScreen(star.x, star.y, camera, viewportWidth, viewportHeight);
    const dx = p.x - sx;
    const dy = p.y - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = magnitudeToRadius(star.magnitude);
    if (dist <= radius + tolerancePx && dist < closestDist) {
      closest = star;
      closestDist = dist;
    }
  }

  return closest;
}
