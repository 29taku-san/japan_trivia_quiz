'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from '../hooks/useLanguage';

// Load the questions JSON dynamically
const fetchQuestions = async () => {
  const response = await fetch('/data/questions.json')
  const data = await response.json()
  return data
}

// Map difficulty levels to class levels
const difficultyClassMap = {
  beginner: [1, 2],
  intermediate: [2, 3],
  advanced: [3, 4],
  japanese: [4, 5],
}

export default function QuizFlow({ params }: { params: { difficulty: string } }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const router = useRouter()
  const lang = useLanguage()

  useEffect(() => {
    const loadQuestions = async () => {
      const allQuestions = await fetchQuestions()
      const [firstClass, secondClass] = difficultyClassMap[params.difficulty]

      // Filter questions based on class levels
      const filteredQuestions = allQuestions.filter(q => 
        q.class_level === firstClass || q.class_level === secondClass
      ).slice(0, 20) // Only take 20 questions (10 from each class)

      setQuestions(filteredQuestions)
    }
    loadQuestions()
  }, [params.difficulty])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  const handleCheckAnswer = () => {
    setIsAnswerChecked(true)
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswerChecked(false)
    } else {
      // Quiz finished - navigate to results page
      router.push(`/${lang}/result?score=${score}&total=${totalQuestions}`)
    }
  }

  // Define onValueChange function here
  const onValueChange = (newValue: string) => {
    setSelectedAnswer(newValue)
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-black py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Japan Trivia Quiz - {params.difficulty}</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {totalQuestions}</h2>
                <span className="text-sm text-gray-500">Score: {score}/{totalQuestions}</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="w-full" />
            </div>

            {!isAnswerChecked ? (
              <>
                <h3 className="text-xl font-bold mb-4">{currentQuestion.text}</h3>
                <RadioGroup 
                  value={selectedAnswer || ''} // 選択された値を設定
                  onValueChange={onValueChange}  // 選択された値を変更する関数を呼び出し
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Explanation</h3>
                <p className="mb-4">
                  {selectedAnswer === currentQuestion.correctAnswer 
                    ? "Correct! " 
                    : `Incorrect. The correct answer is ${currentQuestion.correctAnswer}. `}
                  {currentQuestion.explanation}
                </p>
                <div className="p-4 bg-blue-50 rounded-md">
                  <h4 className="font-bold mb-2">Answer Breakdown:</h4>
                  {currentQuestion.options.map((option, index) => (
                    <p key={index} className={`mb-1 ${
                      option === currentQuestion.correctAnswer 
                        ? 'text-green-600 font-bold' 
                        : selectedAnswer === option 
                          ? 'text-red-600 line-through' 
                          : ''
                    }`}>
                      {option}
                    </p>
                  ))}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-6">
            <div className="w-full flex justify-between items-center">
              <Link href={`/${lang}/difficulty`} passHref>
                <Button variant="outline">Quit Quiz</Button>
              </Link>
              {!isAnswerChecked ? (
                <Button 
                  onClick={handleCheckAnswer} 
                  disabled={!selectedAnswer}
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestionIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              )}
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
  )
}
