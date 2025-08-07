export const waitForGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    let attempts = 0;
    const maxAttempts = 50;

    const check = setInterval(() => {
      attempts++;

      if (window.google?.maps?.places) {
        clearInterval(check);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(check);
        reject(new Error('Google Maps API 載入超時，請檢查網路連線和 API key'));
      }
    }, 100);
  });
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Google Maps script load error')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script load error'));
    document.head.appendChild(script);
  });
};

export const ensureGoogleMapsLoaded = async (): Promise<void> => {
  await loadGoogleMapsScript();
  await waitForGoogleMaps();
};

export const fetchNearbyPlaces = (location: google.maps.LatLngLiteral, type: string, radius = 2000, rankBy?: google.maps.places.RankBy): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      await ensureGoogleMapsLoaded();

      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);

      const request: google.maps.places.PlaceSearchRequest = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        type,
        ...(rankBy ? { rankBy } : { radius })
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          reject(new Error(`Places API error: ${status}`));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};
