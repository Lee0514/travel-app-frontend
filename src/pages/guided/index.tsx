import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchNearbyAndDetails, FetchNearbyCallbacks } from '../../utils/googleMapsPlaces';
import { fetchWikiTitleBySearch, fetchWikiExtractByTitle } from '../../utils/googleMapsWiki';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ExploreContainer = styled.div`
  max-width: 45rem;
  margin: 5.5rem auto 1rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 40rem;
  text-align: left;
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
  background-color: #6b4c3b;
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

const HoursContainer = styled.div`
  display: inline-block;
  min-width: 200px;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  margin-top: 0.5rem;
  cursor: pointer;
`;

const HoursHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HoursList = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
`;

const ChevronIcon = styled.span`
  margin-left: 1rem;
  padding-top: 0.4rem;
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
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('geolocationNotSupported'));
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
        setError(t('geolocationPermissionDenied'));
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
    if (!currentLocation?.lat || !currentLocation?.lng) return;
    const callbacks: FetchNearbyCallbacks = { setPlace, setError, setLoading };
    fetchNearbyAndDetails(currentLocation, callbacks, t);
  }, [currentLocation, t]);

  useEffect(() => {
    const loadWiki = async () => {
      if (!place?.name) {
        setWikiExtract('');
        return;
      }
  
      setWikiLoading(true);
  
      const searchAndFetch = async (langCode: string, title: string) => {
        try {
          const searchRes = await fetch(
            `https://${langCode}.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&srsearch=${encodeURIComponent(
              title
            )}`
          );
          const searchData = await searchRes.json();
          if (searchData.query.search.length === 0) return null;
  
          const pageTitle = searchData.query.search[0].title;
  
          const summaryRes = await fetch(
            `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
          );
          if (!summaryRes.ok) return null;
          const summaryData = await summaryRes.json();
          return summaryData.extract || null;
        } catch {
          return null;
        }
      };
  
      let summary = await searchAndFetch('zh', place.name);
      if (!summary) summary = await searchAndFetch('en', place.name);
      if (!summary) summary = t('wikipedia.noWikiExtract');
  
      setWikiExtract(summary);
      setWikiLoading(false);
    };
  
    loadWiki();
  }, [place, t]);
  
  
  

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
      <ExploreContainer>
        <p>{loading ? t('loading') : error || t('noData')}</p>
        <RelocateButton onClick={fetchCurrentLocation}>📍 {t('relocate')}</RelocateButton>
      </ExploreContainer>
    );
  }

  const imageUrl = place.photos?.[0]?.getUrl({ maxWidth: 800 }) || 'https://via.placeholder.com/800x400?text=No+Image';
  const weekdayText = place.opening_hours?.weekday_text || [];
  const todayText = weekdayText.length ? weekdayText[(new Date().getDay() + 6) % 7] : null;

  return (
    <ExploreContainer>
      <ContentBox>
        <RelocateButton onClick={fetchCurrentLocation}>📍 {t('relocate')}</RelocateButton>
        <Image src={imageUrl} alt={place.name || ''} />
        <InfoSection>
          <Title>{place.name}</Title>

          {weekdayText.length > 0 && (
            <HoursContainer onClick={() => setIsHoursExpanded((prev) => !prev)}>
              <HoursHeader>
                <Text>{todayText}</Text>
                <ChevronIcon>{isHoursExpanded ? <FaChevronUp /> : <FaChevronDown />}</ChevronIcon>
              </HoursHeader>
              {isHoursExpanded && (
                <HoursList>
                  {weekdayText.map((line, i) => (
                    <Text key={i}>{line}</Text>
                  ))}
                </HoursList>
              )}
            </HoursContainer>
          )}

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

        <Button onClick={speakText}>{t('explore.playDescription')}</Button>
      </ContentBox>
    </ExploreContainer>
  );
};

export default Guided;
