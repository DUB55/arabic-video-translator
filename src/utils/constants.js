// Vercel backend endpoint for Supadata transcript
export const TRANSCRIBE_ENDPOINT = process.env.EXPO_PUBLIC_TRANSCRIBE_ENDPOINT || '';

export const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';

// Removed Whisper model configuration in favor of Supadata transcript backend

// Removed local video file constraints for reel URL input flow

// API Retry Configuration
export const MAX_RETRIES = 3;
export const RETRY_DELAY_BASE = 1000; // 1 second base delay
export const RETRY_DELAY_MULTIPLIER = 2; // Exponential backoff

// Processing Progress Steps
export const PROCESSING_STEPS = {
  TRANSCRIBING: { progress: 0.3, message: 'Fetching transcript...' },
  PREPROCESSING: { progress: 0.5, message: 'Preprocessing Arabic text...' },
  TRANSLATING: { progress: 0.7, message: 'Translating to Dutch...' },
  EXTRACTING_DUAS: { progress: 0.85, message: 'Extracting duas...' },
  COMPLETE: { progress: 1.0, message: 'Processing complete!' }
};

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  SELECTED_MODEL: 'selectedModel',
  DUA_ENABLED: 'duaEnabled',
  LAST_VIDEO_URI: 'lastVideoUri',
  RESULTS_HISTORY: 'resultsHistory'
};

export const DUB5_ENDPOINT = 'https://chatbot-beta-weld.vercel.app/api/chatbot';
