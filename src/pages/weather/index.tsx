import React, { useEffect, useState } from 'react';
import styles from './weather.module.css';
import WeatherCard from '../../components/weather/WeatherCard';
import HourlyForecast from '../../components/weather/HourlyForecast';
import DailyForecast from '../../components/weather/DailyForecast';
export interface HourData {
  time: string;
  temp_c: number;
  chance_of_rain: number;
  condition: {
    text: string;
    icon: string;
  };
}
export interface DayData {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    daily_chance_of_rain: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

const Weather: React.FC = () => {
  const [location, setLocation] = useState('');
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [condition, setCondition] = useState('');
  const [icon, setIcon] = useState('');
  const [highTemp, setHighTemp] = useState<number | null>(null);
  const [lowTemp, setLowTemp] = useState<number | null>(null);
  const [hourly, setHourly] = useState<HourData[]>([]);
  const [daily, setDaily] = useState<DayData[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=10&aqi=no&alerts=no`
      );
      const data = await res.json();
      setLocation(data.location.name);
      setCurrentTemp(data.current.temp_c);
      setCondition(data.current.condition.text);
      setIcon(data.current.condition.icon);
      setHighTemp(data.forecast.forecastday[0].day.maxtemp_c);
      setLowTemp(data.forecast.forecastday[0].day.mintemp_c);

      const now = new Date();
      const hours: HourData[] = [];
      for (const day of data.forecast.forecastday) {
        for (const hour of day.hour) {
          const hourTime = new Date(hour.time);
          if (hourTime >= now && hours.length < 24) {
            hours.push(hour);
          }
        }
      }
      setHourly(hours);
      setDaily(data.forecast.forecastday);
    });
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <WeatherCard
        location={location}
        temp={currentTemp}
        condition={condition}
        icon={icon}
        high={highTemp}
        low={lowTemp}
      />
      <HourlyForecast hours={hourly} />
      <DailyForecast days={daily} />
    </div>
  );
};

export default Weather;
