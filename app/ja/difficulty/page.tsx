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
      description: "初めての日本旅行なら、ここから始めてみよう！", 
      color: "bg-green-100 hover:bg-green-200" 
    },
    { 
      name: "中級", 
      url: "intermediate",  // URLに英語の難易度名を使用
      description: "日本好きなリピーターなら、これくらいは知っていてほしい！", 
      color: "bg-yellow-100 hover:bg-yellow-200" 
    },
    { 
      name: "上級", 
      url: "advanced",  // URLに英語の難易度名を使用
      description: "これに答えられたら、かなりの日本通です！", 
      color: "bg-orange-100 hover:bg-orange-200" 
    },
    { 
      name: "日本人級", 
      url: "japanese",  // URLに英語の難易度名を使用
      description: "日本人でも尊敬されるレベルです！", 
      color: "bg-red-100 hover:bg-red-200" 
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">日本豆知識クイズ</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">難易度を選んでください</h2>
        
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
                    {difficulty.name}クイズを始める
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${lang}/home`} passHref>
            <Button variant="outline">ホームに戻る</Button>
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
