export interface Star {
  id: string;
  name: string | null;
  catalogId: string;
  x: number; // world-space coordinate
  y: number; // world-space coordinate
  magnitude: number; // apparent magnitude (lower = brighter)
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  constellationId: string;
}

export interface Constellation {
  id: string;
  name: string;
  color: string;
  anchorX: number;
  anchorY: number;
}

export interface Camera {
  x: number; // world-space center x
  y: number; // world-space center y
  zoom: number; // pixels per world unit
}
