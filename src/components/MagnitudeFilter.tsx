interface MagnitudeFilterProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  visibleCount: number;
  totalCount: number;
}

/**
 * Slider that controls the apparent-magnitude cutoff for the star field.
 * Lower magnitude = brighter, so this filters out stars *dimmer* than the
 * selected threshold and reports how many stars remain visible.
 */
export function MagnitudeFilter({
  value,
  onChange,
  min,
  max,
  visibleCount,
  totalCount,
}: MagnitudeFilterProps) {
  return (
    <div className="magnitude-filter">
      <label htmlFor="magnitude-slider">Magnitude &le; {value.toFixed(1)}</label>
      <input
        id="magnitude-slider"
        type="range"
        min={min}
        max={max}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="magnitude-count">
        {visibleCount.toLocaleString()} / {totalCount.toLocaleString()} stars
      </span>
    </div>
  );
}
