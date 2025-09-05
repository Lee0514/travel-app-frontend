import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import HeartButton from '../heartButton.tsx';
import { calculateDistance } from '../../utils/googleMapsUtils';
import { useTranslation } from 'react-i18next';
import type { CurrentLocation, PlaceResult } from '../../types/place.js';

interface Props {
  place: PlaceResult;
  currentLocation: CurrentLocation;
  onToggleFavorite?: (place: PlaceResult) => void;
  isFavorited?: (placeId: string) => boolean;
}

const Card = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr auto auto auto;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  margin: 0.4rem 0;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 0.06rem 0.25rem rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    padding: 0.5rem;
    gap: 0.3rem;
  }
`;

const PlaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlaceName = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #222;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
  max-width: 100%;

  @media (max-width: 600px) {
    font-size: 0.9rem;
    line-height: 1.2;
  }
`;

const PlaceType = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #666;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

const PlaceDistance = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #555;

  small {
    color: #444;
    display: block;
  }

  @media (max-width: 600px) {
    font-size: 0.75rem;
  }
`;

const MapIconLink = styled.a`
  color: #1b3a70;
  font-size: 1.1rem;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #3498db;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const PlaceImage = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: cover;
  border-radius: 50%;

  @media (max-width: 600px) {
    width: 3rem;
    height: 3rem;
  }
`;

const MarkerIcon = styled.div`
  color: #e74c3c;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const defaultImage =
  'data:image/svg+xml,%3Csvg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="64" height="64" fill="%23e0e0e0"/%3E%3Ctext x="32" y="36" font-family="Arial" font-size="10" fill="%23666" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

const PlaceCard: React.FC<Props> = ({ place, currentLocation, onToggleFavorite, isFavorited }) => {
  const { t } = useTranslation();

  // 計算距離
  const distance = place.geometry?.location
    ? calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      ).toFixed(2)
    : null;

  return (
    <Card>
      <MarkerIcon>
        <FaMapMarkerAlt />
      </MarkerIcon>

      <PlaceInfo>
        <PlaceName>{place.name}</PlaceName>
        <PlaceType>
          {place.types && place.types.length > 0
            ? t(`placeType.${place.types[0]}`, place.types[0])
            : ''}
        </PlaceType>
        <PlaceDistance>
          <span>{place.vicinity || ''}</span>
          {distance && <small>{t('distanceWithValue', { value: distance })}</small>}
        </PlaceDistance>
      </PlaceInfo>

      <HeartButton
        isFavorited={place.place_id ? isFavorited?.(place.place_id) ?? false : false}
        onClick={() => place.place_id && onToggleFavorite?.(place)}
      />

      <MapIconLink
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          place.name || ''
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GrMapLocation size={20} />
      </MapIconLink>

      <PlaceImage
        src={place.photos?.length ? place.photos[0].getUrl() : defaultImage}
        alt={place.name || ''}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultImage;
        }}
        loading="lazy"
      />
    </Card>
  );
};

export default React.memo(PlaceCard);
