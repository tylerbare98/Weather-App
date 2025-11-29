import { useState } from 'react';
import { CitySuggestion } from './types/weather';
import { useWeather } from './hooks/useWeather';
import { useCitySuggestions } from './hooks/useCitySuggestions';
import { useRecentSearches } from './hooks/useRecentSearches';
import { convertTemp, getWeatherBackground, getWeatherIcon, getTheme } from './utils/weatherHelpers';
import SearchBar from './components/SearchBar';
import ThemeControls from './components/ThemeControls';
import RecentSearches from './components/RecentSearches';
import LoadingSkeleton from './components/LoadingSkeleton';
import WeatherCard from './components/WeatherCard';
import ForecastGrid from './components/ForecastGrid';

function App() {
  const [city, setCity] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCelsius, setIsCelsius] = useState(false);

  const { weatherData, forecastData, loading, error, setError, fetchWeatherByCity, fetchWeatherByCoords } = useWeather();
  const { suggestions, showSuggestions, setShowSuggestions } = useCitySuggestions(city);
  const { recentSearches, saveToRecentSearches } = useRecentSearches();

  const theme = getTheme(isDarkMode);

  const handleSearch = async () => {
    if (!city.trim()) return;
    try {
      const cityName = await fetchWeatherByCity(city);
      saveToRecentSearches(cityName);
    } catch (err) {
      // Error already handled by useWeather hook
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = async (suggestion: CitySuggestion) => {
    const cityName = suggestion.state
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setCity(cityName);
    try {
      const savedCityName = await fetchWeatherByCity(cityName);
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

    setShowSuggestions(false);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const cityName = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setCity(cityName);
          saveToRecentSearches(cityName);
        } catch (err) {
          // Error already handled by useWeather hook
        }
      },
      (error) => {
        setError('Unable to retrieve your location. Please enter a city manually.');
      }
    );
  };

  const handleRecentSearchClick = async (search: string) => {
    setShowSuggestions(false);
    setCity(search);
    try {
      await fetchWeatherByCity(search);
    } catch (err) {
      // Error already handled by useWeather hook
    }
  };

  const convertTempWithMode = (temp: number) => convertTemp(temp, isCelsius);

  return (
    <div style={{
      minHeight: '100vh',
      background: weatherData ? getWeatherBackground(weatherData.weather[0].main, isDarkMode) : theme.background,
      color: theme.text,
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

      {loading && <LoadingSkeleton theme={theme} isDarkMode={isDarkMode} />}

      {error && (
        <div style={{ marginTop: '30px', color: '#ff6b6b', fontSize: '18px' }}>
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
    </div>
  );
}

export default App;
