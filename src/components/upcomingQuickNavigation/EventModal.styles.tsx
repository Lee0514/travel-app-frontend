import styled from "styled-components";

export const Modal = styled.div`
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ccc;
  padding: 1rem;
  z-index: 1000;
  width: 20rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  border-radius: 8px;

  input, textarea {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.4rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  input:focus, textarea:focus {
    border-color: #a1866f;
  }

  textarea {
    resize: none;
  }

  button {
    margin-right: 0.5rem;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 10%;
    cursor: pointer;
    font-weight: 600;
    border: none;
    transition: background-color 0.2s ease;
  }
`;

export const SaveButton = styled.button`
  background-color: #6b4c3b;
  color: white;

  &:hover {
    background-color: #56392a;
  }
`;

export const CancelButton = styled.button`
  background-color: #ccc;
  color: black;

  &:hover {
    background-color: #bbb;
  }
`;
