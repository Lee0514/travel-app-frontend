import { useState } from 'react'
import QuickNavigation from '../../components/quickNavigation/QuickNavigation'
import NearbyQuickNavigation from '../../components/nearbyQuickNavigation'
import UpcomingQuickNavigation from '../../components/upcomingQuickNavigation'
import WeatherQuickNavigation from '../../components/weatherQuickNavigation'
import CollectionsQuickNavigation from '../../components/collectionQuickNavigation'
import styles from './Home.module.css'
import { FaMapMarkerAlt, FaRegCalendarAlt, FaCloudSun, FaGlobe } from 'react-icons/fa'

const navItems = [
  { key: 'nearby', label: 'Nearby', icon: <FaMapMarkerAlt /> },
  { key: 'upcoming', label: 'Upcoming', icon: <FaRegCalendarAlt /> },
  { key: 'weather', label: 'Weather', icon: <FaCloudSun /> },
  { key: 'collections', label: 'Collections', icon: <FaGlobe /> },
]


const Home = () => {
  const [activeTab, setActiveTab] = useState('nearby')

  return (
    <div className={styles.wrapper}>
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
  )
}

export default Home
