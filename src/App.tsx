import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/home/index';
import Translate from './pages/translate/index';
import Header from './components/layouts/headers/Header';
import Guided from './pages/guided/index';
import WeatherOverview from './pages/weather/weatherOverview';
import WeatherDetail from './pages/weather/weatherDetail';
import Nearby from './pages/nearby/index';
import Collection from './pages/collection/index';
import UserLogin from './pages/userLogin/index';
import UserRegister from './pages/userRegister/index';
import UserEdit from './pages/userEdit/index';
import './i18n';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/guided" element={<Guided />} />
        <Route path="/weather" element={<WeatherOverview />} />
        <Route path="/weather/:location" element={<WeatherDetail />} />
        <Route path="/nearby" element={<Nearby />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/userRegister" element={<UserRegister />} />
        <Route path="/userEdit" element={<UserEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
