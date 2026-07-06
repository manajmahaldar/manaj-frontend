import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading by default (unless priority=true)
 * - Cloudinary URL optimization (auto format, quality, width, dpr)
 * - LQIP (Low Quality Image Placeholder) as background
 * - Shimmer effect while loading
 * - Smooth fade-in
 * - Fallback handling for broken images
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false, 
  width,
  height,
  objectFit = 'cover',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [lqipSrc, setLqipSrc] = useState(null);

  useEffect(() => {
    if (!src) return;
    
    // Reset states when src changes
    setError(false);
    setIsLoaded(false);

    // Cloudinary optimization logic
    if (src.includes('res.cloudinary.com')) {
      // Check if it already has transformations
      if (!src.includes('/upload/f_auto')) {
        // High-res optimized image
        const newSrc = src.replace('/upload/', '/upload/f_auto,q_auto,w_auto,dpr_auto/');
        setOptimizedSrc(newSrc);
        
        // Low Quality Image Placeholder (LQIP)
        const lqip = src.replace('/upload/', '/upload/f_auto,q_1,w_100,e_blur:1000/');
        setLqipSrc(lqip);
      } else {
        setOptimizedSrc(src);
        setLqipSrc(null);
      }
    } else {
      setOptimizedSrc(src);
      setLqipSrc(null);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true); // stop showing skeleton
  };

  // Fallback placeholder
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiAvPjwvc3ZnPg==';

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* LQIP Background */}
      {lqipSrc && !isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-110" 
          style={{ backgroundImage: `url(${lqipSrc})` }} 
        />
      )}

      {/* Shimmer Skeleton Placeholder (shows over LQIP or empty background) */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 bg-[length:200%_100%] animate-shimmer opacity-80" />
      )}
      
      {/* High-res Image */}
      <img
        src={error ? fallbackSrc : optimizedSrc}
        alt={alt || 'Image'}
        loading={priority ? 'eager' : 'lazy'}
        // Preload hint via fetchpriority if high priority
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
