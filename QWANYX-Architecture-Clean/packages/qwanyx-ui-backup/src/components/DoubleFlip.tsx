import React, { useState, useEffect, useRef } from 'react';
import './DoubleImageFlip.css';

export interface DoubleFlipProps {
  images: string[];
  flipDelay?: { min: number; max: number };
  flipDuration?: number;
  onImageClick?: (image: string, side: 'left' | 'right') => void;
  size?: string | { mobile: string; tablet: string; desktop: string };
  gap?: string;
  className?: string;
}

export const DoubleFlip: React.FC<DoubleFlipProps> = ({
  images,
  flipDelay = { min: 2000, max: 5000 },
  flipDuration = 800,
  onImageClick,
  size = '300px',
  gap = '20px',
  className = ''
}) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [leftFrontImage, setLeftFrontImage] = useState('');
  const [leftBackImage, setLeftBackImage] = useState('');
  const [rightFrontImage, setRightFrontImage] = useState('');
  const [rightBackImage, setRightBackImage] = useState('');
  const [leftFlipped, setLeftFlipped] = useState(false);
  const [rightFlipped, setRightFlipped] = useState(false);
  const [leftFlipping, setLeftFlipping] = useState(false);
  const [rightFlipping, setRightFlipping] = useState(false);
  
  const shuffledImages = useRef<string[]>([]);
  const imageIndex = useRef(0);
  const currentLeft = useRef<string | null>(null);
  const currentRight = useRef<string | null>(null);
  const lastImageFromPreviousShuffle = useRef<string | null>(null);
  const isRunning = useRef(true);
  const leftFlippedRef = useRef(false);
  const rightFlippedRef = useRef(false);

  // Fisher-Yates shuffle
  const shuffleArray = (array: string[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Create new shuffle with memory
  const createNewShuffle = () => {
    if (shuffledImages.current.length > 0) {
      lastImageFromPreviousShuffle.current = currentLeft.current || currentRight.current;
    }
    
    let newShuffle = shuffleArray(images);
    let reshuffleCount = 0;
    while (lastImageFromPreviousShuffle.current && 
           newShuffle[0] === lastImageFromPreviousShuffle.current && 
           reshuffleCount < 2) {
      newShuffle = shuffleArray(images);
      reshuffleCount++;
    }
    
    shuffledImages.current = newShuffle;
    imageIndex.current = 0;
  };

  // Get next image from shuffled array
  const getNextImage = () => {
    if (imageIndex.current >= shuffledImages.current.length) {
      createNewShuffle();
    }
    
    const nextImage = shuffledImages.current[imageIndex.current];
    imageIndex.current++;
    return nextImage;
  };

  // Initialize images
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    createNewShuffle();
    if (shuffledImages.current.length >= 2) {
      const first = shuffledImages.current[0];
      const second = shuffledImages.current[1];
      
      currentLeft.current = first;
      currentRight.current = second;
      setLeftFrontImage(first);
      setRightFrontImage(second);
      imageIndex.current = 2;
    }
  }, [images]);

  // Flip a panel
  const flipPanel = (side: 'left' | 'right') => {
    const nextImage = getNextImage();
    if (!nextImage) return;
    
    if (side === 'left') {
      setLeftFlipping(true);
      
      if (leftFlippedRef.current) {
        setLeftFrontImage(nextImage);
      } else {
        setLeftBackImage(nextImage);
      }
      
      leftFlippedRef.current = !leftFlippedRef.current;
      setLeftFlipped(leftFlippedRef.current);
      currentLeft.current = nextImage;
      
      setTimeout(() => {
        setLeftFlipping(false);
      }, flipDuration);
    } else {
      setRightFlipping(true);
      
      if (rightFlippedRef.current) {
        setRightFrontImage(nextImage);
      } else {
        setRightBackImage(nextImage);
      }
      
      rightFlippedRef.current = !rightFlippedRef.current;
      setRightFlipped(rightFlippedRef.current);
      currentRight.current = nextImage;
      
      setTimeout(() => {
        setRightFlipping(false);
      }, flipDuration);
    }
  };

  // Random delay
  const getRandomDelay = () => {
    return Math.floor(Math.random() * (flipDelay.max - flipDelay.min)) + flipDelay.min;
  };

  // Start the flipping animation
  useEffect(() => {
    if (!shuffledImages.current.length) return;
    
    isRunning.current = true;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const scheduleNextFlip = () => {
      if (!isRunning.current) return;
      
      const delay = getRandomDelay();
      const side = Math.random() < 0.5 ? 'left' : 'right';
      
      timeoutId = setTimeout(() => {
        if (isRunning.current) {
          flipPanel(side);
          scheduleNextFlip();
        }
      }, delay);
    };
    
    const startTimeout = setTimeout(() => {
      scheduleNextFlip();
    }, 1000);
    
    return () => {
      isRunning.current = false;
      clearTimeout(startTimeout);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [images]);

  const handleImageClick = (side: 'left' | 'right') => {
    const imageSrc = side === 'left' ? currentLeft.current : currentRight.current;
    if (!imageSrc || !onImageClick) return;
    onImageClick(imageSrc, side);
  };

  // Calculate panel size
  const getPanelSize = () => {
    if (typeof size === 'object') {
      if (windowWidth < 768) return size.mobile;
      if (windowWidth < 1024) return size.tablet;
      return size.desktop;
    }
    return size;
  };

  // Return nothing if no images
  if (!leftFrontImage && !rightFrontImage) {
    return (
      <div className="qwanyx-double-flip-loading">
        Chargement des images...
      </div>
    );
  }
  
  const panelSize = getPanelSize();
  const isVertical = windowWidth < 768;

  return (
    <div 
      className={`qwanyx-double-flip ${isVertical ? 'qwanyx-double-flip--vertical' : 'qwanyx-double-flip--horizontal'} ${className}`}
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: gap,
        justifyContent: 'center',
        alignItems: 'center',
        padding: isVertical ? '15px' : '30px'
      }}
    >
      {/* Left Panel */}
      <div 
        className={`qwanyx-double-flip__panel ${leftFlipping ? 'qwanyx-double-flip__panel--flipping' : ''}`}
        style={{
          position: 'relative',
          width: panelSize,
          height: panelSize,
          perspective: '1000px',
          cursor: onImageClick ? 'pointer' : 'default'
        }}
        onClick={() => handleImageClick('left')}
      >
        <div className="qwanyx-double-flip__card">
          <div 
            className="qwanyx-double-flip__card-inner"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: `transform ${flipDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
              transform: leftFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div className="qwanyx-double-flip__card-front" style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden'
            }}>
              <img 
                src={leftFrontImage} 
                alt="Flip image" 
                className="qwanyx-double-flip__image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <div className="qwanyx-double-flip__card-back" style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}>
              <img 
                src={leftBackImage} 
                alt="Flip image" 
                className="qwanyx-double-flip__image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel */}
      <div 
        className={`qwanyx-double-flip__panel ${rightFlipping ? 'qwanyx-double-flip__panel--flipping' : ''}`}
        style={{
          position: 'relative',
          width: panelSize,
          height: panelSize,
          perspective: '1000px',
          cursor: onImageClick ? 'pointer' : 'default'
        }}
        onClick={() => handleImageClick('right')}
      >
        <div className="qwanyx-double-flip__card">
          <div 
            className="qwanyx-double-flip__card-inner"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: `transform ${flipDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`,
              transform: rightFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div className="qwanyx-double-flip__card-front" style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden'
            }}>
              <img 
                src={rightFrontImage} 
                alt="Flip image" 
                className="qwanyx-double-flip__image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <div className="qwanyx-double-flip__card-back" style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}>
              <img 
                src={rightBackImage} 
                alt="Flip image" 
                className="qwanyx-double-flip__image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleFlip;