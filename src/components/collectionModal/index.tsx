import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Collection {
  id: string;
  name: string;
}
interface CollectionModalProps {
  place: { id: string; name: string } | null;
  collections: Collection[];
  onAddToCollection: (collectionId: string) => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalWrapper = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  z-index: 1000;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  background: white;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f5f5f5;
  }
`;

const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 8px;
  width: 100%;
  margin-top: 8px;
`;

const ConfirmButton = styled.button`
  margin-top: 12px;
  width: 100%;
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

const CancelButton = styled.button`
  margin-top: 12px;
  width: 100%;
  background: #e5e7eb;
  padding: 10px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #d1d5db;
  }
`;

const CollectionModal: React.FC<CollectionModalProps> = ({ place, collections, onAddToCollection, onClose }) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const { t } = useTranslation();

  if (!place) return null;

  return (
    <Overlay>
      <ModalWrapper>
        <Title>{t('collection.addToCategoryTitle')}</Title>
        <p>{t('collection.addToCategoryDesc', { placeName: place.name })}</p>

        {/* 已有分類 */}
        <div style={{ maxHeight: '160px', overflowY: 'auto', marginTop: '12px' }}>
          {collections.map((col) => (
            <Button
              key={col.id}
              onClick={() => {
                onAddToCollection(col.id);
                onClose();
              }}
            >
              {col.name}
            </Button>
          ))}
        </div>

        {/* 新建分類 */}
        <div>
          <Input type="text" placeholder={t('collection.newCategoryPlaceholder')} value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} />
          <ConfirmButton
            onClick={() => {
              if (newCollectionName.trim()) {
                const newId = newCollectionName.toLowerCase();
                onAddToCollection(newId);
                setNewCollectionName('');
                onClose();
              }
            }}
          >
            {t('collection.createAndAdd')}
          </ConfirmButton>
        </div>

        <CancelButton onClick={onClose}>{t('collection.cancel')}</CancelButton>
      </ModalWrapper>
    </Overlay>
  );
};

export default CollectionModal;
