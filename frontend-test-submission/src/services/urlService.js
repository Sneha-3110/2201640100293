import { nanoid } from 'nanoid';
import logger from './logger';

const DB_KEY = 'shortenedUrls';

const getUrlsFromStorage = () => {
  try {
    const urls = localStorage.getItem(DB_KEY);
    return urls ? JSON.parse(urls) : [];
  } catch (error) {
    logger.error('Failed to parse URLs from localStorage', error);
    return [];
  }
};

const saveUrlsToStorage = (urls) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(urls));
  } catch (error) {
    logger.error('Failed to save URLs to localStorage', error);
  }
};

export const createShortUrl = ({ longUrl, customShortcode = null, validity = 30 }) => {
  const urls = getUrlsFromStorage();
  
  if (customShortcode && urls.some(url => url.shortCode === customShortcode)) {
    const errorMsg = `Shortcode "${customShortcode}" already exists.`;
    logger.warn(errorMsg);
    throw new Error(errorMsg);
  }

  const shortCode = customShortcode || nanoid(7); 
  const creationTime = new Date();
  const expiryTime = new Date(creationTime.getTime() + validity * 60 * 1000);

  const newUrl = {
    id: nanoid(),
    longUrl,
    shortCode,
    createdAt: creationTime.toISOString(),
    expiresAt: expiryTime.toISOString(),
    clicks: [],
  };

  urls.push(newUrl);
  saveUrlsToStorage(urls);
  logger.info('Successfully created new short URL', newUrl);
  return newUrl;
};

export const getAllUrls = () => {
  const urls = getUrlsFromStorage();
  return urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getUrlByShortcode = (shortCode) => {
  const urls = getUrlsFromStorage();
  return urls.find(url => url.shortCode === shortCode);
};

export const recordClick = (shortCode) => {
  let urls = getUrlsFromStorage();
  const urlIndex = urls.findIndex(url => url.shortCode === shortCode);

  if (urlIndex !== -1) {
    const clickData = {
      timestamp: new Date().toISOString(),
      source: document.referrer || 'Direct',
      location: 'Coarse Location (Mocked)',
    };
    urls[urlIndex].clicks.push(clickData);
    saveUrlsToStorage(urls);
    logger.info(`Recorded click for ${shortCode}`, clickData);
    return urls[urlIndex];
  }
  return null;
};