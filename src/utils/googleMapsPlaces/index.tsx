import { ensureGoogleMapsLoaded, fetchNearbyPlaces } from '../googleMapsUtils';

export interface FetchNearbyCallbacks {
  setPlace: (place: google.maps.places.PlaceResult | null) => void;
  setError: (msg: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export async function fetchNearbyAndDetails(
  currentLocation: google.maps.LatLngLiteral,
  callbacks: FetchNearbyCallbacks,
  t: (key: string) => string
) {
  const { setPlace, setError, setLoading } = callbacks;

  setLoading(true);
  setError(null);
  setPlace(null);

  try {
    await ensureGoogleMapsLoaded();
    const results = await fetchNearbyPlaces(
      currentLocation,
      'tourist_attraction',
      2000,
      window.google.maps.places.RankBy.PROMINENCE
    );

    if (results.length === 0) {
      setError(t('noData'));
      setPlace(null);
      setLoading(false);
      return;
    }

    setPlace(results[0]);

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: results[0].place_id! }, (detailedPlace, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && detailedPlace) {
        setPlace(detailedPlace);
      } else {
        console.warn('getDetails failed:', status);
      }
      setLoading(false);
    });
  } catch (e) {
    setError(e instanceof Error ? e.message : t('loadError'));
    setPlace(null);
    setLoading(false);
  }
}

export async function getLatLngByPlaceName(placeName: string): Promise<google.maps.LatLngLiteral> {
  await ensureGoogleMapsLoaded();

  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request: google.maps.places.TextSearchRequest = {
      query: placeName,
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const location = results[0].geometry?.location;
        if (location) {
          resolve({ lat: location.lat(), lng: location.lng() });
          return;
        }
      }
      reject(new Error('找不到地點或 Google Maps API 錯誤'));
    });
  });
}