'use client'

import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from '../../hooks/useLanguage';

export default function DifficultySelection() {
  const lang = useLanguage()

  const difficulties = [
    { 
      name: "初級", 
      url: "beginner",  // URLに英語の難易度名を使用
      description: "如果這是你第一次來日本，從這裡開始吧！", 
      color: "bg-green-100 hover:bg-green-200" 
    },
    { 
      name: "中級", 
      url: "intermediate",  // URLに英語の難易度名を使用
      description: "如果你是回頭客或是日本愛好者，這些你應該知道！", 
      color: "bg-yellow-100 hover:bg-yellow-200" 
    },
    { 
      name: "高級", 
      url: "advanced",  // URLに英語の難易度名を使用
      description: "能回答這些問題，代表你對日本有很深的了解！", 
      color: "bg-orange-100 hover:bg-orange-200" 
    },
    { 
      name: "專家級", 
      url: "expert",  // URLに英語の難易度名を使用
      description: "這個難度即使日本人也會尊敬你！", 
      color: "bg-red-100 hover:bg-red-200" 
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">日本知識問答</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">選擇難度</h2>
        
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
                    開始 {difficulty.name} 問答
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${lang}/home`} passHref>
            <Button variant="outline">返回首頁</Button>
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
