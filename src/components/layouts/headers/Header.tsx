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

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <img src="src/assets/img/logo.png" alt="Logo" />
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
        <SearchBar type="text" placeholder="Search..." />
          <SearchIcon src="src/assets/img/search.svg" alt="Search Icon" />
            {/* 永遠顯示的使用者頭像 */}
            <UserAvatar src="src/assets/img/visitor.png" alt="User Avatar" />
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
