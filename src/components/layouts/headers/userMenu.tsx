import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { clearUser } from '../../../redux/slice/userSlice';
import { UserAvatar, AvatarImg, UserDropdownMenu, DropdownItem } from './userMenu.styles';
import { logout } from '../../../apis/auth';

const UserMenu = () => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user); // 從 Redux 拿 user
  const isOAuthUser = user.provider !== 'email';
  const handleClick = () => setShowMenu((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout(); // ✅ 清 cookie（LINE）
    } catch (e) {
      // 忽略也沒關係，前端仍要清狀態
    }

    localStorage.removeItem('accessToken');
    dispatch(clearUser()); // Redux 清空 user
    navigate('/');
    setShowMenu(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <UserAvatar onClick={handleClick}>{user.avatar ? <AvatarImg src={user.avatar} alt={user.userName || 'user avatar'} /> : <FaUserCircle size={28} />}</UserAvatar>

      {showMenu && (
        <UserDropdownMenu ref={menuRef}>
          {user.id ? (
            <>
              {!isOAuthUser && (
                <DropdownItem
                  onClick={() => {
                    navigate('/userEdit');
                    setShowMenu(false);
                  }}
                >
                  {t(`auth.editUser`)}
                </DropdownItem>
              )}
              <DropdownItem onClick={handleLogout}>{t(`auth.logout`)}</DropdownItem>
            </>
          ) : (
            <DropdownItem
              onClick={() => {
                navigate('/userLogin');
                setShowMenu(false);
              }}
            >
              {t(`auth.login`)} / {t(`auth.register`)}
            </DropdownItem>
          )}
        </UserDropdownMenu>
      )}
    </div>
  );
};

export default UserMenu;
