import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
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
import AuthCallback from './pages/authCallback/index';
import { store } from './redux/store';
import { setUser, clearUser } from './redux/slice/userSlice';
import { getMe } from './apis/auth';
import './i18n';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await getMe(); // { user: {...} }
        const u = data?.user;

        if (u?.id) {
          dispatch(
            setUser({
              id: u.id,
              email: u.email,
              userName: u.userName,
              avatar: u.profileImage || u.avatar || '', // 後端回 profileImage，slice 用 avatar
              provider: u.provider
            })
          );
        } else {
          dispatch(clearUser());
        }
      } catch {
        dispatch(clearUser());
      }
    };

    initAuth();
  }, [dispatch]);

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
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
