import axios from 'axios';

/**
 * Upload an image file to Cloudinary with progress callback.
 * Fallbacks to data URL if Cloudinary credentials are not configured.
 * @param {File} file 
 * @param {function} onProgress 
 * @returns {Promise<string>} Secure image URL
 */
const getEnv = () => (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});

export async function uploadToCloudinary(file, onProgress) {
  const env = getEnv();
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Fallback to data URL / local object URL if Cloudinary environment variables are missing
  if (!cloudName || !uploadPreset || cloudName === 'demo' || cloudName.includes('your_')) {
    console.warn('Cloudinary credentials missing in .env. Utilizing client-side data URL fallback for book cover.');
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        if (onProgress) onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }
      }, 150);
    });
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (onProgress) onProgress(percent);
          }
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to upload cover image to Cloudinary.');
  }
}

/**
 * Upload an external image URL to Cloudinary after verifying it via the proxy.
 * Reuses existing image storage and security rules.
 * @param {string} url 
 * @param {function} onProgress 
 * @returns {Promise<string>} Secure image URL stored in Cloudinary
 */
export async function uploadCoverFromUrl(url, onProgress) {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error('Invalid image URL format.');
  }

  const env = getEnv();
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 1. Fetch verified image blob through our proxy to ensure it is a valid image and not an HTML error
  const proxyUrl = `/api/cover-proxy?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(errData.error || `Failed to fetch cover from remote server (HTTP ${res.status}).`);
  }

  const blob = await res.blob();
  if (blob.size < 16) {
    throw new Error('Image file is empty or corrupted.');
  }

  // 2. Fallback to data URL if Cloudinary is not configured
  if (!cloudName || !uploadPreset || cloudName === 'demo' || cloudName.includes('your_')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // 3. Upload verified image blob to configured Cloudinary bucket
  const formData = new FormData();
  formData.append('file', blob, 'cover.jpg');
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error('Cloudinary cover upload error:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to upload cover image to Cloudinary.');
  }
}
