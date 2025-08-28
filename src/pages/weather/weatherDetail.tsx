import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './weatherDetail.module.css';
import WeatherCard from '../../components/weather/WeatherCard';
import HourlyForecast from '../../components/weather/HourlyForecast';
import DailyForecast from '../../components/weather/DailyForecast';
import { useTranslation } from 'react-i18next';

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

const WeatherDetail: React.FC = () => {
  const { t } = useTranslation();
  const { location: locationParam } = useParams();
  const navigate = useNavigate();
  const locationHook = useLocation();
  const [location, setLocation] = useState('');
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [condition, setCondition] = useState('');
  const [icon, setIcon] = useState('');
  const [highTemp, setHighTemp] = useState<number | null>(null);
  const [lowTemp, setLowTemp] = useState<number | null>(null);
  const [hourly, setHourly] = useState<HourData[]>([]);
  const [daily, setDaily] = useState<DayData[]>([]);
  const [isInList, setIsInList] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(locationHook.search);
  const isCurrentParam = params.get('current') === 'true';

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const fetchWeather = async (query: string) => {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=10&aqi=no&alerts=no`);
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

      // 檢查是否在列表
      const stored = JSON.parse(localStorage.getItem('cities') || '[]');
      setIsInList(stored.includes(data.location.name));
      setLoading(false);
    };

    if (locationParam === 'current') {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
      });
    } else if (locationParam) {
      fetchWeather(locationParam);
    }
  }, [locationParam]);

  const addToList = () => {
    const stored = JSON.parse(localStorage.getItem('cities') || '[]');
    if (!stored.includes(location)) {
      const updated = [...stored, location];
      localStorage.setItem('cities', JSON.stringify(updated));
      setIsInList(true);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← {t('weather.back')}
        </button>
        {!loading && !isInList && (
          <button className={styles.addToListBtn} onClick={addToList}>
            ＋ {t('weather.addToList')}
          </button>
        )}
      </div>

      <WeatherCard location={location} temp={currentTemp} condition={condition} icon={icon} high={highTemp} low={lowTemp} isCurrent={isCurrentParam} />
      <HourlyForecast hours={hourly} />
      <DailyForecast days={daily} />
    </div>
  );
};

export default WeatherDetail;
