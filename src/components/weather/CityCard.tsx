import React from 'react';
import styled from 'styled-components';

interface CityCardProps {
  city: string;
  temperature: number;
  onRemove: () => void;
}

const Card = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const City = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const Temp = styled.p`
  color: #4b5563;
  margin: 0;
`;

const RemoveButton = styled.button`
  background-color: #ef4444;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #dc2626;
  }
`;

const CityCard: React.FC<CityCardProps> = ({ city, temperature, onRemove }) => {
  return (
    <Card>
      <Info>
        <City>{city}</City>
        <Temp>{temperature}°C</Temp>
      </Info>
      <RemoveButton onClick={onRemove}>刪除</RemoveButton>
    </Card>
  );
};

export default CityCard;
