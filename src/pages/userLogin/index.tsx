import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/loginForm';
import styles from './userLogin.module.css';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('auth.login')}</h2>
      <LoginForm />
      <p className={styles.register}>
        {t('auth.donnotHaveAccount')}<br />
        <Link to="/register" className={styles.link}>{t('auth.register')}</Link>
      </p>

    </div>
  );
};

export default LoginPage;

