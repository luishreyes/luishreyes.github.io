

/**
 * This module handles the sequential preloading of images to improve perceived performance.
 * After the initial page load, it starts loading images for other pages one by one
 * to ensure they are cached by the time the user navigates to them.
 */

// A comprehensive and prioritized list of images to preload.
// The main hero image is already preloaded via a <link> tag in index.html for maximum speed.
const prioritizedImageUrls = [
  // About Page (second image)
  '/images/site/1756469286343.jpg',

  // --- Page Specific Banners (in navigation order) ---
  // Principles
  '/images/site/campus-mision-historia-y-simbolos-0.webp', // Teaching Purpose
  '/images/site/generales-campus-2015-2015-69.jpg', // Research Purpose
  'https://ingenieria.uniandes.edu.co/sites/default/files/actualidad_0.jpg', // Service Purpose
  '/images/uniandes-bw.jpg', // Teaching Philosophy

  // Research
  '/images/site/generated-image-september-02-2025-1-07pm.jpg', // Research Overview
  
  // Teaching
  '/images/site/04.png', // Teaching Overview

  // Service
  '/images/site/img-4560-2.jpg', // Institutional Overview
  
  // Recognition
  'https://pbs.twimg.com/media/DWKm7gvXcAIISbY?format=jpg&name=4096x4096', // Awards Page

];

// Use a Set to ensure there are no duplicate URLs in the final queue.
const preloadQueue = [...new Set(prioritizedImageUrls)];

let isPreloading = false;

/**
 * Preloads a single image by creating a new Image object.
 * @param src The URL of the image to preload.
 * @returns A promise that resolves when the image is loaded or fails to load.
 */
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn(`Failed to preload image, but continuing queue: ${src}`);
      resolve(); // Resolve even on error to not block the queue.
    };
  });
};

/**
 * Starts preloading all images in the queue sequentially.
 * This function should be called after the initial page content is interactive.
 */
export const startSequentialImagePreloading = async (): Promise<void> => {
  if (isPreloading || typeof window === 'undefined') {
    return; // Don't run on the server or if already running.
  }
  
  isPreloading = true;

  for (const url of preloadQueue) {
    await preloadImage(url);
  }

  isPreloading = false;
};