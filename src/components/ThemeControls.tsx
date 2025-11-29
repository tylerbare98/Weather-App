import { Theme } from '../types/weather';

interface ThemeControlsProps {
  isCelsius: boolean;
  setIsCelsius: (value: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  theme: Theme;
}

export default function ThemeControls({
  isCelsius,
  setIsCelsius,
  isDarkMode,
  setIsDarkMode,
  theme
}: ThemeControlsProps) {
  return (
    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px' }}>
      <button
        onClick={() => setIsCelsius(!isCelsius)}
        style={{
          padding: '10px 20px',
          background: theme.buttonBg,
          color: theme.buttonText,
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        {isCelsius ? '°F' : '°C'}
      </button>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          padding: '10px 20px',
          background: theme.buttonBg,
          color: theme.buttonText,
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
}
