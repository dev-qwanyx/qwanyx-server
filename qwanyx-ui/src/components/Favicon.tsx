import { useEffect } from 'react';

export interface FaviconProps {
  href?: string;
  autoDetect?: boolean;
}

export const Favicon: React.FC<FaviconProps> = ({ 
  href,
  autoDetect = true 
}) => {
  useEffect(() => {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(favicon => favicon.remove());

    if (href) {
      // Use specified favicon
      setFavicon(href);
    } else if (autoDetect) {
      // Auto-detect from available logo files
      const possiblePaths = [
        '/favicon.ico',
        '/favicon.svg',
        '/favicon.png',
        '/images/logo.svg',
        '/images/logo.png',
        '/images/logo.jpg',
        '/images/logo-icon.svg',
        '/images/logo-icon.png',
        '/images/icon.svg',
        '/images/icon.png'
      ];

      // Try to find the first available favicon
      tryNextFavicon(possiblePaths, 0);
    }
  }, [href, autoDetect]);

  const tryNextFavicon = (paths: string[], index: number) => {
    if (index >= paths.length) {
      // No favicon found, use default or generate from text
      console.warn('No favicon found, using fallback');
      generateTextFavicon('Q'); // First letter of QWANYX
      return;
    }

    const path = paths[index];
    const img = new Image();
    
    img.onload = () => {
      setFavicon(path);
    };
    
    img.onerror = () => {
      tryNextFavicon(paths, index + 1);
    };
    
    img.src = path;
  };

  const setFavicon = (href: string) => {
    // Determine type based on extension
    const extension = href.split('.').pop()?.toLowerCase();
    let type = 'image/x-icon';
    
    if (extension === 'png') type = 'image/png';
    else if (extension === 'svg') type = 'image/svg+xml';
    else if (extension === 'jpg' || extension === 'jpeg') type = 'image/jpeg';

    // Create and add favicon link
    const link = document.createElement('link');
    link.rel = extension === 'svg' ? 'icon' : 'shortcut icon';
    link.type = type;
    link.href = href;
    document.head.appendChild(link);

    // Also add as apple-touch-icon for iOS if it's not an ico
    if (extension !== 'ico') {
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = href;
      document.head.appendChild(appleLink);
    }
  };

  const generateTextFavicon = (text: string) => {
    // Create a canvas favicon with text
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#3B82F6'; // Blue background
      ctx.fillRect(0, 0, 32, 32);
      
      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.charAt(0).toUpperCase(), 16, 16);
      
      // Convert to favicon
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setFavicon(url);
        }
      });
    }
  };

  return null; // This component doesn't render anything
};

// Hook version for more control
export const useFavicon = (href?: string, options?: { autoDetect?: boolean } = {}) => {
  const { autoDetect = true } = options;
  
  useEffect(() => {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(favicon => favicon.remove());

    if (href) {
      // Use specified favicon
      const setFavicon = (faviconHref: string) => {
        const extension = faviconHref.split('.').pop()?.toLowerCase();
        let type = 'image/x-icon';
        
        if (extension === 'png') type = 'image/png';
        else if (extension === 'svg') type = 'image/svg+xml';
        else if (extension === 'jpg' || extension === 'jpeg') type = 'image/jpeg';

        const link = document.createElement('link');
        link.rel = extension === 'svg' ? 'icon' : 'shortcut icon';
        link.type = type;
        link.href = faviconHref;
        document.head.appendChild(link);
      };
      
      setFavicon(href);
    } else if (autoDetect) {
      // Auto-detect logic (simplified for hook)
      const possiblePaths = [
        '/favicon.ico',
        '/favicon.svg',
        '/favicon.png',
        '/images/logo.svg',
        '/images/logo.png',
        '/images/logo.jpg'
      ];

      const tryFavicon = (path: string) => {
        const img = new Image();
        img.src = path;
        return new Promise<string>((resolve, reject) => {
          img.onload = () => resolve(path);
          img.onerror = reject;
        });
      };

      // Try each path until one works
      Promise.any(possiblePaths.map(tryFavicon))
        .then(workingPath => {
          const extension = workingPath.split('.').pop()?.toLowerCase();
          let type = 'image/x-icon';
          
          if (extension === 'png') type = 'image/png';
          else if (extension === 'svg') type = 'image/svg+xml';
          else if (extension === 'jpg' || extension === 'jpeg') type = 'image/jpeg';

          const link = document.createElement('link');
          link.rel = extension === 'svg' ? 'icon' : 'shortcut icon';
          link.type = type;
          link.href = workingPath;
          document.head.appendChild(link);
        })
        .catch(() => {
          console.warn('No favicon found');
        });
    }
  }, [href, autoDetect]);
};