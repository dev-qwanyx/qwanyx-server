/**
 * Double Image Flip Component for Belgicomics
 * Creates a comic-style double panel with random flipping images
 */

class DoubleImageFlip {
    constructor(containerId, imageUrls) {
        this.container = document.getElementById(containerId);
        this.imageUrls = [...imageUrls]; // Copy array
        this.shuffledImages = [];
        this.imageIndex = 0;
        this.currentLeft = null;
        this.currentRight = null;
        this.lastImageFromPreviousShuffle = null;
        this.isRunning = false;
        
        // Create initial shuffle
        this.createNewShuffle();
        
        this.init();
    }
    
    init() {
        // Create HTML structure
        this.container.innerHTML = `
            <div class="double-image-container">
                <div class="image-panel left-panel" onclick="handleMysteryClick(event, 'left')">
                    <div class="flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="" alt="Image mystère - Cliquez pour découvrir l'auteur">
                            </div>
                            <div class="flip-card-back">
                                <img src="" alt="Image mystère - Cliquez pour découvrir l'auteur">
                            </div>
                        </div>
                    </div>
                    <div class="mystery-hover">?</div>
                </div>
                <div class="image-panel right-panel" onclick="handleMysteryClick(event, 'right')">
                    <div class="flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <img src="" alt="Image mystère - Cliquez pour découvrir l'auteur">
                            </div>
                            <div class="flip-card-back">
                                <img src="" alt="Image mystère - Cliquez pour découvrir l'auteur">
                            </div>
                        </div>
                    </div>
                    <div class="mystery-hover">?</div>
                </div>
            </div>
        `;
        
        // Add CSS if not already present
        if (!document.getElementById('double-image-flip-styles')) {
            const style = document.createElement('style');
            style.id = 'double-image-flip-styles';
            style.innerHTML = this.getStyles();
            document.head.appendChild(style);
        }
        
        // Set initial images
        this.setInitialImages();
        
        // Start the animation cycle
        this.start();
    }
    
    getStyles() {
        return `
            .double-image-container {
                display: flex;
                gap: 20px;
                max-width: 800px;
                margin: 0 auto;
                padding: 30px;
                overflow: visible;
            }
            
            .image-panel {
                flex: 1;
                position: relative;
                aspect-ratio: 1 / 1;
                perspective: 1000px;
                transform-style: preserve-3d;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            
            .image-panel:hover {
                transform: scale(1.02);
            }
            
            .mystery-hover {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                color: #2C3E50;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                z-index: 10;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .image-panel:hover .mystery-hover {
                opacity: 1;
            }
            
            .image-panel.flipping .mystery-hover {
                opacity: 0 !important;
                transition: opacity 0.1s ease;
            }
            
            .panel-separator {
                display: none;
            }
            
            .flip-card {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
            }
            
            .flip-card-inner {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
                transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
            }
            
            .flip-card-inner.flipped {
                transform: rotateY(180deg);
            }
            
            .flip-card-front,
            .flip-card-back {
                width: 100%;
                height: 100%;
                position: absolute;
                backface-visibility: hidden;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: visible;
            }
            
            .flip-card-back {
                transform: rotateY(180deg);
                -webkit-transform: rotateY(180deg);
                transform-style: preserve-3d;
                -webkit-transform-style: preserve-3d;
            }
            
            
            
            .flip-card img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
                filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2));
            }
            
            /* Comic book effect - removed to eliminate gray background */
            
            /* Loading state */
            .flip-card img[src=""] {
                display: none;
            }
            
            .flip-card img[src=""]::after {
                content: '?';
                font-size: 48px;
                color: #E74C3C;
                font-weight: bold;
                font-family: 'Comic Sans MS', cursive;
            }
            
            /* Tablet - images côte à côte mais centrées */
            @media (max-width: 1215px) and (min-width: 769px) {
                .double-image-container {
                    max-width: 800px;
                    margin: 20px auto;
                    min-height: 400px;
                    padding: 30px;
                    overflow: visible;
                }
                
                .image-panel {
                    min-height: 400px;
                    width: 48%;
                }
            }
            
            /* Mobile - images en vertical */
            @media (max-width: 768px) {
                .double-image-container {
                    flex-direction: column;
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 30px;
                    overflow: visible;
                }
                
                .image-panel {
                    width: 100%;
                    max-width: 350px;
                    min-height: 350px;
                    margin: 0 auto 20px;
                }
                
                .panel-separator {
                    width: 100%;
                    height: 4px;
                }
            }
        `;
    }
    
    createNewShuffle() {
        // Save the last image from previous shuffle
        if (this.shuffledImages.length > 0) {
            this.lastImageFromPreviousShuffle = this.currentLeft || this.currentRight;
        }
        
        // Create new shuffled array
        this.shuffledImages = [...this.imageUrls];
        this.shuffleArray(this.shuffledImages);
        
        // If first image is same as last from previous shuffle, reshuffle (max 2 times)
        let reshuffleCount = 0;
        while (this.lastImageFromPreviousShuffle && 
               this.shuffledImages[0] === this.lastImageFromPreviousShuffle && 
               reshuffleCount < 2) {
            this.shuffleArray(this.shuffledImages);
            reshuffleCount++;
        }
        
        this.imageIndex = 0;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    setInitialImages() {
        // Take first two images from shuffled array
        if (this.shuffledImages.length >= 2) {
            this.currentLeft = this.shuffledImages[0];
            this.currentRight = this.shuffledImages[1];
            this.imageIndex = 2;
            
            const leftImg = this.container.querySelector('.left-panel .flip-card-front img');
            const rightImg = this.container.querySelector('.right-panel .flip-card-front img');
            
            if (leftImg && this.currentLeft) leftImg.src = this.currentLeft;
            if (rightImg && this.currentRight) rightImg.src = this.currentRight;
        }
    }
    
    getNextImage() {
        // If we've used all images, create new shuffle
        if (this.imageIndex >= this.shuffledImages.length) {
            this.createNewShuffle();
        }
        
        const nextImage = this.shuffledImages[this.imageIndex];
        this.imageIndex++;
        return nextImage;
    }
    
    flipPanel(side) {
        const panel = this.container.querySelector(`.${side}-panel`);
        const flipCardInner = panel.querySelector('.flip-card-inner');
        const frontImg = panel.querySelector('.flip-card-front img');
        const backImg = panel.querySelector('.flip-card-back img');
        
        // Get next image
        const nextImage = this.getNextImage();
        if (!nextImage) return;
        
        // Add flipping class to hide mystery hover during animation
        panel.classList.add('flipping');
        
        // Check if card is already flipped
        const isFlipped = flipCardInner.classList.contains('flipped');
        
        if (isFlipped) {
            // Card is showing back, so put new image on front and flip back
            frontImg.src = nextImage;
            flipCardInner.classList.remove('flipped');
        } else {
            // Card is showing front, so put new image on back and flip
            backImg.src = nextImage;
            flipCardInner.classList.add('flipped');
        }
        
        // Remove flipping class after animation completes
        setTimeout(() => {
            panel.classList.remove('flipping');
        }, 800);
        
        // Update current image reference
        if (side === 'left') {
            this.currentLeft = nextImage;
        } else {
            this.currentRight = nextImage;
        }
    }
    
    getRandomDelay() {
        // Random delay between 2 and 5 seconds
        return Math.floor(Math.random() * 3000) + 2000;
    }
    
    scheduleNextFlip() {
        if (!this.isRunning) return;
        
        const delay = this.getRandomDelay();
        const side = Math.random() < 0.5 ? 'left' : 'right';
        
        setTimeout(() => {
            if (this.isRunning) {
                this.flipPanel(side);
                this.scheduleNextFlip();
            }
        }, delay);
    }
    
    start() {
        this.isRunning = true;
        this.scheduleNextFlip();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    destroy() {
        this.stop();
        this.container.innerHTML = '';
    }
}

// Auto-initialize if on a page with the container
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('double-image-flip');
    if (container) {
        // Get images from the data attribute or use default
        const imagesUrl = container.dataset.images;
        if (imagesUrl) {
            fetch(imagesUrl)
                .then(res => res.text())
                .then(text => {
                    const images = text.trim().split('\n').filter(url => url.trim());
                    new DoubleImageFlip('double-image-flip', images);
                })
                .catch(err => console.error('Error loading images:', err));
        }
    }
});