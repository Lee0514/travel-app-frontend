import React from 'react';
import styled from 'styled-components';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface HeartButtonProps {
  isFavorited: boolean;
  onClick: () => void;
  size?: number;
  color?: string;
}

const Button = styled.button<{ size: number }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.size}px;

  &:hover {
    opacity: 0.8;
  }
`;

const HeartButton: React.FC<HeartButtonProps> = ({ isFavorited, onClick, size = 24, color = 'red' }) => {
  return (
    <Button onClick={onClick} size={size}>
      {isFavorited ? <AiFillHeart color={color} /> : <AiOutlineHeart color={color} />}
    </Button>
  );
};

export default HeartButton;