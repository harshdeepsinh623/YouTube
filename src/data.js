import { mockVideos, mockChannels } from './mockData';

// Multiple API keys for rotation
const API_KEYS = [
  'AIzaSyDlOF9XYEIG24Fk7LL6p-i6nt3EpPwROhY', // Your existing key
  'YOUR_NEW_API_KEY_1',  // Replace with additional keys
  'YOUR_NEW_API_KEY_2'
];

let currentKeyIndex = 0;

// Function to get the next API key when one fails
const getNextApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

// Export the current API key
export const API_KEY = API_KEYS[currentKeyIndex];

// Enhanced fetch function with key rotation
export const fetchWithKeyRotation = async (url) => {
  // Try all available keys before giving up
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      // Replace the API key in the URL with the current one
      const currentUrl = url.replace(/key=[^&]+/, `key=${API_KEYS[currentKeyIndex]}`);
      const response = await fetch(currentUrl);
      
      if (response.ok) {
        return await response.json();
      } else if (response.status === 403) {
        // If we get a 403, try the next key
        console.log(`API key ${currentKeyIndex} failed with 403, trying next key...`);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      // Only rotate key if we've tried all keys
      if (attempt === API_KEYS.length - 1) {
        throw error; // Re-throw if all keys failed
      }
    }
  }
};

export const value_converter = (value) => {
    if(value >= 1000000000) {
        return Math.floor(value / 1000000000) + 'B'
    }   
    else if(value >= 1000000) {
        return Math.floor(value / 1000000) + 'M'
    }   
    else if(value >= 1000) {
        return Math.floor(value / 1000) + 'K'
    }   
    else {
        return value
    }
}