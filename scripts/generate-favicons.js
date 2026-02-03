#!/usr/bin/env node
/**
 * Favicon & OG Image Generator for KejaMatch
 *
 * Generates:
 * - favicon-16x16.png
 * - favicon-32x32.png
 * - apple-touch-icon.png (180x180)
 * - og-image.jpg (1200x630 for social media)
 *
 * Run: npm run generate:favicons
 * Requires: npm install sharp --save-dev
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');

// Source files
const LOGO_SVG = path.join(PUBLIC_DIR, 'clearbg.svg');
const LOGO_YELLOW_JPG = path.join(PUBLIC_DIR, 'yellowbg_page-0001.jpg');
const LOGO_BLACK_JPG = path.join(PUBLIC_DIR, 'blackbg_page-0001.jpg');

async function generateFavicons() {
  console.log('Generating favicons from SVG...\n');

  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(LOGO_SVG);

    // Generate favicon-16x16.png
    await sharp(svgBuffer, { density: 300 })
      .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
    console.log('✓ Generated favicon-16x16.png');

    // Generate favicon-32x32.png
    await sharp(svgBuffer, { density: 300 })
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');

    // Generate apple-touch-icon.png (180x180) - with white background for iOS
    await sharp(svgBuffer, { density: 300 })
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png (180x180)');

    // Generate favicon.ico (32x32 PNG renamed - browsers accept PNG as ico)
    await sharp(svgBuffer, { density: 300 })
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon.ico'));
    console.log('✓ Generated favicon.ico');

    console.log('\n✓ All favicons generated successfully!\n');
  } catch (error) {
    console.error('Error generating favicons:', error.message);
    process.exit(1);
  }
}

async function generateOGImage() {
  console.log('Generating Open Graph image...\n');

  try {
    // Check if yellow logo exists
    if (!fs.existsSync(LOGO_YELLOW_JPG)) {
      console.error('Yellow logo JPG not found at:', LOGO_YELLOW_JPG);
      process.exit(1);
    }

    // Get the original image dimensions
    const metadata = await sharp(LOGO_YELLOW_JPG).metadata();
    console.log(`Original image: ${metadata.width}x${metadata.height}`);

    // Create OG image (1200x630) with the logo centered on a branded background
    // Using yellow/gold background color from the logo (#F0B429)
    const ogWidth = 1200;
    const ogHeight = 630;

    // Resize logo to fit nicely in the OG image
    const logoSize = Math.min(400, metadata.width, metadata.height);
    const resizedLogo = await sharp(LOGO_YELLOW_JPG)
      .resize(logoSize, logoSize, { fit: 'contain' })
      .toBuffer();

    // Create the OG image with centered logo
    await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 3,
        background: { r: 240, g: 180, b: 41 } // #F0B429 - Yellow/Gold from logo
      }
    })
      .composite([
        {
          input: resizedLogo,
          gravity: 'center'
        }
      ])
      .jpeg({ quality: 90 })
      .toFile(path.join(PUBLIC_DIR, 'og-image.jpg'));

    console.log('✓ Generated og-image.jpg (1200x630)');

    // Also create a black background version
    await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 3,
        background: { r: 10, g: 31, b: 68 } // #0A1F44 - Dark blue/black from logo
      }
    })
      .composite([
        {
          input: await sharp(LOGO_BLACK_JPG)
            .resize(logoSize, logoSize, { fit: 'contain' })
            .toBuffer(),
          gravity: 'center'
        }
      ])
      .jpeg({ quality: 90 })
      .toFile(path.join(PUBLIC_DIR, 'og-image-dark.jpg'));

    console.log('✓ Generated og-image-dark.jpg (1200x630) - alternative dark version');

    console.log('\n✓ OG images generated successfully!\n');
  } catch (error) {
    console.error('Error generating OG image:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('========================================');
  console.log('  KejaMatch Favicon & OG Image Generator');
  console.log('========================================\n');

  await generateFavicons();
  await generateOGImage();

  console.log('========================================');
  console.log('  All assets generated successfully!');
  console.log('========================================\n');
  console.log('Files created in /public:');
  console.log('  - favicon-16x16.png');
  console.log('  - favicon-32x32.png');
  console.log('  - favicon.ico');
  console.log('  - apple-touch-icon.png');
  console.log('  - og-image.jpg (yellow background)');
  console.log('  - og-image-dark.jpg (dark background)');
  console.log('\nThe og-image.jpg is now ready for social media sharing!');
}

main();
