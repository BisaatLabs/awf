// lib/images.ts
// Cloudinary Image Delivery, Auto-Format (WebP/AVIF), and Resolution Optimization.

export const DEFAULT_PLACEHOLDER = '/images/placeholder-furniture.svg';

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'thumb';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
}

/**
 * Injects Cloudinary transformations (f_auto, q_auto, w_*, c_limit) into image URLs
 * to reduce bandwidth consumption by up to 95% and speed up page rendering.
 */
export function getOptimizedImageUrl(
  imageUrl?: string | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return DEFAULT_PLACEHOLDER;
  }

  const cleanUrl = imageUrl.trim();

  // If this is a Cloudinary delivery URL
  if (cleanUrl.includes('res.cloudinary.com') && cleanUrl.includes('/image/upload/')) {
    const [baseUrl, imagePath] = cleanUrl.split('/image/upload/');

    // If transformations are already present in the URL, avoid double-transforming
    if (imagePath && /^f_[^/]+,q_[^/]+/.test(imagePath)) {
      return cleanUrl;
    }

    const {
      width = 600,
      quality = 'auto',
      format = 'auto',
      crop = 'limit',
      height,
    } = options;

    const transformParts: string[] = [
      `f_${format}`,
      `q_${quality}`,
      `c_${crop}`,
      `w_${width}`,
    ];

    if (height) {
      transformParts.push(`h_${height}`);
    }

    const transformationStr = transformParts.join(',');
    return `${baseUrl}/image/upload/${transformationStr}/${imagePath}`;
  }

  return cleanUrl;
}

/**
 * Pre-configured presets for different UI contexts
 */
export const imagePresets = {
  thumbnail: (url?: string | null) => getOptimizedImageUrl(url, { width: 300, crop: 'limit' }),
  card:      (url?: string | null) => getOptimizedImageUrl(url, { width: 600, crop: 'limit' }),
  hero:      (url?: string | null) => getOptimizedImageUrl(url, { width: 1200, crop: 'limit' }),
  zoom:      (url?: string | null) => getOptimizedImageUrl(url, { width: 1800, crop: 'limit' }),
};
