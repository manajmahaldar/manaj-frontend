import React, { useState, useEffect, useMemo, useCallback } from 'react';

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

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Compute Cloudinary optimized and LQIP URLs synchronously with useMemo
  const { optimizedSrc, lqipSrc } = useMemo(() => {
    if (!src) return { optimizedSrc: src, lqipSrc: null };

    if (src.includes('res.cloudinary.com')) {
      if (!src.includes('/upload/f_auto')) {
        return {
          optimizedSrc: src.replace('/upload/', '/upload/f_auto,q_auto,w_auto,dpr_auto/'),
          lqipSrc: src.replace('/upload/', '/upload/f_auto,q_1,w_100,e_blur:1000/')
        };
      }
    }
    return { optimizedSrc: src, lqipSrc: null };
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setIsLoaded(true); // stop showing skeleton
  }, []);

  // Fallback placeholder
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiAvPjwvc3ZnPg==';

  return (
    <div className={`relative overflow-hidden w-full h-full min-h-[120px]`} style={{ width, height }}>
      {/* LQIP Background */}
      {lqipSrc && !isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-110" 
          style={{ backgroundImage: `url(${lqipSrc})` }} 
        />
      )}

      {/* Shimmer Skeleton Placeholder (shows over LQIP or empty background) */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 bg-[length:200%_100%] animate-shimmer opacity-80 z-0" />
      )}
      
      {/* High-res Image */}
      <img
        src={error ? fallbackSrc : optimizedSrc}
        alt={alt || 'Image'}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={`relative z-10 w-full h-full block transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
