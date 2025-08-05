import React from 'react';
import styled from 'styled-components';
import { HourData } from '../../pages/weather/index';
import { useTranslation } from 'react-i18next';

interface Props {
  hours: HourData[];
}

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  margin: 24px 0;
  padding-bottom: 8px;
`;

const HourCard = styled.div`
  min-width: 72px;
  display: flex;
  flex-direction: column;
  background: #E9E4DC;
  border-radius: 12px;
  text-align: center;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RainPercentage = styled.div`
  font-size: 12px;
  color: #555;
`;

const HourlyForecast: React.FC<Props> = ({ hours }) => {
  const { t } = useTranslation();
  
  return (
    <ScrollContainer>
      {hours.map((hour, index) => (
        <HourCard key={index}>
          <div>{t('time.hourLabel', { hour: new Date(hour.time).getHours() })}</div>
          <img src={hour.condition.icon} alt={hour.condition.text} />
          <RainPercentage>{hour.chance_of_rain}%</RainPercentage>
          <div>{hour.temp_c}°C</div>
        </HourCard>
      ))}
    </ScrollContainer>
  );
};

export default HourlyForecast;
