import React, { useState, useEffect, useRef } from 'react';

/**
 * OptimizedVideo Component
 * 
 * Features:
 * - Shimmer skeleton placeholder while loading
 * - Smooth fade-in once video is ready to play
 * - Cloudinary optimization for videos
 * - Fallback handling
 */
const OptimizedVideo = ({ 
  src, 
  className = '', 
  priority = false,
  width,
  height,
  objectFit = 'cover',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    
    setError(false);
    setIsLoaded(false);

    // Cloudinary optimization for video
    if (src.includes('res.cloudinary.com')) {
      if (!src.includes('/upload/f_auto')) {
        const newSrc = src.replace('/upload/', '/upload/f_auto,q_auto,w_auto,dpr_auto/');
        setOptimizedSrc(newSrc);
      } else {
        setOptimizedSrc(src);
      }
    } else {
      setOptimizedSrc(src);
    }
  }, [src]);

  // If video is already cached and loaded by browser, this handles it
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsLoaded(true);
    }
  }, [optimizedSrc]);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true); // stop showing skeleton
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Shimmer Skeleton Placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      )}
      
      <video
        ref={videoRef}
        src={error ? '' : optimizedSrc}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        onError={handleError}
        // Preload auto if priority, metadata otherwise
        preload={priority ? 'auto' : 'metadata'}
        className={`w-full h-full transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
};

export default OptimizedVideo;
