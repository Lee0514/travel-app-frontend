import React, { useState, memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  MobileMenu,
  LanguageSwitcher,
  LangButton,
  LanguageIconWrapper,
  MobileLangMenu,
  IconGroup
} from './Header.styles';
import { FaGlobe, FaSearch, FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import UserMenu from './userMenu';

const Header: React.FC = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  interface NavItem {
    to: string;
    label: string;
  }

  const navItems: NavItem[] = useMemo(() => [
    { to: '/', label: t('nav.home') },
    { to: '/collection', label: t('nav.collection') },
    { to: '/culture', label: t('nav.culture') },
    { to: '/guided', label: t('nav.guided') },
    { to: '/nearby', label: t('nav.nearby') },
    { to: '/weather', label: t('nav.weather') }
  ], [i18n.language]);

  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  }, [i18n]);

  const handleNavItemClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <HeaderContainer>
      <LeftSection>
        <Hamburger onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div />
          <div />
          <div />
        </Hamburger>

        <LogoContainer>
          <FaGlobe size={28} style={{ marginRight: '8px' }} />
          <WebsiteName>GlobeTrekker</WebsiteName>
        </LogoContainer>

        {/* 桌面版 Nav 與 Search */}
        <Nav>
          {navItems.map(({ to, label }) => (
            <NavItem key={to} as={Link} to={to}>
              {label}
            </NavItem>
          ))}
        </Nav>
      </LeftSection>

      <RightSection>
        <div className="desktop-search">
          <SearchBar type="text" placeholder="Search..." />
        </div>

        <div className="mobile-search">
          {showMobileSearch ? (
            <SearchBar type="text" placeholder="Search..." autoFocus onBlur={() => setShowMobileSearch(false)} />
          ) : (
            <SearchIcon onClick={() => setShowMobileSearch(true)} style={{ cursor: 'pointer' }}>
              <FaSearch size={20} />
            </SearchIcon>
          )}
        </div>

        <LanguageSwitcher>
          {/* 桌機版多語系按鈕*/}
          <LangButton $active={i18n.language === 'zh'} onClick={() => changeLanguage('zh')}>
            CN
          </LangButton>
          <LangButton $active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>
            EN
          </LangButton>
          <LangButton $active={i18n.language === 'jp'} onClick={() => changeLanguage('jp')}>
            JP
          </LangButton>
        </LanguageSwitcher>

        {/* 手機版多語系圖示 */}
       <IconGroup>
        <LanguageIconWrapper onClick={() => setLangMenuOpen(!langMenuOpen)} style={{ cursor: 'pointer' }}>
          <FaGlobe size={24} />
        </LanguageIconWrapper>

          <UserAvatar as={Link} to="/user">
            <FaUserCircle size={28} />
          </UserAvatar>
        </IconGroup>

        {/* 手機版彈出語言選擇 */}
        <MobileLangMenu $visible={langMenuOpen}>
          <LangButton $active={i18n.language === 'zh'} onClick={() => changeLanguage('zh')}>
            CN
          </LangButton>
          <LangButton $active={i18n.language === 'en'} onClick={() => changeLanguage('en')}>
            EN
          </LangButton>
          <LangButton $active={i18n.language === 'jp'} onClick={() => changeLanguage('jp')}>
            JP
          </LangButton>
        </MobileLangMenu>
      </RightSection>

      <MobileMenu $isOpen={isMenuOpen}>
        {navItems.map(({ to, label }) => (
          <NavItem key={to} as={Link} to={to} onClick={handleNavItemClick}>
            {label}
          </NavItem>
        ))}
      </MobileMenu>
    </HeaderContainer>
  );
});

export default Header;
