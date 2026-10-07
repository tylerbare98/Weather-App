import { useState, useEffect, useRef } from 'react';
import { CitySuggestion } from './types/weather';
import { useWeather } from './hooks/useWeather';
import { useCitySuggestions } from './hooks/useCitySuggestions';
import { RecentSearch, useRecentSearches } from './hooks/useRecentSearches';
import { convertTemp, getWeatherBackground, getWeatherIcon, getTheme } from './utils/weatherHelpers';
import SearchBar from './components/SearchBar';
import ThemeControls from './components/ThemeControls';
import RecentSearches from './components/RecentSearches';
import LoadingSkeleton from './components/LoadingSkeleton';
import WeatherCard from './components/WeatherCard';
import ForecastGrid from './components/ForecastGrid';
import { readStored, saveStored } from './utils/storage';

function App() {
  const [city, setCity] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => readStored('weather-dark-mode') !== false);
  const [isCelsius, setIsCelsius] = useState(() => readStored('weather-celsius') === true);
  const [locating, setLocating] = useState(false);
  const locationRequest = useRef(0);
  useEffect(() => saveStored('weather-dark-mode', isDarkMode), [isDarkMode]);
  useEffect(() => saveStored('weather-celsius', isCelsius), [isCelsius]);

  const { weatherData, forecastData, loading, error, forecastError, setError, fetchWeatherByCity, fetchWeatherByCoords } = useWeather();
  const { suggestions, showSuggestions, setShowSuggestions } = useCitySuggestions(city);
  const { recentSearches, saveToRecentSearches } = useRecentSearches();

  const theme = getTheme(isDarkMode);

  const handleSearch = async () => {
    if (!city.trim()) { setError('Enter a city to search.'); return; }
    locationRequest.current++; setLocating(false);
    setShowSuggestions(false);
    try {
      const cityName = await fetchWeatherByCity(city);
      saveToRecentSearches(cityName);
    } catch (err) {
      // Error already handled by useWeather hook
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = async (suggestion: CitySuggestion) => {
    locationRequest.current++; setLocating(false);
    setShowSuggestions(false);
    const cityName = suggestion.state
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setCity(cityName);
    try {
      const savedCityName = await fetchWeatherByCoords(suggestion.lat, suggestion.lon, suggestion.name, suggestion.country);
      saveToRecentSearches(savedCityName);
    } catch (err) {
      // Error already handled by useWeather hook
    }
    setShowSuggestions(false);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setShowSuggestions(false); setError(''); setLocating(true);
    const requestId = ++locationRequest.current;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (requestId !== locationRequest.current) return;
        setLocating(false);
        try {
          const cityName = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setCity(cityName.name);
          saveToRecentSearches(cityName);
        } catch (err) {
          // Error already handled by useWeather hook
        }
      },
      () => {
        if (requestId !== locationRequest.current) return;
        setLocating(false);
        setError('Unable to retrieve your location. Please enter a city manually.');
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleRecentSearchClick = async (search: RecentSearch) => {
    locationRequest.current++; setLocating(false);
    setShowSuggestions(false);
    setCity(search.name);
    try {
      const result = typeof search.lat === 'number' && typeof search.lon === 'number' ? await fetchWeatherByCoords(search.lat, search.lon, search.name) : await fetchWeatherByCity(search.name);
      saveToRecentSearches(result);
    } catch (err) {
      // Error already handled by useWeather hook
    }
  };

  const convertTempWithMode = (temp: number) => convertTemp(temp, isCelsius);

  return (
    <main style={{
      minHeight: '100vh',
      background: weatherData ? getWeatherBackground(weatherData.weather[0].main, isDarkMode) : theme.background,
      color: theme.text,
      backgroundBlendMode: 'normal',
      padding: '20px',
      textAlign: 'center',
      transition: 'all 0.5s ease'
    }}>
      <ThemeControls
        isCelsius={isCelsius}
        setIsCelsius={setIsCelsius}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        theme={theme}
      />

      <h1>Weather App</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
        handleUseMyLocation={handleUseMyLocation}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        handleSuggestionClick={handleSuggestionClick}
        theme={theme}
        isDarkMode={isDarkMode}
      />

      {!loading && (
        <RecentSearches
          recentSearches={recentSearches}
          onSearchClick={handleRecentSearchClick}
          theme={theme}
        />
      )}

      {!weatherData && !loading && !error && (
        <div style={{
          marginTop: '60px',
          padding: '40px 20px',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '60px auto'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🌤️</div>
          <h2 style={{ fontSize: '24px', marginBottom: '15px', fontWeight: 'normal' }}>
            Welcome to Weather App
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.7, lineHeight: '1.6' }}>
            Search for a city above or use your current location to get started
          </p>
        </div>
      )}

      {locating && <p role="status">Finding your location…</p>}
      {loading && <p role="status">Loading weather…</p>}
      {loading && <LoadingSkeleton theme={theme} isDarkMode={isDarkMode} />}

      {error && (
        <div role="alert" style={{ margin: '30px auto', maxWidth: '600px', padding: '16px', borderRadius: '10px', background: theme.cardBg, color: isDarkMode ? '#ffb8b8' : '#a31228', fontSize: '16px' }}>
          {error}
        </div>
      )}

      {weatherData && !loading && (
        <WeatherCard
          weatherData={weatherData}
          convertTemp={convertTempWithMode}
          getWeatherIcon={getWeatherIcon}
          isCelsius={isCelsius}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}

      {forecastError && !loading && <p role="status" style={{ background: theme.cardBg, padding: 16, borderRadius: 8, maxWidth: 600, margin: '20px auto' }}>{forecastError}</p>}

      {forecastData && !loading && (
        <ForecastGrid
          forecastData={forecastData}
          convertTemp={convertTempWithMode}
          getWeatherIcon={getWeatherIcon}
          isCelsius={isCelsius}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}
      <p style={{fontSize: '12px', marginTop: 32}}>Weather by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>Open-Meteo</a> · Locations by <a href="https://www.geonames.org/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>GeoNames</a> · Times shown in the searched location’s timezone.</p>
    </main>
  );
}

export default App;
