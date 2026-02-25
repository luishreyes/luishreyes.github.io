

/**
 * This module handles the sequential preloading of images to improve perceived performance.
 * After the initial page load, it starts loading images for other pages one by one
 * to ensure they are cached by the time the user navigates to them.
 */

// A comprehensive and prioritized list of images to preload.
// The main hero image is already preloaded via a <link> tag in index.html for maximum speed.
const prioritizedImageUrls = [
  // About Page (second image)
  'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/1756469286343.jpeg',

  // --- Page Specific Banners (in navigation order) ---
  // Principles
  'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Campus_mision-historia-y-simbolos_0.webp', // Teaching Purpose
  'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Generales%20campus_2015_2015%20(69).jpg', // Research Purpose
  'https://ingenieria.uniandes.edu.co/sites/default/files/actualidad_0.jpg', // Service Purpose
  'https://scontent-bog2-1.xx.fbcdn.net/v/t1.6435-9/126177274_10158054021613160_2071561028163868049_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=dj840BgOy88Q7kNvwEiT1uy&_nc_oc=AdnFc82mDCvfBO131TvBC4UAontS_bG0tuNzjVIsU-C_XK_iB36TUYEowg6TU8k_Y-E&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=V3Z7ZIpHD2vHjRFe8ifdyw&oh=00_AfYf6zTruxitjBwowMEhRIze8yY2sM174dYmVyrv5ZWdAw&oe=68F4BC6B', // Teaching Philosophy

  // Research
  'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Generated%20Image%20September%2002,%202025%20-%201_07PM.jpeg', // Research Overview
  
  // Teaching
  'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/04.png', // Teaching Overview

  // Service
  'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_4560-2.jpg', // Institutional Overview
  
  // Recognition
  'https://pbs.twimg.com/media/DWKm7gvXcAIISbY?format=jpg&name=4096x4096', // Awards Page

  // Future
  'https://images.unsplash.com/photo-1516641051054-9df6a1aad654', // Future Overview
  
  // --- Other Banners (used randomly in PageWrapper) ---
  'https://images.unsplash.com/photo-1602108987428-4768d7c7ecbe',
  'https://images.unsplash.com/photo-1583621908511-e082803e3aa2',
  'https://images.unsplash.com/photo-1685086934749-2f9b941716f8',
  'https://images.unsplash.com/photo-1686094464066-305cc8e5a49e',
  'https://images.unsplash.com/photo-1533891244820-1d2dbcf93f56',
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