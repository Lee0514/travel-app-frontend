import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMapsProvider } from '../../providers';
import MapComponent from '../../components/mapComponent';
import NearbyListComponent from '../../components/nearbyListComponent';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import SearchBar from '../../components/searchBar';
import { fetchNearbyAndDetails, getLatLngByPlaceName } from '../../utils/googleMapsPlaces';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  padding: 1.5rem 5rem;
  box-sizing: border-box;
  margin-top: 5rem;

  @media (max-width: 900px) { padding: 1.25rem 3rem; margin-top: 6rem; }
  @media (max-width: 600px) { padding: 0rem 0.5rem; margin-top: 6rem; }
  @media (max-width: 300px) { padding: 0.75rem; margin-top: 1.5rem; }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const centerDefault = { lat: 25.033964, lng: 121.564468 };

const Nearby = () => {
  const { t } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState(centerDefault);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(Date.now());

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLastUpdatedTime(Date.now());
      },
      () => {
        toast.warning(t('public.relocate'), { position: 'top-center', autoClose: 3000 });
        setCurrentLocation(centerDefault);
        setLastUpdatedTime(Date.now());
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => { fetchCurrentLocation(); }, []);

  const handleSearchNearby = async (query: string) => {
    try {
      const location = await getLatLngByPlaceName(query);
      setCurrentLocation(location);
    } catch {
      toast.error(t('explore.noData'));
    }
  };

  return (
    <GoogleMapsProvider>
      <Container>
        <TopBar>
          <button
            onClick={fetchCurrentLocation}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            📍 {t('public.relocate')}
          </button>
          <SearchBar onSearch={handleSearchNearby} />
        </TopBar>
        <MapComponent location={currentLocation} />
        <NearbyListComponent currentLocation={currentLocation} />
        <ToastContainer />
      </Container>
    </GoogleMapsProvider>
  );
};

export default Nearby;