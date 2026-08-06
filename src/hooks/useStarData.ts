import { useMemo } from 'react';
import { generateStarField } from '../data/generateStars';
import type { Star } from '../types';

/** Generates (and memoizes) the star catalog used across the app. */
export function useStarData(count = 4000): Star[] {
  return useMemo(() => generateStarField(count), [count]);
}
