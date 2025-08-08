import React from "react";
import styled from "styled-components";
import { FaStop } from "react-icons/fa";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StopButton = styled.button`
  width: 5rem;
  height: 5rem;
  font-size: 1.5rem;
  background-color: #d88c9a;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0a3ad;
  }
`;

interface RecordingOverlayProps {
  onStop: () => void;
}

const RecordingOverlay: React.FC<RecordingOverlayProps> = ({ onStop }) => {
  return (
    <Overlay>
      <StopButton onClick={onStop}>
        <FaStop /> 
      </StopButton>
    </Overlay>
  );
};

export default RecordingOverlay;
