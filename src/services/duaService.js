/**
 * Dua Extraction Service
 */
import { extract as dub5Extract } from './dub5Service';

/**
 * Creates the dua extraction prompt (EXACT from desktop app)
 * @param {string} arabicText - Arabic text to analyze
 * @returns {string} - Formatted prompt
 */
export function createDuaExtractionPrompt(arabicText) {
  return `You are an expert in Islamic studies and Arabic language. Your task is to identify ANY form of Islamic duas (prayers/supplications) from the following Arabic text.

WHAT TO LOOK FOR - A dua can be:
- Direct invocations to Allah (الله) starting with phrases like "اللهم" (Allahumma), "يا الله" (Ya Allah), "ربي" (Rabbi), "يا رب" (Ya Rabb)
- Requests for guidance, mercy, forgiveness, or blessings
- Seeking protection (استعاذة) like "أعوذ بالله" (A'udhu billah)
- Praise and glorification combined with requests
- Any supplication asking Allah for something, even if informal
- Statements of gratitude or seeking Allah's help
- Personal prayers or wishes directed toward Allah
- References to Allah's names and attributes in a supplicatory context

If you find ANY dua (famous or personal), return it in EXACTLY this 3-line format for EACH dua:

[Arabic dua as in source text]
[Phonetic transliteration in Latin script for Dutch speakers]
[Natural Dutch meaning - NOT literal translation]

Example format:
اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
Allahumma innaka 'afuwwun tuhibbul-'afwa, fa'fu 'anni
O Allah, U bent vergevingsgezind en houdt van vergeving, vergeef mij dan.

IMPORTANT:
- If there are multiple duas, separate them with a blank line
- If absolutely no dua is found, return: Geen dua gevonden.

Arabic text to analyze: ${arabicText}`;
}

/**
 * Calls Pollinations AI for dua extraction
 * @param {string} prompt - Dua extraction prompt
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<string>} - Extracted duas in 3-line format
 */
export async function extractDuasFromPrompt(prompt, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const text = await dub5Extract(prompt);
      return text.trim();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries && (error.message.includes('HTTP') || error.message.includes('network'))) {
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Dua extraction retry ${attempt + 1}/${maxRetries + 1} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (attempt === maxRetries) {
        throw new Error(`Dua extraction failed: ${error.message}`);
      }
    }
  }
  
  throw lastError;
}

/**
 * Extracts duas from Arabic text
 * @param {string} arabicText - Arabic text to analyze
 * @returns {Promise<string>} - Extracted duas in formatted string
 */
export async function extractDuas(arabicText) {
  if (!arabicText || !arabicText.trim()) {
    return 'Geen dua gevonden.';
  }

  const prompt = createDuaExtractionPrompt(arabicText);
  return await extractDuasFromPrompt(prompt);
}

/**
 * Parses dua results into structured format
 * @param {string} duaResults - Raw dua extraction results
 * @returns {Array<{arabic: string, transliteration: string, dutch: string}>} - Parsed duas
 */
export function parseDuaResults(duaResults) {
  if (!duaResults || duaResults.includes('Geen dua gevonden')) {
    return [];
  }

  const duas = [];
  const blocks = duaResults.split(/\n\s*\n/); // Split by blank lines

  for (const block of blocks) {
    const lines = block.trim().split('\n').filter(line => line.trim());
    if (lines.length >= 3) {
      duas.push({
        arabic: lines[0].trim(),
        transliteration: lines[1].trim(),
        dutch: lines[2].trim()
      });
    }
  }

  return duas;
}

/**
 * Unit test placeholder
 * TODO: Add unit tests for:
 * - extractDuas with text containing duas
 * - extractDuas with text containing no duas
 * - parseDuaResults with valid format
 * - Error handling for API failures
 */
export const __tests__ = {
  createDuaExtractionPrompt,
  extractDuasFromPrompt,
  extractDuas,
  parseDuaResults
};

