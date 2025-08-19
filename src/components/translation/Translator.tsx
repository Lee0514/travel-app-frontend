import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface TranslatorProps {
  fromLang: string;
  toLang: string;
  speechText?: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const InputArea = styled.textarea`
  width: 100%;
  min-height: 7.5rem;
  padding: 0.625rem;
  font-size: 1rem;
  resize: none;
  background-color: #f0ede9;
  color: #4a4a4a;
  border-radius: 0.25rem;
  border: 1px solid #dcd7d1;
`;

const TranslateButton = styled.button<{ disabled?: boolean }>`
  padding: 0.6rem 1.2rem;
  background-color: #a3b18a;
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#bcb8b1' : '#87986a')};
  }
`;

const OutputArea = styled.div`
  position: relative;
  min-height: 7.5rem;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 16px;
`;

const PlayButton = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: #87986a;
  }
`;

// for speech synthesis
const langMap: Record<string, string> = {
  en: 'en-US',
  'zh-TW': 'zh-TW',
  ja: 'ja-JP',
  ko: 'ko-KR',
  fr: 'fr-FR',
  de: 'de-DE',
  es: 'es-ES'
};

const Translator: React.FC<TranslatorProps> = ({ fromLang, toLang, speechText }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.BACKEND_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  // 當 speechText 變化就自動翻譯
  React.useEffect(() => {
    if (speechText) {
      setInputText(speechText);
      handleTranslateWithText(speechText);
    }
  }, [speechText]);

  const handleTranslateWithText = async (textToTranslate: string) => {
    if (!textToTranslate) return;

    setLoading(true);
    try {
      const res = await axios.post(`https://travel-app-backend.vercel.app/api/translate`, {
        text: textToTranslate,
        sourceLang: fromLang.toUpperCase(),
        targetLang: toLang.toUpperCase()
      });

      const translated = res?.data?.translations[0]?.text;
      setTranslatedText(translated || textToTranslate);
    } catch (error) {
      console.error('翻譯錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = () => {
    handleTranslateWithText(inputText);
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang] || 'en-US';

    window.speechSynthesis.speak(utterance);
  };

  return (
    <Wrapper>
      <InputArea placeholder={t('translate.typeOrSpeak')} value={inputText} onChange={(e) => setInputText(e.target.value)} />

      <TranslateButton onClick={handleTranslate} disabled={loading}>
        {loading ? t('translate.translating') : t('translate.translate')}
      </TranslateButton>

      <OutputArea>
        {translatedText}
        {translatedText && <PlayButton onClick={() => handleSpeak(translatedText, toLang)}>▶</PlayButton>}
      </OutputArea>
    </Wrapper>
  );
};

export default Translator;
