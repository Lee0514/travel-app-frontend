import type { Collection } from '../../types/collection';
import type { PlaceResult } from '../../types/place';
import { DEFAULT_COLLECTIONS } from '../../types/collection';

// 模擬 API
let mockData: Collection[] = DEFAULT_COLLECTIONS;

const api = {
  getCollections: async (): Promise<{ data: Collection[] }> => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockData }), 300));
  },
  addFavorite: async (collectionId: string, place: PlaceResult) => {
    mockData = mockData.map((col) => (col.id === collectionId ? { ...col, items: [...col.items, { id: place.place_id!, name: place.name || '' }] } : col));
    return new Promise((resolve) => setTimeout(() => resolve(true), 200));
  },
  removeFavorite: async (placeId: string) => {
    mockData = mockData.map((col) => ({
      ...col,
      items: col.items.filter((i) => i.id !== placeId)
    }));
    return new Promise((resolve) => setTimeout(() => resolve(true), 200));
  }
};

export default api;
