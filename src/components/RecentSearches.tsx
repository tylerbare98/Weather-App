import { Theme } from '../types/weather';

interface RecentSearchesProps {
  recentSearches: string[];
  onSearchClick: (search: string) => void;
  theme: Theme;
}

export default function RecentSearches({ recentSearches, onSearchClick, theme }: RecentSearchesProps) {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
      <span style={{ fontSize: '14px', opacity: 0.7 }}>Recent:</span>
      {recentSearches.map((search) => (
        <button
          key={search}
          onClick={() => onSearchClick(search)}
          style={{
            padding: '5px 12px',
            fontSize: '13px',
            background: theme.cardBg,
            color: theme.text,
            border: `1px solid ${theme.inputBorder}`,
            borderRadius: '15px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.buttonBg;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.cardBg;
            e.currentTarget.style.color = theme.text;
          }}
        >
          {search}
        </button>
      ))}
    </div>
  );
}
