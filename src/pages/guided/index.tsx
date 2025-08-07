import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchNearbyPlaces, ensureGoogleMapsLoaded } from '../../utils/googleMapsUtils';

const ExploreContainer = styled.div`
  max-width: 800px;
  margin: 1rem auto;
  margin-top: 5.5rem;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
`;

const InfoSection = styled.div`
  margin-top: 1.5rem;
`;

const Title = styled.h2`
  margin-bottom: 0.5rem;
`;

const Text = styled.p`
  margin: 0.25rem 0;
`;

const Button = styled.button`
  margin-top: 1rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
`;

const RelocateButton = styled.button`
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
`;

const WikiExtract = styled.p`
  margin-top: 1rem;
  font-style: italic;
  color: #555;
`;

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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('geolocationNotSupported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      () => {
        setError(t('geolocationPermissionDenied'));
        setCurrentLocation(centerDefault);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (!currentLocation?.lat || !currentLocation?.lng) return;

    const fetchNearbyAndDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        await ensureGoogleMapsLoaded();
        const results = await fetchNearbyPlaces(
          currentLocation,
          'tourist_attraction',
          2000,
          window.google.maps.places.RankBy.PROMINENCE
        );

        if (results.length === 0) {
          setError(t('noData'));
          setPlace(null);
          setLoading(false);
          return;
        }

        setPlace(results[0]);

        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );

        service.getDetails(
          { placeId: results[0].place_id! },
          (detailedPlace, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              detailedPlace
            ) {
              setPlace(detailedPlace);
            } else {
              console.warn('getDetails failed:', status);
            }
            setLoading(false);
          }
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : t('loadError'));
        setPlace(null);
        setLoading(false);
      }
    };

    fetchNearbyAndDetails();
  }, [currentLocation, t]);

  // 以下維持你原本抓 wiki 的部分
  async function fetchWikiTitleBySearch(keyword: string, lang: string): Promise<string | null> {
    const apiLang = lang === 'jp' ? 'ja' : lang.startsWith('zh') ? 'zh' : 'en';
    const searchUrl = `https://${apiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      keyword
    )}&format=json&origin=*`;

    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error('Failed to fetch Wikipedia search');
    const data = await res.json();

    if (data?.query?.search?.length > 0) {
      return data.query.search[0].title;
    }
    return null;
  }

  async function fetchWikiExtractByTitle(title: string, lang: string): Promise<string> {
    const apiLang = lang === 'jp' ? 'ja' : lang.startsWith('zh') ? 'zh' : 'en';
    const url = `https://${apiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title
    )}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch Wikipedia extract');
    const data = await res.json();
    return data.extract || '';
  }

  useEffect(() => {
    if (!place?.name) {
      setWikiExtract('');
      return;
    }

    const loadWiki = async () => {
      setWikiLoading(true);
      try {
        const title = await fetchWikiTitleBySearch(place.name!, lang);
        if (title) {
          const extract = await fetchWikiExtractByTitle(title, lang);
          setWikiExtract(extract || t('wikipedia.noWikiExtract'));
        } else {
          setWikiExtract(t('wikipedia.noWikiExtract'));
        }
      } catch (error) {
        setWikiExtract(t('wikipedia.noWikiExtract'));
      } finally {
        setWikiLoading(false);
      }
    };

    loadWiki();
  }, [place, lang, t]);

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

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const openInGoogleMaps = () => {
    if (!place) return;
    const query = encodeURIComponent(place.name || '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  if (loading)
    return (
      <ExploreContainer>
        <p>{t('loading')}</p>
      </ExploreContainer>
    );
  if (error)
    return (
      <ExploreContainer>
        <p>{error}</p>
        <RelocateButton onClick={fetchCurrentLocation}>📍 {t('relocate')}</RelocateButton>
      </ExploreContainer>
    );
  if (!place)
    return (
      <ExploreContainer>
        <p>{t('noData')}</p>
        <RelocateButton onClick={fetchCurrentLocation}>📍 {t('relocate')}</RelocateButton>
      </ExploreContainer>
    );

  const imageUrl = place.photos?.length
    ? place.photos[0].getUrl({ maxWidth: 800 })
    : 'https://via.placeholder.com/800x400?text=No+Image';

  const isOpenNow = place.opening_hours?.isOpen ? place.opening_hours.isOpen() : false;

  return (
    <ExploreContainer>
      <RelocateButton onClick={fetchCurrentLocation}>📍 {t('relocate')}</RelocateButton>

      <Image src={imageUrl} alt={place.name || ''} />
      <InfoSection>
        <Title>{place.name}</Title>
        {place.opening_hours?.weekday_text ? (
          place.opening_hours.weekday_text.map((line, i) => <Text key={i}>{line}</Text>)
        ) : (
          <Text>{t('noOpeningHoursInfo')}</Text>
        )}
        <Text>{isOpenNow ? t('openNow') : t('closedNow')}</Text>

        <Text>
          {t('reviews')}: ⭐ {place.rating ?? '-'} ({place.user_ratings_total ?? '-'})
        </Text>
        <Text>{place.vicinity || place.formatted_address || ''}</Text>
        <Button onClick={openInGoogleMaps}>{t('explore.navigate')}</Button>
      </InfoSection>
      <InfoSection>
        <h3>{t('wikipedia.intro')}</h3>
        {wikiLoading ? <p>{t('loading')}</p> : <WikiExtract>{wikiExtract}</WikiExtract>}
      </InfoSection>
      <Button onClick={speakText} style={{ backgroundColor: '#007bff' }}>
        {t('explore.playDescription')}
      </Button>
    </ExploreContainer>
  );
};

export default Guided;
