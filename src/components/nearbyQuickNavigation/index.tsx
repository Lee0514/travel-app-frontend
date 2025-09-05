import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NearbyListComponent from '../nearbyListComponent';
import type { PlaceResult, CurrentLocation } from '../../types/place';
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
  padding: 1rem;
`;

const centerDefault: CurrentLocation = { lat: 25.033964, lng: 121.564468 };

const NearbyQuickNavigation: React.FC = () => {
  const { t } = useTranslation();
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
    limitPerCategory: 5
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
      {loading && <p>{t('loading')}</p>}
      {!loading && places.length === 0 && <p>{t('noData')}</p>}
      <NearbyListComponent
        currentLocation={currentLocation}
        places={places}
        onToggleFavorite={handleToggleFavorite}
        isFavorited={isFavorited}
      />
    </Container>
  );
};

export default NearbyQuickNavigation;