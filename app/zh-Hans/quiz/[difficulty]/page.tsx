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

// 问题类型定义
type Question = {
  class_level: number;
  language_code: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

// 动态加载问题 JSON
const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch('/data/questions.json');
  const data = await response.json();
  return data;
};

// 用于随机打乱数组的函数 (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 难度级别与班级级别的映射
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
  const lang = useLanguage();  // 获取当前选择的语言

  useEffect(() => {
    const loadQuestions = async () => {
      const allQuestions = await fetchQuestions();
      const [firstClass, secondClass] = difficultyClassMap[params.difficulty];

      // 根据班级级别和语言筛选问题
      const class1Questions = allQuestions.filter((q: Question) => q.class_level === firstClass && q.language_code === lang);
      const class2Questions = allQuestions.filter((q: Question) => q.class_level === secondClass && q.language_code === lang);

      // 随机打乱问题
      const shuffledClass1Questions = shuffleArray(class1Questions).slice(0, 5); // 从班级1选择5个问题
      const shuffledClass2Questions = shuffleArray(class2Questions).slice(0, 5); // 从班级2选择5个问题

      // 合并班级1和班级2的问题
      const orderedQuestions = [...shuffledClass1Questions, ...shuffledClass2Questions];

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
      // 完成测验 - 跳转到结果页面
      router.push(`/${lang}/result?score=${score}&total=${totalQuestions}`);
    }
  };

  const onValueChange = (newValue: string) => {
    setSelectedAnswer(newValue);
  };

  if (questions.length === 0) {
    return <p>加载中...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">日本小测验 - {params.difficulty}</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">问题 {currentQuestionIndex + 1} / {totalQuestions}</h2>
                <span className="text-sm text-gray-500">分数: {score}/{totalQuestions}</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="w-full" />
            </div>

            {!isAnswerChecked ? (
              <>
                <h3 className="text-xl font-bold mb-4">{currentQuestion.text}</h3>
                <RadioGroup 
                  value={selectedAnswer || ''}  // 设置已选择的答案，null时设置为空字符串
                  onValueChange={onValueChange}  // 当选择的答案更改时调用函数
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`} 
                        selectedValue={selectedAnswer || ''}  // null时设置为空字符串
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
                <h3 className="text-xl font-bold mb-4">解释</h3>
                <p className="mb-4">
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? "正确!" 
                    : `错误，正确答案是 ${currentQuestion.correctAnswer}. `}
                  {currentQuestion.explanation}
                </p>
                <div className="p-4 bg-blue-50 rounded-md">
                  <h4 className="font-bold mb-2">答案分解:</h4>
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
                <Button variant="outline">退出测验</Button>
              </Link>
              {!isAnswerChecked ? (
                <Button 
                  onClick={handleCheckAnswer} 
                  disabled={!selectedAnswer}  // 如果没有选择答案则禁用按钮
                >
                  检查答案
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex === totalQuestions - 1 ? "结束测验" : "下一个问题"}
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
