import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiTrash2 } from 'react-icons/fi';

interface Props {
  location: string;
  temp: number | null;
  condition: string;
  icon: string;
  high: number | null;
  low: number | null;
  isCurrent?: boolean; // 是否為當前位置
  onRemove?: () => void; // 選填，Overview 才用
}

const Card = styled.div`
  background: #d6cfc7;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Temp = styled.div`
  font-size: 48px;
  font-weight: bold;
`;

const Condition = styled.div`
  font-size: 18px;
  margin-top: 8px;
`;

const Range = styled.div`
  margin-top: 1rem;
  font-size: 16px;
  color: #666;
`;

const LocationTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #444;
  margin-top: 4px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;

  &:hover {
    color: red;
  }
`;

const WeatherCard: React.FC<Props> = ({ location, temp, condition, icon, high, low, isCurrent, onRemove }) => {
  const { t } = useTranslation();

  return (
    <Card>
      {/* 標題 + 刪除按鈕 */}
      <h2>{location}</h2>
      {onRemove && !isCurrent && (
        <RemoveButton onClick={onRemove}>
          <FiTrash2 size={18} />
        </RemoveButton>
      )}

      {/* 當前位置標籤 */}
      {isCurrent && (
        <LocationTag>
          <FiMapPin size={14} />
          <span>{t('weather.currentLocation')}</span>
        </LocationTag>
      )}

      {/* 天氣資訊 */}
      {icon ? <img src={icon} alt={condition} /> : null}
      <Temp>{temp !== null ? `${temp}°C` : 'Loading...'}</Temp>
      <Condition>{condition}</Condition>
      <Range>
        {t('weather.high')}:{high}° {t('weather.low')}:{low}°
      </Range>
    </Card>
  );
};

export default WeatherCard;
