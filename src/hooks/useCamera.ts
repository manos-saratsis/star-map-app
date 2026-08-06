import { useCallback, useState } from 'react';
import type { Camera } from '../types';

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 8;

export function useCamera(initial: Camera = { x: 0, y: 0, zoom: 1 }) {
  const [camera, setCamera] = useState<Camera>(initial);

  const pan = useCallback((dx: number, dy: number) => {
    setCamera((prev) => ({
      ...prev,
      x: prev.x - dx / prev.zoom,
      y: prev.y - dy / prev.zoom,
    }));
  }, []);

  const zoomAt = useCallback((factor: number) => {
    setCamera((prev) => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoom * factor)),
    }));
  }, []);

  const panTo = useCallback((x: number, y: number, zoom?: number) => {
    setCamera((prev) => ({
      x,
      y,
      zoom: zoom ?? prev.zoom,
    }));
  }, []);

  return { camera, pan, zoomAt, panTo, setCamera };
}
