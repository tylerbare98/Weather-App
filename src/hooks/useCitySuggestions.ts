import { useState, useEffect } from 'react';
import { CitySuggestion } from '../types/weather';
import { findCities } from '../utils/weatherService';
export const useCitySuggestions = (city: string) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setSuggestions([]);
    if (city.trim().length < 3) return;
    const timer = setTimeout(async () => {
      try {
        const data = await findCities(city, controller.signal);
        if (!controller.signal.aborted) setSuggestions(data);
      } catch { /* Manual city search remains available. */ }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [city]);
  useEffect(() => {
    const close = () => setShowSuggestions(false);
    if (showSuggestions) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showSuggestions]);
  return { suggestions, showSuggestions, setShowSuggestions };
};
