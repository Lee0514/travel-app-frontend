import { useState } from 'react';
import styled from 'styled-components'
import { AiOutlineArrowLeft } from 'react-icons/ai';

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

export const Detail = styled.div``;

export const Title = styled.h2`
  margin-bottom: 1rem;
  text-align: center;
`;


const CollectionsQuickNavigation = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const handleBack = () => setSelectedCollection(null);

  const current = mockCollections.find((c) => c.id === selectedCollection);

  return (
    <Wrapper>
      {!selectedCollection ? (
        <Grid>
          {mockCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
            >
              <h3>{collection.name}</h3>
            </CollectionCard>
          ))}

          <AddCard onClick={() => alert('新增分類')}>
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
    </Wrapper>
  );
};

export default CollectionsQuickNavigation;
