import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NearbyListComponent from '../nearbyListComponent';
import type { PlaceResult, CurrentLocation } from '../../types/place';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';
import { useCollections } from '../../hooks/useCollections';

const Container = styled.div`
  padding: 1rem;
`;

const centerDefault: CurrentLocation = { lat: 25.033964, lng: 121.564468 };

const NearbyQuickNavigation: React.FC = () => {
  const { t } = useTranslation();

  const {
    collections,
    collectionModal,
    setCollectionModal,
    isFavorited,
    handleToggleFavorite,
    handleAddToCollection,
  } = useCollections();

  const { currentLocation, places, loading, fetchCurrentLocation } = useNearbyPlaces({
    defaultLocation: centerDefault,
    limitPerCategory: 5,
  });

  useEffect(() => {
    if (fetchCurrentLocation) fetchCurrentLocation();
  }, [fetchCurrentLocation]);

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
      {/* 這裡也可以放 CollectionModal，如果你想在快捷導航頁面也能選分類 */}
      {collectionModal?.place_id && (
        <div>{t('chooseCollection')} {/* TODO: 可以改成你的 CollectionModal */}</div>
      )}
    </Container>
  );
};

export default NearbyQuickNavigation;