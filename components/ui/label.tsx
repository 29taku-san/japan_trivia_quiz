// components/ui/label.tsx
import { FC, ReactNode } from 'react'

interface LabelProps {
  children: ReactNode;
  htmlFor: string;
  className?: string;
}

export const Label: FC<LabelProps> = ({ children, htmlFor, className }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  )
}
