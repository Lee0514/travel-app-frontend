import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMapsProvider } from '../../providers';
import MapComponent from '../../components/mapComponent';
import NearbyListComponent from '../../components/nearbyListComponent';

const Container = styled.div`
  padding: 1.5rem 5rem;
  box-sizing: border-box;
  margin-top: 3rem;

  @media (max-width: 900px) {
    padding: 1.25rem 3rem;
    margin-top: 2.5rem;
  }

  @media (max-width: 600px) {
    padding: 0rem 0.5rem;
    margin-top: 6rem;
  }

  @media (max-width: 300px) {
    padding: 0.75rem;
    margin-top: 1.5rem;
  }
`;

const centerDefault = { lat: 25.033964, lng: 121.564468 };

const Nearby = () => {
  const [currentLocation, setCurrentLocation] = useState(centerDefault);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setCurrentLocation(centerDefault);
      }
    );
  }, []);

  return (
    <GoogleMapsProvider>
      <Container>
        <MapComponent location={currentLocation} />
        <NearbyListComponent currentLocation={currentLocation} />
      </Container>
    </GoogleMapsProvider>
  );
};

export default Nearby;
