import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Collection } from '../../types/collection';
import type { PlaceResult } from '../../types/place';
import { DEFAULT_COLLECTIONS } from '../../types/collection';

// 假裝 API 延遲
const fakeApiDelay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface CollectionsState {
  collections: Collection[];
  collectionModal: PlaceResult | null;
  loading: boolean;
}

const initialState: CollectionsState = {
  collections: DEFAULT_COLLECTIONS,
  collectionModal: null,
  loading: false
};

// 模擬 fetch
export const fetchCollections = createAsyncThunk('collections/fetch', async () => {
  await fakeApiDelay(300);
  return DEFAULT_COLLECTIONS;
});

// 模擬新增收藏
export const addFavoriteAPI = createAsyncThunk('collections/addFavorite', async ({ collectionId, place }: { collectionId: string; place: PlaceResult }) => {
  await fakeApiDelay(200);
  return { collectionId, place };
});

// 模擬移除收藏
export const removeFavoriteAPI = createAsyncThunk('collections/removeFavorite', async (placeId: string) => {
  await fakeApiDelay(200);
  return placeId;
});

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollectionModal(state, action: PayloadAction<PlaceResult | null>) {
      state.collectionModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.collections = action.payload;
      })
      .addCase(addFavoriteAPI.fulfilled, (state, action) => {
        const { collectionId, place } = action.payload;
        state.collections = state.collections.map((col) => (col.id === collectionId ? { ...col, items: [...col.items, { id: place.place_id!, name: place.name || '' }] } : col));
      })
      .addCase(removeFavoriteAPI.fulfilled, (state, action) => {
        const placeId = action.payload;
        state.collections = state.collections.map((col) => ({
          ...col,
          items: col.items.filter((i) => i.id !== placeId)
        }));
      });
  }
});

export const { setCollectionModal } = collectionsSlice.actions;
export default collectionsSlice.reducer;
