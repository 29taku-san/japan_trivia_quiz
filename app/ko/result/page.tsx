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
import { useLanguage } from '../../hooks/useLanguage' // 언어를 가져오는 훅

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
  const lang = useLanguage(); // 현재 언어 가져오기

  useEffect(() => {
    const loadAffiliateLinks = async () => {
      const links = await fetchAffiliateLinks()
      // 랜덤으로 3개의 링크 가져오기
      const shuffledLinks = links.sort(() => 0.5 - Math.random()).slice(0, 3)
      setAffiliateLinks(shuffledLinks)
    }
    loadAffiliateLinks()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">일본 퀴즈</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>로딩 중...</div>}>
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
        <h2 className="text-2xl font-bold mb-4 text-center">퀴즈 결과</h2>
        <div className="mb-6">
          <Progress value={percentageValue} className="w-full h-4 mb-2" />
          <p className="text-center text-lg">
            점수: <span className="font-bold">{score}</span> / {total}
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Button variant="outline" size="sm" onClick={() => handleShare(score, total, lang)}>
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>
            <Link href={`/${lang}/difficulty`} passHref>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                퀴즈 다시 풀기
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
          <h3 className="text-xl font-semibold mb-4">퀴즈 제작자의 추천 장소</h3>
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
            <Button variant="outline" className="w-full sm:w-auto">다른 난이도 선택</Button>
          </Link>
          <Link href={`/${lang}/home`} passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">홈으로 돌아가기</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function getResultMessage(score: number) {
  if (score >= 8) {
    return {
      title: "축하합니다!",
      message: "당신은 이제 현지인처럼 일본을 즐길 준비가 되었습니다!"
    }
  } else if (score >= 5 && score <= 7) {
    return {
      title: "아깝네요!",
      message: "조금만 더 노력하면 일본 마스터가 될 수 있어요!"
    }
  } else {
    return {
      title: "걱정하지 마세요!",
      message: "다음 도전에서 일본 전문가가 될 수 있습니다!"
    }
  }
}

async function handleShare(score: number, total: number, lang: string) {
  const shareData = {
    title: "일본 퀴즈 결과",
    text: `저는 일본 퀴즈에서 ${score}/${total} 점을 받았습니다! 당신도 도전해보세요!`,
    url: window.location.origin + `/${lang}/home`,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      console.log("공유 성공!")
    } else {
      alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.")
    }
  } catch (err) {
    console.error("공유 중 오류:", err)
  }
}
