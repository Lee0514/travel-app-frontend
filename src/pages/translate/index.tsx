import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh-TW', name: '中文（繁體）' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
];

const Wrapper = styled.div`
  padding: 20px;
  max-width: 600px;
  margin-top: 5rem;
`;

const SelectorRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const InputArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 10px;
  font-size: 1rem;
  resize: none;
  margin-bottom: 12px;
`;

const TranslateButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 16px;

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const OutputArea = styled.div`
  padding: 10px;
  background-color: #f4f4f4;
  font-size: 1.1rem;
  border-radius: 4px;
  white-space: pre-wrap;

  width: 100%;
  height: 120px;
  padding: 10px;
  font-size: 1rem;
  resize: none;
  margin-bottom: 12px;
`;

const PhraseList = styled.div`
  margin-top: 20px;
`;

const PhraseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PhraseText = styled.div`
  font-weight: 500;
`;

const TranslatedText = styled.div`
  color: gray;
  font-size: 14px;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const TranslationPage = () => {
  const [fromLang, setFromLang] = useState('en'); // 來源語言
  const [toLang, setToLang] = useState('ja'); // 目標語言
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <Wrapper>
      <SelectorRow>
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
      </SelectorRow>

      <InputArea
        placeholder="Type or speak something..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <TranslateButton onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </TranslateButton>
      
      <OutputArea>
        {translatedText}
      </OutputArea>

      <PhraseList>
        {[
          { en: 'Hello', es: 'Hola' },
          { en: 'Thank you', es: 'Gracias' },
        ].map((phrase, index) => (
          <PhraseItem key={index}>
            <div>
              <PhraseText>{phrase.en}</PhraseText>
              <TranslatedText>{phrase.es}</TranslatedText>
            </div>
            <PlayButton>▶</PlayButton>
          </PhraseItem>
        ))}
      </PhraseList>
    </Wrapper>
  );
};

export default TranslationPage;
