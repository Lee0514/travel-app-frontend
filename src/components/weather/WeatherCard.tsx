import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Props {
  location: string;
  temp: number | null;
  condition: string;
  icon: string;
  high: number | null;
  low: number | null;
}

const Card = styled.div`
  background: #D6CFC7;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const WeatherCard: React.FC<Props> = ({ location, temp, condition, icon, high, low }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <h2>{location}</h2>
      {icon ? (
        <img src={icon} alt={condition} />
      ) : null}
      <Temp>{temp !== null ? `${temp}°C` : 'Loading...'}</Temp>
      <Condition>{condition}</Condition>
      <Range>
        {t('weather.high')}:{high}° {t('weather.low')}:{low}°
      </Range>
    </Card>
  );
};

export default WeatherCard;
