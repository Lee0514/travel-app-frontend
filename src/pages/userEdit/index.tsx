import { Link } from 'react-router-dom';
import EditForm from '../../components/auth/editForm';
import styles from './userEdit.module.css';
import { useTranslation } from 'react-i18next';

const EditPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('auth.editUser')}</h2>
      <EditForm />
    </div>
  );
};

export default EditPage;

