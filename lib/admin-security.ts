import { z } from 'zod';

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateImageBytes(bytes: Uint8Array, mime: string) {
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error('Choose an image smaller than 3 MB.');
  const matches =
    (mime === 'image/jpeg' && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
    (mime === 'image/png' && [137,80,78,71,13,10,26,10].every((value, i) => bytes[i] === value)) ||
    (mime === 'image/webp' && String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP');
  if (!matches) throw new Error('Choose a valid JPG, PNG, or WebP image.');
}

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.').max(256),
  newPassword: z.string().min(12, 'Use at least 12 characters.').max(72, 'Use no more than 72 characters.')
    .refine(value => new TextEncoder().encode(value).length <= 72, 'Password must be no more than 72 bytes.'),
  confirmPassword: z.string(),
}).refine(value => value.newPassword === value.confirmPassword, {message: 'New passwords do not match.'})
  .refine(value => value.newPassword !== value.currentPassword, {message: 'Choose a different new password.'});
