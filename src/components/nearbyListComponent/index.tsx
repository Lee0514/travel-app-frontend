import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import { useTranslation } from 'react-i18next';
import NearbyListFilter from '../nearbyListFilter';

interface PlaceResult extends google.maps.places.PlaceResult {
  geometry: {
    location: google.maps.LatLng;
  };
}

interface CurrentLocation {
  lat: number;
  lng: number;
}

interface NearbyListComponentProps {
  currentLocation: CurrentLocation;
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

const PlaceCard = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr auto auto;
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
  min-width: 0; /* 重要！讓 flex 子元素能夠縮小 */
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

const MarkerIcon = styled.div`
  color: #e74c3c;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止圖標被壓縮 */
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  color: #c33;
`;

// 將分類移到組件外部，避免重複創建
const categories: Record<string, string[]> = {
  Attraction: ['tourist_attraction', 'museum', 'park'],
  Hotel: ['lodging'],
  Restaurant: ['restaurant'],
  Store: ['department_store', 'convenience_store'],
  Transport: ['bus_station', 'subway_station']
};

const categoryOrder = Object.keys(categories);

// 輕量化預設圖片
const defaultImage = 'data:image/svg+xml,%3Csvg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="64" height="64" fill="%23e0e0e0"/%3E%3Ctext x="32" y="36" font-family="Arial" font-size="10" fill="%23666" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

// 優化的等待函數
const waitForGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 檢查所有必要的 API 是否載入
    if (window.google?.maps?.places && window.google?.maps?.geometry) {
      resolve();
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 50;
    
    const check = setInterval(() => {
      attempts++;
      
      if (window.google?.maps?.places && window.google?.maps?.geometry) {
        clearInterval(check);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(check);
        reject(new Error('Google Maps API 載入超時。請檢查網路連線和 API key。'));
      }
    }, 100);
  });
};

// 優化的距離計算
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // 地球半徑（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const NearbyListComponent: React.FC<NearbyListComponentProps> = ({ currentLocation }) => {
  const [placesByCategory, setPlacesByCategory] = useState<Record<string, PlaceResult[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const lastFetchLocation = useRef<CurrentLocation | null>(null);
  const { t } = useTranslation();

  const getPlaceTypeTranslation = useCallback((type: string) => t(`placeType.${type}`, type), [t]);

  const fetchAllNearbyPlaces = useCallback(async (location: CurrentLocation) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await waitForGoogleMaps();
      
      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);
      
      const resultsByCategory: Record<string, PlaceResult[]> = {};
      
      // 序列化處理每個分類，避免併發限制
      for (const [category, types] of Object.entries(categories)) {
        const categoryResults: google.maps.places.PlaceResult[] = [];
        
        // 對每個類型進行搜尋
        for (const type of types) {
          await new Promise<void>((resolve) => {
            const request: google.maps.places.PlaceSearchRequest = {
              location: new google.maps.LatLng(location.lat, location.lng),
              radius: 2000, // 2km 搜尋範圍
              type: type as any
            };

            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                categoryResults.push(...results);
              } else if (status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                console.warn(`搜尋 ${type} 時狀態: ${status}`);
              }
              // 增加延遲避免 API 請求限制
              setTimeout(resolve, 100);
            });
          });
        }
        
        // 去重並過濾距離，按距離排序
        const uniqueResults = Array.from(
          new Map(categoryResults.map(place => [place.place_id, place])).values()
        )
        .filter((place): place is PlaceResult => {
          if (!place.geometry?.location) return false;
          
          const distance = calculateDistance(
            location.lat, 
            location.lng, 
            place.geometry.location.lat(), 
            place.geometry.location.lng()
          );
          
          return distance <= 2; // 只顯示 2km 內的結果
        })
        .sort((a, b) => {
          const distA = calculateDistance(
            location.lat, location.lng, 
            a.geometry.location.lat(), 
            a.geometry.location.lng()
          );
          const distB = calculateDistance(
            location.lat, location.lng, 
            b.geometry.location.lat(), 
            b.geometry.location.lng()
          );
          return distA - distB;
        });
        
        resultsByCategory[category] = uniqueResults;
      }
      
      setPlacesByCategory(resultsByCategory);
    } catch (err) {
      console.error('載入附近地點時發生錯誤:', err);
      setError(err instanceof Error ? err.message : '載入附近地點時發生未知錯誤');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentLocation) return;
    
    // 只有移動超過 100 米才重新搜尋
    const shouldFetch = !lastFetchLocation.current || 
      calculateDistance(
        lastFetchLocation.current.lat, 
        lastFetchLocation.current.lng, 
        currentLocation.lat, 
        currentLocation.lng
      ) > 0.1; // 0.1km = 100m
    
    if (shouldFetch) {
      fetchAllNearbyPlaces(currentLocation);
      lastFetchLocation.current = currentLocation;
    }
  }, [currentLocation, fetchAllNearbyPlaces]);

  const filteredCategories = categoryOrder.filter(category => 
    categoryFilter === 'All' || category === categoryFilter
  );

  return (
    <NearbyContainer>
      <NearbyListFilter 
        categories={categoryOrder} 
        selectedCategory={categoryFilter} 
        onChange={setCategoryFilter} 
      />
      
      {error && (
        <ErrorMessage>
          {error}
          <button 
            onClick={() => fetchAllNearbyPlaces(currentLocation)}
            style={{ 
              marginLeft: '1rem', 
              padding: '0.25rem 0.5rem', 
              background: '#c33', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            重試
          </button>
        </ErrorMessage>
      )}

      {filteredCategories.map(category => {
        const places = placesByCategory[category];
        if (!places || places.length === 0) return null;
        
        return (
          <CategoryBlock key={category}>
            <CategoryTitle>{t(`category.${category.toLowerCase()}`, category)}</CategoryTitle>
            {places.map(place => (
              <PlaceCard key={place.place_id}>
                <MarkerIcon>
                  <FaMapMarkerAlt />
                </MarkerIcon>
                <PlaceInfo>
                  <PlaceName>{place.name}</PlaceName>
                  <PlaceType>
                    {place.types && place.types.length > 0 ? getPlaceTypeTranslation(place.types[0]) : ''}
                  </PlaceType>
                  <PlaceDistance>
                    <span>{place.vicinity || place.formatted_address}</span>
                    <small>
                      {t('distanceWithValue', {
                        value: calculateDistance(
                          currentLocation.lat, 
                          currentLocation.lng, 
                          place.geometry.location.lat(), 
                          place.geometry.location.lng()
                        ).toFixed(2)
                      })}
                    </small>
                  </PlaceDistance>
                </PlaceInfo>
                <MapIconLink 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name || '')}`} 
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
              </PlaceCard>
            ))}
          </CategoryBlock>
        );
      })}
      
      {isLoading && (
        <p style={{ margin: '1rem 0', color: '#888' }}>
          {t('loading', '正在載入附近地點...')}
        </p>
      )}
    </NearbyContainer>
  );
};

export default React.memo(NearbyListComponent);