'use server';

import { randomUUID } from 'node:crypto';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { requireAdmin } from '@/lib/supabase/ssr-client';
import { MAX_IMAGE_BYTES, IMAGE_TYPES, validateImageBytes } from '@/lib/admin-security';

export async function uploadProductImage(formData: FormData) {
  try { await requireAdmin(); }
  catch { return { error: 'Your administrator session has expired. Sign in again.' }; }

  const file = formData.get('file');
  if (!(file instanceof File) || !IMAGE_TYPES.includes(file.type)) return { error: 'Choose a JPG, PNG, or WebP image.' };
  if (!file.size || file.size > MAX_IMAGE_BYTES) return { error: 'Choose an image smaller than 3 MB.' };
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return { error: 'Image uploads are not configured. Add the Cloudinary credentials on the server.' };

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    validateImageBytes(bytes, file.type);
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret,
        resource_type: 'image', public_id: `awf/products/${randomUUID()}`,
        overwrite: false, allowed_formats: ['jpg', 'png', 'webp'], timeout: 60000,
      }, (error, result) => error ? reject(error) : result ? resolve(result) : reject(new Error('No upload result')));
      stream.end(bytes);
    });
    return { image: { secure_url: result.secure_url, cloudinary_public_id: result.public_id } };
  } catch {
    return { error: 'The image could not be uploaded. Check the file and try again.' };
  }
}
