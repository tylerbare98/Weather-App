export const convertTemp = (temp: number, isCelsius: boolean) => {
  if (isCelsius) {
    return Math.round((temp - 32) * 5 / 9);
  }
  return Math.round(temp);
};

export const getWeatherBackground = (weatherMain: string, isDarkMode: boolean) => {
  const backgrounds: { [key: string]: string } = {
    'Clear': isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #e6eaff 0%, #ede4f5 100%)',
    'Clouds': isDarkMode ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' : 'linear-gradient(135deg, #eef1f3 0%, #d6e2ea 100%)',
    'Rain': isDarkMode ? 'linear-gradient(135deg, #232526 0%, #414345 100%)' : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'Drizzle': isDarkMode ? 'linear-gradient(135deg, #232526 0%, #414345 100%)' : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'Thunderstorm': isDarkMode ? 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' : 'linear-gradient(135deg, #e2e8f1 0%, #ddd7ed 100%)',
    'Snow': isDarkMode ? 'linear-gradient(135deg, #253d44 0%, #344957 100%)' : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    'Mist': isDarkMode ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' : 'linear-gradient(135deg, #eef1f3 0%, #d6e2ea 100%)',
    'Fog': isDarkMode ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' : 'linear-gradient(135deg, #eef1f3 0%, #d6e2ea 100%)',
  };
  return backgrounds[weatherMain] || (isDarkMode ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)');
};

export const getWeatherIcon = (weatherMain: string) => {
  const icons: { [key: string]: string } = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '🌫️',
    'Haze': '🌫️',
    'Dust': '🌫️',
    'Fog': '🌫️',
    'Sand': '🌫️',
    'Ash': '🌫️',
    'Squall': '💨',
    'Tornado': '🌪️'
  };
  return icons[weatherMain] || '🌤️';
};

export const getTheme = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#1a1a1a' : '#f5f5f5',
  text: isDarkMode ? '#e0e0e0' : '#333',
  inputBg: isDarkMode ? '#2a2a2a' : '#fff',
  inputBorder: isDarkMode ? '#404040' : '#ccc',
  buttonBg: isDarkMode ? '#404040' : '#2466aa',
  buttonText: '#fff',
  cardBg: isDarkMode ? '#2a2a2a' : '#fff'
});
