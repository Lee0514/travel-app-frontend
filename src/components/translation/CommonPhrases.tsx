// components/CommonPhrases.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface CommonPhrasesProps {
  lang: string; // 目標語言
  sourceLang: string; // 來源語言
}

const PhraseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PhraseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const PhraseText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const TranslatedText = styled.div`
  font-size: 13px;
  color: #666;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;

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
  es: 'es-ES',
};

const CommonPhrases = ({ lang, sourceLang }: CommonPhrasesProps) => {
  const [commonPhrases, setCommonPhrases] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/phrases', { params: { lang } })
      .then((res) => setCommonPhrases(res.data))
      .catch((err) => console.error('Error fetching phrases:', err));
  }, [lang]);

  const handlePlay = (text: string, voiceLang: string) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // 設定播放語言，跟來源或目標語言一致
    utterance.lang = langMap[voiceLang] || 'en-US';

    window.speechSynthesis.speak(utterance);
  };

  return (
    <PhraseList>
      {Object.entries(commonPhrases).map(([source, translation]) => (
        <PhraseItem key={source}>
          <div>
            <PhraseText>{source}</PhraseText>
            <TranslatedText>{translation}</TranslatedText>
          </div>
          <div>
            {/* 播放目標語言 */}
            <PlayButton onClick={() => handlePlay(translation, lang)}>▶</PlayButton>
          </div>
        </PhraseItem>
      ))}
    </PhraseList>
  );
};

export default CommonPhrases;
