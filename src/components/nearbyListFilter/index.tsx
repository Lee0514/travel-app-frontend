import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FilterSelect = styled.select`
  margin-bottom: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: #fff;
  color: #333;
  width: 10rem;

  &:focus {
    outline: none;
    border-color: #1b3a70;
  }

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8"><path fill="none" stroke="%23333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M2 2l4 4 4-4"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 12px 8px;
  padding-right: 2.5rem;
`;

type Props = {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
};

const NearbyListFilter: React.FC<Props> = ({ categories, selectedCategory, onChange }) => {
  const { t } = useTranslation();

  return (
    <FilterSelect value={selectedCategory} onChange={(e) => onChange(e.target.value)} aria-label={t('categoryFilterLabel', '分類篩選')}>
      <option value="All">{t('category.all', '全部')}</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {t(`category.${cat.toLowerCase()}`, cat)}
        </option>
      ))}
    </FilterSelect>
  );
};

export default NearbyListFilter;
