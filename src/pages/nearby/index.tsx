import { useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMapsProvider } from '../../providers';
import MapComponent from '../../components/mapComponent';
import NearbyListComponent from '../../components/nearbyListComponent';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import SearchBar from '../../components/searchBar';
import 'react-toastify/dist/ReactToastify.css';
import CollectionModal from '../../components/collectionModal';
import type { CurrentLocation } from '../../types/place';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';
import { useCollections } from '../../hooks/useCollections';

const Container = styled.div`
  padding: 1.5rem 5rem;
  box-sizing: border-box;
  margin-top: 5rem;

  @media (max-width: 900px) {
    padding: 1.25rem 3rem;
    margin-top: 6rem;
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

const TopBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const Button = styled.div`
  color: white;
  border: none;
  padding: 0.5rem 0.7rem;
  font-size: 1em;
  font-weight: 400;
  font-family: inherit;
  background-color: #333;
  cursor: pointer;
  transition: border-color 0.25s;
  border-radius: 5px;
`;

const centerDefault: CurrentLocation = { lat: 25.033964, lng: 121.564468 };

const Nearby = () => {
  const { t } = useTranslation();

  // 收藏 hook
  const {
    collections,
    collectionModal,
    setCollectionModal,
    isFavorited,
    handleToggleFavorite,
    handleAddToCollection,
  } = useCollections();

  // 地圖 hook
  const { currentLocation, places, loading, fetchCurrentLocation } = useNearbyPlaces({
    defaultLocation: centerDefault,
  });

  useEffect(() => {
    if (fetchCurrentLocation) fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  return (
    <Container>
      <GoogleMapsProvider>
        <TopBar>
          <Button onClick={() => fetchCurrentLocation()}>📍 {t('public.relocate')}</Button>
          <SearchBar onSearch={(query) => fetchCurrentLocation(query)} />
        </TopBar>

        <MapComponent location={currentLocation} />
        {loading ? (
          <p>{t('loading')}</p>
        ) : (
          <NearbyListComponent
            currentLocation={currentLocation}
            places={places}
            onToggleFavorite={handleToggleFavorite}
            isFavorited={isFavorited}
          />
        )}

        <ToastContainer />

        {/* {collectionModal?.place_id && (
          <CollectionModal
            collections={collections}
            place={{ id: collectionModal.place_id, name: collectionModal.name || '' }}
            onSave={handleAddToCollection}
            onClose={() => setCollectionModal(null)}
          />
        )} */}
      </GoogleMapsProvider>
    </Container>
  );
};

export default Nearby;