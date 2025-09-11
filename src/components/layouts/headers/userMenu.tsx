import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { UserAvatar, UserDropdownMenu, DropdownItem } from './userMenu.styles';
import { useTranslation } from 'react-i18next';

const UserMenu = () => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
    setIsLoggedIn(!!accessToken);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => setShowMenu((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
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
          {isLoggedIn ? (
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
