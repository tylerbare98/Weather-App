import { Theme } from '../types/weather';

interface SkeletonLoaderProps {
  theme: Theme;
  isDarkMode: boolean;
}

export default function SkeletonLoader({ theme, isDarkMode }: SkeletonLoaderProps) {
  return (
    <div style={{ marginTop: '30px', animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{
        padding: '30px',
        background: theme.cardBg,
        borderRadius: '10px',
        maxWidth: '500px',
        margin: '0 auto',
        boxShadow: isDarkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          height: '40px',
          width: '60%',
          margin: '0 auto 20px',
          background: `linear-gradient(90deg, ${isDarkMode ? '#333' : '#e0e0e0'} 0%, ${isDarkMode ? '#444' : '#f0f0f0'} 50%, ${isDarkMode ? '#333' : '#e0e0e0'} 100%)`,
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite',
          borderRadius: '8px'
        }} />
        <div style={{
          height: '120px',
          width: '120px',
          margin: '20px auto',
          background: `linear-gradient(90deg, ${isDarkMode ? '#333' : '#e0e0e0'} 0%, ${isDarkMode ? '#444' : '#f0f0f0'} 50%, ${isDarkMode ? '#333' : '#e0e0e0'} 100%)`,
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite',
          borderRadius: '50%'
        }} />
        <div style={{
          height: '60px',
          width: '40%',
          margin: '20px auto',
          background: `linear-gradient(90deg, ${isDarkMode ? '#333' : '#e0e0e0'} 0%, ${isDarkMode ? '#444' : '#f0f0f0'} 50%, ${isDarkMode ? '#333' : '#e0e0e0'} 100%)`,
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite',
          borderRadius: '8px'
        }} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginTop: '20px'
        }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              height: '50px',
              background: `linear-gradient(90deg, ${isDarkMode ? '#333' : '#e0e0e0'} 0%, ${isDarkMode ? '#444' : '#f0f0f0'} 50%, ${isDarkMode ? '#333' : '#e0e0e0'} 100%)`,
              backgroundSize: '1000px 100%',
              animation: 'shimmer 2s infinite',
              borderRadius: '8px'
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
