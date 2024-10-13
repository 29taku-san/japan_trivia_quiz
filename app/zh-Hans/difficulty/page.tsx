'use client'

import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from '../../hooks/useLanguage';


export default function DifficultySelection() {
  const lang = useLanguage()

  const difficulties = [
    { 
      name: "初级", 
      description: "如果这是你第一次来日本，建议从这里开始！", 
      color: "bg-green-100 hover:bg-green-200" 
    },
    { 
      name: "中级", 
      description: "如果你是回头客或者日本爱好者，这些你应该知道！", 
      color: "bg-yellow-100 hover:bg-yellow-200" 
    },
    { 
      name: "高级", 
      description: "如果你能回答这些问题，说明你对日本有深入的了解！", 
      color: "bg-orange-100 hover:bg-orange-200" 
    },
    { 
      name: "专家级", 
      description: "这个难度就连日本人也会佩服你！", 
      color: "bg-red-100 hover:bg-red-200" 
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">日本知识问答</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">选择难度</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {difficulties.map((difficulty, index) => (
            <Card key={index} className={`overflow-hidden transition-all duration-300 ${difficulty.color}`}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-bold mb-2">{difficulty.name}</h3>
                  <p className="text-sm mb-4">{difficulty.description}</p>
                </div>
                <Link href={`/${lang}/quiz/${difficulty.name.toLowerCase()}`} passHref>
                  <Button variant="secondary" className="self-start">
                    开始 {difficulty.name} 问答
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${lang}/home`} passHref>
            <Button variant="outline">返回首页</Button>
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
