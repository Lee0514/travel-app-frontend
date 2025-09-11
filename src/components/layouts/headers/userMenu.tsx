import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { clearUser } from '../../../redux/slice/userSlice';
import { UserAvatar, UserDropdownMenu, DropdownItem } from './userMenu.styles';

const UserMenu = () => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user); // 從 Redux 拿 user

  const handleClick = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch(clearUser()); // Redux 清空 user
    navigate('/');
    setShowMenu(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <UserAvatar onClick={handleClick}>
        <FaUserCircle size={28} />
      </UserAvatar>

      {showMenu && (
        <UserDropdownMenu ref={menuRef}>
          {user.id ? (
            <>
              <DropdownItem
                onClick={() => {
                  navigate('/userEdit');
                  setShowMenu(false);
                }}
              >
                {t(`auth.editUser`)}
              </DropdownItem>
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
