'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Share2, Trophy, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Define the type for affiliate link items
type AffiliateLink = {
  url: string;
  image: string;
  title: string;
  description: string;
};

// Load the affiliate links JSON dynamically with error handling
const fetchAffiliateLinks = async (): Promise<AffiliateLink[]> => {
  try {
    const response = await fetch('/data/affiliateLinks.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch affiliate links: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    return [];  // Return an empty array in case of error
  }
};

export default function QuizResult() {
  const searchParams = useSearchParams();
  const lang = useLanguage();
  const score = Number(searchParams.get('score'));
  const total = Number(searchParams.get('total'));

  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);

  useEffect(() => {
    const loadAffiliateLinks = async () => {
      const links = await fetchAffiliateLinks();
      // Get 3 random links
      const shuffledLinks = links.sort(() => 0.5 - Math.random()).slice(0, 3);
      setAffiliateLinks(shuffledLinks);
    };
    loadAffiliateLinks();
  }, []);

  const percentage = (score / total) * 100;

  const getResultMessage = (score: number) => {
    if (score >= 8) {
      return {
        title: "Congrats!",
        message: "You're ready to enjoy Japan like a local!"
      };
    } else if (score >= 5 && score <= 7) {
      return {
        title: "So close!",
        message: "Just a little more to become a Japan master!"
      };
    } else {
      return {
        title: "No worries!",
        message: "Your next challenge will make you a Japan expert!"
      };
    }
  };

  const result = getResultMessage(score);

  const handleShare = async () => {
    const shareData = {
      title: "Japan Trivia Quiz Results",
      text: `I just scored ${score}/${total} on the Japan Trivia Quiz! Test your knowledge at the quiz home page:`,
      url: window.location.origin + `/${lang}/home`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Shared successfully!");
      } else {
        alert("Sharing is not supported on this browser.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleViewCertificate = () => {
    console.log("Viewing certificate...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Japan Trivia Quiz</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>
            <div className="mb-6">
              <Progress value={percentage} className="w-full h-4 mb-2" />
              <p className="text-center text-lg">
                Your Score: <span className="font-bold">{score}</span> out of {total}
              </p>
              <div className="flex justify-center mt-4 space-x-4">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {score >= 8 && (
                  <Button variant="outline" size="sm" onClick={handleViewCertificate}>
                    <Trophy className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                )}
                <Link href={`/${lang}/difficulty`} passHref>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                </Link>
              </div>
            </div>
            <div className={`text-center p-4 rounded-md ${
              score >= 8 ? 'bg-green-100 text-green-800' : score >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="text-2xl font-bold mb-2">
                {result.title}
              </p>
              <p>{result.message}</p>
            </div>
            {/* Creator's Favorite Spots Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Creator&apos;s Favorite Spots</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {affiliateLinks.length > 0 ? (
                  affiliateLinks.map((link, index) => (
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
                  ))
                ) : (
                  <p>No affiliate links available at the moment.</p>  // Fallback message
                )}
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
      </main>

      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2024 Japan Trivia Quiz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
