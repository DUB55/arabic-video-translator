const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map();

function now() {
  return Date.now();
}

function setCache(key, value) {
  cache.set(key, { value, expires: now() + CACHE_TTL_MS });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expires < now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function isValidInstagramReelUrl(url) {
  if (typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return false;
    if (!/instagram\.com$/.test(u.hostname)) return false;
    return /^\/reel\//.test(u.pathname);
  } catch {
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const apiKey = process.env.SUPADATA_API_KEY || '';
    const base = process.env.SUPADATA_API_BASE || 'https://api.supadata.ai';
    const { reelUrl } = req.body || {};
    if (!reelUrl || !isValidInstagramReelUrl(reelUrl)) {
      res.status(400).json({ error: 'Invalid or missing Instagram Reel URL' });
      return;
    }
    const cached = getCache(reelUrl);
    if (cached) {
      res.status(200).json({ text: cached });
      return;
    }
    if (!apiKey) {
      res.status(500).json({ error: 'Server misconfiguration: SUPADATA_API_KEY missing' });
      return;
    }
    const endpoint = `${base}/v1/transcript`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url: reelUrl }),
    });
    if (!response.ok) {
      const text = await response.text();
      let statusText = response.statusText || 'Error';
      res.status(response.status).json({ error: `Supadata error: ${statusText}`, details: text });
      return;
    }
    const data = await response.json().catch(() => ({}));
    const transcript = data.transcript || data.text || data.data?.text || '';
    if (!transcript || !String(transcript).trim()) {
      res.status(502).json({ error: 'No transcript returned from Supadata' });
      return;
    }
    setCache(reelUrl, transcript);
    res.status(200).json({ text: transcript });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message || String(err) });
  }
};
