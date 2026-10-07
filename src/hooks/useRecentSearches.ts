import { useState } from 'react';
import { readStored, saveStored } from '../utils/storage';
export interface RecentSearch { name: string; lat?: number; lon?: number; }
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    const saved = readStored('recentSearches');
    return Array.isArray(saved) ? saved.map(s => typeof s === 'string' ? { name: s } : s).filter(s => s && typeof s.name === 'string' && (s.lat === undefined || Number.isFinite(s.lat)) && (s.lon === undefined || Number.isFinite(s.lon))).slice(0, 5) : [];
  });
  const saveToRecentSearches = (search: RecentSearch) => {
    setRecentSearches(previous => {
      const updated = [search, ...previous.filter(s => !(s.name === search.name && s.lat === search.lat && s.lon === search.lon))].slice(0, 5);
      saveStored('recentSearches', updated); return updated;
    });
  };
  return { recentSearches, saveToRecentSearches };
};
