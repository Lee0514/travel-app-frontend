import React, { useRef, useState } from 'react';
import styles from './translate.module.css';
import { FiMic } from 'react-icons/fi';
import RecordingOverlay from '../../components/translation/RecordingOverlay';
import CommonPhrases from '../../components/translation/CommonPhrases';
import Translator from '../../components/translation/Translator';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
];

const TranslationPage = () => {
  const { t } = useTranslation();
  const recognitionRef = useRef<any>(null);
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('zh-TW');
  const [listening, setListening] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [speechText, setSpeechText] = useState('');

  const handleSpeechInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t('translate.browserNotSupported'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = fromLang;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setShowOverlay(true);
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      // 將辨識結果設置到 speechText 狀態
      setSpeechText(speechResult);
    };

    recognition.onerror = (event: any) => {
      console.error('語音辨識錯誤:', event.error);
      setListening(false);
      setShowOverlay(false);
    };

    recognition.onend = () => {
      setListening(false);
      setShowOverlay(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setShowOverlay(false);
    setListening(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectorRow}>
        <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
        <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSpeechInput}
        className={`${styles.micButton} ${listening ? styles.listening : ''}`}
      >
        <FiMic />
      </button>
     
      <Translator fromLang={fromLang} toLang={toLang} speechText={speechText} />

      <CommonPhrases lang={toLang} sourceLang={fromLang} />

      {showOverlay && <RecordingOverlay onStop={handleStopRecording} />}
    </div>
  );
};

export default TranslationPage;
