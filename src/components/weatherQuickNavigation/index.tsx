import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';

const Card = styled.div`
  background: #f4f4f4;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 23rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconLabel = styled.div`
  font-size: 0.9rem;
  color: #555;
  text-transform: capitalize;
  margin-top: 0.5rem;
`;

const Right = styled.div`
  text-align: right;
`;

const City = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Condition = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #555;
  text-transform: capitalize;
`;

const BottomRow = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #333;
  text-align: center;
`;

const WeatherCard: React.FC = () => {
  const [city, setCity] = useState('Loading...');
  const [temp, setTemp] = useState('');
  const [feelsLike, setFeelsLike] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [tempMin, setTempMin] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(<WiDaySunny size={48} />);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      setCity(`${data.name}, ${data.sys.country}`);
      setTemp(`${Math.round(data.main.temp)}°C`);
      setFeelsLike(`${Math.round(data.main.feels_like)}°C`);
      setTempMax(`${Math.round(data.main.temp_max)}°C`);
      setTempMin(`${Math.round(data.main.temp_min)}°C`);
      setCondition(data.weather[0].main.toLowerCase());
      setDescription(data.weather[0].description.toLowerCase());

      switch (data.weather[0].main) {
        case 'Clouds':
          setIcon(<WiCloudy size={48} />);
          break;
        case 'Rain':
          setIcon(<WiRain size={48} />);
          break;
        default:
          setIcon(<WiDaySunny size={48} />);
          break;
      }
    });
  }, []);

  return (
    <Card>
      <TopRow>
        <Left>
          {icon}
          <IconLabel>{condition}</IconLabel>
        </Left>
        <Right>
          <City>{city}</City>
          <Condition>{temp}</Condition>
        </Right>
      </TopRow>
      <BottomRow>
        Feels like: {feelsLike} | H: {tempMax} / L: {tempMin}
      </BottomRow>
    </Card>
  );
};

export default WeatherCard;
