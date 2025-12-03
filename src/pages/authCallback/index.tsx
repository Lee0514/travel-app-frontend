import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slice/userSlice';
import qs from 'query-string';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Google 會在 hash 中返回 access_token
      const hash = location.hash.substring(1); // 去掉 #
      const params = qs.parse(hash);
      const accessToken = params.access_token as string;

      if (!accessToken) {
        alert('登入失敗，無 access token');
        return navigate('/login');
      }

      try {
        // 發 POST 給後端換取完整 user 資訊
        const res = await fetch(`${import.meta.env.VITE_BACKEND_DEVELOP_URL}/auth/oauth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '取得使用者資料失敗');

        const { user, accessToken: token, refreshToken } = data;

        // 存 Redux
        dispatch(
          setUser({
            id: user.id,
            email: user.email,
            userName: user.userName,
            avatar: user.avatar,
            provider: user.provider,
            accessToken: token,
            refreshToken
          })
        );

        // 存 localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        navigate('/');
      } catch (err: any) {
        console.error(err);
        alert(err.message);
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [location.hash]);

  return <div>登入中...</div>;
};

export default AuthCallback;
