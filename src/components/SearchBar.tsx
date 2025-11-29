import { CitySuggestion, Theme } from '../types/weather';

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  handleSearch: () => void;
  handleUseMyLocation: () => void;
  suggestions: CitySuggestion[];
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSuggestionClick: (suggestion: CitySuggestion) => void;
  theme: Theme;
  isDarkMode: boolean;
}

export default function SearchBar({
  city,
  setCity,
  handleSearch,
  handleUseMyLocation,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  handleSuggestionClick,
  theme,
  isDarkMode
}: SearchBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (e.target.value.length >= 3) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              } else if (e.key === 'Escape') {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (city.length >= 3 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            style={{
              padding: '10px',
              fontSize: '16px',
              width: '300px',
              background: theme.inputBg,
              color: theme.text,
              border: `2px solid ${theme.inputBorder}`,
              borderRadius: '5px'
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '5px',
              background: theme.cardBg,
              border: `1px solid ${theme.inputBorder}`,
              borderRadius: '5px',
              boxShadow: isDarkMode ? '0 4px 8px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.name}-${suggestion.country}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    borderBottom: index < suggestions.length - 1 ? `1px solid ${theme.inputBorder}` : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#333' : '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{suggestion.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {suggestion.state ? `${suggestion.state}, ${suggestion.country}` : suggestion.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: theme.buttonBg,
            color: theme.buttonText,
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Search
        </button>
        <button
          onClick={handleUseMyLocation}
          style={{
            padding: '10px 15px',
            fontSize: '14px',
            background: isDarkMode ? '#505050' : '#5a9fd4',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          📍
        </button>
      </div>
    </div>
  );
}
