import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GoogleMapsProvider } from '../../providers';
import MapComponent from '../../components/mapComponent';
import NearbyListComponent from '../../components/nearbyListComponent';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import SearchBar from '../../components/searchBar';
import { fetchNearbyAndDetails, getLatLngByPlaceName } from '../../utils/googleMapsPlaces';
import 'react-toastify/dist/ReactToastify.css';
import CollectionModal from '../../components/collectionModal';
interface PlaceResult extends google.maps.places.PlaceResult {
  geometry: {
    location: google.maps.LatLng;
  };
}

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
  const [currentLocation, setCurrentLocation] = useState(centerDefault);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(Date.now());

  // 收藏分類列表
  const [collections, setCollections] = useState<Collection[]>(() => {
    const stored = localStorage.getItem('collections');
    return stored
      ? JSON.parse(stored)
      : [
          { id: 'uncategorized', name: '未分類', items: [] }, // 預設未分類
          { id: 'switzerland', name: '瑞士', items: [] },
          { id: 'paris', name: '巴黎', items: [] },
          { id: 'tokyo', name: '東京', items: [] }
        ];
  });

  // modal state
  const [collectionModal, setCollectionModal] = useState<PlaceResult | null>(null);

  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLastUpdatedTime(Date.now());
      },
      () => {
        toast.warning(t('public.relocate'), { position: 'top-center', autoClose: 3000 });
        setCurrentLocation(centerDefault);
        setLastUpdatedTime(Date.now());
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleSearchNearby = async (query: string) => {
    try {
      const location = await getLatLngByPlaceName(query);
      setCurrentLocation(location);
    } catch {
      toast.error(t('explore.noData'));
    }
  };

  // 判斷是否已收藏（任意分類）
  const isFavorited = (placeId: string) => collections.some((col) => col.items.some((item) => item.id === placeId));

  // HeartButton 點擊 → 先加入未分類，同時打開 modal
  const handleToggleFavorite = (place: PlaceResult) => {
    console.log('place.place_id', place.place_id);
    if (isFavorited(place.place_id!)) {
      // 已收藏 → 取消收藏
      setCollections((prev) => {
        const updated = prev.map((col) => ({
          ...col,
          items: col.items.filter((i) => i.id !== place.place_id)
        }));
        localStorage.setItem('collections', JSON.stringify(updated));
        return updated;
      });
    } else {
      // 尚未收藏 → 開啟 modal，並先放到未分類
      console.log('Open modal for:', place);
      setCollectionModal(place);
      setCollections((prev) => {
        const updated = prev.map((col) =>
          col.id === 'uncategorized'
            ? {
                ...col,
                items: [...col.items, { id: place.place_id!, name: place.name || '' }]
              }
            : col
        );
        localStorage.setItem('collections', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // modal 裡選擇收藏分類
  const handleAddToCollection = (collectionId: string) => {
    if (!collectionModal) return;

    setCollections((prev) => {
      // 先把 place 從所有分類移除（避免重複）
      let cleaned = prev.map((col) => ({
        ...col,
        items: col.items.filter((i) => i.id !== collectionModal.place_id)
      }));

      // 加到指定的分類
      cleaned = cleaned.map((col) =>
        col.id === collectionId
          ? {
              ...col,
              items: [...col.items, { id: collectionModal.place_id!, name: collectionModal.name || '' }]
            }
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
          <button
            onClick={fetchCurrentLocation}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📍 {t('public.relocate')}
          </button>
          <SearchBar onSearch={handleSearchNearby} />
        </TopBar>

        <MapComponent location={currentLocation} />
        <NearbyListComponent currentLocation={currentLocation} onToggleFavorite={handleToggleFavorite} isFavorited={isFavorited} />
        <ToastContainer />

        {/* 收藏分類 Modal */}
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
