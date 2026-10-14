// Run: node --env-file=.env scripts/upload-namaz-chair.cjs
const fs = require('node:fs');
const path = require('node:path');
const { v2: cloudinary } = require('cloudinary');

async function main() {
  const required = ['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) throw new Error('Missing upload configuration: ' + missing.join(', '));
  const root = path.resolve(__dirname, '..');
  const productPath = path.join(root, 'data', 'namaz-chair.json');
  const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  const result = await cloudinary.uploader.upload(path.join(root, 'public', 'images', 'namaz-chair.jpg'), {
    resource_type: 'image', public_id: 'awf/products/study-seating/namaz-chair',
    asset_folder: 'awf-assets/AWF Furnitures/study-seating', display_name: 'namaz-chair',
    overwrite: false, allowed_formats: ['jpg'], timeout: 60000,
  });
  if (!result.secure_url || !result.public_id) throw new Error('Cloudinary did not return an image URL.');
  product.images = [result.secure_url];
  product.cloudinaryPublicId = result.public_id;
  fs.writeFileSync(productPath, JSON.stringify(product, null, 2) + '\n');
  console.log('Uploaded Namaz Chair and connected its Cloudinary image to the catalogue and offer popup.');
  console.log('Image: ' + result.secure_url);
}

main().catch((error) => {
  // Avoid serializing provider errors, which may contain credentials.
  console.error(error.message || 'Upload failed.');
  process.exitCode = 1;
});
