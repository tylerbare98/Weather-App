import { useState, useEffect } from 'react';
import { CitySuggestion } from '../types/weather';

export const useCitySuggestions = (city: string) => {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    const fetchCitySuggestions = async () => {
      if (city.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=10&appid=${API_KEY}`
        );

        if (!response.ok) {
          console.error('Geocoding API error:', response.status);
          setSuggestions([]);
          return;
        }

        const data = await response.json();
        console.log('Geocoding results for', city, ':', data);

        if (data && data.length > 0) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching city suggestions:', err);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCitySuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [city, API_KEY]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSuggestions]);

  return {
    suggestions,
    showSuggestions,
    setShowSuggestions
  };
};
