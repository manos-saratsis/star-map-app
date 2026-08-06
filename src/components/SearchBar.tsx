import { useMemo, useState } from 'react';
import type { Star } from '../types';

interface SearchBarProps {
  stars: Star[];
  onSelectStar: (star: Star) => void;
}

export function SearchBar({ stars, onSelectStar }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return stars
      .filter((s) => s.name?.toLowerCase().includes(q) || s.catalogId.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, stars]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search stars by name or catalog id..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {matches.length > 0 && (
        <ul className="search-results">
          {matches.map((star) => (
            <li
              key={star.id}
              onClick={() => {
                onSelectStar(star);
                setQuery('');
              }}
            >
              <span className="star-name">{star.name ?? star.catalogId}</span>
              <span className="star-mag">mag {star.magnitude}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
