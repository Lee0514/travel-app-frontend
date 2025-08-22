import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchNearbyAndDetails, FetchNearbyCallbacks } from '../../utils/googleMapsPlaces';
import { fetchWikiTitlesBySearch, fetchWikiExtractByTitle, fetchWikiGeo } from '../../utils/googleMapsWiki';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SearchBar from '../../components/searchBar';
import styles from './Guided.module.css';

const centerDefault = { lat: 25.033964, lng: 121.564468 };

const Guided: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const noWikiTextMap = t('explore.noWikiText');

  const [currentLocation, setCurrentLocation] = useState(centerDefault);
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wikiExtract, setWikiExtract] = useState<string>('');
  const [wikiLoading, setWikiLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('explore.geolocationNotSupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
        setPlace(null);
        setWikiExtract('');
      },
      () => {
        setError(t('explore.geolocationPermissionDenied'));
        setCurrentLocation(centerDefault);
        setPlace(null);
        setWikiExtract('');
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  // 使用者位置抓附近景點
  useEffect(() => {
    if (!currentLocation.lat || !currentLocation.lng) return;
    const callbacks: FetchNearbyCallbacks = { setPlace, setError, setLoading };
    fetchNearbyAndDetails(currentLocation, callbacks, t);
  }, [currentLocation, t]);

  // 抓維基百科
  const loadWikiByPlace = async (targetPlace: google.maps.places.PlaceResult) => {
    if (!targetPlace?.name || !targetPlace.geometry?.location) {
      setWikiExtract('');
      return;
    }

    setWikiLoading(true);
    setWikiExtract('');

    const wikiLangMap: Record<string, string> = { zh: 'zh', en: 'en', jp: 'ja' };
    const wikiLang = wikiLangMap[lang] || 'zh';

    try {
      const searchName = targetPlace.name || targetPlace.vicinity || '';
      if (!searchName) {
        setWikiExtract(noWikiTextMap);
        setWikiLoading(false);
        return;
      }

      const titles = await fetchWikiTitlesBySearch(searchName, wikiLang);
      let matchedTitle: string | null = null;

      for (const t of titles) {
        const geo = await fetchWikiGeo(t, wikiLang, {
          lat: targetPlace.geometry.location.lat(),
          lng: targetPlace.geometry.location.lng()
        });
        if (geo) {
          matchedTitle = t;
          break;
        }
      }

      if (!matchedTitle) {
        setWikiExtract(noWikiTextMap);
      } else {
        const extract = await fetchWikiExtractByTitle(matchedTitle, wikiLang);
        if (!extract || extract.length < 50) {
          setWikiExtract(noWikiTextMap);
        } else {
          setWikiExtract(extract);
        }
      }
    } catch {
      setWikiExtract(noWikiTextMap);
    }

    setWikiLoading(false);
  };

  useEffect(() => {
    if (place) loadWikiByPlace(place);
  }, [place, lang]);

  //搜尋功能
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setPlace(null);
    setWikiExtract('');
  
    try {
      const geocoder = new google.maps.Geocoder();
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) =>
        geocoder.geocode({ address: query }, (res, status) => {
          if (status === 'OK' && res) resolve(res);
          else reject(status);
        })
      );
  
      if (!results.length) {
        setError(t('explore.noData'));
        setLoading(false);
        return;
      }
  
      const location = results[0].geometry.location;
      const latLng = { lat: location.lat(), lng: location.lng() };
  
      const tempPlaceCallbacks: FetchNearbyCallbacks = { setPlace, setError, setLoading };
      await fetchNearbyAndDetails(latLng, tempPlaceCallbacks, t);
  
    } catch (err) {
      setError(t('explore.noData'));
    }
  
    setLoading(false);
  };
  
  const speakText = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!wikiExtract) return;

    const langMap = { zh: 'zh-TW', en: 'en-US', jp: 'ja-JP' };
    const utterance = new SpeechSynthesisUtterance(wikiExtract);
    utterance.lang = langMap[lang as keyof typeof langMap] || 'zh-TW';
    utterance.onend = utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const openInGoogleMaps = () => {
    if (!place) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name || '')}`);
  };

  if (loading || error || !place) {
    return (
      <div className={styles.exploreContainer}>
        <p>{loading ? t('explore.loading') : error || t('explore.noData')}</p>
        <button className={styles.relocateButton} onClick={fetchCurrentLocation}>
          📍 {t('public.relocate')}
        </button>
      </div>
    );
  }

  const imageUrl = place.photos?.[0]?.getUrl({ maxWidth: 800 }) || 'https://via.placeholder.com/800x400?text=No+Image';
  const weekdayText = place.opening_hours?.weekday_text || [];
  const todayText = weekdayText.length ? weekdayText[(new Date().getDay() + 6) % 7] : null;

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.contentBox}>
        <div className={styles.topBar}>
          <button className={styles.relocateButton} onClick={fetchCurrentLocation}>
            📍 {t('public.relocate')}
          </button>
          <SearchBar onSearch={handleSearch} />
        </div>

        <img className={styles.image} src={imageUrl} alt={place.name || ''} />

        <div className={styles.infoSection}>
          <h2 className={styles.title}>{place.name}</h2>

          {weekdayText.length > 0 && (
            <div className={styles.hoursContainer} onClick={() => setIsHoursExpanded((prev) => !prev)}>
              <div className={styles.hoursHeader}>
                <p>{todayText}</p>
                <span className={styles.chevronIcon}>{isHoursExpanded ? <FaChevronUp /> : <FaChevronDown />}</span>
              </div>
              {isHoursExpanded && (
                <div className={styles.hoursList}>
                  {weekdayText.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          <p>
            {t('explore.reviews')}: ⭐ {place.rating ?? '-'} ({place.user_ratings_total ?? '-'})
          </p>
          <p>{place.vicinity || place.formatted_address || ''}</p>
          <button className={styles.button} onClick={openInGoogleMaps}>
            {t('explore.navigate')}
          </button>
        </div>

        <div className={styles.infoSection}>
          <h3>{t('wikipedia.intro')}</h3>
          {wikiLoading ? <p>{t('explore.loading')}</p> : <p className={styles.wikiExtract}>{wikiExtract}</p>}
        </div>

        <button className={styles.button} onClick={speakText}>
          {t('explore.playDescription')}
        </button>
      </div>
    </div>
  );
};

export default Guided;