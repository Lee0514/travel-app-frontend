import CollectionQuickNavigation from '../../components/collectionQuickNavigation';
import styles from './collection.module.css';

const Collection = () => {
  return (
    <div className={styles.pageWrapper}>
      <CollectionQuickNavigation />
    </div>
  );
};

export default Collection;