import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StopButton = styled.button`
  padding: 16px 32px;
  font-size: 18px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #ff7875;
  }
`;

interface RecordingOverlayProps {
  onStop: () => void;
}

const RecordingOverlay: React.FC<RecordingOverlayProps> = ({ onStop }) => {
  return (
    <Overlay>
      <StopButton onClick={onStop}>停止錄音</StopButton>
    </Overlay>
  );
};

export default RecordingOverlay;
