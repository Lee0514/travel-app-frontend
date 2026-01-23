import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { editProfile } from '../../apis/auth';
import { setUser } from '../../redux/slice/userSlice';

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

const ErrorText = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const EditForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isOAuthUser = user.provider !== 'email';

  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.avatar || 'https://via.placeholder.com/80');
  const [username, setUsername] = useState(user.userName || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isOAuthUser) {
      const isChangingPassword = oldPassword || newPassword || confirmPassword;
      if (isChangingPassword) {
        if (!oldPassword || !newPassword || !confirmPassword) {
          setError('若要更改密碼，請完整填寫所有密碼欄位。');
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('新密碼與確認密碼不一致。');
          return;
        }
      }
    }

    try {
      const formData = new FormData();
      formData.append('userName', username);
      if (avatar) formData.append('profileImage', avatar);
      if (!isOAuthUser && newPassword) {
        formData.append('currentPassword', oldPassword);
        formData.append('newPassword', newPassword);
      }

      const updatedUser = await editProfile(formData);

      // 更新 localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // ✅ 更新 Redux store
      dispatch(setUser(updatedUser));

      alert('更新成功！');
    } catch (err: any) {
      console.error('Edit profile error:', err);
      setError(err.response?.data?.error || '伺服器錯誤');
    }
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
          <Input type="text" value={username} autoComplete="enterNewUsername" onChange={(e) => setUsername(e.target.value)} placeholder={t(`auth.enterNewUsername`)} />
        </FieldWrapper>

        {!isOAuthUser && (
          <>
            <FieldWrapper>
              <Label>{t(`auth.currentPassword`)}</Label>
              <Input type="password" value={oldPassword} autoComplete="enterCurrentPassword" onChange={(e) => setOldPassword(e.target.value)} placeholder={t(`auth.enterCurrentPassword`)} />
            </FieldWrapper>

            <FieldWrapper>
              <Label>{t(`auth.newPassword`)}</Label>
              <Input type="password" value={newPassword} autoComplete="enterNewPassword" onChange={(e) => setNewPassword(e.target.value)} placeholder={t(`auth.enterNewPassword`)} />
            </FieldWrapper>

            <FieldWrapper>
              <Label>{t(`auth.confirmNewPassword`)}</Label>
              <Input type="password" value={confirmPassword} autoComplete="reenterNewPassword" onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t(`auth.reenterNewPassword`)} />
            </FieldWrapper>
          </>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <SubmitButton type="submit">{t(`auth.saveChanges`)}</SubmitButton>
      </Wrapper>
    </form>
  );
};

export default EditForm;
