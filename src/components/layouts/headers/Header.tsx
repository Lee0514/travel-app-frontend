import React, { useState } from 'react';
import {
  HeaderContainer,
  LeftSection,
  LogoContainer,
  WebsiteName,
  Nav,
  NavItem,
  RightSection,
  SearchBar,
  SearchIcon,
  UserAvatar,
  Hamburger,
  MobileMenu
} from './Header.styles';
import { FaGlobe, FaSearch, FaUserCircle  } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <HeaderContainer>
      {/* 左側：漢堡 + 標題（手機版） */}
      <LeftSection>
        <Hamburger onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div />
          <div />
          <div />
        </Hamburger>

        <LogoContainer>
           {/* <img src="src/assets/img/logo.png" alt="Logo" /> */}
          <FaGlobe size={28} style={{ marginRight: '8px' }} />
          <WebsiteName>Globetrekker</WebsiteName>
        </LogoContainer>
      </LeftSection>

      {/* 桌面版 Nav 與 Search */}
      <Nav>
        <NavItem href="#">Home</NavItem>
        <NavItem href="#">Collection</NavItem>
        <NavItem href="#">Culture</NavItem>
        <NavItem href="#">Guided</NavItem>
        <NavItem href="#">Nearby</NavItem>
        <NavItem href="#">Weather</NavItem>
      </Nav>

      <RightSection>
        {/* 桌面版一直顯示 SearchBar */}
        <div className="desktop-search">
          <SearchBar type="text" placeholder="Search..." />
        </div>

        {/* 手機版：只顯示搜尋 icon，點擊後顯示輸入框 */}
        <div className="mobile-search">
          {showMobileSearch ? (
            <SearchBar
              type="text"
              placeholder="Search..."
              autoFocus
              onBlur={() => setShowMobileSearch(false)}
            />
          ) : (
            <SearchIcon
              onClick={() => setShowMobileSearch(true)}
              style={{ cursor: 'pointer' }}
            > <FaSearch size={20} />
            </SearchIcon>
          )}
        </div>
        {/* 永遠顯示的使用者頭像 */}
        <UserAvatar>
          <FaUserCircle size={28} />
        </UserAvatar>
      </RightSection>

      {/* 手機展開選單 */}
      <MobileMenu isOpen={isMenuOpen}>
        {/* <SearchBar type="text" placeholder="Search..." /> */}
        <NavItem href="#">Home</NavItem>
        <NavItem href="#">Collection</NavItem>
        <NavItem href="#">Culture</NavItem>
        <NavItem href="#">Guided</NavItem>
        <NavItem href="#">Nearby</NavItem>
        <NavItem href="#">Weather</NavItem>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
