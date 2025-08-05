import React from 'react';
import styled from 'styled-components';
import { DayData } from '../../pages/weather/index';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

interface Props {
  days: DayData[];
}

const breakpoints = {
  sm: '600px',
  md: '900px',
  lg: '1200px'
};

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 24px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #EFE2BA;
  margin-bottom: 12px;
  border-radius: 12px;
  padding: 12px 16px;
`;

const DateBlock = styled.div`
  width: 5rem;
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
  align-items: center;
  font-weight: 600;
`;

const DateText = styled.div`
  font-size: 12px;
  color: #666;
`;

const WeatherBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
`;

const WeatherIcon = styled.img`
  width: 3.5rem;
  @media (max-width: ${breakpoints.sm}) {
     width: 3rem;
  }
`;

const RainPercentage = styled.div`
  font-size: 12px;
  color: #555;
  padding-bottom: 4px;
`;

const TempBlock = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TempBarWrapper = styled.div`
  position: relative;
  width: 7rem;
  height: 6px;
  background: #EAD8B7;
  border-radius: 6px;

  @media (max-width: ${breakpoints.sm}) {
    width: 6rem;
  }
`;

const TempBar = styled.div<{ $percent: number }>`
  position: absolute;
  height: 6px;
  background: #D8C690;
  border-radius: 6px;
  left: 0;
  width: ${({ $percent }) => $percent}%;
`;

const TempText = styled.div`
  font-size: 14px;
  color: #333;
  min-width: 32px;
  text-align: center;
`;

const getDayOfWeek = (dateString: string, t: TFunction): string => {
  const days = [
    t('weekday.sunday'),
    t('weekday.monday'),
    t('weekday.tuesday'),
    t('weekday.wednesday'),
    t('weekday.thursday'),
    t('weekday.friday'),
    t('weekday.saturday'),
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};


const DailyForecast: React.FC<Props> = ({ days }) => {
  const { t } = useTranslation();
  
  // 先找全區最高、最低氣溫來算條狀圖比例
  const temps = days.map(d => [d.day.mintemp_c, d.day.maxtemp_c]).flat();
  const minAll = Math.min(...temps);
  const maxAll = Math.max(...temps);

  return (
    <List>
      {days.map((day) => {
        const dayText = getDayOfWeek(day.date, t);
        const min = day.day.mintemp_c;
        const max = day.day.maxtemp_c;

        return (
          <Item key={day.date}>
            {/* 左：星期幾 */}
            <DateBlock>
              {dayText}
              <DateText>{day.date.slice(5)}</DateText>
            </DateBlock>


            {/* 中：天氣 + icon + 降雨機率 */}
            <WeatherBlock>
              <WeatherIcon src={day.day.condition.icon} alt={day.day.condition.text} />
              <RainPercentage>{day.day.daily_chance_of_rain}%</RainPercentage>
            </WeatherBlock>

            {/* 右：溫度條 */}
            <TempBlock>
              <TempText>{min}°</TempText>
              <TempBarWrapper>
                <TempBar $percent={((max - min) / (maxAll - minAll)) * 100} />
              </TempBarWrapper>
              <TempText>{max}°</TempText>
            </TempBlock>

          </Item>
        );
      })}
    </List>
  );
};

export default DailyForecast;
