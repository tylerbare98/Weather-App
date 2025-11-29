import { Theme } from '../types/weather';

interface ForecastCardProps {
  dt: number;
  temp: number;
  tempMax: number;
  tempMin: number;
  weatherMain: string;
  weatherDescription: string;
  convertTemp: (temp: number) => number;
  getWeatherIcon: (weatherMain: string) => string;
  isCelsius: boolean;
  theme: Theme;
  isDarkMode: boolean;
}

export default function ForecastCard({
  dt,
  temp,
  tempMax,
  tempMin,
  weatherMain,
  weatherDescription,
  convertTemp,
  getWeatherIcon,
  isCelsius,
  theme,
  isDarkMode
}: ForecastCardProps) {
  const date = new Date(dt * 1000);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      style={{
        background: theme.cardBg,
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
        {dayName}
      </div>
      <div style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#666', marginBottom: '15px' }}>
        {monthDay}
      </div>
      <div style={{ fontSize: '48px', margin: '15px 0' }}>
        {getWeatherIcon(weatherMain)}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
        {convertTemp(temp)}°{isCelsius ? 'C' : 'F'}
      </div>
      <div style={{
        fontSize: '14px',
        textTransform: 'capitalize',
        color: isDarkMode ? '#aaa' : '#666',
        marginTop: '10px'
      }}>
        {weatherDescription}
      </div>
      <div style={{
        fontSize: '12px',
        color: isDarkMode ? '#888' : '#999',
        marginTop: '8px'
      }}>
        H: {convertTemp(tempMax)}° L: {convertTemp(tempMin)}°
      </div>
    </div>
  );
}
