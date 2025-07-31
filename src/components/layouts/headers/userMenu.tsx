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

  // 假登入狀態（之後改成 Redux）
  const isLoggedIn = true;

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

  return (
    <div style={{ position: 'relative' }}>
      <UserAvatar onClick={handleClick}>
        <FaUserCircle size={28} />
      </UserAvatar>

      {showMenu && (
        <UserDropdownMenu ref={menuRef}>
          {isLoggedIn ? (
            <>
              <DropdownItem onClick={() => { navigate('/userEdit'); setShowMenu(false); }}>
                {t(`auth.editUser`)}
              </DropdownItem>
              <DropdownItem onClick={() => { alert('登出功能待串接'); setShowMenu(false); }}>
                {t(`auth.logout`)}
              </DropdownItem>
            </>
          ) : (
            <DropdownItem onClick={() => { navigate('/login'); setShowMenu(false); }}>
              {t(`auth.login`)} / {t(`auth.register`)}
            </DropdownItem>
          )}
        </UserDropdownMenu>
      )}
    </div>
  );
};

export default UserMenu;
