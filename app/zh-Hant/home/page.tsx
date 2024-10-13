'use client'

import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage';

export default function HomeScreen() {
  const lang = useLanguage()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">日本知識問答</h1>
        <Link href="/" passHref>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>更改語言</span>
          </Button>
        </Link>
      </header>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">從這裡開始</h2>
        <Card className="bg-[url('/images/Japan_kyoto.png')] bg-cover bg-center rounded-xl overflow-hidden">
          <CardContent className="p-4 sm:p-6 bg-black bg-opacity-50 h-[200px] sm:h-[300px] flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">日本知識問答</h3>
              <p className="text-sm sm:text-base text-white mb-4">學習對日本人來說是常識的有趣小知識，並在旅遊中驗證你的答案吧！</p>
            </div>
            <Link href={`/${lang}/difficulty`} passHref>
              <Button variant="secondary" className="self-start text-sm sm:text-base">
                開始測驗
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">按主題分類的測驗</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-[url('/images/Coming_Soon2.png')] bg-cover bg-center overflow-hidden">
            <CardContent className="p-4 sm:p-6 h-[200px] sm:h-[300px] flex items-end">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">地點</h3>
            </CardContent>
          </Card>
          <Card className="bg-[url('/images/Coming_Soon.png')] bg-cover bg-center overflow-hidden">
            <CardContent className="p-4 sm:p-6 h-[200px] sm:h-[300px] flex items-end">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">文化與歷史</h3>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="mt-8 text-center text-sm text-gray-600">
        © 2024 Japan Trivia Quiz. All rights reserved.
      </footer>
    </div>
  )
}
