import React, { useState } from 'react';
import styled from 'styled-components';
import SocialLoginButtons from './btn/socialLoginButtons';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
  margin: 0 auto;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  width: 20rem;
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
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

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
        <SocialLoginButtons onGoogleClick={handleGoogleLogin} onLineClick={handleLineLogin} />

        <FieldWrapper>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="username">{t('auth.username')}</Label>
          <Input
            id="username"
            type="text"
            placeholder={t('auth.username')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="passwordCheck">{t('auth.confirmPassword')}</Label>
          <Input
            id="passwordCheck"
            type="password"
            placeholder={t('auth.confirmPassword')}
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FieldWrapper>

        <SubmitButton type="submit">{t('auth.submit')}</SubmitButton>
      </Wrapper>
    </form>
  );
};

export default LoginForm;
