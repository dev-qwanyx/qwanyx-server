import React, { useState, useEffect, useRef } from 'react'
import { HelpCircle } from 'lucide-react'
import './DoubleImageFlip.css'

export interface DoubleImageFlipProps {
  images: string[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
  flipInterval?: number // milliseconds between flips
  flipIntervalMin?: number // minimum interval for variance (if set, uses random between min and max)
  flipIntervalMax?: number // maximum interval for variance
  flipDuration?: number // duration of flip animation in milliseconds
  hoverScale?: number // scale factor on hover (e.g., 1.02 for 2% scale)
  onImageClick?: (imageSrc: string, side: 'left' | 'right') => void
  showMysteryIcon?: boolean
  className?: string
}

export const DoubleImageFlip: React.FC<DoubleImageFlipProps> = ({ 
  images,
  size = 'md',
  flipInterval = 3000,
  flipIntervalMin,
  flipIntervalMax,
  flipDuration = 800,
  hoverScale = 1.02,
  onImageClick,
  showMysteryIcon = true,
  className = ''
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [leftFrontImage, setLeftFrontImage] = useState('')
  const [leftBackImage, setLeftBackImage] = useState('')
  const [rightFrontImage, setRightFrontImage] = useState('')
  const [rightBackImage, setRightBackImage] = useState('')
  const [leftFlipped, setLeftFlipped] = useState(false)
  const [rightFlipped, setRightFlipped] = useState(false)
  const [leftFlipping, setLeftFlipping] = useState(false)
  const [rightFlipping, setRightFlipping] = useState(false)
  
  const shuffledImages = useRef<string[]>([])
  const imageIndex = useRef(0)
  const currentLeft = useRef<string | null>(null)
  const currentRight = useRef<string | null>(null)
  const lastImageFromPreviousShuffle = useRef<string | null>(null)
  const isRunning = useRef(true)
  const leftFlippedRef = useRef(false)
  const rightFlippedRef = useRef(false)

  // Fisher-Yates shuffle
  const shuffleArray = (array: string[]) => {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Create new shuffle with memory
  const createNewShuffle = () => {
    if (shuffledImages.current.length > 0) {
      lastImageFromPreviousShuffle.current = currentLeft.current || currentRight.current
    }
    
    let newShuffle = shuffleArray(images)
    
    let reshuffleCount = 0
    while (lastImageFromPreviousShuffle.current && 
           newShuffle[0] === lastImageFromPreviousShuffle.current && 
           reshuffleCount < 2) {
      newShuffle = shuffleArray(images)
      reshuffleCount++
    }
    
    shuffledImages.current = newShuffle
    imageIndex.current = 0
  }

  // Get next image from shuffled array
  const getNextImage = () => {
    if (imageIndex.current >= shuffledImages.current.length) {
      createNewShuffle()
    }
    
    const nextImage = shuffledImages.current[imageIndex.current]
    imageIndex.current++
    return nextImage
  }

  // Initialize images
  useEffect(() => {
    if (!images || images.length === 0) {
      return
    }
    createNewShuffle()
    if (shuffledImages.current.length >= 2) {
      const first = shuffledImages.current[0]
      const second = shuffledImages.current[1]
      
      currentLeft.current = first
      currentRight.current = second
      setLeftFrontImage(first)
      setRightFrontImage(second)
      imageIndex.current = 2
    }
  }, [images])

  // Flip a panel
  const flipPanel = (side: 'left' | 'right') => {
    let nextImage = getNextImage()
    if (!nextImage) return
    
    // Ensure we don't show the same image on both sides
    const otherSideImage = side === 'left' ? currentRight.current : currentLeft.current
    
    // If the next image is the same as the other side, get another one
    let attempts = 0
    while (nextImage === otherSideImage && attempts < images.length && images.length > 2) {
      nextImage = getNextImage()
      attempts++
    }
    
    if (side === 'left') {
      setLeftFlipping(true)
      
      if (leftFlippedRef.current) {
        setLeftFrontImage(nextImage)
      } else {
        setLeftBackImage(nextImage)
      }
      
      leftFlippedRef.current = !leftFlippedRef.current
      setLeftFlipped(leftFlippedRef.current)
      
      currentLeft.current = nextImage
      
      setTimeout(() => {
        setLeftFlipping(false)
      }, flipDuration)
    } else {
      setRightFlipping(true)
      
      if (rightFlippedRef.current) {
        setRightFrontImage(nextImage)
      } else {
        setRightBackImage(nextImage)
      }
      
      rightFlippedRef.current = !rightFlippedRef.current
      setRightFlipped(rightFlippedRef.current)
      
      currentRight.current = nextImage
      
      setTimeout(() => {
        setRightFlipping(false)
      }, flipDuration)
    }
  }

  // Random delay between flips
  const getRandomDelay = () => {
    // If min and max are specified, use them for variance
    if (flipIntervalMin !== undefined && flipIntervalMax !== undefined) {
      return flipIntervalMin + Math.random() * (flipIntervalMax - flipIntervalMin)
    }
    // Otherwise use default variance of 50% of base interval
    const variance = flipInterval * 0.5
    return flipInterval - variance + Math.random() * variance * 2
  }

  // Start the flipping animation
  useEffect(() => {
    if (!shuffledImages.current.length) return
    
    isRunning.current = true
    let timeoutId: ReturnType<typeof setTimeout>
    
    const scheduleNextFlip = () => {
      if (!isRunning.current) return
      
      const delay = getRandomDelay()
      const side = Math.random() < 0.5 ? 'left' : 'right'
      
      timeoutId = setTimeout(() => {
        if (isRunning.current) {
          flipPanel(side)
          scheduleNextFlip()
        }
      }, delay)
    }
    
    const startTimeout = setTimeout(() => {
      scheduleNextFlip()
    }, 1000)
    
    return () => {
      isRunning.current = false
      clearTimeout(startTimeout)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [images, flipInterval, flipIntervalMin, flipIntervalMax, flipDuration])

  const handleImageClick = (side: 'left' | 'right') => {
    const imageSrc = side === 'left' ? currentLeft.current : currentRight.current
    if (!imageSrc) return
    
    if (onImageClick) {
      onImageClick(imageSrc, side)
    }
  }

  // Return nothing if no images
  if (!leftFrontImage && !rightFrontImage) {
    return (
      <div className="qwanyx-double-image-flip--loading">
        Loading images...
      </div>
    )
  }

  // Sizes configuration
  const sizes = {
    sm: { panel: '200px', gap: '10px' },
    md: { panel: '300px', gap: '20px' },
    lg: { panel: '400px', gap: '30px' },
    xl: { panel: '500px', gap: '40px' }
  }

  const currentSize = sizes[size]
  // Keep original size even on mobile/responsive mode
  const panelSize = currentSize.panel
  const isMobile = windowWidth < 768

  return (
    <div 
      className={`qwanyx-double-image-flip ${className}`}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: currentSize.gap,
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? '15px' : '30px'
      }}
    >
      {/* Left Panel */}
      <div 
        className={`qwanyx-double-image-flip__panel ${leftFlipping ? 'qwanyx-double-image-flip__panel--flipping' : ''}`}
        style={{
          position: 'relative',
          width: panelSize,
          height: panelSize,
          perspective: '1000px',
          cursor: onImageClick ? 'pointer' : 'default',
          transition: 'transform 0.3s ease',
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (hoverScale !== 1) {
            e.currentTarget.style.transform = `scale(${hoverScale})`
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onClick={() => handleImageClick('left')}
      >
        <div className="qwanyx-double-image-flip__card">
          <div 
            className="qwanyx-double-image-flip__card-inner"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: `transform ${flipDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
              transform: leftFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div className="qwanyx-double-image-flip__card-front">
              <img 
                src={leftFrontImage} 
                alt="Flip image" 
                className="qwanyx-double-image-flip__image"
              />
            </div>
            <div className="qwanyx-double-image-flip__card-back">
              <img 
                src={leftBackImage} 
                alt="Flip image" 
                className="qwanyx-double-image-flip__image"
              />
            </div>
          </div>
        </div>
        {showMysteryIcon && (
          <div className="qwanyx-double-image-flip__mystery">
            <HelpCircle size={24} strokeWidth={2} />
          </div>
        )}
      </div>
      
      {/* Right Panel */}
      <div 
        className={`qwanyx-double-image-flip__panel ${rightFlipping ? 'qwanyx-double-image-flip__panel--flipping' : ''}`}
        style={{
          position: 'relative',
          width: panelSize,
          height: panelSize,
          perspective: '1000px',
          cursor: onImageClick ? 'pointer' : 'default',
          transition: 'transform 0.3s ease',
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (hoverScale !== 1) {
            e.currentTarget.style.transform = `scale(${hoverScale})`
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onClick={() => handleImageClick('right')}
      >
        <div className="qwanyx-double-image-flip__card">
          <div 
            className="qwanyx-double-image-flip__card-inner"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: `transform ${flipDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
              transform: rightFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div className="qwanyx-double-image-flip__card-front">
              <img 
                src={rightFrontImage} 
                alt="Flip image" 
                className="qwanyx-double-image-flip__image"
              />
            </div>
            <div className="qwanyx-double-image-flip__card-back">
              <img 
                src={rightBackImage} 
                alt="Flip image" 
                className="qwanyx-double-image-flip__image"
              />
            </div>
          </div>
        </div>
        {showMysteryIcon && (
          <div className="qwanyx-double-image-flip__mystery">
            <HelpCircle size={24} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  )
}