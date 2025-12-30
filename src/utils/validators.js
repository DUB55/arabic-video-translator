/**
 * Input Validation Utilities
 * Validates file uploads, formats, and user inputs
 */

/**
 * For reel URL flow, add Instagram URL validation
 */
export function validateInstagramUrl(url) {
  if (!url || typeof url !== 'string') return { valid: false, error: 'URL is required' };
  const trimmed = url.trim();
  const pattern = /^https:\/\/(www\.)?instagram\.com\/reel\/[A-Za-z0-9_\-]+\/?/;
  if (!pattern.test(trimmed)) {
    return { valid: false, error: 'Provide a valid Instagram Reel URL' };
  }
  return { valid: true };
}

export function validateYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return { valid: false, error: 'URL is required' };
  const u = url.trim();
  const patterns = [
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_\-]+/,
    /^https:\/\/(www\.)?youtu\.be\/[A-Za-z0-9_\-]+/,
  ];
  const ok = patterns.some((p) => p.test(u));
  return ok ? { valid: true } : { valid: false, error: 'Unsupported YouTube URL' };
}

export function validateFacebookUrl(url) {
  if (!url || typeof url !== 'string') return { valid: false, error: 'URL is required' };
  const u = url.trim();
  const pattern = /^https:\/\/(www\.)?facebook\.com\/.+/;
  const ok = pattern.test(u);
  return ok ? { valid: true } : { valid: false, error: 'Unsupported Facebook URL' };
}

export function validateTikTokUrl(url) {
  if (!url || typeof url !== 'string') return { valid: false, error: 'URL is required' };
  const u = url.trim();
  const pattern = /^https:\/\/(www\.)?tiktok\.com\/@.+\/video\/\d+/;
  const ok = pattern.test(u);
  return ok ? { valid: true } : { valid: false, error: 'Unsupported TikTok URL' };
}

export function validateSupportedUrl(url) {
  const ig = validateInstagramUrl(url);
  if (ig.valid) return { valid: true, platform: 'instagram' };
  const yt = validateYouTubeUrl(url);
  if (yt.valid) return { valid: true, platform: 'youtube' };
  const fb = validateFacebookUrl(url);
  if (fb.valid) return { valid: true, platform: 'facebook' };
  const tk = validateTikTokUrl(url);
  if (tk.valid) return { valid: true, platform: 'tiktok' };
  return { valid: false, error: 'Unsupported URL' };
}

/**
 * Validates video file format
 * @param {Object} file - File object from document picker
 * @returns {Object} - { valid: boolean, error?: string }
 */
export function validateVideoFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size && file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` 
    };
  }

  // Check MIME type
  if (file.mimeType && !SUPPORTED_VIDEO_FORMATS.includes(file.mimeType)) {
    return { 
      valid: false, 
      error: `Unsupported format. Supported: MP4, AVI, MOV, MKV, WMV, FLV, WEBM` 
    };
  }

  // Check file extension as fallback
  if (file.name) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const supportedExtensions = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'];
    if (extension && !supportedExtensions.includes(extension)) {
      return { 
        valid: false, 
        error: `Unsupported file extension: .${extension}` 
      };
    }
  }

  return { valid: true };
}

/**
 * Validates Whisper model selection
 * @param {string} model - Model value
 * @returns {boolean} - True if valid
 */
export function validateModel(model) {
  const validModels = ['tiny', 'base', 'small', 'medium', 'large'];
  return validModels.includes(model);
}

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validates network connectivity (basic check)
 * @returns {Promise<boolean>} - True if online
 */
export async function checkNetworkConnection() {
  try {
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    return true;
  } catch (error) {
    return false;
  }
}


