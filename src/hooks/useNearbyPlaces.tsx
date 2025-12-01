import { useState, useEffect, useCallback } from 'react';
import type { PlaceResult, CurrentLocation } from '../types/place';
import { ensureGoogleMapsLoaded, getDistance, fetchNearbyPlaces } from '../utils/googleMapsUtils';
import { getLatLngByPlaceName } from '../utils/googleMapsPlaces';

interface UseNearbyPlacesProps {
  defaultLocation: CurrentLocation;
  radius?: number;
  limitPerCategory?: number;
}

const PLACE_CATEGORIES = [
  { key: 'restaurant', type: 'restaurant' },
  { key: 'lodging', type: 'lodging' },
  { key: 'tourist_attraction', type: 'tourist_attraction' },
  { key: 'store', type: 'store', query: 'store' },
  { key: 'transit_station', type: 'transit_station', query: 'bus station' },
];

export const useNearbyPlaces = ({
  defaultLocation,
  radius = 2000,
  limitPerCategory = 5,
}: UseNearbyPlacesProps) => {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(defaultLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentLocation = useCallback(
    async (query?: string) => {
      setLoading(true);
      setError(null);

      try {
        let location: CurrentLocation;

        if (query) {
          location = await getLatLngByPlaceName(query);
        } else if (navigator.geolocation) {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
          );
          location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } else {
          location = defaultLocation;
        }

        setCurrentLocation(location);
      } catch (err) {
        console.error('Failed to get location', err);
        setError('無法取得位置，使用預設位置');
        setCurrentLocation(defaultLocation);
      } finally {
        setLoading(false);
      }
    },
    [defaultLocation]
  );

  // 當 currentLocation 改變時，抓附近景點
  useEffect(() => {
    const fetchAllPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        await ensureGoogleMapsLoaded();

        let allPlaces: PlaceResult[] = [];

        for (const cat of PLACE_CATEGORIES) {
          try {
            const results = await fetchNearbyPlaces(
              currentLocation,
              cat.type,
              radius,
              undefined,
              cat.query
            );

            const formatted = results.map((r) => ({
              place_id: r.place_id,
              name: r.name,
              geometry: r.geometry ?? undefined,
              vicinity: r.vicinity,
              photos: r.photos,
              rating: r.rating,
              types: r.types,
            }));

            allPlaces = [...allPlaces, ...formatted];
          } catch (err) {
            console.warn(`Google Places error for category ${cat.key}:`, err);
          }
        }

        // 去重
        const uniquePlaces = Array.from(new Map(allPlaces.map(p => [p.place_id, p])).values());

        // 按距離排序
        const sortedPlaces = uniquePlaces.sort((a, b) => {
          if (!a.geometry?.location || !b.geometry?.location) return 0;
          return getDistance(
            currentLocation.lat,
            currentLocation.lng,
            a.geometry.location.lat(),
            a.geometry.location.lng()
          ) - getDistance(
            currentLocation.lat,
            currentLocation.lng,
            b.geometry.location.lat(),
            b.geometry.location.lng()
          );
        });

        const categorized: PlaceResult[] = [];
        const categoryCount: Record<string, number> = {};

        for (const place of sortedPlaces) {
          if (!place.types) continue;
          let added = false;

          for (const t of place.types) {
            if (!categoryCount[t]) categoryCount[t] = 0;
            if (categoryCount[t] < limitPerCategory) {
              categorized.push(place);
              categoryCount[t]++;
              added = true;
              break;
            }
          }

          if (!added) continue;
        }

        setPlaces(categorized);
      } catch (err: any) {
        console.error(err);
        setError(err.message || '取得附近地點發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPlaces();
  }, [currentLocation, radius, limitPerCategory]);

  return { places, loading, error, currentLocation, fetchCurrentLocation };
};
