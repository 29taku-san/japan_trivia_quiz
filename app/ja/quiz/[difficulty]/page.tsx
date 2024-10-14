'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from '../../../hooks/useLanguage';

// 質問の型定義
type Question = {
  class_level: number;
  language_code: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

// 質問データを動的に読み込む
const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch('/data/questions.json');
    const data = await response.json();
    console.log('Questions data:', data);  // データが正しく取得できているか確認
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

// 配列をシャッフルする関数（Fisher-Yatesアルゴリズム）
const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 難易度レベルとクラスレベルの対応
const difficultyClassMap: { [key: string]: [number, number] } = {
  beginner: [1, 2],
  intermediate: [2, 3],
  advanced: [3, 4],
  japanese: [4, 5],
};

export default function QuizFlow({ params }: { params: { difficulty: keyof typeof difficultyClassMap } }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const router = useRouter();
  const lang = useLanguage();  // 現在選択されている言語を取得

  useEffect(() => {
    const loadQuestions = async () => {
      const allQuestions = await fetchQuestions();
      console.log('All Questions:', allQuestions); // 質問データ全体のログを出力

      const [firstClass, secondClass] = difficultyClassMap[params.difficulty];

      // クラスレベルと言語で質問をフィルタリング
      const class1Questions = allQuestions.filter((q: Question) => q.class_level === firstClass && q.language_code === lang);
      console.log('Class 1 Questions:', class1Questions); // クラス1の質問データのログを出力

      const class2Questions = allQuestions.filter((q: Question) => q.class_level === secondClass && q.language_code === lang);
      console.log('Class 2 Questions:', class2Questions); // クラス2の質問データのログを出力

      // 質問をシャッフル
      const shuffledClass1Questions = shuffleArray(class1Questions).slice(0, 5); // クラス1から5問
      const shuffledClass2Questions = shuffleArray(class2Questions).slice(0, 5); // クラス2から5問

      // クラス1とクラス2の質問を連結
      const orderedQuestions = [...shuffledClass1Questions, ...shuffledClass2Questions];
      console.log('Ordered Questions:', orderedQuestions); // シャッフル後の質問データのログを出力

      setQuestions(orderedQuestions);
    };
    loadQuestions();
  }, [params.difficulty, lang]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      // クイズ終了 - 結果ページに移動
      router.push(`/${lang}/result?score=${score}&total=${totalQuestions}`);
    }
  };

  const onValueChange = (newValue: string) => {
    setSelectedAnswer(newValue);
  };

  if (questions.length === 0) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">日本クイズ - {params.difficulty}</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">質問 {currentQuestionIndex + 1} / {totalQuestions}</h2>
                <span className="text-sm text-gray-500">スコア: {score}/{totalQuestions}</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="w-full" />
            </div>

            {!isAnswerChecked ? (
              <>
                <h3 className="text-xl font-bold mb-4">{currentQuestion.text}</h3>
                <RadioGroup 
                  value={selectedAnswer || ''}  // 選択された値を設定、null の場合は空文字列を設定
                  onValueChange={onValueChange}  // 選択された値を変更する関数を呼び出し
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`} 
                        selectedValue={selectedAnswer || ''}  // null の場合は空文字列
                        onValueChange={onValueChange} 
                      />
                      <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">解説</h3>
                <p className="mb-4">
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? "正解！" 
                    : `不正解。正解は ${currentQuestion.correctAnswer} です。`}
                  {currentQuestion.explanation}
                </p>
                <div className="p-4 bg-blue-50 rounded-md">
                  <h4 className="font-bold mb-2">回答の詳細:</h4>
                  {currentQuestion.options.map((option, index) => (
                    <p key={index} className={`mb-1 ${
                      option === currentQuestion.correctAnswer 
                        ? 'text-green-600 font-bold' 
                        : selectedAnswer === option 
                          ? 'text-red-600 line-through' 
                          : ''
                    }`}>
                      {option}
                    </p>
                  ))}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-6">
            <div className="w-full flex justify-between items-center">
              <Link href={`/${lang}/difficulty`} passHref>
                <Button variant="outline">クイズをやめる</Button>
              </Link>
              {!isAnswerChecked ? (
                <Button 
                  onClick={handleCheckAnswer} 
                  disabled={!selectedAnswer}  // 何も選択されていない場合はボタンを無効化
                >
                  回答を確認
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex === totalQuestions - 1 ? "クイズを終了" : "次の質問"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>

      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2024 Japan Trivia Quiz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
