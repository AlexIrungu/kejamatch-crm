// src/components/common/LazyImage.jsx
import React, { useState, useRef, useEffect } from 'react';

/**
 * LazyImage - SEO-optimized lazy loading image component
 *
 * Features:
 * - Intersection Observer for lazy loading
 * - Native loading="lazy" as fallback
 * - Proper alt text handling for accessibility
 * - Width/height attributes for CLS prevention
 * - WebP/AVIF support detection
 * - Responsive srcset support
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  width,
  height,
  sizes,
  srcSet,
  priority = false, // Set to true for above-the-fold images
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Skip observer if priority image (load immediately)
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Generate optimized image URL for Unsplash images
  const getOptimizedSrc = (originalSrc, targetWidth = 800) => {
    if (!originalSrc) return placeholder;

    // Handle Unsplash images - add optimization parameters
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', '80');
      if (!url.searchParams.has('w')) {
        url.searchParams.set('w', targetWidth.toString());
      }
      return url.toString();
    }

    return originalSrc;
  };

  // Generate srcset for responsive images (Unsplash)
  const generateSrcSet = (originalSrc) => {
    if (!originalSrc || !originalSrc.includes('unsplash.com')) return srcSet;

    const widths = [320, 640, 768, 1024, 1280];
    return widths
      .map(w => `${getOptimizedSrc(originalSrc, w)} ${w}w`)
      .join(', ');
  };

  const optimizedSrc = getOptimizedSrc(src);
  const responsiveSrcSet = srcSet || generateSrcSet(src);
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={width && height ? { aspectRatio: `${width}/${height}` } : undefined}
      {...props}
    >
      {/* Placeholder/Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Actual image with SEO attributes */}
      {isInView && (
        <img
          src={hasError ? placeholder : optimizedSrc}
          alt={alt || ''} // Always provide alt, even if empty for decorative images
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          width={width}
          height={height}
          sizes={defaultSizes}
          srcSet={hasError ? undefined : responsiveSrcSet}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export default LazyImage;
