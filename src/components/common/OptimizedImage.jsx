import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * Transforms a Cloudinary URL to add optimization flags (f_auto, q_auto, width, c_limit).
 * Safely handles URLs with existing transformations, non-Cloudinary URLs, and missing URLs.
 */
export const getOptimizedCloudinaryUrl = (url, targetWidth = 800) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com')) return url;

  // Match /upload/ and any subsequent transformation segment or path
  const uploadRegex = /\/upload\/(?:([^\/]+)\/)?(v\d+\/.*|[^\/]+)$/;
  const match = url.match(uploadRegex);

  if (!match) return url;

  let existingTransform = match[1] || '';
  const restOfPath = match[2];

  // Build desired transformation options
  const newParams = [];
  
  if (!existingTransform.includes('f_')) newParams.push('f_auto');
  if (!existingTransform.includes('q_')) newParams.push('q_auto');
  
  if (targetWidth && !existingTransform.includes('w_')) {
    newParams.push(`w_${targetWidth}`);
    if (!existingTransform.includes('c_')) {
      newParams.push('c_limit');
    }
  }

  if (newParams.length === 0) return url; // Already fully specified

  let combinedTransform = existingTransform
    ? `${existingTransform},${newParams.join(',')}`
    : newParams.join(',');

  return url.replace(uploadRegex, `/upload/${combinedTransform}/${restOfPath}`);
};

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Immediate skeleton/placeholder display (no empty white area)
 * - Cloudinary responsive & format optimization (f_auto, q_auto, w_X, c_limit)
 * - Smooth 250ms opacity fade-in on load
 * - Layout shift prevention by matching container aspect ratio & dimensions
 * - Native lazy loading & async decoding for below-the-fold images
 * - Reliable fallback state on error
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  priority = false, 
  width,
  height,
  targetWidth = 800,
  objectFit = 'cover',
  aspectRatio,
  containerBg = 'bg-[#E8E8E8]',
  style = {},
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Compute optimized Cloudinary URL
  const optimizedSrc = useMemo(() => {
    return getOptimizedCloudinaryUrl(src, targetWidth);
  }, [src, targetWidth]);

  // Sync load state whenever src changes
  useEffect(() => {
    if (!optimizedSrc) return;

    // If the browser already has this image in cache, mark it loaded immediately
    // (happens when coming back from ProductDetails or re-rendering a cached image)
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth !== 0) {
      setIsLoaded(true);
      setError(false);
      return;
    }

    // Otherwise reset so the shimmer shows while the image fetches
    setIsLoaded(false);
    setError(false);
  }, [optimizedSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setIsLoaded(true); // stop skeleton state
  }, []);

  // SVG Fallback for broken images
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+SW1hZ2UgVW5hdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  const containerStyle = {
    width: width || undefined,
    height: height || undefined,
    aspectRatio: aspectRatio || undefined,
    ...style,
  };

  return (
    <div 
      className={`relative overflow-hidden w-full h-full ${containerBg}`} 
      style={containerStyle}
    >
      {/* Skeleton Shimmer Placeholder (visible until image loads) */}
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer pointer-events-none z-0" 
          aria-hidden="true"
        />
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={error ? fallbackSrc : (optimizedSrc || fallbackSrc)}
        alt={alt || 'Product image'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full block transition-opacity duration-300 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;

