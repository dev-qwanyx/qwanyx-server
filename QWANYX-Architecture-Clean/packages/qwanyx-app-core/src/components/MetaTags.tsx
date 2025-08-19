/**
 * MetaTags Component
 * Injects essential meta tags for Progressive Web Apps
 */

import React from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  themeColor?: string;
  viewport?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'QWANYX App',
  description = 'Built with QWANYX Architecture',
  themeColor,
  viewport = 'width=device-width, initial-scale=1, viewport-fit=cover'
}) => {
  React.useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    }

    // Create or update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'viewport', content: viewport },
      { name: 'theme-color', content: themeColor || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3B82F6' },
      // PWA meta tags
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'format-detection', content: 'telephone=no' },
      // Security
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    });

    // Set charset if not present
    if (!document.querySelector('meta[charset]')) {
      const charset = document.createElement('meta');
      charset.setAttribute('charset', 'utf-8');
      document.head.insertBefore(charset, document.head.firstChild);
    }

    // Add IE compatibility if not present
    let ieCompat = document.querySelector('meta[http-equiv="X-UA-Compatible"]') as HTMLMetaElement;
    if (!ieCompat) {
      ieCompat = document.createElement('meta');
      ieCompat.setAttribute('http-equiv', 'X-UA-Compatible');
      ieCompat.content = 'IE=edge';
      document.head.appendChild(ieCompat);
    }
  }, [title, description, themeColor, viewport]);

  return null;
};