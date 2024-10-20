'use client'

import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from '../../hooks/useLanguage';

export default function DifficultySelection() {
  const lang = useLanguage()

  const difficulties = [
    { 
      name: "초급", 
      url: "beginner",  // URLに英語の難易度名を使用
      description: "일본 여행이 처음이라면, 여기서 시작해보세요!", 
      color: "bg-green-100 hover:bg-green-200" 
    },
    { 
      name: "중급", 
      url: "intermediate",  // URLに英語の難易度名を使用
      description: "일본을 좋아하는 리피터라면, 이 정도는 알고 있어야 해요!", 
      color: "bg-yellow-100 hover:bg-yellow-200" 
    },
    { 
      name: "상급", 
      url: "advanced",  // URLに英語の難易度名を使用
      description: "이 문제를 맞추면, 당신은 진정한 일본 전문가입니다!", 
      color: "bg-orange-100 hover:bg-orange-200" 
    },
    { 
      name: "일본인 수준", 
      url: "japanese",  // URLに英語の難易度名を使用
      description: "일본인도 존경할 만한 수준입니다!", 
      color: "bg-red-100 hover:bg-red-200" 
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">일본 상식 퀴즈</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">난이도를 선택하세요</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {difficulties.map((difficulty, index) => (
            <Card key={index} className={`overflow-hidden transition-all duration-300 ${difficulty.color}`}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-bold mb-2">{difficulty.name}</h3>
                  <p className="text-sm mb-4">{difficulty.description}</p>
                </div>
                <Link href={`/${lang}/quiz/${difficulty.url}`} passHref>
                  <Button variant="secondary" className="self-start">
                    {difficulty.name} 퀴즈 시작
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${lang}/home`} passHref>
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2024 Japan Trivia Quiz. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
