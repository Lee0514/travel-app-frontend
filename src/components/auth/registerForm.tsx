import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SocialLoginButtons from './btn/socialLoginButtons';
import { useTranslation } from 'react-i18next';
import { signup } from '../../apis/auth';

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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordCheck) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    try {
      const res = await signup(email, password, passwordCheck, userName);
      console.log('註冊成功:', res);

      if (res?.accessToken) {
        localStorage.setItem('accessToken', res.accessToken);
        if (res.refreshToken) {
          localStorage.setItem('refreshToken', res.refreshToken);
        }

        // @TODO: 存 user 資訊（之後放到 Redux）
        localStorage.setItem('user', JSON.stringify(res.user));

        // 跳轉首頁
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);

      setError(err.response?.data?.error || '註冊失敗');
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
          <Label htmlFor="username">{t('auth.username')}</Label>
          <Input id="username" type="text" autoComplete="username" placeholder={t('auth.username')} value={userName} onChange={(e) => setUserName(e.target.value)} />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input id="password" type="password" autoComplete="new-password" placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} />
        </FieldWrapper>

        <FieldWrapper>
          <Label htmlFor="passwordCheck">{t('auth.confirmPassword')}</Label>
          <Input id="passwordCheck" type="password" autoComplete="new-password" placeholder={t('auth.confirmPassword')} value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} />
        </FieldWrapper>

        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

        <SubmitButton type="submit">{t('auth.submit')}</SubmitButton>
      </Wrapper>
    </form>
  );
};

export default LoginForm;
