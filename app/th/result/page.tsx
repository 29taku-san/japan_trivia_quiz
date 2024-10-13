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
import { useLanguage } from '../../hooks/useLanguage' // ฟังก์ชันเพื่อดึงภาษาที่ใช้งานอยู่

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
  const lang = useLanguage(); // ดึงภาษาปัจจุบัน

  useEffect(() => {
    const loadAffiliateLinks = async () => {
      const links = await fetchAffiliateLinks()
      // สุ่มลิงก์ 3 ลิงก์
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
        <Suspense fallback={<div>กำลังโหลด...</div>}>
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
        <h2 className="text-2xl font-bold mb-4 text-center">ผลลัพธ์ของแบบทดสอบ</h2>
        <div className="mb-6">
          <Progress value={percentageValue} className="w-full h-4 mb-2" />
          <p className="text-center text-lg">
            คะแนนของคุณ: <span className="font-bold">{score}</span> จาก {total}
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Button variant="outline" size="sm" onClick={() => handleShare(score, total, lang)}>
              <Share2 className="w-4 h-4 mr-2" />
              แชร์
            </Button>
            <Link href={`/${lang}/difficulty`} passHref>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                ทำแบบทดสอบอีกครั้ง
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
          <h3 className="text-xl font-semibold mb-4">สถานที่โปรดของผู้สร้างแบบทดสอบ</h3>
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
            <Button variant="outline" className="w-full sm:w-auto">เลือกความยากระดับอื่น</Button>
          </Link>
          <Link href={`/${lang}/home`} passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">กลับไปที่หน้าแรก</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function getResultMessage(score: number) {
  if (score >= 8) {
    return {
      title: "ขอแสดงความยินดี!",
      message: "คุณพร้อมที่จะเพลิดเพลินกับญี่ปุ่นในฐานะคนท้องถิ่นแล้ว!"
    }
  } else if (score >= 5 && score <= 7) {
    return {
      title: "เกือบแล้ว!",
      message: "อีกนิดเดียวคุณจะเป็นปรมาจารย์เรื่องญี่ปุ่น!"
    }
  } else {
    return {
      title: "ไม่ต้องกังวล!",
      message: "ท้าทายครั้งหน้าจะทำให้คุณเป็นผู้เชี่ยวชาญเรื่องญี่ปุ่น!"
    }
  }
}

async function handleShare(score: number, total: number, lang: string) {
  const shareData = {
    title: "ผลลัพธ์ของแบบทดสอบญี่ปุ่น",
    text: `ฉันทำคะแนนได้ ${score}/${total} ในแบบทดสอบญี่ปุ่น! ลองท้าทายความรู้ของคุณดูสิ!`,
    url: window.location.origin + `/${lang}/home`,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      console.log("แชร์สำเร็จ!")
    } else {
      alert("เบราว์เซอร์นี้ไม่รองรับการแชร์")
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการแชร์:", err)
  }
}
