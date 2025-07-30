import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/index'
import Header from './components/layouts/headers/Header';
import LoginPage from './pages/userLogin/index';
import './i18n';


function App() {

  return (
    <BrowserRouter>
     <>
      <Header />
      {/* <Home /> */}
      <LoginPage />
    </>
    {/* <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      
    </Routes> */}
    </BrowserRouter>
   
  )
}

export default App
