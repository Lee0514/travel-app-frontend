import React, { useRef, useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '50vh',
  borderRadius: '3%'
};

interface MapComponentProps {
  location: { lat: number; lng: number };
}

const MapComponent: React.FC<MapComponentProps> = ({ location }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.panTo(location);
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(location);
    }
  }, [location]);

  return (
    <GoogleMap 
      mapContainerStyle={mapContainerStyle} 
      center={location} 
      zoom={15} 
      onLoad={onMapLoad}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    />
  );
};

export default MapComponent;