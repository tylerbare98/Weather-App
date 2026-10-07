import { WeatherData, ForecastData } from '../types/weather';

type ObjectValue = Record<string, unknown>;
const object = (value: unknown): value is ObjectValue => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const timestamp = (value: unknown): value is number => finite(value) && Math.abs(value) < 8.64e12;
const conditions = (value: unknown) => Array.isArray(value) && value.length > 0 && value.every(item => object(item) && typeof item.main === 'string' && typeof item.description === 'string');

export function isWeatherData(value: unknown): value is WeatherData {
  if (!object(value)) return false;
  const { main, coord, sys, wind } = value;
  return typeof value.name === 'string'
    && finite(value.timezone) && Math.abs(value.timezone) <= 86400
    && object(main) && ['temp', 'feels_like', 'humidity', 'pressure'].every(key => finite(main[key]))
    && object(coord) && finite(coord.lat) && Math.abs(coord.lat) <= 90 && finite(coord.lon) && Math.abs(coord.lon) <= 180
    && object(sys) && (sys.sunrise === null || timestamp(sys.sunrise)) && (sys.sunset === null || timestamp(sys.sunset)) && (sys.country === undefined || typeof sys.country === 'string')
    && object(wind) && finite(wind.speed) && finite(value.visibility)
    && conditions(value.weather);
}

export function isForecastData(value: unknown): value is ForecastData {
  if (!object(value) || !object(value.city) || typeof value.city.name !== 'string' || !finite(value.city.timezone) || Math.abs(value.city.timezone) > 86400) return false;
  return Array.isArray(value.list) && value.list.length > 0 && value.list.every(item => object(item)
    && timestamp(item.dt) && typeof item.dt_txt === 'string'
    && object(item.main) && ['temp', 'temp_min', 'temp_max'].every(key => finite((item.main as ObjectValue)[key]))
    && conditions(item.weather));
}
