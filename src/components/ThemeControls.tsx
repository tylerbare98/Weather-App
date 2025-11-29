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
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    }}>
      <button
        onClick={() => setIsCelsius(!isCelsius)}
        style={{
          padding: '8px 12px',
          background: theme.buttonBg,
          color: theme.buttonText,
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '13px',
          minWidth: '45px',
          whiteSpace: 'nowrap'
        }}
      >
        {isCelsius ? '°F' : '°C'}
      </button>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          padding: '8px 12px',
          background: theme.buttonBg,
          color: theme.buttonText,
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '13px',
          whiteSpace: 'nowrap'
        }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
