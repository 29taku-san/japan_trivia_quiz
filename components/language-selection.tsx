'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'  // Next.js 14ではrouterはこのパッケージからimportします
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { setCookie } from 'cookies-next'

// 対象言語を6つに絞り込む
const languages = [
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
]

export default function LanguageSelection() {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLanguageSelect = (langCode: string) => {
    // Set a cookie with the selected language
    setCookie('selectedLanguage', langCode, { maxAge: 30 * 24 * 60 * 60 }) // 30 days
    // Navigate to the home page with the selected language
    router.push(`/${langCode}/home`)
  }

  if (!isClient) {
    return null // クライアントサイドが準備されるまでレンダリングしない
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-white">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Select Your Language</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  className="w-full py-6 text-lg font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => handleLanguageSelect(lang.code)}
                  aria-label={`Select ${lang.name}`}
                >
                  <span className="flex flex-col items-center">
                    <span className="text-sm text-gray-600">{lang.name}</span>
                    <span className="text-xl">{lang.nativeName}</span>
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-white py-4 shadow-inner">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2024 Japan Trivia Quiz. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
