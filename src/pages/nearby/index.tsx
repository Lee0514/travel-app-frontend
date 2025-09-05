import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMapsProvider } from '../../providers';
import MapComponent from '../../components/mapComponent';
import NearbyListComponent from '../../components/nearbyListComponent';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import SearchBar from '../../components/searchBar';
import 'react-toastify/dist/ReactToastify.css';
import CollectionModal from '../../components/collectionModal';
import type { PlaceResult } from '../../types/place';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';

interface FavoriteItem {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
  items: FavoriteItem[];
}

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

const centerDefault = { lat: 25.033964, lng: 121.564468 };

const Nearby = () => {
  const { t } = useTranslation();

  // 收藏分類
  const [collections, setCollections] = useState<Collection[]>(() => {
    const stored = localStorage.getItem('collections');
    return stored
      ? JSON.parse(stored)
      : [
          { id: 'uncategorized', name: '未分類', items: [] },
          { id: 'switzerland', name: '瑞士', items: [] },
          { id: 'paris', name: '巴黎', items: [] },
          { id: 'tokyo', name: '東京', items: [] }
        ];
  });

  const [collectionModal, setCollectionModal] = useState<PlaceResult | null>(null);

  const { currentLocation, places, loading, fetchCurrentLocation } = useNearbyPlaces({
    defaultLocation: centerDefault,
  });

  useEffect(() => {
    if (fetchCurrentLocation) fetchCurrentLocation();
  }, [fetchCurrentLocation]);

  const isFavorited = (placeId: string) =>
    collections.some((col) => col.items.some((item) => item.id === placeId));

  const handleToggleFavorite = (place: PlaceResult) => {
    if (!place.place_id) return;

    if (isFavorited(place.place_id)) {
      setCollections((prev) => {
        const updated = prev.map((col) => ({
          ...col,
          items: col.items.filter((i) => i.id !== place.place_id)
        }));
        localStorage.setItem('collections', JSON.stringify(updated));
        return updated;
      });
    } else {
      setCollectionModal(place);
      setCollections((prev) => {
        const updated = prev.map((col) =>
          col.id === 'uncategorized'
            ? { ...col, items: [...col.items, { id: place.place_id!, name: place.name || '' }] }
            : col
        );
        localStorage.setItem('collections', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    if (!collectionModal) return;

    setCollections((prev) => {
      let cleaned = prev.map((col) => ({
        ...col,
        items: col.items.filter((i) => i.id !== collectionModal.place_id)
      }));

      cleaned = cleaned.map((col) =>
        col.id === collectionId
          ? { ...col, items: [...col.items, { id: collectionModal.place_id!, name: collectionModal.name || '' }] }
          : col
      );

      localStorage.setItem('collections', JSON.stringify(cleaned));
      return cleaned;
    });

    setCollectionModal(null);
  };

  return (
    <Container>
      <GoogleMapsProvider>
        <TopBar>
        <button onClick={() => fetchCurrentLocation()}>📍 {t('public.relocate')}</button>
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

        {collectionModal?.place_id && (
          <CollectionModal
            collections={collections}
            place={{ id: collectionModal.place_id, name: collectionModal.name || '' }}
            onSave={handleAddToCollection}
            onClose={() => setCollectionModal(null)}
          />
        )}
      </GoogleMapsProvider>
    </Container>
  );
};

export default Nearby;