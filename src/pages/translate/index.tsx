import React,  { useRef, useState, useEffect}  from 'react';
import styles from './translate.module.css';
import axios from 'axios';
import { FiMic } from 'react-icons/fi';
import RecordingOverlay from "../../components/translation/RecordingOverlay";

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh-TW', name: '中文（繁體）' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
];

// const Wrapper = styled.div`
//   padding: 20px;
//   max-width: 600px;
//   margin-top: 5rem;
// `;

// const SelectorRow = styled.div`
//   display: flex;
//   gap: 12px;
//   margin-bottom: 12px;
// `;

// const InputArea = styled.textarea`
//   width: 100%;
//   height: 120px;
//   padding: 10px;
//   font-size: 1rem;
//   resize: none;
//   margin-bottom: 12px;
// `;

// const TranslateButton = styled.button`
//   padding: 8px 16px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   font-size: 1rem;
//   cursor: pointer;
//   margin-bottom: 16px;

//   &:disabled {
//     background-color: #999;
//     cursor: not-allowed;
//   }
// `;

// const OutputArea = styled.div`
//   padding: 10px;
//   background-color: #f4f4f4;
//   font-size: 1.1rem;
//   border-radius: 4px;
//   white-space: pre-wrap;

//   width: 100%;
//   height: 120px;
//   padding: 10px;
//   font-size: 1rem;
//   resize: none;
//   margin-bottom: 12px;
// `;

// const PhraseList = styled.div`
//   margin-top: 20px;
// `;

// const PhraseItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 16px;
// `;

// const PhraseText = styled.div`
//   font-weight: 500;
// `;

// const TranslatedText = styled.div`
//   color: gray;
//   font-size: 14px;
// `;

// const PlayButton = styled.button`
//   background: none;
//   border: none;
//   font-size: 20px;
//   cursor: pointer;
// `;

// const MicButton = styled.button<{ $listening: boolean }>`
//   border-radius: 50%;
//   border: none;
//   background-color: ${({ $listening }) => ($listening ? '#ff4d4f' : '#007bff')};
//   color: white;
//   font-size: 24px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   margin-bottom: 12px;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: ${({ listening }) => (listening ? '#ff7875' : '#0056b3')};
//   }
// `;

const TranslationPage = () => {
  const recognitionRef = useRef<any>(null);
  const [fromLang, setFromLang] = useState('en'); // 來源語言
  const [toLang, setToLang] = useState('ja'); // 目標語言
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasSpokenOnce, setHasSpokenOnce] = useState(false); // 是否已經辨識過一次
  const [showOverlay, setShowOverlay] = useState(false);

  const handleTranslate = async () => {
    if (!inputText) return; // 如果輸入是空的就不翻譯

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/translate', {
        text: inputText,  // 傳入使用者輸入
        sourceLang: fromLang.toUpperCase(),
        targetLang: toLang.toUpperCase(),
      });
     
      const translatedText = res?.data?.translations[0]?.text
      setTranslatedText(translatedText || inputText); // 更新翻譯結果 若無翻譯結果先放未翻譯
    } catch (error) {
      console.error('翻譯錯誤:', error);
    } finally {
      setLoading(false);
    }
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
      if (hasSpokenOnce) {
        setInputText('');
      }
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInputText(speechResult);
      setHasSpokenOnce(true);
    };

    recognition.onerror = (event: any) => {
      console.error('語音辨識錯誤:', event.error);
      setListening(false);
      setShowOverlay(false);
    };

    recognition.onend = () => {
      setListening(false);
      setShowOverlay(false); // 自動關閉遮罩
      if (hasSpokenOnce) {
        handleTranslate();   // 說完就直接翻譯
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setShowOverlay(false);
      setListening(false);
      handleTranslate();
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
