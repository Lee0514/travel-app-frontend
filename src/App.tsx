import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/index';
import Translate from './pages/translate/index';
import User from './pages/user/index';
import Header from './components/layouts/headers/Header';
import Culture from './pages/culture/index';
import Guided from './pages/guided/index';
import Weather from './pages/weather/index';
import Nearby from './pages/nearby/index';
import Collection from './pages/collection/index';
import LoginPage from './pages/userLogin/index';
import RegisterPage from './pages/userRegister/index';
import './i18n';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/user" element={<User />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/guided" element={<Guided />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
