import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/registerForm';
import styles from './userRegister.module.css';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('auth.register')}</h2>
      <RegisterForm />
      <p className={styles.register}>
        <Link to="/userLogin" className={styles.link}>{t('auth.login')}</Link>
      </p>

    </div>
  );
};

export default RegisterPage;

