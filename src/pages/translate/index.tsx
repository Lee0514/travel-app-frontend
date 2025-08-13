import React, { useRef, useState } from 'react';
import styles from './translate.module.css';
import axios from 'axios';
import { FiMic } from 'react-icons/fi';
import RecordingOverlay from "../../components/translation/RecordingOverlay";

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
  const recognitionRef = useRef<any>(null);
  const [fromLang, setFromLang] = useState('en'); // 來源語言
  const [toLang, setToLang] = useState('ja'); // 目標語言
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // 抽成一個可以用指定文字翻譯的函式
  const handleTranslateWithText = async (textToTranslate: string) => {
    if (!textToTranslate) return;// 如果輸入是空的就不翻譯

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/translate', {
        text: textToTranslate,
        sourceLang: fromLang.toUpperCase(),
        targetLang: toLang.toUpperCase(),
      });

      const translated = res?.data?.translations[0]?.text;
      setTranslatedText(translated || textToTranslate);
    } catch (error) {
      console.error('翻譯錯誤:', error);
    } finally {
      setLoading(false);
    }
  };

  // 原本按鈕用的翻譯
  const handleTranslate = () => {
    handleTranslateWithText(inputText);
  };

  const handleSpeechInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('您的瀏覽器不支援語音辨識。');
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
      setInputText(speechResult);

      // 在這裡立刻翻譯當次語音
      handleTranslateWithText(speechResult);
    };

    recognition.onerror = (event: any) => {
      console.error('語音辨識錯誤:', event.error);
      setListening(false);
      setShowOverlay(false);
    };

    recognition.onend = () => {
      setListening(false);
      setShowOverlay(false); // 自動關閉遮罩
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setShowOverlay(false);
      setListening(false);
    }
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!window.speechSynthesis) {
      alert('此瀏覽器不支援語音播放。');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
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

      <textarea
        className={styles.inputArea}
        placeholder="Type or speak something..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <button
        className={styles.translateButton}
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? 'Translating...' : 'Translate'}
      </button>

      <div className={styles.outputArea}>
        {translatedText}
        {translatedText && (
          <button
            className={styles.playButton}
            onClick={() => handleSpeak(translatedText, toLang)}
          >
            ▶
          </button>
        )}
      </div>

      <div className={styles.phraseList}>
        {[
          { en: 'Hello', es: 'Hola' },
          { en: 'Thank you', es: 'Gracias' },
        ].map((phrase, index) => (
          <div key={index} className={styles.phraseItem}>
            <div>
              <div className={styles.phraseText}>{phrase.en}</div>
              <div className={styles.translatedText}>{phrase.es}</div>
            </div>
            <button className={styles.playButton}>▶</button>
          </div>
        ))}
      </div>

      {showOverlay && <RecordingOverlay onStop={handleStopRecording} />}
    </div>
  );
};

export default TranslationPage;
