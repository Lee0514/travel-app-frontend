import React, { createContext, useContext, ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

export interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

export interface GoogleMapsProviderProps {
  children: ReactNode;
  apiKey?: string;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ 
  children, 
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' 
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
    preventGoogleFontsLoading: true,
  });

  if (loadError) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '2rem auto',
        border: '1px solid #fcc',
        borderRadius: '0.5rem',
        backgroundColor: '#fee'
      }}>
        <h2>載入 Google Maps 時發生錯誤</h2>
        <p style={{ color: '#c33' }}>{loadError.message}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1b3a70',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          重新載入頁面
        </button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        maxWidth: '400px',
        margin: '2rem auto'
      }}>
        <h2>載入 Google Maps 中...</h2>
        <p style={{ color: '#666' }}>請稍候，正在載入地圖服務</p>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #1b3a70',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '1rem auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = (): GoogleMapsContextType => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export const withGoogleMaps = <P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const WithGoogleMapsComponent: React.FC<P> = (props) => (
    <GoogleMapsProvider>
      <WrappedComponent {...props} />
    </GoogleMapsProvider>
  );

  // 設定顯示名稱
  WithGoogleMapsComponent.displayName = `withGoogleMaps(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithGoogleMapsComponent;
};