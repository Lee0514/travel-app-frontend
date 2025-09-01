import React, { useState } from 'react';

interface Collection {
  id: string;
  name: string;
  items: { id: string; name: string }[];
}

interface CollectionModalProps {
  place: { id: string; name: string } | null;
  collections: Collection[];
  onClose: () => void;
  onSave: (collectionId: string, place: { id: string; name: string }) => void;
}

const CollectionModal: React.FC<CollectionModalProps> = ({ place, collections, onClose, onSave }) => {
  const [newCollectionName, setNewCollectionName] = useState('');

  if (!place) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">加入收藏分類</h2>
        <p className="mb-4">
          要將 <b>{place.name}</b> 加入到哪個分類？
        </p>

        {/* 已有分類 */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {collections.map((col) => (
            <button key={col.id} onClick={() => onSave(col.id, place)} className="w-full text-left p-2 rounded-lg hover:bg-gray-100 border">
              {col.name}
            </button>
          ))}
        </div>

        {/* 新建分類 */}
        <div className="mt-4">
          <input type="text" placeholder="新增分類名稱" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} className="border rounded p-2 w-full" />
          <button
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={() => {
              if (newCollectionName.trim()) {
                const newId = newCollectionName.toLowerCase();
                onSave(newId, place);
                setNewCollectionName('');
              }
            }}
          >
            建立並加入
          </button>
        </div>

        <button onClick={onClose} className="mt-4 w-full bg-gray-300 py-2 rounded-lg hover:bg-gray-400">
          取消
        </button>
      </div>
    </div>
  );
};

export default CollectionModal;
