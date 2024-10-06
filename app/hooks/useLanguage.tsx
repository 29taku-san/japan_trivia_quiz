// app/hooks/useLanguage.tsx

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

// 9言語に対応する言語コード
const supportedLanguages = ['en', 'ja', 'zh-Hans', 'zh-Hant', 'es', 'fr', 'it', 'ko', 'th'];

export function useLanguage() {
  const [language, setLanguage] = useState('en'); // デフォルトは英語

  useEffect(() => {
    // クッキーから選択された言語を取得
    const savedLanguage = getCookie('selectedLanguage');
    
    // 取得した言語がサポートされているか確認し、設定する
    if (savedLanguage && supportedLanguages.includes(savedLanguage as string)) {
      setLanguage(savedLanguage as string);
    }
  }, []);

  return language;
}
