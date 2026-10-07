import { ForecastData, Theme } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastGridProps {
  forecastData: ForecastData;
  convertTemp: (temp: number) => number;
  getWeatherIcon: (weatherMain: string) => string;
  isCelsius: boolean;
  theme: Theme;
  isDarkMode: boolean;
}

export default function ForecastGrid({
  forecastData,
  convertTemp,
  getWeatherIcon,
  isCelsius,
  theme,
  isDarkMode
 }: ForecastGridProps) {
  const timezone = forecastData.city.timezone || 0;
  const days = new Map<string, ForecastData['list']>();
  forecastData.list.forEach(item => {
    const key = new Date((item.dt + timezone) * 1000).toISOString().slice(0, 10);
    days.set(key, [...(days.get(key) || []), item]);
  });
  const daily = Array.from(days.values()).slice(0, 5).map(items => {
    const noon = items.reduce((closest, item) => Math.abs(new Date((item.dt + timezone) * 1000).getUTCHours() - 12) < Math.abs(new Date((closest.dt + timezone) * 1000).getUTCHours() - 12) ? item : closest);
    return { ...noon, main: { ...noon.main, temp_min: Math.min(...items.map(i => i.main.temp_min)), temp_max: Math.max(...items.map(i => i.main.temp_max)) } };
  });
  return (
    <div style={{
      marginTop: '20px',
      maxWidth: '1200px',
      margin: '20px auto 40px',
      padding: '0 20px',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <h2 style={{ fontSize: '24px', marginBottom: '15px', textAlign: 'center' }}>
        5-Day Forecast
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px',
        justifyContent: 'center'
      }}>
        {daily
          .map((item) => (
            <ForecastCard
              key={item.dt}
              dt={item.dt}
              timezone={timezone}
              temp={item.main.temp}
              tempMax={item.main.temp_max}
              tempMin={item.main.temp_min}
              weatherMain={item.weather[0].main}
              weatherDescription={item.weather[0].description}
              convertTemp={convertTemp}
              getWeatherIcon={getWeatherIcon}
              isCelsius={isCelsius}
              theme={theme}
              isDarkMode={isDarkMode}
            />
          ))}
      </div>
    </div>
  );
}
