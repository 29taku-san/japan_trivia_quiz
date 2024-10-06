// components/ui/progress.tsx
import { FC } from 'react'

interface ProgressProps {
  value: number; // Progress value as a percentage (0-100)
  className?: string;
}

export const Progress: FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={`relative w-full h-4 bg-gray-200 rounded ${className}`}>
      <div
        className="absolute left-0 top-0 h-4 bg-blue-500 rounded"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
