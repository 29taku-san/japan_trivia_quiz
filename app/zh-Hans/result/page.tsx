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
import { useLanguage } from '../../hooks/useLanguage' // 用于获取当前语言的钩子

// Define the type for affiliate link items
type AffiliateLink = {
  url: string;
  image: string;
  title: string;
  description: string;
};

// Load the affiliate links JSON dynamically
const fetchAffiliateLinks = async (): Promise<AffiliateLink[]> => {
  try {
    const response = await fetch('/data/affiliateLinks.json')
    if (!response.ok) {
      throw new Error('Failed to fetch affiliate links');
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
  const lang = useLanguage(); // 获取当前语言

  useEffect(() => {
    const loadAffiliateLinks = async () => {
      const links = await fetchAffiliateLinks()
      // 随机获取 3 个链接
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
        <Suspense fallback={<div>加载中...</div>}>
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
        <h2 className="text-2xl font-bold mb-4 text-center">测试结果</h2>
        <div className="mb-6">
          <Progress value={percentageValue} className="w-full h-4 mb-2" />
          <p className="text-center text-lg">
            你的得分: <span className="font-bold">{score}</span> / {total}
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Button variant="outline" size="sm" onClick={() => handleShare(score, total, lang)}>
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Link href={`/${lang}/difficulty`} passHref>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新测试
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
          <h3 className="text-xl font-semibold mb-4">测验创作者的最爱地点</h3>
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
            <Button variant="outline" className="w-full sm:w-auto">选择其他难度</Button>
          </Link>
          <Link href={`/${lang}/home`} passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">返回主页</Button>
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
      message: "你已经准备好像当地人一样享受日本了！"
    }
  } else if (score >= 5 && score <= 7) {
    return {
      title: "快成功了!",
      message: "再多一些，你就能成为日本大师了！"
    }
  } else {
    return {
      title: "别担心!",
      message: "下次挑战将让你成为日本专家！"
    }
  }
}

async function handleShare(score: number, total: number, lang: string) {
  const shareData = {
    title: "日本知识问答结果",
    text: `我在日本知识问答中得到了 ${score}/${total} 的分数！快来挑战你的知识吧！`,
    url: window.location.origin + `/${lang}/home`,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      console.log("分享成功！")
    } else {
      alert("此浏览器不支持分享功能")
    }
  } catch (err) {
    console.error("分享时出错:", err)
  }
}
