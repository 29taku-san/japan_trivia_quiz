'use client'

import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from '../../hooks/useLanguage';


export default function DifficultySelection() {
  const lang = useLanguage()

  const difficulties = [
    { 
      name: "ระดับเริ่มต้น", 
      description: "หากนี่เป็นครั้งแรกที่คุณมาเที่ยวญี่ปุ่น เริ่มที่นี่!", 
      color: "bg-green-100 hover:bg-green-200" 
    },
    { 
      name: "ระดับกลาง", 
      description: "หากคุณเป็นผู้มาเยือนซ้ำหรือเป็นผู้หลงใหลในญี่ปุ่น คุณควรรู้สิ่งนี้!", 
      color: "bg-yellow-100 hover:bg-yellow-200" 
    },
    { 
      name: "ระดับสูง", 
      description: "หากคุณตอบคำถามเหล่านี้ได้ แสดงว่าคุณมีความรู้เกี่ยวกับญี่ปุ่นลึกซึ้ง!", 
      color: "bg-orange-100 hover:bg-orange-200" 
    },
    { 
      name: "ระดับผู้เชี่ยวชาญ", 
      description: "ระดับนี้แม้แต่คนญี่ปุ่นยังต้องยอมรับ!", 
      color: "bg-red-100 hover:bg-red-200" 
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">แบบทดสอบความรู้เกี่ยวกับญี่ปุ่น</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">เลือกระดับความยาก</h2>
        
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
                    เริ่ม {difficulty.name} แบบทดสอบ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${lang}/home`} passHref>
            <Button variant="outline">กลับไปที่หน้าแรก</Button>
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
