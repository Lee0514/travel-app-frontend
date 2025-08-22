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
  Hamburger,
  MobileMenu,
  LanguageSwitcher,
  LangButton,
  LanguageIconWrapper,
  MobileLangMenu,
  IconGroup
} from './Header.styles';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import UserMenu from './userMenu';

const Header: React.FC = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  interface NavItem {
    to: string;
    label: string;
  }

  const navItems: NavItem[] = useMemo(
    () => [
      { to: '/', label: t('nav.home') },
      { to: '/translate', label: t('nav.translate') },
      { to: '/collection', label: t('nav.collection') },
      { to: '/guided', label: t('nav.guided') },
      { to: '/nearby', label: t('nav.nearby') },
      { to: '/weather', label: t('nav.weather') },
    ],
    [i18n.language]
  );

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      setLangMenuOpen(false);
    },
    [i18n]
  );

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

        {/* 桌面版 Nav */}
        <Nav>
          {navItems.map(({ to, label }) => (
            <NavItem key={to} as={Link} to={to}>
              {label}
            </NavItem>
          ))}
        </Nav>
      </LeftSection>

      <RightSection>

        <LanguageSwitcher>
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

        <IconGroup>
          <LanguageIconWrapper onClick={() => setLangMenuOpen(!langMenuOpen)} style={{ cursor: 'pointer' }}>
            <FaGlobe size={24} />
          </LanguageIconWrapper>
          <UserMenu />
        </IconGroup>

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
