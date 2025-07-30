import React, { useState } from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { SiLine } from 'react-icons/si';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
  margin: 0 auto;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const LoginButton = styled.button<{ bgColor?: string; color?: string }>`
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
  width: 20rem;
  cursor: pointer;
  background-color: ${(props) => props.bgColor || '#f5f5f5'};
  color: ${(props) => props.color || '#000'};
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleLineLogin = () => {
    console.log('LINE login clicked');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Wrapper>
        <ButtonRow>
          <LoginButton onClick={handleGoogleLogin} bgColor="#000" color="#fff">
            <FcGoogle size={20} />
            Google
          </LoginButton>
          <LoginButton onClick={handleLineLogin} bgColor="#00C300" color="#fff">
            <SiLine size={20} />
            LINE
          </LoginButton>
        </ButtonRow>
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton type="submit">登入</SubmitButton>
      </Wrapper>
    </form>
  );
};

export default LoginForm;
