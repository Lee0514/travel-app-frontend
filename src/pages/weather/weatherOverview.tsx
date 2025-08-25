import { useState, useEffect } from 'react';
import WeatherCard from '@/components/weather/WeatherCard';
import styles from './weatherOverview.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface WeatherData {
  location: string;
  temp: number | null;
  condition: string;
  icon: string;
  high: number | null;
  low: number | null;
  isCurrent?: boolean;
}

const WeatherOverview = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [cities, setCities] = useState<string[]>([]);
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

  const searchCity = async () => {
    const city = input.trim();
    if (!city) return;

    // 如果城市已經在列表 → 直接跳 detail
    if (cities.map((c) => c.toLowerCase()).includes(city.toLowerCase())) {
      navigate(`/weather/${city}`);
      return;
    }

    // 不在列表 → 先驗證是否存在
    const weatherData = await fetchWeather(city);
    if (!weatherData) {
      alert(t('weather.cityNotFound'));
      return;
    }

    // 跳轉 detail，但不加入列表
    navigate(`/weather/${weatherData.location}`);
    setInput('');
  };

  // 刪除城市時同步 localStorage
  const removeCity = (city: string) => {
    setCities((prev) => {
      const updated = prev.filter((c) => c !== city);
      localStorage.setItem('cities', JSON.stringify(updated));
      return updated;
    });
    setWeatherDataList((prev) => prev.filter((data) => data.location !== city));
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cities') || '[]');

    if (!stored.length) {
      localStorage.setItem('cities', JSON.stringify(['Taipei', 'Tokyo']));
    }

    setCities(stored);

    const loadInitialCities = async () => {
      for (const city of stored) {
        const data = await fetchWeather(city);
        if (data) {
          setWeatherDataList((prev) => (prev.some((d) => d.location === data.location) ? prev : [...prev, data]));
        }
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const query = `${position.coords.latitude},${position.coords.longitude}`;
            const weatherData = await fetchWeather(query, true);
            if (weatherData) {
              if (!stored.includes(weatherData.location)) {
                const updated = [weatherData.location, ...stored];
                setCities(updated);
                localStorage.setItem('cities', JSON.stringify(updated));
              }
              setWeatherDataList((prev) => {
                const existsIndex = prev.findIndex((d) => d.location === weatherData.location);
                if (existsIndex >= 0) {
                  const newList = [...prev];
                  newList[existsIndex] = weatherData; // 替換成最新的資料（含 isCurrent）
                  return newList;
                }
                return [weatherData, ...prev];
              });
            }
          },
          () => console.log('使用者拒絕定位')
        );
      }
    };

    loadInitialCities();
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const stored = JSON.parse(localStorage.getItem('cities') || '["Taipei","Tokyo"]');
      setCities(stored);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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
          onKeyDown={(e) => e.key === 'Enter' && searchCity()}
        />
        <button onClick={searchCity} className={styles.searchButton}>
          {t('weather.search')}
        </button>
      </div>

      {/* 天氣卡片列表 */}
      <div className={styles.gridContainer}>
        {weatherDataList.map((data) => (
          <div key={data.location} style={{ cursor: 'pointer' }} onClick={() => navigate(`/weather/${data.location}?current=${data.isCurrent}`)}>
            <WeatherCard
              location={data.location}
              temp={data.temp}
              condition={data.condition}
              icon={data.icon}
              high={data.high}
              low={data.low}
              onRemove={(e) => {
                e.stopPropagation(); // 防止點擊刪除觸發跳轉
                removeCity(data.location);
              }}
              isCurrent={data.isCurrent}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherOverview;
