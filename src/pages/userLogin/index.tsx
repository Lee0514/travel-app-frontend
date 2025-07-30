import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/loginForm';
import styles from './userLogin.module.css';

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>登入</h2>
      <LoginForm />
      <p className={styles.register}>
        還沒有帳號嗎？<Link to="/register" className={styles.link}>註冊</Link>
      </p>

    </div>
  );
};

export default LoginPage;

