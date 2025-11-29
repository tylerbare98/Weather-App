import { useState } from 'react';
import { WeatherData, ForecastData } from '../types/weather';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeatherByCity = async (cityName: string) => {
    setLoading(true);
    setError('');

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
      );

      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherData.message || 'City not found');
      }

      setWeatherData(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`
      );

      const forecastData = await forecastResponse.json();

      if (forecastResponse.ok) {
        setForecastData(forecastData);
      }

      return weatherData.name;
    } catch (err: any) {
      setError(err.message || 'City not found. Please try again.');
      setWeatherData(null);
      setForecastData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');

    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );

      const weatherData = await weatherResponse.json();

      if (!weatherResponse.ok) {
        throw new Error(weatherData.message || 'Location not found');
      }

      setWeatherData(weatherData);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
      );

      const forecastData = await forecastResponse.json();

      if (forecastResponse.ok) {
        setForecastData(forecastData);
      }

      return weatherData.name;
    } catch (err: any) {
      setError(err.message || 'Could not fetch weather for your location.');
      setWeatherData(null);
      setForecastData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    weatherData,
    forecastData,
    loading,
    error,
    setError,
    fetchWeatherByCity,
    fetchWeatherByCoords
  };
};
