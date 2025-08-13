import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchNearbyAndDetails, FetchNearbyCallbacks } from '../../utils/googleMapsPlaces';
import { fetchWikiTitlesBySearch, fetchWikiExtractByTitle, fetchWikiGeo } from '../../utils/googleMapsWiki';
import { getDistance } from '../../utils/googleMapsUtils';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './Guided.module.css';

const centerDefault = { lat: 25.033964, lng: 121.564468 };

const Guided: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

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

  useEffect(() => {
    if (!currentLocation.lat || !currentLocation.lng) return;
    const callbacks: FetchNearbyCallbacks = { setPlace, setError, setLoading };
    fetchNearbyAndDetails(currentLocation, callbacks, t);
  }, [currentLocation, t]);

  useEffect(() => {
    const loadWiki = async () => {
      if (!place?.name || !place.geometry?.location) {
        setWikiExtract('');
        return;
      }

      setWikiLoading(true);
      setWikiExtract('');

      const wikiLangMap: Record<string, string> = { zh: 'zh', en: 'en', jp: 'ja' };
      const wikiLang = wikiLangMap[lang] || 'zh';

      const noWikiTextMap: Record<string, string> = {
        zh: '暫無維基百科資料，您可以參考 Google Maps 或其他旅遊網站了解更多資訊。',
        en: 'No Wikipedia information available. You can check Google Maps or other travel sources for more details.',
        jp: 'ウィキペディアの情報はありません。Googleマップや他の旅行情報をご確認ください。',
      };

      try {
        const searchName = place.name || place.vicinity || '';
        if (!searchName) {
          setWikiExtract(noWikiTextMap[lang] || noWikiTextMap.zh);
          setWikiLoading(false);
          return;
        }

        const titles = await fetchWikiTitlesBySearch(searchName, wikiLang);
        let matchedTitle: string | null = null;

        for (const t of titles) {
          const geo = await fetchWikiGeo(t, wikiLang, {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          if (geo) {
            matchedTitle = t;
            break;
          }
        }

        if (!matchedTitle) {
          setWikiExtract(noWikiTextMap[lang] || noWikiTextMap.zh);
        } else {
          const extract = await fetchWikiExtractByTitle(matchedTitle, wikiLang);
          if (!extract || extract.length < 50) {
            setWikiExtract(noWikiTextMap[lang] || noWikiTextMap.zh);
          } else {
            setWikiExtract(extract);
          }
        }
      } catch {
        setWikiExtract(noWikiTextMap[lang] || noWikiTextMap.zh);
      }

      setWikiLoading(false);
    };

    loadWiki();
  }, [place, lang]);

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
        <button className={styles.relocateButton} onClick={fetchCurrentLocation}>
          📍 {t('public.relocate')}
        </button>

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
