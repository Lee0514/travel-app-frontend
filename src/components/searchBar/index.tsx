import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const breakpoints = {
  sm: '600px',
  lg: '1200px',
};

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 60%;

  .desktop-search, .mobile-search {
    display: flex;
    align-items: center;
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
    }
  }
`;

const SearchBarInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #ccc;
  outline: none;
  width: 100%;
  max-width: 40rem;
  font-size: 1rem;

  @media (max-width: ${breakpoints.lg}) {
    max-width: 100%;
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  border-radius: 50%;
  margin-left: 0.5rem;
  cursor: pointer;

  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }

   @media (min-width: ${breakpoints.lg}) {
    margin-left: 0.2rem; 
  }

  @media (max-width: ${breakpoints.lg}) {
    margin-left: 0.5rem;
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearch = () => {
    if (onSearch && inputValue.trim() !== '') {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const placeholderText = t('explore.searchGuide');

  return (
    <SearchWrapper>
      {/* 桌機版 */}
      <div className="desktop-search">
        <SearchBarInput
          id="search-input-desktop"
          name="search-desktop"
          type="text"
          placeholder={placeholderText}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* 手機版 */}
      <div className="mobile-search">
        {showMobileSearch ? (
          <>
            <SearchBarInput
              id="search-input-mobile"
              name="search-mobile"
              type="text"
              placeholder={placeholderText}
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setShowMobileSearch(false)}
            />
          </>
        ) : (
          <SearchIcon onClick={() => setShowMobileSearch(true)}>
            <FaSearch size={20} />
          </SearchIcon>
        )}
      </div>
    </SearchWrapper>
  );
};

export default SearchBar;
