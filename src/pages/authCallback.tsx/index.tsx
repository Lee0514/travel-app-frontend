import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ 解析 URL hash
    const hash = window.location.hash.substring(1); // 去掉 #
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const provider = params.get('provider'); // 如果你前端加上 provider
    const expiresIn = params.get('expires_in');

    if (!accessToken) {
      console.error('No access token found in callback URL.');
      navigate('/login'); // 回登入頁
      return;
    }

    // 2️⃣ 呼叫後端換取自己的 JWT / 註冊使用者
    const backendUrl = import.meta.env.VITE_BACKEND_DEVELOP_URL;

    fetch(`${backendUrl}/api/auth/oauth/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, provider })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('OAuth callback error:', data.error);
          navigate('/login');
          return;
        }

        // 3️⃣ 後端回傳 JWT 與使用者資料
        const { token, user } = data;

        // 4️⃣ 存到 localStorage 或 state
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // 5️⃣ 導向登入後頁面
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Callback fetch error:', err);
        navigate('/login');
      });
  }, [navigate]);

  return <div>正在登入中，請稍候...</div>;
};

export default AuthCallback;
