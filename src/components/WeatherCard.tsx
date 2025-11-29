import { WeatherData, Theme } from '../types/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
  convertTemp: (temp: number) => number;
  getWeatherIcon: (weatherMain: string) => string;
  isCelsius: boolean;
  theme: Theme;
  isDarkMode: boolean;
}

export default function WeatherCard({
  weatherData,
  convertTemp,
  getWeatherIcon,
  isCelsius,
  theme,
  isDarkMode
}: WeatherCardProps) {
  return (
    <div style={{
      marginTop: '20px',
      padding: '25px',
      background: theme.cardBg,
      borderRadius: '10px',
      maxWidth: '500px',
      margin: '20px auto',
      boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>
        {weatherData.name}
      </h2>
      <div style={{ fontSize: '80px', margin: '20px 0' }}>
        {getWeatherIcon(weatherData.weather[0].main)}
      </div>
      <div style={{ fontSize: '64px', fontWeight: 'bold', margin: '20px 0' }}>
        {convertTemp(weatherData.main.temp)}°{isCelsius ? 'C' : 'F'}
      </div>
      <div style={{ fontSize: '24px', textTransform: 'capitalize', marginBottom: '20px', color: isDarkMode ? '#aaa' : '#666' }}>
        {weatherData.weather[0].description}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginTop: '20px',
        fontSize: '14px'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Feels Like</div>
          <div>{convertTemp(weatherData.main.feels_like)}°{isCelsius ? 'C' : 'F'}</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Humidity</div>
          <div>{weatherData.main.humidity}%</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Wind Speed</div>
          <div>{Math.round(weatherData.wind.speed)} mph</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Pressure</div>
          <div>{weatherData.main.pressure} hPa</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Visibility</div>
          <div>{(weatherData.visibility / 1000).toFixed(1)} km</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Sunrise</div>
          <div>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Sunset</div>
          <div>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </div>
  );
}
