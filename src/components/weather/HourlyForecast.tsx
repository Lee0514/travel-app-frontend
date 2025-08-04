import React from 'react';
import styled from 'styled-components';
import { HourData } from '../../pages/weather/index';

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
  background: #ffffff;
  border-radius: 12px;
  text-align: center;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HourlyForecast: React.FC<Props> = ({ hours }) => {
  return (
    <ScrollContainer>
      {hours.map((hour, index) => (
        <HourCard key={index}>
          <div>{new Date(hour.time).getHours()}時</div>
          <img src={hour.condition.icon} alt={hour.condition.text} />
          <div>{hour.chance_of_rain}%</div>
          <div>{hour.temp_c}°C</div>
        </HourCard>
      ))}
    </ScrollContainer>
  );
};

export default HourlyForecast;
