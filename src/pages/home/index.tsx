import { useState } from 'react';
import QuickNavigation from '../../components/quickNavigation/QuickNavigation';
import NearbyQuickNavigation from '../../components/nearbyQuickNavigation';
import UpcomingQuickNavigation from '../../components/upcomingQuickNavigation';
import WeatherQuickNavigation from '../../components/weatherQuickNavigation';
import CollectionsQuickNavigation from '../../components/collectionQuickNavigation';
import styles from './Home.module.css';
import { FaMapMarkerAlt, FaRegCalendarAlt, FaCloudSun, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [activeTab, setActiveTab] = useState('nearby');
  const { t } = useTranslation();

  const navItems = [
    { key: 'nearby', label: t('nav.nearby'), icon: <FaMapMarkerAlt /> },
    { key: 'upcoming', label: t('nav.upcoming'), icon: <FaRegCalendarAlt /> },
    { key: 'weather', label: t('nav.weather'), icon: <FaCloudSun /> },
    { key: 'collections', label: t('nav.collections'), icon: <FaGlobe /> }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.bannerWrapper}>
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Banner"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>

        <div className={styles.navBar}>
          {navItems.map((item) => (
            <QuickNavigation
              key={item.key}
              label={item.label}
              icon={item.icon}
              active={activeTab === item.key}
              onClick={() => setActiveTab(item.key)}
            />
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 'nearby' && <NearbyQuickNavigation />}
          {activeTab === 'upcoming' && <UpcomingQuickNavigation />}
          {activeTab === 'weather' && <WeatherQuickNavigation />}
          {activeTab === 'collections' && <CollectionsQuickNavigation />}
        </div>
      </div>
    </div>
  );
};

export default Home;
