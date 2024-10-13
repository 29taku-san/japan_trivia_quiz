'use client'

import Link from 'next/link'
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Share2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '../../hooks/useLanguage' // 用來獲取當前語言的鉤子

// 定義聯盟鏈接項目的類型
type AffiliateLink = {
  url: string;
  image: string;
  title: string;
  description: string;
};

// 動態加載聯盟鏈接的 JSON
const fetchAffiliateLinks = async (): Promise<AffiliateLink[]> => {
  try {
    const response = await fetch('/data/affiliateLinks.json')
    if (!response.ok) {
      throw new Error('無法獲取聯盟鏈接');
    }
    const data: AffiliateLink[] = await response.json()
    return data
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function QuizResult() {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const lang = useLanguage(); // 獲取當前語言

  useEffect(() => {
    const loadAffiliateLinks = async () => {
      const links = await fetchAffiliateLinks()
      // 隨機獲取 3 個鏈接
      const shuffledLinks = links.sort(() => 0.5 - Math.random()).slice(0, 3)
      setAffiliateLinks(shuffledLinks)
    }
    loadAffiliateLinks()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Japan Trivia Quiz</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>載入中...</div>}>
          <QuizResultContent affiliateLinks={affiliateLinks} handleShare={handleShare} lang={lang} />
        </Suspense>
      </main>

      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2024 Japan Trivia Quiz. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

interface QuizResultContentProps {
  affiliateLinks: AffiliateLink[];
  handleShare: (score: number, total: number, lang: string) => Promise<void>;
  lang: string;
}

function QuizResultContent({ affiliateLinks, handleShare, lang }: QuizResultContentProps) {
  const searchParams = useSearchParams();
  const score: number = Number(searchParams.get('score')) || 0;
  const total: number = Number(searchParams.get('total')) || 20;

  const percentageValue = (score / total) * 100;
  const result = getResultMessage(score);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">測驗結果</h2>
        <div className="mb-6">
          <Progress value={percentageValue} className="w-full h-4 mb-2" />
          <p className="text-center text-lg">
            你的分數: <span className="font-bold">{score}</span> / {total}
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Button variant="outline" size="sm" onClick={() => handleShare(score, total, lang)}>
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Link href={`/${lang}/difficulty`} passHref>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                重做測驗
              </Button>
            </Link>
          </div>
        </div>
        <div className={`text-center p-4 rounded-md ${score >= 8 ? 'bg-green-100 text-green-800' : score >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
          <p className="text-2xl font-bold mb-2">
            {result.title}
          </p>
          <p>{result.message}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">測驗創作者的最愛地點</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {affiliateLinks.map((link, index) => (
              <a
                href={link.url}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white border rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <Image
                  src={link.image}
                  alt={link.title}
                  width={500}
                  height={300}
                  className="w-full h-32 object-cover rounded-t-lg mb-2"
                />
                <h4 className="font-semibold mb-1">{link.title}</h4>
                <p className="text-sm text-gray-600">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href={`/${lang}/difficulty`} passHref className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">選擇其他難度</Button>
          </Link>
          <Link href={`/${lang}/home`} passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">返回首頁</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function getResultMessage(score: number) {
  if (score >= 8) {
    return {
      title: "恭喜!",
      message: "你已經準備好像當地人一樣享受日本了！"
    }
  } else if (score >= 5 && score <= 7) {
    return {
      title: "差一點就成功了!",
      message: "再多學習一點，你就能成為日本專家了！"
    }
  } else {
    return {
      title: "不用擔心!",
      message: "下次挑戰會讓你成為日本專家！"
    }
  }
}

async function handleShare(score: number, total: number, lang: string) {
  const shareData = {
    title: "日本知識問答結果",
    text: `我在日本知識問答中得到了 ${score}/${total} 的分數！快來挑戰你的知識吧！`,
    url: window.location.origin + `/${lang}/home`,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      console.log("分享成功！")
    } else {
      alert("此瀏覽器不支持分享功能")
    }
  } catch (err) {
    console.error("分享時出錯:", err)
  }
}
