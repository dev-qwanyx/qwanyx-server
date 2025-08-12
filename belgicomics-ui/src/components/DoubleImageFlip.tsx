import React, { useState, useEffect, useRef } from 'react'

interface DoubleImageFlipProps {
  images: string[]
}

const DoubleImageFlip: React.FC<DoubleImageFlipProps> = ({ images }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  
  useEffect(() => {
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
    // Save the last image from previous shuffle
    if (shuffledImages.current.length > 0) {
      lastImageFromPreviousShuffle.current = currentLeft.current || currentRight.current
    }
    
    // Create new shuffled array
    let newShuffle = shuffleArray(images)
    
    // If first image is same as last from previous shuffle, reshuffle (max 2 times)
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
    // If we've used all images, create new shuffle
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
    const nextImage = getNextImage()
    if (!nextImage) return
    
    if (side === 'left') {
      setLeftFlipping(true)
      
      // Check current state using ref
      if (leftFlippedRef.current) {
        // Currently showing back, update front (hidden) then flip to show it
        setLeftFrontImage(nextImage)
      } else {
        // Currently showing front, update back (hidden) then flip to show it
        setLeftBackImage(nextImage)
      }
      
      // Toggle the flip state
      leftFlippedRef.current = !leftFlippedRef.current
      setLeftFlipped(leftFlippedRef.current)
      
      currentLeft.current = nextImage
      
      setTimeout(() => {
        setLeftFlipping(false)
      }, 800)
    } else {
      setRightFlipping(true)
      
      // Check current state using ref
      if (rightFlippedRef.current) {
        // Currently showing back, update front (hidden) then flip to show it
        setRightFrontImage(nextImage)
      } else {
        // Currently showing front, update back (hidden) then flip to show it
        setRightBackImage(nextImage)
      }
      
      // Toggle the flip state
      rightFlippedRef.current = !rightFlippedRef.current
      setRightFlipped(rightFlippedRef.current)
      
      currentRight.current = nextImage
      
      setTimeout(() => {
        setRightFlipping(false)
      }, 800)
    }
  }

  // Random delay between 2 and 5 seconds
  const getRandomDelay = () => {
    return Math.floor(Math.random() * 3000) + 2000
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
    
    // Start the animation after a short delay
    const startTimeout = setTimeout(() => {
      scheduleNextFlip()
    }, 1000)
    
    return () => {
      isRunning.current = false
      clearTimeout(startTimeout)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [images]) // Only depend on images prop

  const handleImageClick = (side: 'left' | 'right') => {
    const imageSrc = side === 'left' ? currentLeft.current : currentRight.current
    if (!imageSrc) return
    
    // Extract filename from URL
    const filename = imageSrc.split('/').pop() || ''
    const authors: Record<string, string> = {
      'Mystère A.jpg': 'À découvrir...',
      'ImageMystèreJannin.jpg': 'Frédéric Jannin',
      'FranquinA.jpg': 'André Franquin',
      'DavidWautierA.jpg': 'David Wautier',
      'ChrisLamquetImageMistere.jpg': 'Chris Lamquet',
      'Greg Shaw Mistère A.jpg': 'Greg Shaw',
      'Devos mystère NEW1 copie.jpg': 'Devos',
      'ANJO-MIST.png': 'Anjo',
      'LAUDY-M1.jpg': 'Laudy',
      'A.jpg': 'Auteur mystère'
    }
    
    const author = authors[filename] || 'Auteur mystère'
    alert(`Auteur: ${author}`)
  }

  // Return nothing if no images
  if (!leftFrontImage && !rightFrontImage) {
    return <div style={{ padding: '2rem', color: 'white' }}>Chargement des images mystère...</div>
  }
  

  // Responsive sizes
  const getPanelSize = () => {
    if (windowWidth < 768) return '300px'  // Mobile - empilées verticalement
    if (windowWidth >= 768 && windowWidth < 900) return '300px' // Small tablet
    if (windowWidth >= 900 && windowWidth < 1024) return '250px' // Tablet - côte à côte  
    return '300px' // Desktop
  }
  
  const panelSize = getPanelSize()
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: windowWidth < 768 ? 'column' as const : 'row' as const,
      gap: '20px',
      justifyContent: 'center',
      alignItems: 'center',
      padding: windowWidth < 768 ? '15px' : '30px',
      overflow: 'visible'
    },
    panel: {
      flex: 1,
      position: 'relative' as const,
      width: panelSize,
      height: panelSize,
      perspective: '1000px',
      transformStyle: 'preserve-3d' as const,
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    },
    flipCard: {
      width: '100%',
      height: '100%',
      position: 'relative' as const,
      transformStyle: 'preserve-3d' as const
    },
    flipCardInner: {
      width: '100%',
      height: '100%',
      position: 'relative' as const,
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)'
    },
    flipCardFront: {
      width: '100%',
      height: '100%',
      position: 'absolute' as const,
      backfaceVisibility: 'hidden' as const,
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible'
    },
    flipCardBack: {
      width: '100%',
      height: '100%',
      position: 'absolute' as const,
      backfaceVisibility: 'hidden' as const,
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
      transform: 'rotateY(180deg)'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
      display: 'block',
      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))'
    },
    mysteryHover: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#2C3E50',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '36px',
      fontWeight: 'bold',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none' as const,
      zIndex: 10,
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }
  }

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div 
        className={`double-image-flip-panel ${leftFlipping ? 'flipping' : ''}`}
        style={styles.panel}
        onClick={() => handleImageClick('left')}
      >
        <div style={styles.flipCard}>
          <div style={{
            ...styles.flipCardInner,
            transform: leftFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}>
            <div style={styles.flipCardFront}>
              <img src={leftFrontImage} alt="Image mystère" style={styles.image} />
            </div>
            <div style={styles.flipCardBack}>
              <img src={leftBackImage} alt="Image mystère" style={styles.image} />
            </div>
          </div>
        </div>
        <div className="double-image-flip-mystery-hover" style={styles.mysteryHover}>?</div>
      </div>
      
      {/* Right Panel */}
      <div 
        className={`double-image-flip-panel ${rightFlipping ? 'flipping' : ''}`}
        style={styles.panel}
        onClick={() => handleImageClick('right')}
      >
        <div style={styles.flipCard}>
          <div style={{
            ...styles.flipCardInner,
            transform: rightFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}>
            <div style={styles.flipCardFront}>
              <img src={rightFrontImage} alt="Image mystère" style={styles.image} />
            </div>
            <div style={styles.flipCardBack}>
              <img src={rightBackImage} alt="Image mystère" style={styles.image} />
            </div>
          </div>
        </div>
        <div className="double-image-flip-mystery-hover" style={styles.mysteryHover}>?</div>
      </div>
    </div>
  )
}

export default DoubleImageFlip