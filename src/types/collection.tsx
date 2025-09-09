import type { PlaceResult } from './place';
export interface FavoriteItem {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
  items: FavoriteItem[];
}

/**
 * 預設的收藏分類
 * 如果之後要改預設分類只要改這裡
 */
export const DEFAULT_COLLECTIONS: Collection[] = [
  { id: 'uncategorized', name: '未分類', items: [] },
  { id: 'switzerland', name: '瑞士', items: [] },
  { id: 'paris', name: '巴黎', items: [] },
  { id: 'tokyo', name: '東京', items: [] }
];

export interface CollectionsState {
  collections: Collection[];
  collectionModal: PlaceResult | null;
  loading: boolean;
}

export const initialState: CollectionsState = {
  collections: DEFAULT_COLLECTIONS,
  collectionModal: null,
  loading: false
};
