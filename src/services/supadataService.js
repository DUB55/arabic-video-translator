import { TRANSCRIBE_ENDPOINT } from '../utils/constants';

export async function transcribeReel(reelUrl) {
  if (!reelUrl || !/^https:\/\/(www\.)?instagram\.com\/reel\//.test(reelUrl)) {
    throw new Error('Invalid Instagram Reel URL');
  }
  const endpoint = TRANSCRIBE_ENDPOINT;
  if (!endpoint) {
    throw new Error('Transcription endpoint not configured');
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reelUrl }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Transcription failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  const json = await res.json().catch(() => ({}));
  const text = json.text || '';
  if (!text) throw new Error('Empty transcript returned');
  return text;
}
