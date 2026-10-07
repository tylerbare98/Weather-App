import { useState, useRef, useEffect } from 'react';
import { CitySuggestion, WeatherData, ForecastData } from '../types/weather';
import { currentWeather, dailyForecast, findCities, requestWeather } from '../utils/weatherService';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forecastError, setForecastError] = useState('');
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => active.current?.abort(), []);

  const fetchWeather = async (query: string | CitySuggestion) => {
    active.current?.abort();
    const controller = new AbortController(); active.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true); setError(''); setForecastError(''); setWeatherData(null); setForecastData(null);
    try {
      const location = typeof query === 'string' ? (await findCities(query, controller.signal))[0] : query;
      if (!location) throw new Error('City not found. Check the spelling or choose a suggestion.');
      const params = new URLSearchParams({ latitude: String(location.lat), longitude: String(location.lon), temperature_unit: 'fahrenheit', wind_speed_unit: 'mph', timezone: 'auto', timeformat: 'unixtime', forecast_days: '5' });
      const currentParams = new URLSearchParams(params);
      currentParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,weather_code,visibility');
      currentParams.set('daily', 'sunrise,sunset');
      const current = currentWeather(await requestWeather(`https://api.open-meteo.com/v1/forecast?${currentParams}`, controller.signal), location);
      if (active.current !== controller) throw new Error('Search replaced');
      let forecast: ForecastData | null = null;
      let warning = '';
      try {
        params.set('daily', 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,weather_code');
        forecast = dailyForecast(await requestWeather(`https://api.open-meteo.com/v1/forecast?${params}`, controller.signal), location);
      } catch {
        warning = 'Current weather is available, but the forecast could not be loaded. Search again to retry.';
      }
      if (active.current !== controller) throw new Error('Search replaced');
      setWeatherData(current); setForecastData(forecast); setForecastError(warning);
      return { name: current.name + (current.sys.country ? `, ${current.sys.country}` : ''), lat: current.coord.lat, lon: current.coord.lon };
    } catch (err) {
      if (active.current === controller) setError(controller.signal.aborted ? 'The weather request timed out. Please try again.' : err instanceof Error ? err.message : 'Unable to connect. Please try again.');
      throw err;
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) setLoading(false);
    }
  };
  return {
    weatherData, forecastData, loading, error, forecastError, setError,
    fetchWeatherByCity: (city: string) => fetchWeather(city.trim()),
    fetchWeatherByCoords: (lat: number, lon: number, name = 'Current location', country = '') => fetchWeather({ lat, lon, name, country }),
  };
};
