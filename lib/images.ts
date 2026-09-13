/**
 * Cloudinary Image Delivery and Optimization Helper
 *
 * Usage:
 * Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local to enable automatic Cloudinary delivery:
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *
 * Example result:
 * https://res.cloudinary.com/your_cloud_name/image/upload/f_auto,q_auto/awf/products/bedroom-set-wooden/01-bed.png
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '';
const DEFAULT_PLACEHOLDER = '/images/placeholder-furniture.svg';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  crop?: 'limit' | 'fill' | 'fit' | 'scale';
}

export function getProductImage(
  imagePath?: string | null,
  options: ImageOptions = {}
): string {
  if (!imagePath || typeof imagePath !== 'string') {
    return DEFAULT_PLACEHOLDER;
  }

  // If already a full URL (Cloudinary, S3, or external CDN), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If custom base URL is provided in env
  if (CLOUDINARY_BASE_URL) {
    const cleanPath = imagePath.replace(/^\/+/, '');
    const cleanBase = CLOUDINARY_BASE_URL.replace(/\/+$/, '');
    return `${cleanBase}/${cleanPath}`;
  }

  // If Cloudinary cloud name is provided
  if (CLOUDINARY_CLOUD_NAME) {
    // Strip leading slashes and any local public prefix
    let publicId = imagePath.replace(/^\/+/, '');
    if (publicId.startsWith('images/products/')) {
      publicId = publicId.replace('images/products/', 'awf/products/');
    }

    const transformations: string[] = ['f_auto', 'q_auto'];

    if (options.width) {
      transformations.push(`w_${options.width}`);
    }
    if (options.height) {
      transformations.push(`h_${options.height}`);
    }
    if (options.crop) {
      transformations.push(`c_${options.crop}`);
    } else if (options.width || options.height) {
      transformations.push('c_limit');
    }

    const transformStr = transformations.join(',');
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformStr}/${publicId}`;
  }

  // If referencing removed local product images and no Cloudinary is configured yet,
  // return the elegant SVG placeholder to prevent 404s
  if (imagePath.startsWith('/images/products') || imagePath.startsWith('awf/products')) {
    return DEFAULT_PLACEHOLDER;
  }

  return imagePath;
}

