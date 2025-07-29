import { useState } from 'react';
import styled from 'styled-components'
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

// Mock data for collections
// In a real application, this would be fetched from an API or database
const mockCollections = [
  {
    id: 'switzerland',
    name: '瑞士',
    items: [
      { id: 'lucerne', name: '琉森' },
      { id: 'zermatt', name: '策馬特' },
      { id: 'bern', name: '伯恩' },
    ],
  },
  {
    id: 'paris',
    name: '巴黎',
    items: [
      { id: 'eiffel', name: '艾菲爾鐵塔' },
      { id: 'louvre', name: '羅浮宮' },
    ],
  },
  {
    id: 'tokyo',
    name: '東京',
    items: [
      { id: 'shibuya', name: '澀谷' },
      { id: 'skytree', name: '晴空塔' },
    ],
  },
];

const Wrapper = styled.div`
  padding: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

const CollectionCard = styled.div`
  background-color: #f4f4f4;
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-4px);
    background-color: #e0e0e0;
  }
`;

const ItemCard = styled(CollectionCard)``;

const AddCard = styled.div`
  background-color: #f4f4f4;
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  border: 2px dashed #ccc;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #666;

  &:hover {
    background-color: #e9e9e9;
  }
`;

const Plus = styled.span`
  font-weight: bold;
  font-size: 2rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;
 const Detail = styled.div``;
 const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;
 const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
 const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;
 const ModalTitle = styled.h3`
  margin-bottom: 1rem;
`;
 const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
`;
 const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
 const ModalButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #999;
    color: #000;
  }
`;
 const CancelButton = styled(ModalButton)`
  background-color: #ccc;

  &:hover {
    background-color: #999;
  }
`;


const CollectionsQuickNavigation = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [collections, setCollections] = useState(mockCollections);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCollections([
        ...collections,
        { id: newCategory.toLowerCase(), name: newCategory, items: [] },
      ]);
      setNewCategory('');
      setShowModal(false);
    }
  };

  const handleBack = () => setSelectedCollection(null);

  const current = collections.find((c) => c.id === selectedCollection);

  return (
    <Wrapper>
      {!selectedCollection ? (
        <Grid>
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
            >
              <h3>{collection.name}</h3>
            </CollectionCard>
          ))}
          <AddCard onClick={() => setShowModal(true)}>
            <Plus>＋</Plus>
          </AddCard>
        </Grid>
      ) : (
        <Detail>
          <HeaderRow>
            <BackButton onClick={handleBack}>
              <AiOutlineArrowLeft />
            </BackButton>
            <Title>{current?.name}</Title>
          </HeaderRow>

          <Grid>
            {current?.items.map((item) => (
              <ItemCard key={item.id}>
                <p>{item.name}</p>
              </ItemCard>
            ))}
          </Grid>
        </Detail>
      )}

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{t('collection.addNewGroup')}</ModalTitle>
            <ModalInput
              type="text"
              placeholder={t('collection.typeGroupName')}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <ModalButtons>
              <CancelButton onClick={() => setShowModal(false)}>{t('collection.cancel')}</CancelButton>
              <ModalButton onClick={handleAddCategory}>{t('collection.done')}</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default CollectionsQuickNavigation;
