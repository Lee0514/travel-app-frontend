import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';

type CategoryKey = 'Attraction' | 'Restaurant' | 'Hotel' | 'Store' | 'Transport';

type Place = {
  id: number;
  name: string;
  type: string;
  distance: string;
  image: string;
};

const categoryOrder: CategoryKey[] = ['Attraction', 'Restaurant', 'Hotel', 'Store', 'Transport'];

const nearbyPlaces: Place[] = [
  {
    id: 1,
    name: 'Taipei 101',
    type: 'Landmark',
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Din Tai Fung',
    type: 'Restaurant',
    distance: '500 m',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Elephant Mountain Trail',
    type: 'Hiking Trail',
    distance: '2.1 km',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    name: 'Taipei Fine Arts Museum',
    type: 'Museum',
    distance: '3.4 km',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    name: 'Hotel Royal-Nikko Taipei',
    type: 'Hotel',
    distance: '2.0 km',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    name: '7-Eleven Xinyi Store',
    type: 'Convenience Store',
    distance: '300 m',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    name: 'Taipei MRT City Hall Station',
    type: 'MRT',
    distance: '400 m',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    name: 'Watsons Pharmacy',
    type: 'Drugstore',
    distance: '600 m',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
  }
];

const categorizedPlaces: Record<CategoryKey, Place[]> = {
  Attraction: [],
  Restaurant: [],
  Hotel: [],
  Store: [],
  Transport: []
};

nearbyPlaces.forEach(place => {
  const { type } = place;
  if (type === 'Restaurant') {
    categorizedPlaces.Restaurant.push(place);
  } else if (type === 'Hotel') {
    categorizedPlaces.Hotel.push(place);
  } else if (['Convenience Store', 'Department Store', 'Drugstore'].includes(type)) {
    categorizedPlaces.Store.push(place);
  } else if (['MRT', 'Bus'].includes(type)) {
    categorizedPlaces.Transport.push(place);
  } else if (['Landmark', 'Museum', 'Hiking Trail'].includes(type)) {
    categorizedPlaces.Attraction.push(place);
  }
});

const NearbyContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryBlock = styled.div`
  margin-bottom: 0.5rem;
`;

const CategoryTitle = styled.h2`
  font-size: 1.25rem;
  color: #1b3a70;
  margin-bottom: 0.5rem;
  border-left: 4px solid #1b3a70;
  padding-left: 0.5rem;
`;

const PlaceCard = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;

const MarkerIcon = styled.div`
  color: #e74c3c;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceInfo = styled.div`
  flex: 1;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlaceName = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #222;
`;

const PlaceType = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #666;
`;

const PlaceDistance = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #999;
`;

const MapIconLink = styled.a`
  color: #1b3a70;
  font-size: 1.2rem;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #3498db;
  }
`;

const PlaceImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
`;

const Nearby = () => {
  const { t } = useTranslation();
  return (
    <NearbyContainer>
      {categoryOrder.map(category =>
        categorizedPlaces[category].length > 0 ? (
          <CategoryBlock key={category}>
            <CategoryTitle>{t(`category.${category.toLowerCase()}`)}</CategoryTitle>
            {categorizedPlaces[category].map(place => (
              <PlaceCard key={place.id}>
                <MarkerIcon>
                  <FaMapMarkerAlt />
                </MarkerIcon>
                <PlaceInfo>
                  <InfoBlock>
                    <PlaceName>{place.name}</PlaceName>
                    <PlaceType>{place.type}</PlaceType>
                    <PlaceDistance>{t('distanceWithValue', { value: place.distance })}</PlaceDistance>
                  </InfoBlock>
                </PlaceInfo>
                <MapIconLink
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GrMapLocation size={20} />
                </MapIconLink>
                <PlaceImage src={place.image} alt={place.name} />
              </PlaceCard>
            ))}
          </CategoryBlock>
        ) : null
      )}
    </NearbyContainer>
  );
};

export default Nearby;
