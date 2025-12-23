// UserMenu.styles.ts
import styled from 'styled-components';

export const UserAvatar = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  padding-top: 0.65rem;
`;

export const AvatarImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

export const UserDropdownMenu = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 180px;
  z-index: 1000;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;
