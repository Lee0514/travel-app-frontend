import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NearbyListFilter from '../nearbyListFilter';
import PlaceCard from '../nearbyPlaceCard';
import type { PlaceResult, CurrentLocation } from '../../types/place';

interface NearbyListComponentProps {
  currentLocation: CurrentLocation;
  places: PlaceResult[];
  onToggleFavorite?: (place: PlaceResult) => void;
  isFavorited?: (placeId: string) => boolean;
  limitPerCategory?: number;
}

const NearbyContainer = styled.div`
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;

const CategoryBlock = styled.div`
  margin-bottom: 0.4rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.2rem;
  color: #1b3a70;
  margin-bottom: 0.4rem;
  border-left: 0.25rem solid #1b3a70;
  padding-left: 0.5rem;
`;

const categories: Record<string, string[]> = {
  Attraction: ['tourist_attraction', 'museum', 'park'],
  Hotel: ['lodging'],
  Restaurant: ['restaurant'],
  Store: ['department_store', 'convenience_store'],
  Transport: ['bus_station', 'subway_station']
};

const categoryOrder = Object.keys(categories);

const NearbyListComponent: React.FC<NearbyListComponentProps> = ({
  currentLocation,
  places,
  onToggleFavorite,
  isFavorited,
  limitPerCategory
}) => {
  const { t } = useTranslation();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // 分類整理資料
  const placesByCategory = useMemo(() => {
    const grouped: Record<string, PlaceResult[]> = {};
    for (const category of categoryOrder) {
      grouped[category] = places.filter((place) => {
        if (!place.types) return false;
        return categories[category].some((type) => place.types!.includes(type));
      }).slice(0, limitPerCategory || 5);
    }
    return grouped;
  }, [places, limitPerCategory]);

  const filteredCategories = categoryOrder.filter(
    (category) => categoryFilter === 'All' || category === categoryFilter
  );

  return (
    <NearbyContainer>
      <NearbyListFilter
        categories={categoryOrder}
        selectedCategory={categoryFilter}
        onChange={setCategoryFilter}
      />

      {filteredCategories.map((category) => {
        const categoryPlaces = placesByCategory[category];
        if (!categoryPlaces || categoryPlaces.length === 0) return null;

        return (
          <CategoryBlock key={category}>
            <CategoryTitle>{t(`category.${category.toLowerCase()}`, category)}</CategoryTitle>
            {categoryPlaces.map((place) => (
              <PlaceCard
                key={place.place_id}
                place={place}
                currentLocation={currentLocation}
                onToggleFavorite={onToggleFavorite}
                isFavorited={isFavorited}
              />
            ))}
          </CategoryBlock>
        );
      })}
    </NearbyContainer>
  );
};

export default React.memo(NearbyListComponent);
