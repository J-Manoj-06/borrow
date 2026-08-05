import axios from 'axios';

/**
 * Upload an image file to Cloudinary with progress callback.
 * Fallbacks to data URL if Cloudinary credentials are not configured.
 * @param {File} file 
 * @param {function} onProgress 
 * @returns {Promise<string>} Secure image URL
 */
export async function uploadToCloudinary(file, onProgress) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
