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
import { useLanguage } from '../../hooks/useLanguage' // 言語を取得するためのフック

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
  const lang = useLanguage(); // 現在の言語を取得

  useEffect(() => {
    const loadAffiliateLinks = async () => {
      const links = await fetchAffiliateLinks()
      // ランダムに3つのリンクを取得
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
        <Suspense fallback={<div>Loading...</div>}>
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
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>
        <div className="mb-6">
          <Progress value={percentageValue} className="w-full h-4 mb-2" />
          <p className="text-center text-lg">
            Your Score: <span className="font-bold">{score}</span> out of {total}
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Button variant="outline" size="sm" onClick={() => handleShare(score, total, lang)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Link href={`/${lang}/difficulty`} passHref>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
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
          <h3 className="text-xl font-semibold mb-4">Quiz Creator&apos;s Favorite Spots</h3>
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
            <Button variant="outline" className="w-full sm:w-auto">Choose Another Difficulty</Button>
          </Link>
          <Link href={`/${lang}/home`} passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Back to Home</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function getResultMessage(score: number) {
  if (score >= 8) {
    return {
      title: "Congrats!",
      message: "You're ready to enjoy Japan like a local!"
    }
  } else if (score >= 5 && score <= 7) {
    return {
      title: "So close!",
      message: "Just a little more to become a Japan master!"
    }
  } else {
    return {
      title: "No worries!",
      message: "Your next challenge will make you a Japan expert!"
    }
  }
}

async function handleShare(score: number, total: number, lang: string) {
  const shareData = {
    title: "Japan Trivia Quiz Results",
    text: `I just scored ${score}/${total} on the Japan Trivia Quiz! Test your knowledge at the quiz home page:`,
    url: window.location.origin + `/${lang}/home`,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      console.log("Shared successfully!")
    } else {
      alert("Sharing is not supported on this browser.")
    }
  } catch (err) {
    console.error("Error sharing:", err)
  }
}
