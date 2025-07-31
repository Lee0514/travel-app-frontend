import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditForm: React.FC = () => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('https://via.placeholder.com/80');
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Avatar File:', avatar);
    console.log('Old Password:', oldPassword);
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    // 處理 API 送出等...
  };

  return (
    <form onSubmit={handleSubmit}>
      <Wrapper>
        <FieldWrapper>
          <Label>{t(`auth.userAvatar`)}</Label>
          <Avatar src={previewUrl} alt="User Avatar" />
          <Input type="file" accept="image/*" onChange={handleAvatarChange} />
        </FieldWrapper>

        <FieldWrapper>
          <Label>{t(`auth.username`)}</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t(`auth.enterNewUsername`)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>{t(`auth.currentPassword`)}</Label>
          <Input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={t(`auth.enterCurrentPassword`)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>{t(`auth.newPassword`)}</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t(`auth.enterNewPassword`)}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Label>{t(`auth.confirmNewPassword`)}</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t(`auth.reenterNewPassword`)}
          />
        </FieldWrapper>

        <SubmitButton type="submit">{t(`auth.saveChanges`)}</SubmitButton>
      </Wrapper>
    </form>
  );
};

export default EditForm;
