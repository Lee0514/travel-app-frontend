import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SocialLoginButtons from './btn/socialLoginButtons';
import { useTranslation } from 'react-i18next';
import { login } from '../../apis/auth';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 360px;
  margin: 0 auto;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
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
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('登入成功！');
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      alert(`登入失敗：${err.response?.data?.error || '伺服器錯誤'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Wrapper>
        <SocialLoginButtons />

        <FieldWrapper>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input id="email" type="email" autoComplete="email" placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input id="password" type="password" autoComplete="password" placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} />
        </FieldWrapper>

        <SubmitButton type="submit">{t('auth.login')}</SubmitButton>
      </Wrapper>
    </form>
  );
};

export default LoginForm;
