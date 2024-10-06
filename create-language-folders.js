const fs = require('fs');
const path = require('path');

// 言語コードとフォルダ名
const languages = [
  { code: 'ja', name: 'Japanese', message: '日本語のホームページへようこそ！' },
  { code: 'en', name: 'English', message: 'Welcome to the English Home Page!' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', message: '欢迎来到简体中文首页！' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', message: '歡迎來到繁體中文首頁！' },
  { code: 'es', name: 'Spanish', message: '¡Bienvenido a la página de inicio en español!' },
  { code: 'fr', name: 'French', message: 'Bienvenue sur la page d\'accueil en français !' },
  { code: 'it', name: 'Italian', message: 'Benvenuti nella homepage italiana!' },
  { code: 'ko', name: 'Korean', message: '한국어 홈페이지에 오신 것을 환영합니다!' },
  { code: 'th', name: 'Thai', message: 'ยินดีต้อนรับสู่หน้าแรกภาษาไทย!' }
];

// 各言語ごとのページテンプレートを作成
const createLanguagePage = (language) => `
'use client';

export default function Home() {
  return (
    <div>
      <h1>${language.message}</h1>
      <p>ここからクイズを始めましょう。</p>
    </div>
  );
}
`;

// 各言語のフォルダとpage.tsxを作成
languages.forEach(language => {
  const dirPath = path.join(__dirname, 'app', language.code, 'home');
  const filePath = path.join(dirPath, 'page.tsx');

  // フォルダを作成
  fs.mkdirSync(dirPath, { recursive: true });

  // page.tsxファイルを作成
  fs.writeFileSync(filePath, createLanguagePage(language), 'utf8');

  console.log(`Created: ${filePath}`);
});
