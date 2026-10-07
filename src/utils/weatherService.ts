import { CitySuggestion, ForecastData, WeatherData } from '../types/weather';
import { isForecastData, isWeatherData } from './validateWeather';

type Value = Record<string, unknown>;
const object = (value: unknown): value is Value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const incomplete = () => new Error('Weather service returned incomplete data. Please try again.');

export async function requestWeather(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });
  if (response.status === 429) throw new Error('Weather service is busy. Please try again in a few minutes.');
  if (!response.ok) throw new Error('Weather service is unavailable. Please try again.');
  try { return await response.json(); } catch { throw incomplete(); }
}

export async function findCities(name: string, signal: AbortSignal): Promise<CitySuggestion[]> {
  const params = new URLSearchParams({ name: name.trim(), count: '5', language: 'en', format: 'json' });
  const data = await requestWeather(`https://geocoding-api.open-meteo.com/v1/search?${params}`, signal);
  if (!object(data)) throw incomplete();
  if (data.results === undefined) return [];
  if (!Array.isArray(data.results)) throw incomplete();
  return data.results.filter((city): city is Value => object(city)
    && typeof city.name === 'string' && finite(city.latitude) && Math.abs(city.latitude) <= 90
    && finite(city.longitude) && Math.abs(city.longitude) <= 180 && typeof city.country_code === 'string')
    .map(city => ({ name: city.name as string, lat: city.latitude as number, lon: city.longitude as number,
      country: city.country_code as string, state: typeof city.admin1 === 'string' ? city.admin1 : undefined }));
}

const weatherCodes: Record<number, [string, string]> = {
  0: ['Clear', 'clear sky'], 1: ['Clear', 'mainly clear'], 2: ['Clouds', 'partly cloudy'], 3: ['Clouds', 'overcast'],
  45: ['Fog', 'fog'], 48: ['Fog', 'rime fog'],
  51: ['Drizzle', 'light drizzle'], 53: ['Drizzle', 'drizzle'], 55: ['Drizzle', 'heavy drizzle'],
  56: ['Drizzle', 'light freezing drizzle'], 57: ['Drizzle', 'freezing drizzle'],
  61: ['Rain', 'light rain'], 63: ['Rain', 'rain'], 65: ['Rain', 'heavy rain'],
  66: ['Rain', 'light freezing rain'], 67: ['Rain', 'freezing rain'],
  71: ['Snow', 'light snow'], 73: ['Snow', 'snow'], 75: ['Snow', 'heavy snow'], 77: ['Snow', 'snow grains'],
  80: ['Rain', 'light rain showers'], 81: ['Rain', 'rain showers'], 82: ['Rain', 'heavy rain showers'],
  85: ['Snow', 'light snow showers'], 86: ['Snow', 'heavy snow showers'],
  95: ['Thunderstorm', 'thunderstorm'], 96: ['Thunderstorm', 'thunderstorm with hail'], 99: ['Thunderstorm', 'severe thunderstorm with hail'],
};
function condition(code: unknown) {
  if (!finite(code) || !weatherCodes[code]) throw incomplete();
  const [main, description] = weatherCodes[code];
  return [{ main, description }];
}

export function currentWeather(data: unknown, location: CitySuggestion): WeatherData {
  if (!object(data) || !object(data.current) || !object(data.daily)) throw incomplete();
  const current = data.current;
  const result: unknown = {
    name: location.name, coord: { lat: location.lat, lon: location.lon }, timezone: data.utc_offset_seconds,
    main: { temp: current.temperature_2m, humidity: current.relative_humidity_2m, feels_like: current.apparent_temperature, pressure: current.surface_pressure },
    weather: condition(current.weather_code), wind: { speed: current.wind_speed_10m }, visibility: current.visibility,
    sys: { country: location.country, sunrise: Array.isArray(data.daily.sunrise) ? data.daily.sunrise[0] : undefined, sunset: Array.isArray(data.daily.sunset) ? data.daily.sunset[0] : undefined },
  };
  if (!isWeatherData(result)) throw incomplete();
  return result;
}

export function dailyForecast(data: unknown, location: CitySuggestion): ForecastData {
  if (!object(data) || !object(data.daily)) throw incomplete();
  const daily = data.daily;
  const fields = ['temperature_2m_mean', 'temperature_2m_min', 'temperature_2m_max', 'weather_code'];
  if (!Array.isArray(daily.time) || daily.time.length < 5 || !fields.every(key => Array.isArray(daily[key]) && (daily[key] as unknown[]).length === (daily.time as unknown[]).length)) throw incomplete();
  const result: unknown = {
    city: { name: location.name, timezone: data.utc_offset_seconds },
    list: daily.time.map((dt, index) => ({
      dt, dt_txt: String(dt),
      main: { temp: (daily.temperature_2m_mean as unknown[])[index], temp_min: (daily.temperature_2m_min as unknown[])[index], temp_max: (daily.temperature_2m_max as unknown[])[index] },
      weather: condition((daily.weather_code as unknown[])[index]),
    })),
  };
  if (!isForecastData(result)) throw incomplete();
  return result;
}
