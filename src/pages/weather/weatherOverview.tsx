import { useState, useEffect } from 'react';
import WeatherCard from '@/components/weather/WeatherCard';
import { FiMapPin } from 'react-icons/fi';
import styles from './weather.module.css';
import { useTranslation } from 'react-i18next';

interface WeatherData {
  location: string;
  temp: number | null;
  condition: string;
  icon: string;
  high: number | null;
  low: number | null;
  isCurrent?: boolean; // 新增欄位
}

const WeatherOverview = () => {
  const { t } = useTranslation();

  const [cities, setCities] = useState<string[]>(['Taipei', 'Tokyo']);
  const [input, setInput] = useState('');
  const [weatherDataList, setWeatherDataList] = useState<WeatherData[]>([]);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (query: string, isCurrent = false): Promise<WeatherData | null> => {
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=1&aqi=no&alerts=no`);
      const data = await res.json();

      return {
        location: data.location.name,
        temp: data.current.temp_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon ? `https:${data.current.condition.icon}` : '',
        high: data.forecast.forecastday[0].day.maxtemp_c,
        low: data.forecast.forecastday[0].day.mintemp_c,
        isCurrent
      };
    } catch (err) {
      console.error('抓取天氣失敗', err);
      return null;
    }
  };

  const addCity = async () => {
    const city = input.trim();
    if (!city || cities.includes(city)) return;

    const weatherData = await fetchWeather(city);
    if (!weatherData) {
      alert(t('weather.cityNotFound'));
      return;
    }

    setCities((prev) => [...prev, weatherData.location]);
    setWeatherDataList((prev) => [...prev, weatherData]);
    setInput('');
  };

  const removeCity = (city: string) => {
    setCities((prev) => prev.filter((c) => c !== city));
    setWeatherDataList((prev) => prev.filter((data) => data.location !== city));
  };

  useEffect(() => {
    const loadInitialCities = async () => {
      // 先抓預設城市 Taipei / Tokyo
      for (const city of cities) {
        const data = await fetchWeather(city);
        if (data) {
          setWeatherDataList((prev) => (prev.some((d) => d.location === data.location) ? prev : [...prev, data]));
        }
      }

      // 抓當前位置
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const query = `${position.coords.latitude},${position.coords.longitude}`;
            const weatherData = await fetchWeather(query, true); // 設為 isCurrent
            if (weatherData) {
              setCities((prev) => (prev.includes(weatherData.location) ? prev : [weatherData.location, ...prev]));
              setWeatherDataList((prev) => (prev.some((d) => d.location === weatherData.location) ? prev : [weatherData, ...prev]));
            }
          },
          () => console.log('使用者拒絕定位')
        );
      }
    };

    loadInitialCities();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* 搜尋區塊 */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('weather.enterLocation')}
          className={styles.searchInput}
          onKeyDown={(e) => e.key === 'Enter' && addCity()}
        />
        <button onClick={addCity} className={styles.addButton}>
          {t('weather.search')}
        </button>
      </div>

      {/* 天氣卡片列表 */}
      <div className={styles.gridContainer}>
        {weatherDataList.map((data) => (
          <WeatherCard
            key={data.location}
            location={data.location}
            temp={data.temp}
            condition={data.condition}
            icon={data.icon}
            high={data.high}
            low={data.low}
            onRemove={() => removeCity(data.location)}
            isCurrent={data.isCurrent} // 傳給 WeatherCard
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherOverview;
