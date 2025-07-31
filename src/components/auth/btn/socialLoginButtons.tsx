import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { SiLine } from 'react-icons/si';

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const LoginButton = styled.button<{ $bgColor?: string; $color?: string }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 0;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $bgColor }) => $bgColor|| '#f5f5f5'};
  color: ${({ $color }) => $color|| '#000'};
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

type Props = {
  onGoogleClick: () => void;
  onLineClick: () => void;
};

const SocialLoginButtons: React.FC<Props> = ({ onGoogleClick, onLineClick }) => {
  return (
    <ButtonRow>
      <LoginButton onClick={onGoogleClick} $bgColor="#000" $color="#fff">
        <FcGoogle size={20} />
        Google
      </LoginButton>
      <LoginButton onClick={onLineClick} $bgColor="#00C300" $color="#fff">
        <SiLine size={20} />
        LINE
      </LoginButton>
    </ButtonRow>
  );
};

export default SocialLoginButtons;
