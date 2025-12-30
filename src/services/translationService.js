/**
 * Translation Service
 */
import { translate as dub5Translate } from './dub5Service';

/**
 * Creates the translation prompt (EXACT from desktop app)
 * @param {string} arabicText - Arabic text to translate
 * @returns {string} - Formatted prompt
 */
export function createTranslationPrompt(arabicText) {
  return `You are a professional Arabic-to-Dutch translator with expertise in Islamic and religious content. 

Translate the following Arabic text to Dutch with these requirements:

TRANSLATION GUIDELINES:
- Provide a natural, fluent Dutch translation - NOT a word-for-word literal translation
- Maintain the meaning and context while making it sound natural in Dutch
- Use appropriate Dutch Islamic terminology when relevant:
  * Allah remains "Allah"
  * Prophet = "Profeet" 
  * Quran = "Koran" or "Qur'an"
  * Prayer = "gebed" or "dua" 
  * Faith = "geloof"
  * Blessing = "zegen"
  * Mercy = "genade" or "barmhartigheid"
- If the text contains Quranic verses, religious teachings, or Islamic concepts, ensure they are conveyed respectfully and accurately
- Make the Dutch text flow naturally as if originally written in Dutch
- Preserve the emotional tone and intent of the original Arabic
- If there are cultural concepts that don't translate directly, provide context or use explanatory phrases

Arabic text to translate:
${arabicText}

Provide only the Dutch translation:`;
}

/**
 * Calls DUB5 AI for translation
 * @param {string} prompt
 * @param {number} maxRetries
 * @returns {Promise<string>}
 */
export async function translateToDutch(prompt, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const text = await dub5Translate(prompt, { language: 'nl' });
      return text.trim();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries && (error.message.includes('HTTP') || error.message.includes('network'))) {
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Translation retry ${attempt + 1}/${maxRetries + 1} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (attempt === maxRetries) {
        throw new Error(`Translation failed: ${error.message}`);
      }
    }
  }
  
  throw lastError;
}

/**
 * Translates Arabic text to Dutch
 * @param {string} arabicText - Arabic text to translate
 * @returns {Promise<string>} - Dutch translation
 */
export async function translateArabicToDutch(arabicText) {
  if (!arabicText || !arabicText.trim()) {
    throw new Error('Arabic text is required for translation');
  }

  const prompt = createTranslationPrompt(arabicText);
  return await translateToDutch(prompt);
}

/**
 * Unit test placeholder
 * TODO: Add unit tests for:
 * - translateArabicToDutch with valid Arabic text
 * - Error handling for network failures
 * - Retry logic with exponential backoff
 * - Prompt formatting validation
 */
export const __tests__ = {
  createTranslationPrompt,
  translateToDutch,
  translateArabicToDutch
};

