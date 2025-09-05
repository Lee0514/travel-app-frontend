import { useState } from 'react';
import type { Collection } from '../types/collection';
import type { PlaceResult } from '../types/place';
import { DEFAULT_COLLECTIONS } from '../types/collection';

const LOCALSTORAGE_KEY = 'collections';

/**
 * useCollections
 * - 管理 collections 狀態
 * - 管理 collectionModal（當 user toggle favorite 時先存在 modal）
 * - 提供 isFavorited / handleToggleFavorite / handleAddToCollection
 *
 * NOTE: 路徑假設 types 與 hooks 在同一層級 (src/types, src/hooks)
 */
export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(() => {
    try {
      const stored = localStorage.getItem(LOCALSTORAGE_KEY);
      if (!stored) return DEFAULT_COLLECTIONS;
      const parsed = JSON.parse(stored) as Collection[];
      if (!Array.isArray(parsed)) return DEFAULT_COLLECTIONS;
      return parsed;
    } catch (err) {
      console.warn('Failed to parse collections from localStorage', err);
      return DEFAULT_COLLECTIONS;
    }
  });

  const [collectionModal, setCollectionModal] = useState<PlaceResult | null>(null);

  const persist = (next: Collection[]) => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn('Failed to persist collections to localStorage', err);
    }
  };

  const isFavorited = (placeId: string) =>
    collections.some((col) => col.items.some((item) => item.id === placeId));

  const handleToggleFavorite = (place: PlaceResult) => {
    if (!place.place_id) return;

    if (isFavorited(place.place_id)) {
      // 移除收藏
      setCollections((prev) => {
        const updated = prev.map((col) => ({
          ...col,
          items: col.items.filter((i) => i.id !== place.place_id)
        }));
        persist(updated);
        return updated;
      });
    } else {
      // 先 show modal（使用者要選擇分類），同時先放到未分類（跟你原本行為一致）
      setCollectionModal(place);
      setCollections((prev) => {
        const updated = prev.map((col) =>
          col.id === 'uncategorized'
            ? { ...col, items: [...col.items, { id: place.place_id!, name: place.name || '' }] }
            : col
        );
        persist(updated);
        return updated;
      });
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    if (!collectionModal) return;

    setCollections((prev) => {
      const placeId = collectionModal.place_id;
      if (!placeId) return prev;

      // 先從所有分類移除該 place（避免重複），再加到目標分類
      let cleaned = prev.map((col) => ({
        ...col,
        items: col.items.filter((i) => i.id !== placeId)
      }));

      cleaned = cleaned.map((col) =>
        col.id === collectionId
          ? { ...col, items: [...col.items, { id: placeId, name: collectionModal.name || '' }] }
          : col
      );

      persist(cleaned);
      return cleaned;
    });

    setCollectionModal(null);
  };

  return {
    collections,
    collectionModal,
    setCollectionModal,
    isFavorited,
    handleToggleFavorite,
    handleAddToCollection,
  } as const;
}

export default useCollections;
