import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import { FiTrash } from 'react-icons/fi';

interface PlaceCardProps {
  id: string;
  name: string;
  onDelete?: (id: string) => void;
}

const Card = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr auto auto;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  margin: 0.4rem 0;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 0.06rem 0.25rem rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    padding: 0.5rem;
    gap: 0.3rem;
  }
`;

const PlaceName = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

const MarkerIcon = styled.div`
  color: #e74c3c;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MapIconLink = styled.a`
  color: #1b3a70;
  font-size: 1.1rem;
  margin-top: 5px;

  &:hover {
    color: #3498db;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;

  &:hover {
    color: #e74c3c;
  }
`;

const PlaceCard: React.FC<PlaceCardProps> = ({ id, name, onDelete }) => {
  return (
    <Card>
      {/* 左側 marker */}
      <MarkerIcon>
        <FaMapMarkerAlt />
      </MarkerIcon>

      {/* 地點名稱 */}
      <PlaceName>{name}</PlaceName>

      {/* Google Map 連結 */}
      <MapIconLink href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`} target="_blank" rel="noopener noreferrer">
        <GrMapLocation size={20} />
      </MapIconLink>

      {/* 刪除收藏 */}
      {onDelete && (
        <DeleteButton onClick={() => onDelete(id)}>
          <FiTrash />
        </DeleteButton>
      )}
    </Card>
  );
};

export default PlaceCard;
