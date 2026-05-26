import React, { useState, useEffect } from 'react';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading by default (unless priority=true)
 * - Cloudinary URL optimization (auto format, quality)
 * - Blur-up effect while loading
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

  useEffect(() => {
    if (!src) return;
    
    // Reset states when src changes
    setError(false);
    setIsLoaded(false);

    // Cloudinary optimization logic
    if (src.includes('res.cloudinary.com')) {
      // Check if it already has transformations
      if (!src.includes('/upload/f_auto,q_auto')) {
        // Simple insertion of optimization params
        const newSrc = src.replace('/upload/', '/upload/f_auto,q_auto/');
        setOptimizedSrc(newSrc);
      } else {
        setOptimizedSrc(src);
      }
    } else {
      setOptimizedSrc(src);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true); // stop showing skeleton
  };

  // Fallback placeholder (could be an SVG or local asset)
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiAvPjwvc3ZnPg==';

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Blur/Skeleton placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={error ? fallbackSrc : optimizedSrc}
        alt={alt || 'Image'}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-300 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
