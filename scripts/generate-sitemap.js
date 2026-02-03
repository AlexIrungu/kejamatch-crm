#!/usr/bin/env node
/**
 * Sitemap Generator for KejaMatch
 *
 * This script generates a dynamic sitemap.xml that includes:
 * - Static pages (home, about, contact, etc.)
 * - Blog posts (from static data)
 * - Property listings (fetched from API)
 *
 * Run: node scripts/generate-sitemap.js
 * Add to package.json: "build:sitemap": "node scripts/generate-sitemap.js"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://kejamatch.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');
const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Static pages configuration
const staticPages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/properties', changefreq: 'daily', priority: 0.9 },
  { url: '/bnbs', changefreq: 'daily', priority: 0.9 },
  { url: '/blogs', changefreq: 'weekly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/login', changefreq: 'yearly', priority: 0.3 },
  { url: '/register', changefreq: 'yearly', priority: 0.3 },
];

// Blog posts (static data - update as new posts are added)
const blogPosts = [
  { id: 1, date: '2025-09-05' },
  { id: 2, date: '2025-09-05' },
  { id: 3, date: '2025-09-05' },
];

// Generate date in sitemap format (YYYY-MM-DD)
function formatDate(date) {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date || new Date().toISOString().split('T')[0];
}

// Generate XML for a single URL entry
function generateUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// Fetch properties from API
async function fetchProperties() {
  try {
    const response = await fetch(`${API_URL}/api/properties/search?limit=1000`);
    if (!response.ok) {
      console.warn('Could not fetch properties from API, skipping dynamic property URLs');
      return [];
    }
    const data = await response.json();
    return data.data?.properties || data.properties || [];
  } catch (error) {
    console.warn('API not available, skipping dynamic property URLs:', error.message);
    return [];
  }
}

// Main sitemap generation function
async function generateSitemap() {
  console.log('Generating sitemap...');
  const today = formatDate(new Date());
  const urlEntries = [];

  // Add static pages
  console.log('Adding static pages...');
  staticPages.forEach(page => {
    urlEntries.push(generateUrlEntry(page.url, today, page.changefreq, page.priority));
  });

  // Add blog posts
  console.log('Adding blog posts...');
  blogPosts.forEach(post => {
    urlEntries.push(generateUrlEntry(`/blog/${post.id}`, post.date, 'monthly', 0.7));
  });

  // Try to fetch and add properties
  console.log('Fetching properties from API...');
  const properties = await fetchProperties();
  if (properties.length > 0) {
    console.log(`Adding ${properties.length} property URLs...`);
    properties.forEach(property => {
      const lastmod = property.updatedAt ? formatDate(new Date(property.updatedAt)) : today;
      urlEntries.push(generateUrlEntry(`/property/${property._id}`, lastmod, 'weekly', 0.8));
    });
  }

  // Generate final XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${urlEntries.join('\n\n')}

</urlset>`;

  // Write to file
  fs.writeFileSync(OUTPUT_PATH, sitemap);
  console.log(`Sitemap generated successfully with ${urlEntries.length} URLs`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

// Run the generator
generateSitemap().catch(error => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
});
