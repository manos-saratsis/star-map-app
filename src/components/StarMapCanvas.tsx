import { useEffect, useRef } from 'react';
import type { Camera, Star } from '../types';
import { hitTestStar, magnitudeToRadius, worldToScreen } from '../utils/projection';

interface StarMapCanvasProps {
  stars: Star[];
  camera: Camera;
  selectedStar: Star | null;
  onSelectStar: (star: Star | null) => void;
  onPan: (dx: number, dy: number) => void;
  onZoom: (factor: number) => void;
  activeConstellationId?: string | null;
}

const SPECTRAL_COLORS: Record<Star['spectralClass'], string> = {
  O: '#9bb0ff',
  B: '#aabfff',
  A: '#cad7ff',
  F: '#f8f7ff',
  G: '#fff4ea',
  K: '#ffd2a1',
  M: '#ffb56c',
};

export function StarMapCanvas({
  stars,
  camera,
  selectedStar,
  onSelectStar,
  onPan,
  onZoom,
  activeConstellationId = null,
}: StarMapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, width, height);

    for (const star of stars) {
      const p = worldToScreen(star.x, star.y, camera, width, height);
      if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) continue;

      const radius = magnitudeToRadius(star.magnitude) * Math.min(1.6, camera.zoom);
      const isDimmed =
        activeConstellationId !== null && star.constellationId !== activeConstellationId;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.globalAlpha = isDimmed ? 0.15 : 1;
      ctx.fillStyle = SPECTRAL_COLORS[star.spectralClass];
      ctx.fill();
      ctx.globalAlpha = 1;

      if (selectedStar?.id === star.id) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  }, [stars, camera, selectedStar, activeConstellationId]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    onPan(dx, dy);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const moved = isDragging.current;
    isDragging.current = false;

    // Treat as a click (select) rather than a drag if the pointer barely moved.
    const canvas = canvasRef.current;
    if (!canvas || !moved) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const hit = hitTestStar(sx, sy, stars, camera, rect.width, rect.height);
    if (hit) onSelectStar(hit);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    onZoom(factor);
  };

  return (
    <canvas
      ref={canvasRef}
      className="star-map-canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    />
  );
}
