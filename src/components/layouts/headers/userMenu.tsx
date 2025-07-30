import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { UserAvatar, UserDropdownMenu, DropdownItem } from './userMenu.styles';

const UserMenu = () => {
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
              <DropdownItem onClick={() => { navigate('/profile'); setShowMenu(false); }}>
                編輯使用者資料
              </DropdownItem>
              <DropdownItem onClick={() => { alert('登出功能待串接'); setShowMenu(false); }}>
                登出
              </DropdownItem>
            </>
          ) : (
            <DropdownItem onClick={() => { navigate('/login'); setShowMenu(false); }}>
              登入 / 註冊
            </DropdownItem>
          )}
        </UserDropdownMenu>
      )}
    </div>
  );
};

export default UserMenu;
