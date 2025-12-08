import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  className
}) => {
  const [hoverValue, setHoverValue] = React.useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating)
    }
  }

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverValue(rating)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0)
    }
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            'transition-colors cursor-pointer',
            {
              'cursor-default': readOnly,
              'fill-yellow-400 text-yellow-400': star <= (hoverValue || value),
              'text-gray-300 hover:text-yellow-400': star > (hoverValue || value) && !readOnly,
              'text-gray-300': star > (hoverValue || value) && readOnly,
            }
          )}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  )
}

export { Rating }