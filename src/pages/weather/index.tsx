import React, { useEffect, useState } from 'react';
import { WiCloud, WiRain, WiDaySunny } from 'react-icons/wi';
import styles from './weather.module.css';
interface WeatherData {
  location: string;
  temp: number;
  feelsLike: number;
  condition: string;
  icon: React.ReactNode;
}
interface HourlyForecast {
  hour: string;
  temp: number;
  rain: boolean;
}
interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: React.ReactNode;
}

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const iconMap: { [key: string]: React.ReactNode } = {
    Sunny: <WiDaySunny size={48} />,
    Clear: <WiDaySunny size={48} />,
    Cloudy: <WiCloud size={48} />,
    'Partly cloudy': <WiCloud size={48} />,
    Rain: <WiRain size={48} />,
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&lang=zh`
      );
      const data = await response.json();

      const condition: string = data.current.condition.text;

      setWeatherData({
        location: `${data.location.name}, ${data.location.country}`,
        temp: Math.round(data.current.temp_c),
        feelsLike: Math.round(data.current.feelslike_c),
        condition,
        icon: iconMap[condition] || <WiCloud size={48} />,
      });

      const now = new Date();
      const allHours = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];

      const next24Hours = allHours
        .filter((h) => new Date(h.time) >= now)
        .slice(0, 24) // 最多 24 小時
        .map((h) => ({
          hour: h.time.split(' ')[1].slice(0, 5),
          temp: Math.round(h.temp_c),
          rain: h.chance_of_rain > 30,
        }));

      setHourlyForecast(next24Hours);

      setDailyForecast(
        data.forecast.forecastday.map((d) => ({
          day: new Date(d.date).toLocaleDateString('zh-TW', { weekday: 'short' }),
          high: Math.round(d.day.maxtemp_c),
          low: Math.round(d.day.mintemp_c),
          condition: d.day.condition.text,
          icon: iconMap[d.day.condition.text] || <WiCloud />,
        }))
      );
    });
  }, [apiKey]);

  return (
    <div className={styles.wrapper}>
      {weatherData && (
        <div className={styles.currentWeather}>
          <div>{weatherData.icon}</div>
          <div>
            <h2>{weatherData.location}</h2>
            <h1 className={styles.temp}>{weatherData.temp}°C</h1>
            <p className={styles.condition}>{weatherData.condition}</p>
            <small className={styles.small}>
              體感溫度: {weatherData.feelsLike}°C | 高: {weatherData.temp}°C / 低: {weatherData.temp}°C
            </small>
          </div>
        </div>
      )}

      <h3 className={styles.sectionTitle}>每小時預報</h3>
      <div className={styles.hourlyWrapper}>
        {hourlyForecast.map((h, index) => (
          <div
            key={index}
            className={`${styles.hourCard} ${h.rain ? styles.hourCardRain : styles.hourCardClear}`}
          >
            <p>{h.hour}</p>
            <p>{h.temp}°C</p>
            <p>{h.rain ? '🌧️' : '☀️'}</p>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>每日預報</h3>
      <div className={styles.dailyWrapper}>
        {dailyForecast.map((d, index) => (
          <div key={index} className={styles.dayCard}>
            <div>{d.icon}</div>
            <div>{d.day}</div>
            <div>{d.condition}</div>
            <div>
              {d.high}° / {d.low}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
