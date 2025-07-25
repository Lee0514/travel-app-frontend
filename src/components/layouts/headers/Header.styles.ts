import styled from 'styled-components';
interface MobileLangMenuProps {
  $visible: boolean;
}
const breakpoints = {
  sm: '600px',
  md: '900px',
  lg: '1200px'
};

export const HeaderContainer = styled.header`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 3rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${breakpoints.lg}) {
    padding: 1rem;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding: 1rem;
  }
`;

// 新增：左側容器（手機排版用）
export const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

// 調整 logoContainer 的顯示邏輯
export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-right: 0.5rem;

  img {
    width: 32px;
    height: 32px;

    @media (max-width: ${breakpoints.sm}) {
      display: none;
    }
  }
`;

export const WebsiteName = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 1rem;
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  margin-left: 0.8rem;

  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

export const NavItem = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #0077cc;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;

  .desktop-search {
    display: flex;
  }

  .mobile-search {
    display: none;
  }

  @media (max-width: ${breakpoints.lg}) {
    .desktop-search {
      display: none;
    }

    .mobile-search {
      display: flex;
      align-items: center;
    }

    input[type='text'] {
      font-size: 1rem;
      padding: 0.3rem 0.6rem;
    }
  }
`;

export const SearchBar = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #ccc;
  outline: none;
  margin-left: 1rem;
  width: 180px;

  @media (max-width: ${breakpoints.lg}) {
    width: 140px;
  }
`;

export const SearchIcon = styled.div`
  display: flex;
  border-radius: 50%;
  margin-left: 1rem;

  @media (min-width: ${breakpoints.sm}) {
    display: flex;
  }
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 30px;
  border-radius: 50%;
  margin-left: 1rem;
`;

export const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;
  margin-right: 1rem;

  div {
    width: 24px;
    height: 3px;
    background-color: #333;
    border-radius: 2px;
  }

  @media (max-width: ${breakpoints.md}) {
    display: flex;
  }
`;

export const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 64px;
  left: 0;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  a {
    margin: 0.5rem 0;
    font-weight: 500;
    color: #333;
    text-decoration: none;

    &:hover {
      color: #0077cc;
    }
  }

  input {
    margin-bottom: 1rem;
  }
`;

//多語系按鈕
export const LanguageSwitcher = styled.div`
  display: flex;
  margin-left: 1rem;

  @media (max-width: ${breakpoints.lg}) {
    display: none;
  }
`;

export const LangButton = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? 'black' : '#888')};
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:disabled {
    cursor: default;
  }
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  color: #333;
`;

// 手機版專用語言切換 icon
export const LanguageIconWrapper = styled.div`
  display: none;

  @media (max-width: ${breakpoints.lg}) {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 1rem;
    color: #333;
    font-size: 1.3rem;
    user-select: none;
  }
`;

// 手機版彈出語言選擇容器
export const MobileLangMenu = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 3.5rem;
  right: 3.5rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1100;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 12px;
    border-width: 0 8px 8px 8px;
    border-style: solid;
    border-color: transparent transparent white transparent;
  }

  &::after {
    content: '';
    position: absolute;
    top: -9px;
    right: 11px;
    border-width: 0 9px 9px 9px;
    border-style: solid;
    border-color: transparent transparent #ccc transparent;
    z-index: -1;
  }
`;
