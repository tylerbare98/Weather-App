import { useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(-1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <div style={{ position: 'relative', width: 'min(300px, 100%)', maxWidth: '100%' }} onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            aria-label="City name"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls={showSuggestions && suggestions.length > 0 ? "city-suggestions" : undefined}
            aria-activedescendant={showSuggestions && activeIndex >= 0 && activeIndex < suggestions.length ? `city-option-${activeIndex}` : undefined}
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value); setActiveIndex(-1);
              if (e.target.value.length >= 3) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setShowSuggestions(true); setActiveIndex(index => Math.min(index + 1, suggestions.length - 1));
              } else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(index => Math.max(index - 1, 0));
              } else if (e.key === 'Enter') {
                if (showSuggestions && activeIndex >= 0 && suggestions[activeIndex]) handleSuggestionClick(suggestions[activeIndex]); else handleSearch();
                setActiveIndex(-1);
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
              width: '100%',
              background: theme.inputBg,
              color: theme.text,
              border: `2px solid ${theme.inputBorder}`,
              borderRadius: '5px'
            }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div id="city-suggestions" role="listbox" aria-label="City suggestions" style={{
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
                <button type="button" role="option" id={`city-option-${index}`} aria-selected={activeIndex === index}
                  key={`${suggestion.name}-${suggestion.country}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '10px 15px', width: '100%', textAlign: 'left', color: theme.text, background: activeIndex === index ? (isDarkMode ? '#444' : '#e9eef4') : theme.cardBg, border: 0, font: 'inherit',
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
                </button>
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
          aria-label="Use my location"
          title="Use my location"
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
