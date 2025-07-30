import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/registerForm';
import styles from './userRegister.module.css';

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>註冊</h2>
      <RegisterForm />
      <p className={styles.register}>
        <Link to="/login" className={styles.link}>登入</Link>
      </p>

    </div>
  );
};

export default RegisterPage;

